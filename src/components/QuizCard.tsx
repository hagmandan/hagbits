'use client';

import { Question } from '@/lib/questions';

interface QuizCardProps {
  question: Question;
  onAnswer: (score: number) => void;
}

const categoryColors: Record<string, string> = {
  sleep: 'bg-indigo-50 border-indigo-200',
  screen: 'bg-sky-50 border-sky-200',
  diet: 'bg-emerald-50 border-emerald-200',
  activity: 'bg-orange-50 border-orange-200',
};

const categoryHover: Record<string, string> = {
  sleep: 'hover:bg-indigo-100 hover:border-indigo-400',
  screen: 'hover:bg-sky-100 hover:border-sky-400',
  diet: 'hover:bg-emerald-100 hover:border-emerald-400',
  activity: 'hover:bg-orange-100 hover:border-orange-400',
};

export default function QuizCard({ question, onAnswer }: QuizCardProps) {
  const baseCard = categoryColors[question.category] ?? 'bg-slate-50 border-slate-200';
  const hoverCard = categoryHover[question.category] ?? 'hover:bg-slate-100';

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option, i) => (
        <button
          key={i}
          onClick={() => onAnswer(option.score)}
          className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-slate-700 font-medium transition-all duration-150 active:scale-95 cursor-pointer animate-fade-in-up ${baseCard} ${hoverCard}`}
          style={{ animationDelay: `${i * 55}ms` }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
