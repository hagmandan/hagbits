# Hagbits Scoring System

This document covers the full scoring model: how raw answers become category scores, how category scores map to archetypes, and how archetypes and pillar insights are presented on the results page.

---

## 1. Categories

There are 4 quiz categories, each measured by 4 questions (0–3 points each), giving a 0–12 score per category and a 0–48 total.

| Category | Color theme | What it measures |
|----------|------------|-----------------|
| **Sleep** | Indigo | Sleep timing, quality, alarms, and bedtime behaviors |
| **Screen Time** | Sky | Phone use patterns, morning routine, pre-sleep habits, idle behavior |
| **Diet & Hydration** | Emerald | Food quality, meal regularity, hydration choices |
| **Physical Activity** | Orange | Type and frequency of movement, sedentary behavior, energy levels |

### Score bands (per category, 0–12)

| Range | Band | Color |
|-------|------|-------|
| 11–12 | Thriving | Emerald |
| 8–10 | Pretty solid | Sky |
| 4–7 | Room to grow | Amber |
| 0–3 | Needs a glow-up | Rose |

---

## 2. Question types

### Single-choice
Each option has a fixed score 0–3. The user's raw selection is used directly.

### Ranked
The user picks and orders 3 items from a shuffled list. Score is computed as:

```
weightedSum = Σ (option.score × (rankCount - position))
maxPossible = rankCount × (rankCount + 1) / 2
score = clamp(round((weightedSum / maxPossible) × 3), 0, 3)
```

Where `position` is 0-indexed (first pick = highest weight). This normalizes any number of options to the 0–3 scale.

The final option on every ranked question ("Mine's different — not really on this list", score 0.5) is pinned last and serves as a neutral escape hatch. It contributes a mid-range score rather than penalizing or rewarding atypical habits.

---

## 3. Archetypes

A **HagBit** is a ranked set of 3 archetypes selected from 10 by Euclidean distance to predefined centroids. Archetypes replace a 1D score-to-label mapping with a multi-dimensional identity model.

### How archetype ranking works

Each archetype has a centroid: an ideal `[sleep, screen, diet, activity]` vector normalized to 0–1. The user's category scores are normalized the same way, then Euclidean distance is computed to each centroid. The 10 archetypes are ranked closest→furthest; the top 3 are shown.

**Special case — Chaotic Functional:** This archetype gets a bonus proportional to the standard deviation of the user's 4 scores, rewarding mixed/uneven profiles that wouldn't otherwise cluster near its centroid.

```
dist(chaotic_functional) -= stdDev(userScores) × 0.5
```

### Archetype definitions

| Key | Label | Emoji | Centroid [sleep, screen, diet, activity] |
|-----|-------|-------|------------------------------------------|
| `blueprint` | The Blueprint | 🏆 | [1.0, 1.0, 1.0, 1.0] |
| `main_character` | Main Character Energy | 🌟 | [0.9, 0.7, 0.7, 0.9] |
| `undercover_athlete` | The Undercover Athlete | 🏃 | [0.4, 0.4, 0.6, 1.0] |
| `sleep_lore` | Sleep Lore | 🌙 | [1.0, 0.5, 0.6, 0.3] |
| `soft_life` | Soft Life Era | 🛋️ | [0.9, 0.4, 0.9, 0.2] |
| `chaotic_functional` | Chaotic Functional | ⚡ | [0.6, 0.6, 0.6, 0.6] + variance bonus |
| `always_online` | Always Online | 📱 | [0.6, 0.2, 0.6, 0.6] |
| `needs_more_fruit` | Needs More Fruit | 🍟 | [0.6, 0.6, 0.2, 0.6] |
| `offline_struggling` | Offline But Struggling | 💤 | [0.4, 0.4, 0.4, 0.4] |
| `plot_twist` | Plot Twist Loading | 🔄 | [0.1, 0.1, 0.1, 0.1] |

### Combo headline

The top-2 archetypes (sorted alphabetically by key) form a combo key (e.g. `always_online+blueprint`) that maps to a unique label and emoji pair from a 45-entry table. This gives the results page its headline identity — a witty synthesis of the user's two strongest traits.

---

## 4. The 4 Pillars

Pillars are a **higher-level meta-layer** computed from the same category scores. Where category tips diagnose each habit area individually, pillars synthesize across two categories to reflect broader life patterns.

Each pillar pairs two categories and uses a binary gate (`score ≥ 8` = "good") to select from 4 pre-written insights.

| Pillar | Emoji | Primary | Secondary | Rationale |
|--------|-------|---------|-----------|-----------|
| **rest** | 🌙 | sleep | screen | Recovery requires both physical rest and protecting it from digital disruption |
| **learn** | 🧠 | screen | sleep | Intentional consumption + sleep-based memory consolidation = actual learning |
| **grow** | 🌱 | diet | activity | Growth requires both fuel (diet) and challenge (movement) |
| **play** | 🎯 | activity | screen | How you enjoy your time — real-world movement vs. passive consumption |

### Pillar state logic

```
aGood = score_a >= 8
bGood = score_b >= 8

both    → both contributing categories are solid
aOnly   → primary is good, secondary is weak
bOnly   → primary is weak, secondary is good
neither → both are weak
```

Note: for **rest** and **play**, a high `screen_score` is the "good" state — it indicates controlled, intentional phone use, which supports rest and real-world play.

### Pillar insight tags

| Pillar | both | aOnly | bOnly | neither |
|--------|------|-------|-------|---------|
| rest | Locked in | Fragile | Half-built | Running dry |
| learn | Switched on | Input only | Sleeping on it | Signal lost |
| grow | Fully loaded | Idling | Running on fumes | Needs a jumpstart |
| play | Best of both | In the body | Low-key intentional | On pause |

---

## 5. Results page structure

```
┌─────────────────────┬────────────────┬──────────────────┐
│  ArchetypeCard      │  Report card   │  Score breakdown │
│  (sticky)           │  (category     │  (ScoreBar ×4)   │
│                     │   tips ×4)     │                  │
│  · Combo headline   │                │  Retake / Share  │
│  · Top 3 archetypes │                │                  │
│  · Heatmap bars     │                │                  │
└─────────────────────┴────────────────┴──────────────────┘
┌──────────────┬──────────────┬──────────────┬────────────┐
│  🌙 rest     │  🧠 learn    │  🌱 grow     │  🎯 play   │
│  [tag]       │  [tag]       │  [tag]       │  [tag]     │
│  insight...  │  insight...  │  insight...  │  insight.. │
└──────────────┴──────────────┴──────────────┴────────────┘
```

- **3-column grid** (responsive: 1-col mobile → 2-col lg → 3-col xl)
- **2×2 pillar grid** spans full width below the main grid
- ArchetypeCard is sticky on desktop

---

## 6. Design intent

Hagbits is not a health assessment. The philosophy:

- **Non-judgmental** — no category is "bad," every archetype has a positive frame
- **Specific, not generic** — tips reference real behaviors (specific apps, meal timing, walking without headphones) rather than vague advice
- **Teen voice** — copy avoids clinical language; uses phrases like "W," "locked in," "era"
- **Escape hatch** — ranked questions always offer a neutral opt-out so no user is blocked by options that don't fit their life
- **Multi-dimensional** — a single 0–48 score can't capture habit complexity; archetypes + pillars together give a richer, more honest picture
