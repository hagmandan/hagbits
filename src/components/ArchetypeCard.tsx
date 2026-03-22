import { getArchetypeInfo, getArchetypeResult, getBandLabel, getBandColor, CategoryScores, ArchetypeKey } from '@/lib/scoring';
import { categoryLabels } from '@/lib/questions';

interface ArchetypeCardProps {
  archetypeRanked: [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  scores: CategoryScores;
}

export default function ArchetypeCard({ archetypeRanked, scores }: ArchetypeCardProps) {
  const result = getArchetypeResult(archetypeRanked);
  const [first, second, third] = archetypeRanked.map(getArchetypeInfo);

  const categoryRows = [
    { key: 'sleep', label: categoryLabels.sleep, score: scores.sleep_score },
    { key: 'screen', label: categoryLabels.screen, score: scores.screen_score },
    { key: 'diet', label: categoryLabels.diet, score: scores.diet_score },
    { key: 'activity', label: categoryLabels.activity, score: scores.activity_score },
  ];

  return (
    <div className="bg-gradient-to-br from-violet-100 to-pink-100 rounded-3xl overflow-hidden shadow-sm">
      {/* Combo headline */}
      <div className="px-8 pt-8 pb-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">
          Your vibe mix
        </div>
        <div className="text-4xl mb-2">{result.comboEmoji}</div>
        <h1 className="text-2xl font-bold text-slate-800">{result.comboLabel}</h1>
      </div>

      {/* Top-3 archetypes */}
      <div className="bg-white/60 mx-4 rounded-2xl divide-y divide-slate-100 mb-4">
        {/* #1 — full description */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">#1</span>
            <span className="text-xl">{first.emoji}</span>
            <span className="font-bold text-slate-800">{first.label}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed italic mb-1">{first.tagline}</p>
          <p className="text-sm text-slate-500 leading-relaxed">{first.description}</p>
        </div>

        {/* #2 — tagline only */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">#2</span>
            <span className="text-lg">{second.emoji}</span>
            <span className="font-semibold text-slate-700">{second.label}</span>
          </div>
          <p className="text-sm text-slate-500 italic">{second.tagline}</p>
        </div>

        {/* #3 — tagline only */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">#3</span>
            <span className="text-lg">{third.emoji}</span>
            <span className="font-semibold text-slate-600">{third.label}</span>
          </div>
          <p className="text-sm text-slate-400 italic">{third.tagline}</p>
        </div>
      </div>

      {/* Category heatmap */}
      <div className="bg-white/40 mx-4 mb-4 rounded-2xl px-5 py-4 space-y-3">
        {categoryRows.map(({ key, label, score }) => {
          const pct = Math.round((score / 12) * 100);
          const band = getBandLabel(score);
          const color = getBandColor(score);
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
              <div className="flex-1 h-2.5 bg-white/70 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-20 text-right shrink-0">{band}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
