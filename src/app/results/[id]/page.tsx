import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/firebase-admin';
import ArchetypeCard from '@/components/ArchetypeCard';
import ScoreBar from '@/components/ScoreBar';
import RadarChart from '@/components/RadarChart';
import WaffleGrid from '@/components/WaffleGrid';
import ArchetypeConstellation from '@/components/ArchetypeConstellation';
import ArchetypeDistances from '@/components/ArchetypeDistances';
import QuestionBreakdown from '@/components/QuestionBreakdown';
import GlowUpSimulator from '@/components/GlowUpSimulator';
import ShareButton from '@/components/ShareButton';
import {
  getCategoryTips,
  getPillarInsights,
  getArchetypeDistances,
  computePerQuestionScores,
  getArchetypeResult,
  CategoryScores,
  ArchetypeKey,
} from '@/lib/scoring';
import { categoryLabels, questions } from '@/lib/questions';

interface ResultRow {
  id: string;
  uid: string;
  created_at: unknown;
  answers: Record<string, number | number[]>;
  sleep_score: number;
  screen_score: number;
  diet_score: number;
  activity_score: number;
  total_score: number;
  archetype_ranked: string; // JSON array of 3 ArchetypeKey strings
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    openGraph: {
      images: [`/api/og/${id}`],
    },
  };
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
  const pillars = getPillarInsights(scores);
  const distances = getArchetypeDistances(scores.sleep_score, scores.screen_score, scores.diet_score, scores.activity_score);
  const questionScores = computePerQuestionScores(result.answers);
  const { comboLabel } = getArchetypeResult(archetypeRanked);

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
            {/* Score breakdown — radar */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 text-lg mb-1">Your shape</h2>
              <RadarChart scores={scores} />
            </div>

            {/* Retake / share */}
            <div className="flex gap-3">
              <Link
                href="/quiz"
                className="flex-1 text-center bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Retake quiz
              </Link>
              <ShareButton resultId={id} comboLabel={comboLabel} />
            </div>
          </div>

        </div>

        {/* Visual breakdown: waffle + constellation */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 text-lg mb-4">Score grid</h2>
            <WaffleGrid scores={scores} />
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 text-lg mb-2">Archetype map</h2>
            <ArchetypeConstellation archetypeRanked={archetypeRanked} scores={scores} />
          </div>
        </div>

        {/* Archetype distances */}
        <div className="mt-6 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4">Your archetype matches</h2>
          <ArchetypeDistances distances={distances} />
        </div>

        {/* Pillar grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div key={p.name} className="bg-white rounded-3xl shadow-sm p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{p.emoji}</span>
                <span className="font-semibold text-slate-700 capitalize">{p.name}</span>
                <span className="ml-auto text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 shrink-0">
                  {p.tag}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{p.insight}</p>
            </div>
          ))}
        </div>

        {/* Glow-up simulator */}
        <div className="mt-6">
          <GlowUpSimulator
            initialScores={scores}
            initialRanked={archetypeRanked}
            questionScores={questionScores}
            resultId={id}
          />
        </div>

        {/* Question breakdown */}
        <div className="mt-4">
          <QuestionBreakdown questionScores={questionScores} questions={questions} />
        </div>

      </div>
    </main>
  );
}
