import Link from 'next/link';

// Re-render on every request so the shuffled chip order is different each visit
export const dynamic = 'force-dynamic';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const sleepChips    = shuffle(['After 1am', 'Midnight–1am', '11pm–midnight', 'Before 10pm']);
  const screenChips   = shuffle(['2+ hours', '1–2 hours', '30–60 min', 'Under 10 min']);
  const dietChips     = shuffle(['Energy drink', 'Soda', 'Coffee or tea', 'Water']);
  const activityChips = shuffle(['Keep sitting', 'Get up briefly', 'Walk around', 'Stretch or move']);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50">

      {/* Floating question preview cards — sm+ only */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden hidden sm:block">

        {/* Sleep — top left */}
        <div
          className="absolute top-16 left-8 lg:left-16 w-72 opacity-60"
          style={{ rotate: '-8deg', filter: 'blur(1.5px)', animation: 'float-a 4s ease-in-out infinite', animationDelay: '0s' }}
        >
          <div className="rounded-2xl border-2 bg-indigo-50 border-indigo-100 shadow-lg p-5 flex flex-col gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-600 self-start">
              💤 Sleep
            </span>
            <p className="text-slate-700 text-sm font-medium leading-snug">
              What time does your phone screen usually go dark for the night?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sleepChips.slice(0, 3).map((label) => (
                <span key={label} className="text-xs px-2.5 py-1 rounded-lg border bg-indigo-100 text-indigo-700 border-indigo-200">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Screen — top right */}
        <div
          className="absolute top-20 right-8 lg:right-16 w-72 opacity-55"
          style={{ rotate: '7deg', filter: 'blur(2px)', animation: 'float-b 5.5s ease-in-out infinite', animationDelay: '0.8s' }}
        >
          <div className="rounded-2xl border-2 bg-sky-50 border-sky-100 shadow-lg p-5 flex flex-col gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-600 self-start">
              📱 Screen Time
            </span>
            <p className="text-slate-700 text-sm font-medium leading-snug">
              You open an app &quot;real quick&quot; — next time you look up, how long has it been?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {screenChips.slice(0, 3).map((label) => (
                <span key={label} className="text-xs px-2.5 py-1 rounded-lg border bg-sky-100 text-sky-700 border-sky-200">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Diet — bottom left */}
        <div
          className="absolute bottom-20 left-8 lg:left-16 w-72 opacity-55"
          style={{ rotate: '11deg', filter: 'blur(1.5px)', animation: 'float-c 3.5s ease-in-out infinite', animationDelay: '0.3s' }}
        >
          <div className="rounded-2xl border-2 bg-emerald-50 border-emerald-100 shadow-lg p-5 flex flex-col gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 self-start">
              🥗 Diet &amp; Hydration
            </span>
            <p className="text-slate-700 text-sm font-medium leading-snug">
              Afternoon slump hits. Rank what you actually reach for, most to least:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {dietChips.slice(0, 3).map((label) => (
                <span key={label} className="text-xs px-2.5 py-1 rounded-lg border bg-emerald-100 text-emerald-700 border-emerald-200">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Activity — bottom right */}
        <div
          className="absolute bottom-14 right-8 lg:right-16 w-72 opacity-60"
          style={{ rotate: '-9deg', filter: 'blur(1.5px)', animation: 'float-a 4.8s ease-in-out infinite', animationDelay: '1.2s' }}
        >
          <div className="rounded-2xl border-2 bg-orange-50 border-orange-100 shadow-lg p-5 flex flex-col gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 self-start">
              🏃 Activity
            </span>
            <p className="text-slate-700 text-sm font-medium leading-snug">
              You&apos;ve been sitting for a while. Rank what actually happens next:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activityChips.slice(0, 3).map((label) => (
                <span key={label} className="text-xs px-2.5 py-1 rounded-lg border bg-orange-100 text-orange-700 border-orange-200">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full text-center space-y-8">

          <div className="space-y-4">
            <div className="text-6xl">🔮</div>
            <h1 className="text-4xl font-bold text-slate-800 leading-tight">
              What&apos;s your <span className="text-violet-500">vibe</span>?
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              16 questions across sleep, screen time, diet, and activity.
              No health lecture — just find out what kind of era you&apos;re in.
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

          <p className="text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>
            {' · '}
            <span>© {new Date().getFullYear()} Dan Hagman</span>
          </p>

        </div>
      </div>
    </main>
  );
}
