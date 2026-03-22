import { getPersonalityInfo } from '@/lib/scoring';

interface PersonalityCardProps {
  label: string;
  totalScore: number;
}

export default function PersonalityCard({ label, totalScore }: PersonalityCardProps) {
  const info = getPersonalityInfo(label);

  return (
    <div className="bg-gradient-to-br from-violet-100 to-pink-100 rounded-3xl p-8 text-center shadow-sm">
      <div className="text-6xl mb-4">{info.emoji}</div>
      <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">
        Your vibe is
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-3">{info.label}</h1>
      <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">{info.tagline}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 bg-white/60 rounded-full px-4 py-1.5 text-sm text-slate-600">
        <span className="font-semibold text-violet-600">{totalScore}</span>
        <span>/ 48 total score</span>
      </div>
    </div>
  );
}
