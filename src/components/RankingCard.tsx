'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/lib/questions';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface RankingCardProps {
  question: Question;
  onComplete: (indices: number[]) => void;
}

const categoryColors: Record<string, {
  pool: string;
  poolSelected: string;
  ranked: string;
  number: string;
  remove: string;
}> = {
  sleep: {
    pool: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100 hover:border-indigo-400 active:scale-95',
    poolSelected: 'bg-indigo-100 border-indigo-200 text-indigo-800 opacity-40 scale-[0.95] shadow-inner',
    ranked: 'bg-white border-indigo-200 text-indigo-900',
    number: 'bg-indigo-500 text-white',
    remove: 'hover:bg-indigo-100 text-indigo-300 hover:text-indigo-600',
  },
  screen: {
    pool: 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100 hover:border-sky-400 active:scale-95',
    poolSelected: 'bg-sky-100 border-sky-200 text-sky-800 opacity-40 scale-[0.95] shadow-inner',
    ranked: 'bg-white border-sky-200 text-sky-900',
    number: 'bg-sky-500 text-white',
    remove: 'hover:bg-sky-100 text-sky-300 hover:text-sky-600',
  },
  diet: {
    pool: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 active:scale-95',
    poolSelected: 'bg-emerald-100 border-emerald-200 text-emerald-800 opacity-40 scale-[0.95] shadow-inner',
    ranked: 'bg-white border-emerald-200 text-emerald-900',
    number: 'bg-emerald-500 text-white',
    remove: 'hover:bg-emerald-100 text-emerald-300 hover:text-emerald-600',
  },
  activity: {
    pool: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100 hover:border-orange-400 active:scale-95',
    poolSelected: 'bg-orange-100 border-orange-200 text-orange-800 opacity-40 scale-[0.95] shadow-inner',
    ranked: 'bg-white border-orange-200 text-orange-900',
    number: 'bg-orange-500 text-white',
    remove: 'hover:bg-orange-100 text-orange-300 hover:text-orange-600',
  },
};

export default function RankingCard({ question, onComplete }: RankingCardProps) {
  // Start with original order (matches SSR), shuffle after hydration.
  // Each entry carries its originalIndex so scoring is unaffected by display order.
  const withIndices = question.options.map((opt, originalIndex) => ({ ...opt, originalIndex }));
  const [shuffled, setShuffled] = useState(withIndices);
  useEffect(() => {
    const last = withIndices[withIndices.length - 1];
    const rest = withIndices.slice(0, -1);
    setShuffled([...shuffle(rest), last]);
  }, []);

  const [ranked, setRanked] = useState<number[]>([]); // indices into `shuffled`
  const rankCount = question.rankCount ?? question.options.length;
  const colors = categoryColors[question.category] ?? categoryColors.sleep;

  function toggleOption(i: number) {
    if (ranked.includes(i)) {
      setRanked(ranked.filter((r) => r !== i));
    } else if (ranked.length < rankCount) {
      setRanked([...ranked, i]);
    }
  }

  function removeFromRanking(pos: number) {
    setRanked(ranked.filter((_, idx) => idx !== pos));
  }

  const isFull = ranked.length === rankCount;

  return (
    <div className="flex flex-col gap-5">
      {/* Ranked list */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Your ranking
          </p>
          <span className="text-xs text-slate-300 font-mono">
            {ranked.length}/{rankCount}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {ranked.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm text-slate-400">
              Tap an option below to start ranking
            </div>
          ) : (
            ranked.map((shuffledIdx, pos) => (
              <div
                key={shuffledIdx}
                className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 animate-rank-item-in ${colors.ranked}`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${colors.number}`}
                >
                  {pos + 1}
                </span>
                <span className="flex-1 text-sm font-medium">
                  {shuffled[shuffledIdx].label}
                </span>
                <button
                  onClick={() => removeFromRanking(pos)}
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-base leading-none transition-all cursor-pointer ${colors.remove}`}
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pool */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Tap to rank
        </p>
        <div className="flex flex-wrap gap-2">
          {shuffled.map((_, i) => {
            const isSelected = ranked.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleOption(i)}
                className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all cursor-pointer ${isSelected ? colors.poolSelected : colors.pool}`}
              >
                {shuffled[i].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      {isFull && (
        <button
          onClick={() => onComplete(ranked.map((shuffledIdx) => shuffled[shuffledIdx].originalIndex))}
          className="w-full py-3 rounded-2xl bg-violet-500 text-white font-semibold text-base hover:bg-violet-600 active:scale-95 transition-all cursor-pointer"
        >
          Continue
        </button>
      )}
    </div>
  );
}
