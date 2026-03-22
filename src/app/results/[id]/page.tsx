import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase-admin';
import ArchetypeCard from '@/components/ArchetypeCard';
import ScoreBar from '@/components/ScoreBar';
import { getCategoryTips, CategoryScores, ArchetypeKey } from '@/lib/scoring';
import { categoryLabels } from '@/lib/questions';

interface ResultRow {
  id: string;
  uid: string;
  created_at: unknown;
  answers: Record<string, number>;
  sleep_score: number;
  screen_score: number;
  diet_score: number;
  activity_score: number;
  total_score: number;
  archetype_ranked: string; // JSON array of 3 ArchetypeKey strings
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doc = await db.collection('quiz_responses').doc(id).get();
  if (!doc.exists) notFound();

  const result = { id: doc.id, ...doc.data() } as ResultRow;

  const scores: CategoryScores = {
    sleep_score: result.sleep_score,
    screen_score: result.screen_score,
    diet_score: result.diet_score,
    activity_score: result.activity_score,
  };

  const archetypeRanked = JSON.parse(result.archetype_ranked) as [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  const tips = getCategoryTips(scores);

  const scoreRows = [
    { key: 'sleep', label: categoryLabels.sleep, score: result.sleep_score },
    { key: 'screen', label: categoryLabels.screen, score: result.screen_score },
    { key: 'diet', label: categoryLabels.diet, score: result.diet_score },
    { key: 'activity', label: categoryLabels.activity, score: result.activity_score },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[3fr_2fr] xl:grid-cols-3 gap-6 items-start">

          {/* Col 1: archetype card — sticky on desktop */}
          <div className="lg:sticky lg:top-10">
            <ArchetypeCard archetypeRanked={archetypeRanked} scores={scores} />
          </div>

          {/* Col 2: report card */}
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

          {/* Col 3 (xl) / appended to col 2 (lg): breakdown + buttons */}
          <div className="space-y-6 lg:col-start-2 xl:col-start-3">
            {/* Score breakdown */}
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-slate-800 text-lg">Your breakdown</h2>
              {scoreRows.map(({ key, label, score }) => (
                <ScoreBar key={key} category={label} score={score} />
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

        </div>
      </div>
    </main>
  );
}
