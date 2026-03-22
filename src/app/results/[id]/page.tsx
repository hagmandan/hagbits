import { notFound } from 'next/navigation';
import Link from 'next/link';
import sql from '@/lib/db';
import PersonalityCard from '@/components/PersonalityCard';
import ScoreBar from '@/components/ScoreBar';
import { getCategoryTips, CategoryScores } from '@/lib/scoring';
import { categoryLabels } from '@/lib/questions';

interface ResultRow {
  id: string;
  created_at: string;
  answers: Record<string, number>;
  sleep_score: number;
  screen_score: number;
  diet_score: number;
  activity_score: number;
  total_score: number;
  personality_label: string;
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const rows = await sql`SELECT * FROM quiz_responses WHERE id = ${id}`;
  if (rows.length === 0) notFound();

  const result = rows[0] as ResultRow;

  const scores: CategoryScores = {
    sleep_score: result.sleep_score,
    screen_score: result.screen_score,
    diet_score: result.diet_score,
    activity_score: result.activity_score,
  };

  const tips = getCategoryTips(scores);

  const scoreRows = [
    { key: 'sleep', label: categoryLabels.sleep, score: result.sleep_score },
    { key: 'screen', label: categoryLabels.screen, score: result.screen_score },
    { key: 'diet', label: categoryLabels.diet, score: result.diet_score },
    { key: 'activity', label: categoryLabels.activity, score: result.activity_score },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Personality card */}
        <PersonalityCard label={result.personality_label} totalScore={result.total_score} />

        {/* Score breakdown */}
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-slate-800 text-lg">Your breakdown</h2>
          {scoreRows.map(({ key, label, score }) => (
            <ScoreBar key={key} category={label} score={score} />
          ))}
        </div>

        {/* Report card / tips */}
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-slate-800 text-lg">Report card</h2>
          {tips.map((tip) => (
            <div key={tip.category} className="border-l-4 border-violet-200 pl-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700 text-sm">{tip.category}</span>
                <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">
                  {tip.band}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>

        {/* Retake / share */}
        <div className="flex gap-3">
          <Link
            href="/quiz"
            className="flex-1 text-center bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3.5 rounded-2xl transition-colors"
          >
            Retake quiz
          </Link>
          <Link
            href="/"
            className="flex-1 text-center bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-2xl border border-slate-200 transition-colors"
          >
            Share with a friend →
          </Link>
        </div>
      </div>
    </main>
  );
}
