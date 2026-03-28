'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';
import { QuestionScore } from '@/lib/scoring';

interface Props {
  questionScores: QuestionScore[];
  questions: Question[];
}

const CATEGORY_CONFIG = {
  sleep:    { label: 'Sleep',             color: 'border-indigo-400',  badge: 'bg-indigo-100 text-indigo-700' },
  screen:   { label: 'Screen Time',       color: 'border-sky-400',     badge: 'bg-sky-100 text-sky-700' },
  diet:     { label: 'Diet & Hydration',  color: 'border-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
  activity: { label: 'Physical Activity', color: 'border-orange-400',  badge: 'bg-orange-100 text-orange-700' },
} as const;

function scoreBadgeClass(score: number): string {
  if (score >= 2.5) return 'bg-emerald-100 text-emerald-700';
  if (score >= 1.5) return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
}

function getAnswerLabel(qs: QuestionScore, question: Question): string {
  if (question.type === 'ranked' && Array.isArray(qs.rawAnswer)) {
    return (qs.rawAnswer as number[])
      .map(i => question.options[i]?.label ?? '?')
      .join(' → ');
  }
  if (typeof qs.rawAnswer === 'number') {
    return question.options[qs.rawAnswer]?.label ?? '?';
  }
  return '?';
}

export default function QuestionBreakdown({ questionScores, questions }: Props) {
  const [open, setOpen] = useState(false);
  const qMap = Object.fromEntries(questions.map(q => [q.id, q]));

  const categories = (['sleep', 'screen', 'diet', 'activity'] as const).map(cat => ({
    cat,
    items: questionScores.filter(qs => qs.category === cat),
  }));

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <h2 className="font-semibold text-slate-800 text-lg">Question breakdown</h2>
        <span className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-6">
          {categories.map(({ cat, items }) => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <div key={cat}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 pl-2 border-l-2 ${cfg.color} ${cfg.badge.split(' ')[1]}`}>
                  {cfg.label}
                </div>
                <div className="space-y-3">
                  {items.map(qs => {
                    const q = qMap[qs.id];
                    if (!q) return null;
                    const answerLabel = getAnswerLabel(qs, q);
                    return (
                      <div key={qs.id} className="flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 leading-snug line-clamp-2">{q.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{answerLabel}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold rounded-full px-2 py-0.5 ${scoreBadgeClass(qs.score)}`}>
                          {qs.score}/3
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
