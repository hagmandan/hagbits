# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
yarn dev          # Start dev server (http://localhost:3000)
yarn dev-https    # Start dev server with HTTPS
yarn build        # Production build
yarn lint         # Run ESLint
```

There are no tests configured.

## Architecture

**Hagbits** is an anonymous habit-check quiz app for teens. Users answer 16 questions across 4 lifestyle categories, then receive a personalized **HagBit** result: a ranked set of archetypes, per-category scores, cross-category pillar insights, and actionable tips.

See [`docs/SCORING.md`](docs/SCORING.md) for the full scoring system, archetype definitions, and pillar philosophy.

### Data flow

1. **Landing** (`/`) → **Quiz** (`/quiz`) → **Results** (`/results/[id]`)
2. On quiz completion, answers POST to `/api/responses`, which scores them and writes to **Firebase Firestore** (`quiz_responses` collection), returning a document ID
3. Results page is server-rendered, fetching by that document ID via `firebase-admin`

### Key files

- `src/lib/questions.ts` — All 16 questions with options, scores, emoji, and question type (`single` or `ranked`)
- `src/lib/scoring.ts` — Score computation, archetype ranking, pillar insights, category bands, and tips
- `src/lib/firebase-admin.ts` — Firestore admin client
- `src/app/api/responses/route.ts` — POST saves a result; GET fetches one by `?id=`
- `src/app/quiz/page.tsx` — Client component managing question state, slide animations, and two-column layout

### Question types

- **Single-choice** (7 questions): each option has a fixed score 0–3
- **Ranked** (9 questions): user selects and orders 3 items from a shuffled list; score computed as weighted sum normalized to 0–3. The final option ("Mine's different — not really on this list", score 0.5) is always pinned last and serves as an escape hatch.

Each question carries an `emoji` field used as a watermark on the quiz page and inline with the blurb.

### Scoring summary

- Each question contributes 0–3 points to its category
- 4 questions per category → category scores range 0–12
- Total score range: 0–48
- See `docs/SCORING.md` for full detail

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom animations (`slide-in-from-right`, `fade-in-up`, `badge-pop`, `rank-item-in`, `float-a/b/c`) are defined in `src/app/globals.css`. Category background colors shift per section (indigo/sleep, sky/screen, emerald/diet, orange/activity).

### Path alias

`@/*` maps to `./src/*`.
