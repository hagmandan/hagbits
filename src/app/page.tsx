import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">🔮</div>
          <h1 className="text-4xl font-bold text-slate-800 leading-tight">
            What&apos;s your <span className="text-violet-500">vibe</span>?
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            16 questions. No health lecture. Just find out what&apos;s actually going on with your lifestyle — and what kind of era you&apos;re in.
          </p>
        </div>

        <Link
          href="/quiz"
          className="inline-block w-full bg-violet-500 hover:bg-violet-600 active:scale-95 text-white font-bold text-lg py-4 rounded-2xl shadow-md shadow-violet-200 transition-all duration-150"
        >
          Find out your vibe →
        </Link>

        <div className="flex justify-center gap-6 text-sm text-slate-400">
          <span>✦ 16 questions</span>
          <span>✦ ~2 min</span>
          <span>✦ No sign up</span>
        </div>
      </div>
    </main>
  );
}
