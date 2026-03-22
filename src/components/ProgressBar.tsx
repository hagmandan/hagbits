'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'default' | 'slim';
}

export default function ProgressBar({ current, total, variant = 'default' }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  if (variant === 'slim') {
    return (
      <div className="h-1 bg-slate-100 w-full">
        <div
          className="h-full bg-violet-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-slate-500 mb-1.5">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
