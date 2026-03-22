'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

interface RankingCardProps {
  question: Question;
  onComplete: (indices: number[]) => void;
}

const categoryColors: Record<string, { base: string; selected: string; badge: string }> = {
  sleep: {
    base: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    selected: 'bg-indigo-200 border-indigo-500 text-indigo-900',
    badge: 'bg-indigo-500 text-white',
  },
  screen: {
    base: 'bg-sky-50 border-sky-200 text-sky-800',
    selected: 'bg-sky-200 border-sky-500 text-sky-900',
    badge: 'bg-sky-500 text-white',
  },
  diet: {
    base: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    selected: 'bg-emerald-200 border-emerald-500 text-emerald-900',
    badge: 'bg-emerald-500 text-white',
  },
  activity: {
    base: 'bg-orange-50 border-orange-200 text-orange-800',
    selected: 'bg-orange-200 border-orange-500 text-orange-900',
    badge: 'bg-orange-500 text-white',
  },
};

export default function RankingCard({ question, onComplete }: RankingCardProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const rankCount = question.rankCount ?? 5;
  const colors = categoryColors[question.category] ?? categoryColors.sleep;
  const isFull = selectedIndices.length >= rankCount;

  function toggleOption(i: number) {
    const pos = selectedIndices.indexOf(i);
    if (pos !== -1) {
      setSelectedIndices(selectedIndices.filter((_, idx) => idx !== pos));
    } else if (!isFull) {
      setSelectedIndices([...selectedIndices, i]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-y-auto max-h-[60vh]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {question.options.map((option, i) => {
            const rank = selectedIndices.indexOf(i);
            const isSelected = rank !== -1;
            const isDisabled = isFull && !isSelected;

            return (
              <button
                key={i}
                onClick={() => toggleOption(i)}
                disabled={isDisabled}
                className={`relative rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left
                  ${isSelected ? colors.selected : colors.base}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option.label}
                {isSelected && (
                  <span
                    className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center animate-badge-pop ${colors.badge}`}
                  >
                    {rank + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {selectedIndices.length === rankCount && (
        <div className="sticky bottom-4">
          <button
            onClick={() => onComplete(selectedIndices)}
            className="w-full py-3 rounded-2xl bg-violet-500 text-white font-semibold text-base hover:bg-violet-600 active:scale-95 transition-all cursor-pointer"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
