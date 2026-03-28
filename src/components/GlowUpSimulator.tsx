'use client';

import { useState } from 'react';
import { CategoryScores, ArchetypeKey, rankArchetypes, getArchetypeResult } from '@/lib/scoring';

interface Props {
  initialScores: CategoryScores;
  initialRanked: [ArchetypeKey, ArchetypeKey, ArchetypeKey];
}

const SLIDERS = [
  { key: 'sleep_score',    label: 'Sleep',           emoji: '🌙', color: 'accent-indigo-500' },
  { key: 'screen_score',   label: 'Screen Time',     emoji: '📱', color: 'accent-sky-500' },
  { key: 'diet_score',     label: 'Diet',            emoji: '🍽️', color: 'accent-emerald-500' },
  { key: 'activity_score', label: 'Activity',        emoji: '🏃', color: 'accent-orange-500' },
] as const;

function deriveResult(scores: CategoryScores) {
  const ranked = rankArchetypes(scores.sleep_score, scores.screen_score, scores.diet_score, scores.activity_score);
  return getArchetypeResult(ranked);
}

export default function GlowUpSimulator({ initialScores, initialRanked }: Props) {
  const [open, setOpen] = useState(false);
  const [simScores, setSimScores] = useState<CategoryScores>(initialScores);

  const initial = getArchetypeResult(initialRanked);
  const sim = deriveResult(simScores);
  const changed = sim.comboLabel !== initial.comboLabel;

  function update(key: keyof CategoryScores, value: number) {
    setSimScores(s => ({ ...s, [key]: value }));
  }

  function reset() {
    setSimScores(initialScores);
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <h2 className="font-semibold text-slate-800 text-lg">Glow-up simulator</h2>
          <p className="text-sm text-slate-400 mt-0.5">Slide to see how one change shifts your result</p>
        </div>
        <span className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-6">
          {/* Current vs simulated result */}
          <div className="bg-violet-50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Your result:</span>
              <span>{initial.comboEmoji}</span>
              <span className="font-semibold text-slate-800">{initial.comboLabel}</span>
            </div>
            {changed && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-violet-600">With changes:</span>
                <span>{sim.comboEmoji}</span>
                <span className="font-semibold text-violet-800">{sim.comboLabel}</span>
              </div>
            )}
            {!changed && (
              <div className="text-xs text-slate-400">
                Adjust a slider to explore what shifts your result
              </div>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {SLIDERS.map(({ key, label, emoji, color }) => {
              const current = simScores[key];
              const initial_val = initialScores[key];
              const delta = current - initial_val;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {emoji} {label}
                    </span>
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
                </div>
              );
            })}
          </div>

          {/* Reset */}
          {changed && (
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
