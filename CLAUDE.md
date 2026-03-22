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

**Hagbits** is an anonymous habit-check quiz app for teens. Users answer 16 questions across 4 lifestyle categories, then receive a personalized "vibe" personality result with per-category scores and tips.

### Data flow

1. **Landing** (`/`) → **Quiz** (`/quiz`) → **Results** (`/results/[id]`)
2. On quiz completion, answers POST to `/api/responses`, which scores them and writes to the Neon (PostgreSQL) `quiz_responses` table, returning a UUID
3. Results page is server-rendered, fetching by that UUID

### Key files

- `src/lib/questions.ts` — All 16 questions with options, scores, and question type (`single` or `ranked`)
- `src/lib/scoring.ts` — Score computation, personality label mapping (0–48 total), category bands, and per-category tips
- `src/lib/db.ts` — Neon serverless SQL client
- `src/app/api/responses/route.ts` — POST saves a result; GET fetches one by `?id=`
- `src/app/quiz/page.tsx` — Client component managing question state, slide animations, and two-column layout

### Question types

- **Single-choice** (12 questions): each option has a fixed score 0–3
- **Ranked** (4 questions): user orders 5 items from a list; score computed as weighted sum normalized to 0–3 range

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom animations (`slide-in-from-right`, `fade-in-up`, `badge-pop`) are defined in `src/app/globals.css`. Category background colors shift per section (indigo/sleep, sky/screen, emerald/diet, orange/activity).

### Path alias

`@/*` maps to `./src/*`.
