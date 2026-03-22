import { questions, Category, Question, Answers } from './questions';

export interface CategoryScores {
  sleep_score: number;
  screen_score: number;
  diet_score: number;
  activity_score: number;
}

export interface ScoreResult extends CategoryScores {
  total_score: number;
  personality_label: string;
}

export interface PersonalityInfo {
  label: string;
  tagline: string;
  emoji: string;
}

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
  const personality_label = getPersonalityLabel(total_score);

  return { sleep_score, screen_score, diet_score, activity_score, total_score, personality_label };
}

export function getPersonalityLabel(total: number): string {
  if (total >= 40) return "That Girl/That Guy Era";
  if (total >= 30) return "Soft Launch of a Better You";
  if (total >= 20) return "Chaotic Neutral";
  if (total >= 10) return "NPC Mode (Offline)";
  return "Villain Arc (Unhinged)";
}

export function getPersonalityInfo(label: string): PersonalityInfo {
  const map: Record<string, PersonalityInfo> = {
    "That Girl/That Guy Era": {
      label: "That Girl/That Guy Era",
      tagline: "You're lowkey thriving and probably don't even realize it",
      emoji: "✨",
    },
    "Soft Launch of a Better You": {
      label: "Soft Launch of a Better You",
      tagline: "The vibe is there — just a few tweaks needed",
      emoji: "🌱",
    },
    "Chaotic Neutral": {
      label: "Chaotic Neutral",
      tagline: "You've got good days and bad days and somehow survive both",
      emoji: "⚡",
    },
    "NPC Mode (Offline)": {
      label: "NPC Mode (Offline)",
      tagline: "Your body's been sending signals — maybe worth listening",
      emoji: "💤",
    },
    "Villain Arc (Unhinged)": {
      label: "Villain Arc (Unhinged)",
      tagline: "No judgment, but your body called and it's concerned",
      emoji: "🔥",
    },
  };
  return map[label] ?? map["Chaotic Neutral"];
}

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

function getTip(category: Category, score: number): string {
  const tips: Record<Category, Record<string, string>> = {
    sleep: {
      low: "Try putting your phone across the room at night — even one night makes a difference. Your brain needs darkness to wind down.",
      mid: "You're close! Shifting your sleep time 30 minutes earlier could make mornings feel less brutal.",
      high: "Solid sleep game. Keep that consistent bedtime — it's literally a superpower.",
      top: "Sleep icon behavior. Your brain and body thank you every single morning.",
    },
    screen: {
      low: "Your phone might be running your schedule more than you are. Try a 1-hour screen-free window before bed — even one night.",
      mid: "You're aware of it, which is half the battle. Try greyscale mode on your phone to make scrolling less addictive.",
      high: "You've got decent phone boundaries. A quick check-in of your daily screen time in settings could keep you on track.",
      top: "Low screen, high life. You're rare — keep being intentional about when you pick it up.",
    },
    diet: {
      low: "Your body runs on fuel. Even just adding breakfast can shift your energy and mood a lot.",
      mid: "The chaos is real, but a few consistent meal times can make everything feel more stable.",
      high: "You're eating pretty well. Swapping one sugary drink for water daily could push you to the next level.",
      top: "You eat like someone who actually respects their body — and it shows.",
    },
    activity: {
      low: "Start small: a 10-minute walk counts more than zero. Your future self will thank you for just moving a little.",
      mid: "You're moving sometimes — make it more intentional. Even dancing in your room counts.",
      high: "Consistent movement is a vibe. You're building a habit that will carry you for years.",
      top: "Genuinely active every day? That's elite. You're probably the person others are low-key inspired by.",
    },
  };

  const t = tips[category];
  if (score >= 11) return t.top;
  if (score >= 8) return t.high;
  if (score >= 4) return t.mid;
  return t.low;
}
