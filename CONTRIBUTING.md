# Contributing to Hagbits

Thanks for your interest! Hagbits is a personal project, but thoughtful contributions are welcome.

## Before you start

- Open an issue first to discuss significant changes — saves everyone time if a direction doesn't fit the project vision.
- Small fixes (typos, broken links, minor bugs) can go straight to a PR.

## Development setup

```bash
git clone https://github.com/hagmandan/hagbits.git
cd hagbits
yarn install
cp .env.example .env.local   # add your DATABASE_URL
yarn dev
```

## Guidelines

**Questions & scoring** (`src/lib/questions.ts`, `src/lib/scoring.ts`)
Keep the tone honest and conversational — no moralising. Questions should be things a teen would actually recognise in their own life. Scoring values (0–1 range for ranked, 0–3 for single) should map intuitively to healthier behaviour getting higher scores.

**UI**
Follow the existing two-column layout and category colour scheme. Tailwind utility classes only — no new CSS files.

**Commits**
Clear, present-tense commit messages: `Add ranked question to diet section`, not `Added stuff`.

**Tests**
Run the Playwright suite before opening a PR:
```bash
npx playwright test
```
Screenshots land in `test-results/` and are gitignored.

## Pull request checklist

- [ ] `yarn lint` passes with no new errors
- [ ] `yarn build` succeeds
- [ ] Playwright tests pass
- [ ] Description explains *why*, not just *what*

## Code of conduct

Be kind. This app is built for teens — keep that audience in mind in everything from tone to privacy decisions.
