import { getBandLabel, getBandColor } from '@/lib/scoring';

interface ScoreBarProps {
  category: string;
  score: number;
  max?: number;
}

export default function ScoreBar({ category, score, max = 12 }: ScoreBarProps) {
  const pct = Math.round((score / max) * 100);
  const band = getBandLabel(score);
  const color = getBandColor(score);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-slate-700">{category}</span>
        <span className="text-xs text-slate-500">{band}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-slate-400">{score}/{max}</div>
    </div>
  );
}
