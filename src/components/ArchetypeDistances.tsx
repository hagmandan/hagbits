import { ArchetypeDistance, getArchetypeInfo } from '@/lib/scoring';

interface Props {
  distances: ArchetypeDistance[];
}

const RANK_COLORS = ['bg-violet-500', 'bg-violet-400', 'bg-violet-300'];
const RANK_TRACK = ['bg-violet-100', 'bg-violet-100', 'bg-violet-100'];

export default function ArchetypeDistances({ distances }: Props) {
  return (
    <div className="space-y-2.5">
      {distances.map(({ key, pct }, i) => {
        const info = getArchetypeInfo(key);
        const isTop3 = i < 3;
        const barColor = isTop3 ? RANK_COLORS[i] : 'bg-slate-300';
        const trackColor = isTop3 ? RANK_TRACK[i] : 'bg-slate-100';

        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-lg w-6 shrink-0">{info.emoji}</span>
            <span className={`text-sm shrink-0 w-36 truncate ${isTop3 ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
              {info.label}
            </span>
            <div className={`flex-1 h-2 rounded-full ${trackColor} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${barColor} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs w-9 text-right shrink-0 ${isTop3 ? 'font-bold text-violet-700' : 'text-slate-400'}`}>
              {pct}%
            </span>
            {isTop3 && (
              <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-1.5 py-0.5 shrink-0 font-semibold">
                #{i + 1}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
