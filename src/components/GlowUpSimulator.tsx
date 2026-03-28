'use client';

import { useState, useEffect } from 'react';
import {
  CategoryScores, ArchetypeKey, QuestionScore,
  rankArchetypes, getArchetypeResult, getArchetypeInfo,
  getArchetypeCentroidScores, ARCHETYPE_KEYS,
} from '@/lib/scoring';

interface Props {
  initialScores: CategoryScores;
  initialRanked: [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  questionScores: QuestionScore[];
  resultId: string;
}

const SLIDERS = [
  { key: 'sleep_score' as const,    label: 'Sleep',       emoji: '🌙', category: 'sleep',    color: 'accent-indigo-500' },
  { key: 'screen_score' as const,   label: 'Screen Time', emoji: '📱', category: 'screen',   color: 'accent-sky-500' },
  { key: 'diet_score' as const,     label: 'Diet',        emoji: '🍽️', category: 'diet',     color: 'accent-emerald-500' },
  { key: 'activity_score' as const, label: 'Activity',    emoji: '🏃', category: 'activity', color: 'accent-orange-500' },
] as const;

const WEEKLY_CHALLENGES: Record<string, string> = {
  sleep_1:    "Pick a bedtime and stay within 30 minutes of it for 7 nights straight",
  sleep_2:    "Set just 1 alarm tomorrow — no backup. Get up on the first one for 5 days.",
  sleep_3:    "Go to bed 45 minutes earlier than usual for 7 nights — rate your morning energy each day",
  sleep_4:    "Phone charger lives outside your bedroom for 7 nights",
  screen_1:   "When you're bored for under 5 minutes, leave the phone face-down — 7 days",
  screen_2:   "Set a 30-minute daily limit on your most-used app for the next 7 days",
  screen_3:   "No apps for the first 15 minutes after waking — 7 mornings",
  screen_4:   "Phone down 20 minutes before you want to fall asleep — 7 nights",
  diet_1:     "Add one fruit or vegetable to at least one meal every day this week",
  diet_2:     "Eat at a consistent time for at least 2 meals per day for 7 days",
  diet_3:     "Swap one sugary or energy drink per day for water — 7 days",
  diet_4:     "Eat at least 2 real meals every day this week",
  activity_1: "Move your body intentionally for 20+ minutes, 4 times this week",
  activity_2: "Stand up and move for at least 5 minutes after every hour of sitting — 7 days",
  activity_3: "One free afternoon this week: phone away, go outside or do something offline",
  activity_4: "Sleep 30 minutes earlier every night this week — track your daytime energy",
};

function deriveResult(scores: CategoryScores) {
  const ranked = rankArchetypes(
    scores.sleep_score, scores.screen_score, scores.diet_score, scores.activity_score
  );
  return getArchetypeResult(ranked);
}

function computeQuickestWin(scores: CategoryScores): {
  key: keyof CategoryScores;
  label: string;
  emoji: string;
  delta: number;
  newArchetype: ArchetypeKey;
} | null {
  const currentTop = rankArchetypes(
    scores.sleep_score, scores.screen_score, scores.diet_score, scores.activity_score
  )[0];

  type Win = { key: keyof CategoryScores; label: string; emoji: string; delta: number; newArchetype: ArchetypeKey };
  let best: Win | null = null;

  for (const { key, label, emoji } of SLIDERS) {
    const currentVal = scores[key];
    for (let d = 1; d <= 12 - currentVal; d++) {
      const newScores = { ...scores, [key]: currentVal + d };
      const newTop = rankArchetypes(
        newScores.sleep_score, newScores.screen_score, newScores.diet_score, newScores.activity_score
      )[0];
      if (newTop !== currentTop) {
        if (!best || d < best.delta || (d === best.delta && scores[key] < scores[best.key])) {
          best = { key, label, emoji, delta: d, newArchetype: newTop };
        }
        break;
      }
    }
  }
  return best;
}

function getChallengeForCategory(category: string, questionScores: QuestionScore[]): string | null {
  const qs = questionScores.filter(q => q.category === category);
  if (!qs.length) return null;
  const weakest = qs.reduce((min, q) => q.score < min.score ? q : min);
  return WEEKLY_CHALLENGES[weakest.id] ?? null;
}

export default function GlowUpSimulator({ initialScores, initialRanked, questionScores, resultId }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'explore' | 'target'>('explore');
  const [targetArchetype, setTargetArchetype] = useState<ArchetypeKey | null>(null);
  const [simScores, setSimScores] = useState<CategoryScores>(initialScores);
  const [priorScores, setPriorScores] = useState<CategoryScores | null>(null);
  const [priorResult, setPriorResult] = useState<ReturnType<typeof getArchetypeResult> | null>(null);

  const initialResult = getArchetypeResult(initialRanked);
  const sim = deriveResult(simScores);
  const isChanged = SLIDERS.some(({ key }) => simScores[key] !== initialScores[key]);
  const quickestWin = computeQuickestWin(initialScores);

  useEffect(() => {
    const STORAGE_KEY = 'hagbits_last_result_id';
    const priorId = localStorage.getItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, resultId);

    if (priorId && priorId !== resultId) {
      fetch(`/api/responses?id=${priorId}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data || data.sleep_score == null) return;
          const ps: CategoryScores = {
            sleep_score: data.sleep_score,
            screen_score: data.screen_score,
            diet_score: data.diet_score,
            activity_score: data.activity_score,
          };
          setPriorScores(ps);
          if (data.archetype_ranked) {
            const ranked = JSON.parse(data.archetype_ranked) as ArchetypeKey[];
            setPriorResult(getArchetypeResult(ranked));
          }
        })
        .catch(() => {});
    }
  }, [resultId]);

  function update(key: keyof CategoryScores, value: number) {
    setSimScores(s => ({ ...s, [key]: value }));
  }

  function reset() {
    setSimScores(initialScores);
    setTargetArchetype(null);
  }

  function selectTarget(key: ArchetypeKey) {
    setTargetArchetype(key);
    setSimScores(getArchetypeCentroidScores(key));
  }

  function switchMode(next: 'explore' | 'target') {
    setMode(next);
    if (next === 'explore') reset();
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <h2 className="font-semibold text-slate-800 text-lg">Glow-up simulator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {priorScores ? 'Your glow-up is confirmed — ' : ''}Slide to see how one change shifts your result
          </p>
        </div>
        <span className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-5">

          {/* Retake comparison — Phase 4 */}
          {priorScores && priorResult && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Glow-up confirmed ✦</p>
              <div className="grid grid-cols-2 gap-x-4 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500">Before</p>
                  <p className="font-medium text-slate-700">{priorResult.comboEmoji} {priorResult.comboLabel}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500">Now</p>
                  <p className="font-semibold text-slate-900">{initialResult.comboEmoji} {initialResult.comboLabel}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {SLIDERS.map(({ key, emoji }) => {
                  const d = initialScores[key] - priorScores[key];
                  if (d === 0) return null;
                  return (
                    <span
                      key={key}
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                    >
                      {emoji} {d > 0 ? '+' : ''}{d}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode toggle — Phase 2 */}
          <div className="flex gap-2">
            <button
              onClick={() => switchMode('explore')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'explore' ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Explore
            </button>
            <button
              onClick={() => switchMode('target')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'target' ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Set a target
            </button>
          </div>

          {/* Target archetype picker — Phase 2 */}
          {mode === 'target' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Which archetype do you want to aim for?</p>
              <div className="grid grid-cols-2 gap-2">
                {ARCHETYPE_KEYS.map(key => {
                  const info = getArchetypeInfo(key);
                  const selected = targetArchetype === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectTarget(key)}
                      className={`text-left px-3 py-2 rounded-xl text-sm transition-colors ${selected ? 'bg-violet-500 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    >
                      <span className="mr-1">{info.emoji}</span>{info.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result display */}
          <div className="bg-violet-50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700">Your result:</span>
              <span>{initialResult.comboEmoji}</span>
              <span className="font-semibold text-slate-800">{initialResult.comboLabel}</span>
            </div>
            {isChanged && sim.comboLabel !== initialResult.comboLabel && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-violet-600">With changes:</span>
                <span>{sim.comboEmoji}</span>
                <span className="font-semibold text-violet-800">{sim.comboLabel}</span>
              </div>
            )}
            {isChanged && sim.comboLabel === initialResult.comboLabel && (
              <p className="text-xs text-slate-400">Same result — try moving a slider further</p>
            )}
            {/* Quickest Win — Phase 1 */}
            {!isChanged && mode === 'explore' && quickestWin && (
              <p className="text-xs text-slate-500">
                <span className="font-medium text-violet-600">Quickest win:</span>{' '}
                bump {quickestWin.emoji} {quickestWin.label} by {quickestWin.delta} point{quickestWin.delta > 1 ? 's' : ''} → shifts to{' '}
                <span className="font-semibold">{getArchetypeInfo(quickestWin.newArchetype).label}</span>
              </p>
            )}
            {!isChanged && mode === 'explore' && !quickestWin && (
              <p className="text-xs text-slate-400">Adjust a slider to explore what shifts your result</p>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {SLIDERS.map(({ key, label, emoji, category, color }) => {
              const current = simScores[key];
              const initialVal = initialScores[key];
              const delta = current - initialVal;
              const targetScore = mode === 'target' && targetArchetype
                ? getArchetypeCentroidScores(targetArchetype)[key]
                : null;
              const gap = targetScore !== null ? targetScore - initialVal : null;
              const isMoved = current !== initialVal;
              const challenge = isMoved ? getChallengeForCategory(category, questionScores) : null;

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{emoji} {label}</span>
                    <div className="flex items-center gap-2">
                      {delta !== 0 && (
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {delta > 0 ? '+' : ''}{delta}
                        </span>
                      )}
                      <span className="text-sm text-slate-500 w-12 text-right">{current}/12</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={current}
                    onChange={e => update(key, Number(e.target.value))}
                    className={`w-full h-2 rounded-full appearance-none bg-slate-200 ${color} cursor-pointer`}
                  />
                  {/* Target gap label — Phase 2 */}
                  {mode === 'target' && gap !== null && targetScore !== null && (
                    <p className="text-xs text-slate-500">
                      Target: <span className="font-medium text-slate-700">{targetScore}/12</span>
                      {gap > 0 && <span className="ml-2 text-amber-600 font-medium">+{gap} from your score</span>}
                      {gap === 0 && <span className="ml-2 text-emerald-600 font-medium">✓ already there</span>}
                      {gap < 0 && <span className="ml-2 text-emerald-600 font-medium">✓ already there</span>}
                    </p>
                  )}
                  {/* Weekly challenge card — Phase 3 */}
                  {challenge && (
                    <div className="bg-violet-50 rounded-xl px-3 py-2 text-xs text-violet-700">
                      <span className="font-semibold">7-day challenge: </span>{challenge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset */}
          {isChanged && (
            <button
              onClick={reset}
              className="text-sm text-violet-500 hover:text-violet-700 transition-colors"
            >
              ↺ Reset to your actual scores
            </button>
          )}

        </div>
      )}
    </div>
  );
}
