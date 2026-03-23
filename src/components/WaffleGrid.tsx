'use client';

import { useEffect, useState } from 'react';
import { CategoryScores } from '@/lib/scoring';

interface WaffleGridProps {
  scores: CategoryScores;
}

const rows = [
  { label: 'Sleep',    key: 'sleep_score'    as keyof CategoryScores, filled: 'bg-indigo-400', empty: 'bg-indigo-100' },
  { label: 'Screen',   key: 'screen_score'   as keyof CategoryScores, filled: 'bg-sky-400',    empty: 'bg-sky-100'    },
  { label: 'Diet',     key: 'diet_score'     as keyof CategoryScores, filled: 'bg-emerald-400', empty: 'bg-emerald-100' },
  { label: 'Activity', key: 'activity_score' as keyof CategoryScores, filled: 'bg-orange-400', empty: 'bg-orange-100' },
];

export default function WaffleGrid({ scores }: WaffleGridProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    // Reveal squares one by one across all 48 total
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= 48) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // Global square index for staggered reveal
  let globalIdx = 0;

  return (
    <div className="space-y-3">
      {rows.map(({ label, key, filled, empty }) => {
        const score = scores[key];
        return (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16 shrink-0">{label}</span>
            <div className="flex gap-1 flex-1">
              {Array.from({ length: 12 }, (_, i) => {
                const squareGlobalIdx = globalIdx++;
                const isFilled = i < score;
                const isVisible = squareGlobalIdx < revealed;
                return (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-sm transition-all duration-200 ${
                      isVisible
                        ? isFilled ? filled : empty
                        : 'bg-transparent'
                    }`}
                    style={{ transform: isVisible ? 'scale(1)' : 'scale(0.4)' }}
                  />
                );
              })}
            </div>
            <span className="text-xs text-slate-400 w-8 text-right shrink-0">{score}/12</span>
          </div>
        );
      })}
    </div>
  );
}
