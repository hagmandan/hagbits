'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions, Answers } from '@/lib/questions';
import QuizCard from '@/components/QuizCard';
import RankingCard from '@/components/RankingCard';
import ProgressBar from '@/components/ProgressBar';
import { useAnonymousAuth } from '@/hooks/useAnonymousAuth';
import { getFirebaseAnalytics } from '@/lib/analytics';
import { logEvent } from 'firebase/analytics';

type TransitionState = 'idle' | 'exiting' | 'entering';

const categoryBg: Record<string, string> = {
  sleep: '#eef2ff',
  screen: '#f0f9ff',
  diet: '#ecfdf5',
  activity: '#fff7ed',
};

export default function QuizPage() {
  const router = useRouter();
  const uid = useAnonymousAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [transition, setTransition] = useState<TransitionState>('idle');
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  async function handleAnswer(value: number | number[]) {
    if (transition !== 'idle' || submitting) return;

    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setTransition('exiting');

    setTimeout(async () => {
      if (isLast) {
        setSubmitting(true);
        try {
          const res = await fetch('/api/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: newAnswers, uid }),
          });
          const data = await res.json();
          const analytics = getFirebaseAnalytics();
          if (analytics) logEvent(analytics, 'quiz_completed', { personality_label: data.personality_label });
          router.push(`/results/${data.id}`);
        } catch {
          setSubmitting(false);
          setTransition('idle');
        }
      } else {
        setCurrentIndex((i) => i + 1);
        setTransition('entering');
        setTimeout(() => setTransition('idle'), 240);
      }
    }, 220);
  }

  if (submitting) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-pink-50">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">✨</div>
          <p className="text-slate-600 font-medium">Calculating your vibe...</p>
        </div>
      </main>
    );
  }

  const transitionClass =
    transition === 'exiting' ? 'animate-slide-out' :
    transition === 'entering' ? 'animate-slide-in' : '';

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: categoryBg[question.category] ?? '#f8f4ff',
        transition: 'background-color 600ms ease',
      }}
    >
      {/* Fixed slim progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <ProgressBar current={currentIndex + 1} total={questions.length} variant="slim" />
      </div>

      {/* Main content */}
      <div className="pt-14 max-w-5xl mx-auto px-6 min-h-screen">
        <div
          className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-56px)] ${transitionClass}`}
        >
          {/* Watermark emoji */}
          {question.emoji && (
            <span
              className="absolute bottom-4 right-4 text-[14rem] leading-none opacity-[0.07] select-none pointer-events-none"
              aria-hidden="true"
            >
              {question.emoji}
            </span>
          )}

          {/* Left column: question */}
          <div className="flex flex-col justify-center gap-4 py-8 lg:py-0">
            <div className="text-sm font-mono text-slate-400 tracking-wide">
              {String(currentIndex + 1).padStart(2, '0')} / {questions.length}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
              {question.text}
            </h2>
            {question.blurb ? (
              <p className="text-slate-500 text-base leading-relaxed">
                {question.emoji && <span className="mr-1.5">{question.emoji}</span>}
                {question.blurb}
              </p>
            ) : question.emoji && (
              <span className="text-2xl">{question.emoji}</span>
            )}
          </div>

          {/* Right column: answer component */}
          <div className="pb-8 lg:py-0">
            {question.type === 'ranked' ? (
              <RankingCard
                key={currentIndex}
                question={question}
                onComplete={(indices) => handleAnswer(indices)}
              />
            ) : (
              <QuizCard
                key={currentIndex}
                question={question}
                onAnswer={(score) => handleAnswer(score)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
