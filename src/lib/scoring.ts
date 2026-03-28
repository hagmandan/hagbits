import { questions, Category, Question, Answers } from './questions';

export interface CategoryScores {
  sleep_score: number;
  screen_score: number;
  diet_score: number;
  activity_score: number;
}

export type ArchetypeKey =
  | 'blueprint'
  | 'main_character'
  | 'undercover_athlete'
  | 'sleep_lore'
  | 'soft_life'
  | 'chaotic_functional'
  | 'always_online'
  | 'needs_more_fruit'
  | 'offline_struggling'
  | 'plot_twist';

export interface ArchetypeInfo {
  key: ArchetypeKey;
  label: string;
  tagline: string;
  emoji: string;
  description: string;
}

export interface ArchetypeResult {
  ranked: [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  comboLabel: string;
  comboEmoji: string;
}

export interface ScoreResult extends CategoryScores {
  total_score: number;
  archetype_ranked: string; // JSON array of top-3 ArchetypeKey[]
}

// ---------------------------------------------------------------------------
// Archetype definitions
// ---------------------------------------------------------------------------

const ARCHETYPE_INFO: Record<ArchetypeKey, ArchetypeInfo> = {
  blueprint: {
    key: 'blueprint',
    label: 'The Blueprint',
    emoji: '🏆',
    tagline: "You're not trying to be healthy — you just are. That's the rarest thing.",
    description:
      "You've quietly built the habits that most people talk about but don't actually do. Sleep is locked in, screen time isn't running your life, you're eating real food, and you're moving your body. No big announcement. No vision board. Just the blueprint.",
  },
  main_character: {
    key: 'main_character',
    label: 'Main Character Energy',
    emoji: '🌟',
    tagline: "You show up to your own life. That's rarer than it sounds.",
    description:
      "You're rested, you're moving, and you have the energy to actually be present. You might be on your phone more than you'd like, or your diet isn't perfect — but the foundation is solid. You feel good in your body most of the time, and people around you notice.",
  },
  undercover_athlete: {
    key: 'undercover_athlete',
    label: 'The Undercover Athlete',
    emoji: '🏃',
    tagline: "Your body's doing the work. Your sleep and screen time are... something else.",
    description:
      "You're genuinely active — that part's real. But you might be burning the candle at both ends: staying up too late, scrolling after workouts, not giving your body the recovery it needs. Your fitness is real. Your rest is overdue.",
  },
  sleep_lore: {
    key: 'sleep_lore',
    label: 'Sleep Lore',
    emoji: '🌙',
    tagline: "Your sleep game is elite. Everything else is still loading.",
    description:
      "You protect your sleep like it's a personality trait — and honestly? That's a flex. Your body is recovering well and your brain is probably sharper than you realize. The movement and screen stuff hasn't clicked yet, but sleep is the foundation. You're starting from the right place.",
  },
  soft_life: {
    key: 'soft_life',
    label: 'Soft Life Era',
    emoji: '🛋️',
    tagline: "Comfort is your love language. Motion is not.",
    description:
      "You eat well, you sleep well, you live well — comfort and restoration are your default mode. But your body might be asking for a little more movement, and your screen time might be cutting into the quality of that rest you treasure. The soft life is valid. A little more energy expenditure would make it even softer.",
  },
  chaotic_functional: {
    key: 'chaotic_functional',
    label: 'Chaotic Functional',
    emoji: '⚡',
    tagline: "You're thriving in some areas and completely unhinged in others. Classic.",
    description:
      "You've somehow built real strengths in a couple of areas while other parts of your routine are still on main character behavior. The chaos isn't a problem — it's information. You know how to be consistent. You just haven't applied it everywhere yet.",
  },
  always_online: {
    key: 'always_online',
    label: 'Always Online',
    emoji: '📱',
    tagline: "Your phone is calling. You always answer.",
    description:
      "You're doing okay in other areas — you move, you sleep reasonably, you eat something — but your screen time is where everything kind of blurs. The endless scroll is your default state, and it might be quietly eating into your sleep, your focus, and your actual life. One less hour a day would probably surprise you.",
  },
  needs_more_fruit: {
    key: 'needs_more_fruit',
    label: 'Needs More Fruit',
    emoji: '🍟',
    tagline: "Your body is running on fumes and vibes. Functioning, but barely fueled.",
    description:
      "You're managing to move, sleep, and exist without totally losing it — but your nutrition is the missing piece. Your energy is probably inconsistent, your focus comes and goes, and your body is working harder than it needs to because it's not getting the raw materials. Food is literally the simplest upgrade available.",
  },
  offline_struggling: {
    key: 'offline_struggling',
    label: 'Offline But Struggling',
    emoji: '💤',
    tagline: "The habits haven't clicked yet. That's just where you are right now.",
    description:
      "None of your four categories is a standout — sleep is rough, screen time is high, food is inconsistent, and movement is rare. But you're aware enough to take this quiz, which means something. Every person who has good habits started from exactly here. One small shift, consistently, is the move.",
  },
  plot_twist: {
    key: 'plot_twist',
    label: 'Plot Twist Loading',
    emoji: '🔄',
    tagline: "This is the before photo. The glow-up is incoming.",
    description:
      "Okay so right now — not great across the board. But here's the thing: this is actually the best starting position, because every single change you make will register immediately. You'll feel the difference within a week if you pick one thing and do it. No one who built great habits did it all at once. You're just before the plot twist.",
  },
};

// ---------------------------------------------------------------------------
// Fit-scoring via Euclidean distance to archetype centroids
// ---------------------------------------------------------------------------

// Ideal [sleep, screen, diet, activity] vectors, normalized 0–1 (where 1 = 12/12)
const CENTROIDS: Record<ArchetypeKey, [number, number, number, number]> = {
  blueprint:           [1.0, 1.0, 1.0, 1.0],
  main_character:      [0.9, 0.7, 0.7, 0.9],
  undercover_athlete:  [0.4, 0.4, 0.6, 1.0],
  sleep_lore:          [1.0, 0.5, 0.6, 0.3],
  soft_life:           [0.9, 0.4, 0.9, 0.2],
  chaotic_functional:  [0.6, 0.6, 0.6, 0.6],
  always_online:       [0.6, 0.2, 0.6, 0.6],
  needs_more_fruit:    [0.6, 0.6, 0.2, 0.6],
  offline_struggling:  [0.4, 0.4, 0.4, 0.4],
  plot_twist:          [0.1, 0.1, 0.1, 0.1],
};

function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

function stdDev(vals: number[]): number {
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  return Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
}

export interface ArchetypeDistance {
  key: ArchetypeKey;
  pct: number; // 0–100, higher = closer match
}

export function getArchetypeDistances(
  sleep: number,
  screen: number,
  diet: number,
  activity: number
): ArchetypeDistance[] {
  const user = [sleep, screen, diet, activity].map(s => s / 12);
  const variance = stdDev(user);
  const maxDist = Math.sqrt(4); // diagonal of 4D unit hypercube

  return (Object.keys(CENTROIDS) as ArchetypeKey[])
    .map(key => {
      let dist = euclidean(user, CENTROIDS[key]);
      if (key === 'chaotic_functional') dist -= variance * 0.5;
      const pct = Math.max(0, Math.min(100, Math.round((1 - dist / maxDist) * 100)));
      return { key, dist, pct };
    })
    .sort((a, b) => a.dist - b.dist)
    .map(({ key, pct }) => ({ key, pct }));
}

export function rankArchetypes(
  sleep: number,
  screen: number,
  diet: number,
  activity: number
): ArchetypeKey[] {
  return getArchetypeDistances(sleep, screen, diet, activity).map(d => d.key);
}

// ---------------------------------------------------------------------------
// Combo headline table — all 45 unique top-2 pairs (keys sorted alphabetically)
// ---------------------------------------------------------------------------

const COMBO_LABELS: Record<string, { label: string; emoji: string }> = {
  'blueprint+main_character':              { label: "Certified That Girl/Guy",                  emoji: "🏆🌟" },
  'blueprint+undercover_athlete':          { label: "The Full Package",                          emoji: "🏆🏃" },
  'blueprint+sleep_lore':                  { label: "Sleeping on Your Own Excellence",           emoji: "🏆🌙" },
  'blueprint+soft_life':                   { label: "Thriving in Comfort",                       emoji: "🏆🛋️" },
  'blueprint+chaotic_functional':          { label: "Mostly Put Together",                       emoji: "🏆⚡" },
  'always_online+blueprint':              { label: "Screen Break? What's That?",                 emoji: "🏆📱" },
  'blueprint+needs_more_fruit':            { label: "Almost Perfect",                            emoji: "🏆🍟" },
  'blueprint+offline_struggling':          { label: "Carrying the Team",                         emoji: "🏆💤" },
  'blueprint+plot_twist':                  { label: "Glow Up Complete",                          emoji: "🏆🔄" },

  'main_character+undercover_athlete':     { label: "The Active Protagonist",                   emoji: "🌟🏃" },
  'main_character+sleep_lore':             { label: "Well-Rested Lead Role",                    emoji: "🌟🌙" },
  'main_character+soft_life':              { label: "Comfortable in the Spotlight",              emoji: "🌟🛋️" },
  'chaotic_functional+main_character':     { label: "Loveable Chaos Energy",                    emoji: "🌟⚡" },
  'always_online+main_character':          { label: "Always On, Always Moving",                 emoji: "🌟📱" },
  'main_character+needs_more_fruit':       { label: "Running on Fumes and Fits",                emoji: "🌟🍟" },
  'main_character+offline_struggling':     { label: "Potential Unlocked",                       emoji: "🌟💤" },
  'main_character+plot_twist':             { label: "Plot Twist Protagonist",                   emoji: "🌟🔄" },

  'sleep_lore+undercover_athlete':         { label: "Gains While Rested",                       emoji: "🌙🏃" },
  'soft_life+undercover_athlete':          { label: "Gym-to-Couch Pipeline",                    emoji: "🛋️🏃" },
  'chaotic_functional+undercover_athlete': { label: "Chaotic Cardio Energy",                    emoji: "⚡🏃" },
  'always_online+undercover_athlete':      { label: "Scrolling Between Sets",                   emoji: "📱🏃" },
  'needs_more_fruit+undercover_athlete':   { label: "Moving on Empty",                          emoji: "🍟🏃" },
  'offline_struggling+undercover_athlete': { label: "Diamond in the Rough",                     emoji: "💤🏃" },
  'plot_twist+undercover_athlete':         { label: "The Origin Story",                         emoji: "🔄🏃" },

  'sleep_lore+soft_life':                  { label: "Permanently in Cozy Season",               emoji: "🌙🛋️" },
  'chaotic_functional+sleep_lore':         { label: "Rested but the Rest is a Mess",            emoji: "⚡🌙" },
  'always_online+sleep_lore':              { label: "Asleep at 10, Online at 9:59",             emoji: "📱🌙" },
  'needs_more_fruit+sleep_lore':           { label: "Sleeping Beauty, Needs Lunch",             emoji: "🍟🌙" },
  'offline_struggling+sleep_lore':         { label: "At Least the Sleep Slaps",                 emoji: "💤🌙" },
  'plot_twist+sleep_lore':                 { label: "The Sleeping Giant",                       emoji: "🔄🌙" },

  'chaotic_functional+soft_life':          { label: "Comfort Chaos",                            emoji: "⚡🛋️" },
  'always_online+soft_life':               { label: "Chronically Cozy, Chronically Online",     emoji: "📱🛋️" },
  'needs_more_fruit+soft_life':            { label: "Snacks and Soft Hours",                    emoji: "🍟🛋️" },
  'offline_struggling+soft_life':          { label: "Resting But Reaching",                     emoji: "💤🛋️" },
  'plot_twist+soft_life':                  { label: "The Cozy Comeback",                        emoji: "🔄🛋️" },

  'always_online+chaotic_functional':      { label: "Uncontrolled Feed, Controlled Chaos",      emoji: "📱⚡" },
  'chaotic_functional+needs_more_fruit':   { label: "Chaotic Hungry Energy",                    emoji: "⚡🍟" },
  'chaotic_functional+offline_struggling': { label: "Almost Figured It Out",                    emoji: "⚡💤" },
  'chaotic_functional+plot_twist':         { label: "The Unhinged Underdog",                    emoji: "⚡🔄" },

  'always_online+needs_more_fruit':        { label: "Phone in Hand, Fork Missing",              emoji: "📱🍟" },
  'always_online+offline_struggling':      { label: "Scrolling Through the Struggle",           emoji: "📱💤" },
  'always_online+plot_twist':              { label: "Digital Detox Pending",                    emoji: "📱🔄" },

  'needs_more_fruit+offline_struggling':   { label: "Running on WiFi and Wishes",               emoji: "🍟💤" },
  'needs_more_fruit+plot_twist':           { label: "Hungry for the Comeback",                  emoji: "🍟🔄" },

  'offline_struggling+plot_twist':         { label: "The Renaissance is Loading",               emoji: "💤🔄" },
};

export function getArchetypeInfo(key: ArchetypeKey): ArchetypeInfo {
  return ARCHETYPE_INFO[key];
}

export const ARCHETYPE_KEYS: ArchetypeKey[] = Object.keys(ARCHETYPE_INFO) as ArchetypeKey[];

export function getArchetypeCentroidScores(key: ArchetypeKey): CategoryScores {
  const [s, sc, d, a] = CENTROIDS[key];
  return {
    sleep_score: Math.round(s * 12),
    screen_score: Math.round(sc * 12),
    diet_score: Math.round(d * 12),
    activity_score: Math.round(a * 12),
  };
}

export function getArchetypeResult(ranked: ArchetypeKey[]): ArchetypeResult {
  const top3 = ranked.slice(0, 3) as [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  const comboKey = [top3[0], top3[1]].sort().join('+');
  const combo = COMBO_LABELS[comboKey] ?? { label: `${ARCHETYPE_INFO[top3[0]].label} + ${ARCHETYPE_INFO[top3[1]].label}`, emoji: `${ARCHETYPE_INFO[top3[0]].emoji}${ARCHETYPE_INFO[top3[1]].emoji}` };
  return {
    ranked: top3,
    comboLabel: combo.label,
    comboEmoji: combo.emoji,
  };
}

// ---------------------------------------------------------------------------
// Score computation
// ---------------------------------------------------------------------------

export function computeRankedScore(selectedIndices: number[], question: Question): number {
  const rankCount = question.rankCount ?? 3;
  const maxPossible = rankCount * (rankCount + 1) / 2;
  let weightedSum = 0;
  selectedIndices.forEach((optionIdx, position) => {
    const weight = rankCount - position;
    const optionScore = question.options[optionIdx]?.score ?? 0;
    weightedSum += optionScore * weight;
  });
  return Math.min(3, Math.max(0, Math.round((weightedSum / maxPossible) * 3)));
}

export interface QuestionScore {
  id: string;
  category: Category;
  score: number; // 0–3
  rawAnswer: number | number[];
}

export function computePerQuestionScores(answers: Answers): QuestionScore[] {
  return questions.map(question => {
    const rawAnswer = answers[question.id];
    const score = question.type === 'ranked'
      ? Array.isArray(rawAnswer) ? computeRankedScore(rawAnswer, question) : 0
      : typeof rawAnswer === 'number' ? rawAnswer : 0;
    return { id: question.id, category: question.category, score, rawAnswer: rawAnswer ?? 0 };
  });
}

export function computeScores(answers: Answers): ScoreResult {
  const categoryTotals: Record<Category, number> = {
    sleep: 0,
    screen: 0,
    diet: 0,
    activity: 0,
  };

  for (const question of questions) {
    const rawAnswer = answers[question.id];
    const score = question.type === 'ranked'
      ? Array.isArray(rawAnswer) ? computeRankedScore(rawAnswer, question) : 0
      : typeof rawAnswer === 'number' ? rawAnswer : 0;
    categoryTotals[question.category] += score;
  }

  const sleep_score = categoryTotals.sleep;
  const screen_score = categoryTotals.screen;
  const diet_score = categoryTotals.diet;
  const activity_score = categoryTotals.activity;
  const total_score = sleep_score + screen_score + diet_score + activity_score;
  const ranked = rankArchetypes(sleep_score, screen_score, diet_score, activity_score);
  const archetype_ranked = JSON.stringify(ranked.slice(0, 3));

  return { sleep_score, screen_score, diet_score, activity_score, total_score, archetype_ranked };
}

// ---------------------------------------------------------------------------
// Category bands and tips
// ---------------------------------------------------------------------------

export function getBandLabel(score: number): string {
  if (score >= 11) return "Thriving";
  if (score >= 8) return "Pretty solid";
  if (score >= 4) return "Room to grow";
  return "Needs a glow-up";
}

export function getBandColor(score: number): string {
  if (score >= 11) return "bg-emerald-400";
  if (score >= 8) return "bg-sky-400";
  if (score >= 4) return "bg-amber-400";
  return "bg-rose-400";
}

export type CategoryTip = {
  category: string;
  band: string;
  tip: string;
};

export function getCategoryTips(scores: CategoryScores): CategoryTip[] {
  return [
    {
      category: 'Sleep',
      band: getBandLabel(scores.sleep_score),
      tip: getTip('sleep', scores.sleep_score),
    },
    {
      category: 'Screen Time',
      band: getBandLabel(scores.screen_score),
      tip: getTip('screen', scores.screen_score),
    },
    {
      category: 'Diet & Hydration',
      band: getBandLabel(scores.diet_score),
      tip: getTip('diet', scores.diet_score),
    },
    {
      category: 'Physical Activity',
      band: getBandLabel(scores.activity_score),
      tip: getTip('activity', scores.activity_score),
    },
  ];
}

// ---------------------------------------------------------------------------
// Pillars — cross-category meta-layer
// ---------------------------------------------------------------------------

export interface PillarInsight {
  name: 'rest' | 'learn' | 'grow' | 'play';
  emoji: string;
  tag: string;
  insight: string;
}

type PillarState = 'both' | 'aOnly' | 'bOnly' | 'neither';

function pillarState(aScore: number, bScore: number): PillarState {
  const a = aScore >= 8, b = bScore >= 8;
  if (a && b)  return 'both';
  if (a && !b) return 'aOnly';
  if (!a && b) return 'bOnly';
  return 'neither';
}

const PILLAR_DATA: Array<{
  name: PillarInsight['name'];
  emoji: string;
  aKey: keyof CategoryScores;
  bKey: keyof CategoryScores;
  states: Record<PillarState, { tag: string; insight: string }>;
}> = [
  {
    name: 'rest',
    emoji: '🌙',
    aKey: 'sleep_score',
    bKey: 'screen_score',
    states: {
      both:    { tag: 'Locked in',    insight: "Your sleep is protected and your screen habits aren't blowing it up. You're actually recovering — that's not a given for most people your age." },
      aOnly:   { tag: 'Fragile',      insight: "Your sleep is decent but screen time is chipping away at the edges. The late-night scrolling is costing you more than you realize." },
      bOnly:   { tag: 'Half-built',   insight: "You're not glued to your phone all night — right instinct — but sleep still isn't clicking. The problem probably isn't screens anymore." },
      neither: { tag: 'Running dry',  insight: "Late nights, phone in hand, not really resting. Even one change (phone out of reach at bedtime) compounds fast." },
    },
  },
  {
    name: 'learn',
    emoji: '🧠',
    aKey: 'screen_score',
    bKey: 'sleep_score',
    states: {
      both:    { tag: 'Switched on',   insight: "You're consuming intentionally and giving your brain time to process it. Sleep is when memory consolidates — you're getting both sides of the loop." },
      aOnly:   { tag: 'Input only',    insight: "You're selective about what goes in your head, but skimping on sleep means your brain never finishes processing it. Taking notes you never read back." },
      bOnly:   { tag: 'Sleeping on it', insight: "Your brain is getting the recovery it needs — but mostly from passive scrolling. More intentional input would make the sleep work harder." },
      neither: { tag: 'Signal lost',   insight: "High passive screen time plus low sleep is a focus-killer. Overstimulated and underrested. Put the phone down 30 min earlier — clarity follows within days." },
    },
  },
  {
    name: 'grow',
    emoji: '🌱',
    aKey: 'diet_score',
    bKey: 'activity_score',
    states: {
      both:    { tag: 'Fully loaded',       insight: "You're fueling right and actually using your body. That combo is rare — more stable energy, better mood, faster recovery. Keep the loop going." },
      aOnly:   { tag: 'Idling',             insight: "You're eating well — the raw materials are there — but without movement a lot of that potential just sits. Even 20 minutes a day unlocks what good food is actually for." },
      bOnly:   { tag: 'Running on fumes',   insight: "You're moving but not fueling the effort properly. Your body is working hard on not enough. Consistent eating would make your active days feel noticeably different." },
      neither: { tag: 'Needs a jumpstart',  insight: "Start with one meal. Seriously — just eat breakfast. Energy follows, and movement follows from that." },
    },
  },
  {
    name: 'play',
    emoji: '🎯',
    aKey: 'activity_score',
    bKey: 'screen_score',
    states: {
      both:    { tag: 'Best of both',         insight: "You're moving AND being intentional about your downtime. You know how to actually enjoy yourself without defaulting to the scroll. Real skill." },
      aOnly:   { tag: 'In the body',          insight: "You're physically active — W — but downtime probably leans heavy on passive screens. The activity is real. The rest of 'play' could be more varied." },
      bOnly:   { tag: 'Low-key intentional',  insight: "Not glued to your phone in free time, but not moving much either. Your body would appreciate being invited to the party." },
      neither: { tag: 'On pause',             insight: "Most free time is passive screen time with not much movement. Both get worse the less you do. Pick one thing you enjoy that isn't on a screen." },
    },
  },
];

export function getPillarInsights(scores: CategoryScores): PillarInsight[] {
  return PILLAR_DATA.map(({ name, emoji, aKey, bKey, states }) => {
    const state = pillarState(scores[aKey], scores[bKey]);
    return { name, emoji, ...states[state] };
  });
}

// ---------------------------------------------------------------------------

function getTip(category: Category, score: number): string {
  const tips: Record<Category, Record<string, string>> = {
    sleep: {
      low: "Your body is genuinely exhausted and it's affecting more than you think — focus, mood, how anxious you feel, all of it. Try one thing: put your phone on the other side of the room tonight. Just tonight. If you wake up less groggy, that's your proof.",
      mid: "You're getting some sleep, but the quality is probably inconsistent. Try shifting your actual off-time 30 minutes earlier — even 2–3 nights a week. It compounds fast.",
      high: "Your sleep is genuinely decent. To level up: check your weekend schedule — if you're sleeping 3 hours later on weekends, that 'social jet lag' cancels a lot of your weekday consistency.",
      top: "Sleep is your foundation and you're protecting it. That's not boring — that's elite. Your brain consolidates memory, regulates mood, and repairs itself while you sleep. Keep that bedtime sacred.",
    },
    screen: {
      low: "Your phone is running your day more than you are. One small experiment: put your phone in another room when you go to sleep tonight. Just to see what morning feels like. That's it.",
      mid: "You know your screen time is a thing. The shift from awareness to action is just one habit: pick one hour a day where the phone is face-down in another room — meals, first hour after school, whatever fits.",
      high: "You've got more self-control with your phone than most people your age. To tighten it up: check your weekly screen time stats and see which specific app is eating the most hours. Set a 45-minute daily limit on it.",
      top: "You use your phone — it doesn't use you. That's rare and it shows in your attention, your sleep, and how present you are in real life. Being intentional about when you pick it up is a skill most adults haven't figured out.",
    },
    diet: {
      low: "Your body is trying to function without the fuel it needs. Even one change makes a real difference: eat something within the first hour of waking up — anything, even small. It signals to your body that the day has started and can change your energy by 3pm.",
      mid: "Your eating is inconsistent and your energy probably reflects that. The easiest fix isn't eating 'better,' it's eating more regularly. Even two consistent meal times a day stabilizes your blood sugar and your mood.",
      high: "You're fueling yourself reasonably well. The next level is hydration — most teens are chronically slightly dehydrated and don't know it because it feels like low-level tiredness. Try a full glass of water first thing in the morning for a week.",
      top: "You actually eat like someone who respects their future self. Real food, consistent timing, staying hydrated — that combination is doing a lot of work for your energy, focus, and mood, even if you don't realize the full effect.",
    },
    activity: {
      low: "Your body is built to move and right now it's mostly not. Start absurdly small: a 10-minute walk outside, today, no headphones. Notice how you feel after. That's the entry point, and it's actually enough to start.",
      mid: "You move sometimes but it's not consistent enough to feel the real benefits yet. Pick one day this week and put movement in. Not a workout — just movement. Same time, same thing. That's how it becomes automatic.",
      high: "You're moving regularly and your body is better for it — more energy, better sleep, more regulated mood. To go further: adding one social element (a class, a team, a friend to walk with) dramatically improves consistency.",
      top: "You move because you want to, not because you feel like you should — and that shift in mindset is everything. You've probably noticed your sleep is better, your stress is lower, and your focus is sharper on active days. You've built the habit that makes everything else easier.",
    },
  };

  const t = tips[category];
  if (score >= 11) return t.top;
  if (score >= 8) return t.high;
  if (score >= 4) return t.mid;
  return t.low;
}
