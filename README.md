# Hagbits

**Hagbits** is an anonymous lifestyle quiz app for teens.

The name is a triple pun: it combines *Hags* (Dan's nickname), *habits* (what the app is about), and the idea of "healthy and good bits" — small, honest checkpoints on how you're actually living.

---

## What it does (today)

Users answer **16 questions** across four lifestyle categories:

| Category | Focus |
|---|---|
| 💤 Sleep | Bedtime, alarms, wind-down routine |
| 📱 Screen Time | App rabbit holes, morning routine, idle habits |
| 🥗 Diet & Hydration | What you reach for, meal patterns, drinks |
| 🏃 Activity | Movement, how you spend free time |

Questions come in two flavours — single-choice and **ranked** (drag-to-order style) — and the whole thing takes ~2 minutes with no account required.

At the end you get a personalised **vibe result**: a personality label (e.g. *The Recharge Arc*, *Digital Nomad*) with per-category scores and practical tips.

---

## Roadmap

- **Quiz + Results** ✅ live
- **Habit Tracker** — check back in daily on specific habits; see streaks and trends over time
- **Profile & Avatar** — build a character that evolves with your scores; unlock cosmetics as you improve

---

## Tech stack

- [Next.js](https://nextjs.org) (App Router, server components)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Neon](https://neon.tech) — serverless PostgreSQL
- [Playwright](https://playwright.dev) — end-to-end tests

---

## Running locally

```bash
# Install dependencies
yarn install

# Set up your database URL
cp .env.example .env.local
# Add DATABASE_URL=<your Neon connection string>

# Start the dev server
yarn dev        # http://localhost:3000
yarn dev-https  # HTTPS variant
```

### Build & lint

```bash
yarn build
yarn lint
```

### Tests

```bash
# Run Playwright e2e suite (screenshots saved to test-results/)
npx playwright test

# With a real DB (requires DATABASE_URL)
DATABASE_URL=<url> npx playwright test
```

---

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    quiz/page.tsx         # Quiz flow (client component)
    results/[id]/page.tsx # Results (server-rendered)
    api/responses/        # POST scores, GET by UUID
    privacy/page.tsx      # Privacy policy
  components/
    QuizCard.tsx          # Single-choice question card
    RankingCard.tsx       # Ranked question UI
    ProgressBar.tsx
  lib/
    questions.ts          # All 16 questions, options, scores
    scoring.ts            # Score computation & personality mapping
    db.ts                 # Neon SQL client
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Privacy

See [PRIVACY.md](./PRIVACY.md) or visit `/privacy` in the app.

## License

[MIT](./LICENSE) © Dan Hagman
