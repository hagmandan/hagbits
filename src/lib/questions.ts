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
      { label: "Until I'm told to turn it off", score: 1 },
      { label: "11pm–1am", score: 1 },
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
      { label: "I don't use alarms — someone wakes me up", score: 2 },
      { label: "2", score: 2 },
      { label: "1 or none", score: 3 },
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
    type: 'single',
    text: "When you've had a long week, your body's first sign is...",
    options: [
      { label: "I zone out all day", score: 0 },
      { label: "I get mad for no reason", score: 1 },
      { label: "I crash at weird times", score: 2 },
      { label: "I barely notice", score: 3 },
    ],
  },

  // Screen
  {
    id: 'screen_1',
    category: 'screen',
    type: 'single',
    text: "You get dragged to run errands with a parent or guardian. You tend to...",
    blurb: "Classic Sunday afternoon. The store is endless. How do you survive it?",
    options: [
      { label: "Message friends / scroll the whole time", score: 0 },
      { label: "Headphones in, phone out — game or scroll until it's done", score: 0 },
      { label: "Wander off on your own, meet back up — fine by you", score: 2 },
      { label: "Walk around with them, honestly no big deal", score: 3 },
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
      { label: "5–10 min", score: 3 },
      { label: "Under 5 min", score: 3 },
    ],
  },
  {
    id: 'screen_3',
    category: 'screen',
    type: 'ranked',
    rankCount: 5,
    text: "Think about this morning (or a typical one). What are the FIRST 5 things you do after waking up?",
    blurb: "Tap to rank them in order — what actually happens first, second, third...",
    options: [
      { label: "Check Instagram / TikTok", score: 0 },
      { label: "Check Snapchat or texts", score: 0 },
      { label: "Doomscroll whatever's in the feed", score: 0 },
      { label: "Watch YouTube or videos", score: 0.1 },
      { label: "Snooze and lie in bed a bit longer", score: 0.2 },
      { label: "Play a mobile game", score: 0.2 },
      { label: "Get up and use the bathroom", score: 0.5 },
      { label: "Make or grab breakfast", score: 0.8 },
      { label: "Drink a glass of water", score: 1 },
      { label: "Shower or wash up", score: 0.7 },
      { label: "Brush teeth / get ready", score: 0.7 },
      { label: "Stretch or do a quick workout", score: 1 },
      { label: "Journal or write something", score: 1 },
      { label: "Think about the day / plan mentally", score: 0.8 },
      { label: "Listen to music or a podcast", score: 0.5 },
    ],
  },
  {
    id: 'screen_4',
    category: 'screen',
    type: 'single',
    text: "Last thing before you sleep?",
    options: [
      { label: "Scroll until I pass out", score: 0 },
      { label: "Watch something", score: 1 },
      { label: "Scroll a little", score: 1 },
      { label: "Read / journal / nothing", score: 3 },
    ],
  },

  // Diet
  {
    id: 'diet_1',
    category: 'diet',
    type: 'single',
    text: "When you're tired in the afternoon, what do you reach for?",
    options: [
      { label: "Energy drink or soda", score: 0 },
      { label: "A snack", score: 1 },
      { label: "Coffee or tea", score: 1 },
      { label: "Water", score: 3 },
    ],
  },
  {
    id: 'diet_2',
    category: 'diet',
    type: 'single',
    text: "Your usual eating routine could best be described as...",
    options: [
      { label: "Barely eat till dinner", score: 0 },
      { label: "Chaos", score: 1 },
      { label: "Snacking all day", score: 1 },
      { label: "Three meals pretty much", score: 3 },
    ],
  },
  {
    id: 'diet_3',
    category: 'diet',
    type: 'single',
    text: "What's in your hand most of the day, drink-wise?",
    options: [
      { label: "Energy drink", score: 0 },
      { label: "Soda or juice", score: 1 },
      { label: "Coffee or tea", score: 2 },
      { label: "Water bottle", score: 3 },
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
    type: 'single',
    text: "After sitting for a long time, how do you feel?",
    options: [
      { label: "Pretty achy", score: 0 },
      { label: "A little stiff", score: 1 },
      { label: "Fine but ready to move", score: 2 },
      { label: "I avoid sitting that long", score: 3 },
    ],
  },
  {
    id: 'activity_3',
    category: 'activity',
    type: 'ranked',
    rankCount: 5,
    text: "Picture a free afternoon — no homework, no obligations. How do you actually spend it?",
    blurb: "Rank your top 5 — most time to least.",
    options: [
      { label: "Netflix / streaming binge", score: 0 },
      { label: "Brainrot TikTok / reels / shorts", score: 0 },
      { label: "Scrolling social media feeds", score: 0 },
      { label: "Playing video games solo", score: 0.2 },
      { label: "Gaming with friends online", score: 0.4 },
      { label: "Watching a fav YouTuber / creator", score: 0.2 },
      { label: "Watch cool / educational YouTube", score: 0.6 },
      { label: "Reading (books, articles, manga)", score: 0.8 },
      { label: "Napping or just lying around", score: 0.3 },
      { label: "Hanging out with friends IRL", score: 1 },
      { label: "Going for a walk or run", score: 1 },
      { label: "Playing a sport or working out", score: 1 },
      { label: "Doing a hobby (art, music, crafts)", score: 0.9 },
      { label: "Extracurricular / team / club", score: 1 },
      { label: "Hanging out with family", score: 0.7 },
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
