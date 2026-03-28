import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Hagbits',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-10">

        <div className="space-y-2">
          <Link href="/" className="text-sm text-violet-500 hover:text-violet-700 transition-colors">
            ← Back to Hagbits
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: March 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">What is Hagbits?</h2>
          <p className="text-slate-600 leading-relaxed">
            Hagbits is an anonymous lifestyle quiz app for teens. It asks 16 questions across four
            categories — sleep, screen time, diet, and physical activity — and returns a personalised
            result with scores and tips. No account is required, and no personally identifiable
            information is collected.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">What data we collect</h2>
          <p className="text-slate-600 leading-relaxed">
            When you complete the quiz, your answers are stored in a database alongside a randomly
            generated identifier (UUID). We do <strong>not</strong> collect:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your IP address</li>
            <li>Device identifiers or cookies for tracking</li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            The only data stored is your quiz answers (as numeric scores) and the UUID in the
            shareable results link. There is no way for us to link this back to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">How your data is used</h2>
          <p className="text-slate-600 leading-relaxed">
            Quiz responses are used solely to generate and display your results page. We may analyse
            anonymised, aggregated response data to improve the questions and scoring — no individual
            record is ever singled out.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Data storage</h2>
          <p className="text-slate-600 leading-relaxed">
            Data is stored in{' '}
            <a href="https://firebase.google.com/products/firestore" className="text-violet-500 underline underline-offset-2">
              Firebase Firestore
            </a>
            {' '}(Google Cloud), a SOC 2 certified NoSQL document database. Data is stored in the
            US by default. We do not share data with any third-party analytics or advertising services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Children&apos;s privacy</h2>
          <p className="text-slate-600 leading-relaxed">
            Hagbits is intended for users aged 13 and above. If you are under 13, please use this
            app only with a parent or guardian&apos;s permission. We do not knowingly collect any
            information from children under 13, and because no personal information is collected at
            all, this risk is minimal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            Hagbits does not use cookies for tracking or analytics. Session state (your in-progress
            quiz) is held in browser memory only and is lost when you close the tab.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Your rights</h2>
          <p className="text-slate-600 leading-relaxed">
            Because responses are anonymous and unlinked to any identity, we cannot retrieve or
            delete a specific person&apos;s data on request. If you have a concern, please open an
            issue on{' '}
            <a
              href="https://github.com/hagmandan/hagbits"
              className="text-violet-500 underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Changes to this policy</h2>
          <p className="text-slate-600 leading-relaxed">
            We may update this policy as new features are added (such as profiles or tracking).
            The &quot;last updated&quot; date at the top of this page will reflect any changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700">Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            Questions or concerns? Open an issue at{' '}
            <a
              href="https://github.com/hagmandan/hagbits/issues"
              className="text-violet-500 underline underline-offset-2"
            >
              github.com/hagmandan/hagbits
            </a>
            .
          </p>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          © {new Date().getFullYear()} Dan Hagman. All rights reserved.
        </p>

      </div>
    </main>
  );
}
