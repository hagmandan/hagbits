export type Category = 'sleep' | 'screen' | 'diet' | 'activity';

export type AnswerValue = number | number[];
export type Answers = Record<string, AnswerValue>;

export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: string;
  category: Category;
  type: 'single' | 'ranked';
  text: string;
  blurb?: string;
  rankCount?: number;
  options: Option[];
}

export const questions: Question[] = [
  // Sleep
  {
    id: 'sleep_1',
    category: 'sleep',
    type: 'single',
    text: "What time does your phone screen usually go dark for the night?",
    options: [
      { label: "After 1am", score: 0 },
      { label: "Midnight–1am", score: 1 },
      { label: "11pm–midnight", score: 2 },
      { label: "10–11pm", score: 2 },
      { label: "Before 10pm", score: 3 },
    ],
  },
  {
    id: 'sleep_2',
    category: 'sleep',
    type: 'single',
    text: "How many alarms do you set to actually get up?",
    options: [
      { label: "4 or more", score: 0 },
      { label: "2–3", score: 1 },
      { label: "1", score: 2 },
      { label: "None — I just wake up", score: 3 },
    ],
  },
  {
    id: 'sleep_3',
    category: 'sleep',
    type: 'single',
    text: "Be real — how often do you wake up actually feeling refreshed?",
    options: [
      { label: "Almost never", score: 0 },
      { label: "Rarely", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Most days", score: 3 },
    ],
  },
  {
    id: 'sleep_4',
    category: 'sleep',
    type: 'ranked',
    rankCount: 3,
    text: "How do you actually wind down before sleep? Rank most to least like you:",
    options: [
      { label: "Scroll until I pass out", score: 0 },
      { label: "Watch something until I sleep", score: 0.2 },
      { label: "Scroll a bit, then stop", score: 0.5 },
      { label: "Read or listen to something", score: 0.8 },
      { label: "Nothing — just lie there", score: 1 },
    ],
  },

  // Screen
  {
    id: 'screen_1',
    category: 'screen',
    type: 'ranked',
    rankCount: 3,
    text: "You're stuck waiting — store, appointment, car ride. Rank what you actually do:",
    options: [
      { label: "Scroll social feeds", score: 0 },
      { label: "Message friends / group chats", score: 0.2 },
      { label: "Play a mobile game", score: 0.4 },
      { label: "Listen to music or a podcast", score: 0.7 },
      { label: "Just... exist and look around", score: 1 },
    ],
  },
  {
    id: 'screen_2',
    category: 'screen',
    type: 'single',
    text: "You open an app 'real quick' — next time you look up, how long has it been?",
    options: [
      { label: "2+ hours, easily", score: 0 },
      { label: "1–2 hours", score: 0 },
      { label: "30–60 min", score: 1 },
      { label: "10–30 min", score: 2 },
      { label: "Under 10 min", score: 3 },
    ],
  },
  {
    id: 'screen_3',
    category: 'screen',
    type: 'ranked',
    rankCount: 3,
    text: "Think about a typical morning. Rank these in the order they actually happen:",
    options: [
      { label: "Check socials or scroll", score: 0 },
      { label: "Lie in bed a bit longer", score: 0.2 },
      { label: "Shower or brush teeth / get ready", score: 0.6 },
      { label: "Eat breakfast", score: 0.8 },
      { label: "Drink water", score: 0.9 },
      { label: "Stretch or move", score: 1 },
    ],
  },
  {
    id: 'screen_4',
    category: 'screen',
    type: 'ranked',
    rankCount: 3,
    text: "Last thing before you actually fall asleep — rank most to least likely:",
    options: [
      { label: "Scroll until I pass out", score: 0 },
      { label: "Watch something", score: 0.3 },
      { label: "Scroll a little then stop", score: 0.5 },
      { label: "Read or journal", score: 0.9 },
      { label: "Just lie there, nothing", score: 1 },
    ],
  },

  // Diet
  {
    id: 'diet_1',
    category: 'diet',
    type: 'ranked',
    rankCount: 3,
    text: "Afternoon slump hits. Rank what you actually reach for, most to least:",
    options: [
      { label: "Energy drink", score: 0 },
      { label: "Soda", score: 0.2 },
      { label: "A snack (chips, something sweet)", score: 0.4 },
      { label: "Coffee or tea", score: 0.7 },
      { label: "Water", score: 1 },
    ],
  },
  {
    id: 'diet_2',
    category: 'diet',
    type: 'single',
    text: "Your usual eating routine could best be described as...",
    options: [
      { label: "Barely eat till dinner", score: 0 },
      { label: "Chaos — whenever, whatever", score: 1 },
      { label: "Snacking all day", score: 1 },
      { label: "Three meals pretty much", score: 3 },
    ],
  },
  {
    id: 'diet_3',
    category: 'diet',
    type: 'ranked',
    rankCount: 3,
    text: "Rank your go-to drinks throughout the day — most to least:",
    options: [
      { label: "Energy drink", score: 0 },
      { label: "Soda or juice", score: 0.2 },
      { label: "Coffee or tea", score: 0.6 },
      { label: "Milk / nothing much", score: 0.8 },
      { label: "Water", score: 1 },
    ],
  },
  {
    id: 'diet_4',
    category: 'diet',
    type: 'single',
    text: "Quick: how many actual meals did you eat yesterday?",
    options: [
      { label: "0–1", score: 0 },
      { label: "2", score: 1 },
      { label: "4+", score: 2 },
      { label: "3", score: 3 },
    ],
  },

  // Activity
  {
    id: 'activity_1',
    category: 'activity',
    type: 'single',
    text: "On a typical day, how much are you actually moving?",
    options: [
      { label: "Barely at all", score: 0 },
      { label: "30 mins maybe", score: 1 },
      { label: "An hour or more", score: 2 },
      { label: "Active most of the day", score: 3 },
    ],
  },
  {
    id: 'activity_2',
    category: 'activity',
    type: 'ranked',
    rankCount: 3,
    text: "You've been sitting for a while. Rank what actually happens next:",
    options: [
      { label: "Keep sitting, grab my phone", score: 0 },
      { label: "Stay put but shift around", score: 0.2 },
      { label: "Get up, grab something, sit back", score: 0.5 },
      { label: "Walk around for a bit", score: 0.8 },
      { label: "Stretch or do something active", score: 1 },
    ],
  },
  {
    id: 'activity_3',
    category: 'activity',
    type: 'ranked',
    rankCount: 3,
    text: "Free afternoon — no homework, no obligations. Rank how you spend it:",
    options: [
      { label: "Stream / binge content", score: 0 },
      { label: "Scroll social media / short vids", score: 0 },
      { label: "Game online", score: 0.4 },
      { label: "Hang out with friends IRL", score: 0.9 },
      { label: "Do a hobby (art, music, etc.)", score: 0.9 },
      { label: "Go for a walk, run, or sport", score: 1 },
    ],
  },
  {
    id: 'activity_4',
    category: 'activity',
    type: 'single',
    text: "How often are you doing something physical on purpose?",
    options: [
      { label: "Never", score: 0 },
      { label: "Once in a while", score: 1 },
      { label: "A few times a week", score: 2 },
      { label: "Almost daily", score: 3 },
    ],
  },
];

export const categoryLabels: Record<Category, string> = {
  sleep: 'Sleep',
  screen: 'Screen Time',
  diet: 'Diet & Hydration',
  activity: 'Physical Activity',
};
