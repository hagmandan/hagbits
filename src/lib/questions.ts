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
  emoji?: string;
  rankCount?: number;
  options: Option[];
}

export const questions: Question[] = [
  // Sleep
  {
    id: 'sleep_1',
    category: 'sleep',
    type: 'single',
    emoji: '🌙',
    text: "Do you have anything you actually do to wind down before bed — or do you just pass out?",
    options: [
      { label: "I just pass out whenever", score: 0 },
      { label: "I lie down and hope for the best", score: 0 },
      { label: "I put my phone down at some point, at least", score: 1 },
      { label: "I have a loose routine (dim lights, relax, etc.)", score: 2 },
      { label: "I'm deliberate about it — same time, same routine", score: 3 },
    ],
  },
  {
    id: 'sleep_2',
    category: 'sleep',
    type: 'single',
    emoji: '⏰',
    text: "How many alarms do you set to actually get up?",
    options: [
      { label: "I don't even bother anymore", score: 0 },
      { label: "5 or more (it's a whole system)", score: 0 },
      { label: "3–4", score: 1 },
      { label: "2", score: 2 },
      { label: "1", score: 2 },
      { label: "None — I just wake up naturally", score: 3 },
    ],
  },
  {
    id: 'sleep_3',
    category: 'sleep',
    type: 'single',
    emoji: '😴',
    text: "Be real — how often do you wake up actually feeling refreshed?",
    blurb: "Not 'functional.' Actually rested.",
    options: [
      { label: "Refreshed? That's not a thing for me", score: 0 },
      { label: "Almost never", score: 0 },
      { label: "Once or twice a week maybe", score: 1 },
      { label: "A few times a week", score: 2 },
      { label: "Most mornings", score: 3 },
      { label: "Every morning — I'm a morning person", score: 3 },
    ],
  },
  {
    id: 'sleep_4',
    category: 'sleep',
    type: 'ranked',
    emoji: '💤',
    rankCount: 3,
    text: "When you can't fall asleep, what do you actually do? Rank most to least likely:",
    blurb: "Be honest — what really happens when your brain won't quit.",
    options: [
      { label: "Pick up my phone and start scrolling", score: 0 },
      { label: "Put on a show or video to watch", score: 0.2 },
      { label: "Listen to music or have something on", score: 0.5 },
      { label: "Get up, do something low-key, try again", score: 0.7 },
      { label: "Try breathing or just lying still", score: 0.8 },
      { label: "I usually fall asleep pretty easily", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },

  // Screen
  {
    id: 'screen_1',
    category: 'screen',
    type: 'ranked',
    emoji: '📱',
    rankCount: 3,
    text: "Your phone's right there and you're bored for 5 minutes. What actually happens?",
    blurb: "Rank most to least like you.",
    options: [
      { label: "I'm on it before I even decide to", score: 0 },
      { label: "Open something, doesn't matter what", score: 0.2 },
      { label: "Check notifications, then maybe scroll", score: 0.4 },
      { label: "Put on music or something in the background", score: 0.7 },
      { label: "Leave it alone — it's not that serious", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'screen_2',
    category: 'screen',
    type: 'single',
    emoji: '⏳',
    text: "You open an app 'real quick.' Next time you look up, how long has it been?",
    options: [
      { label: "I genuinely don't know — time stops", score: 0 },
      { label: "2+ hours, easily", score: 0 },
      { label: "1–2 hours", score: 1 },
      { label: "30–60 min", score: 1 },
      { label: "10–30 min", score: 2 },
      { label: "Under 10 min — I have self control", score: 3 },
    ],
  },
  {
    id: 'screen_3',
    category: 'screen',
    type: 'ranked',
    emoji: '🌅',
    rankCount: 3,
    text: "Think about a typical morning. Rank these in the order they actually happen:",
    options: [
      { label: "Check socials / notifications first thing", score: 0 },
      { label: "Lie in bed a bit longer (doom scroll optional)", score: 0.2 },
      { label: "Shower or get ready", score: 0.6 },
      { label: "Eat something", score: 0.8 },
      { label: "Drink water", score: 0.9 },
      { label: "Stretch or move", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'screen_4',
    category: 'screen',
    type: 'ranked',
    emoji: '🛏️',
    rankCount: 3,
    text: "Last thing before you actually fall asleep — rank what's most like you:",
    options: [
      { label: "Scroll until I pass out mid-video", score: 0 },
      { label: "Put on something to fall asleep to", score: 0.2 },
      { label: "Scroll a little, then make myself stop", score: 0.5 },
      { label: "Read, journal, pray, or wind down intentionally", score: 0.8 },
      { label: "Phone's already put away before bed", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },

  // Diet
  {
    id: 'diet_1',
    category: 'diet',
    type: 'ranked',
    emoji: '🍽️',
    rankCount: 3,
    text: "Picture what you actually ate yesterday. Rank which best describes your meals:",
    blurb: "Pick the 3 that most match your day, best to worst fit.",
    options: [
      { label: "Ultra-processed — fast food, packaged snacks", score: 0 },
      { label: "Ate what was available — didn't have a ton of options", score: 0.4 },
      { label: "Mix of okay and not-so-okay", score: 0.5 },
      { label: "Home-cooked or reasonably balanced", score: 0.8 },
      { label: "Fruits, veg, whole foods made an appearance", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'diet_2',
    category: 'diet',
    type: 'single',
    emoji: '🍴',
    text: "Your usual eating pattern could best be described as...",
    options: [
      { label: "I forget to eat for most of the day", score: 0 },
      { label: "I barely eat until dinner, then a lot", score: 0 },
      { label: "Chaos — whenever, whatever, if I remember", score: 1 },
      { label: "Snacking all day, not really sitting down", score: 1 },
      { label: "Two solid meals and some snacks", score: 2 },
      { label: "Three meals, pretty consistent timing", score: 3 },
    ],
  },
  {
    id: 'diet_3',
    category: 'diet',
    type: 'ranked',
    emoji: '💧',
    rankCount: 3,
    text: "What are you actually drinking throughout the day? Rank most to least:",
    options: [
      { label: "Energy drinks (Monster, Celsius, Reign…)", score: 0 },
      { label: "Soda or sugary juice", score: 0.2 },
      { label: "Flavored drinks — lemonade, fruit punch, Gatorade, etc.", score: 0.4 },
      { label: "Coffee or tea", score: 0.5 },
      { label: "Milk, sparkling water, or something else", score: 0.8 },
      { label: "Water — just water", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'diet_4',
    category: 'diet',
    type: 'single',
    emoji: '🥗',
    text: "Quick: how many actual meals did you eat yesterday?",
    blurb: "Snacks don't count. A handful of chips is not a meal.",
    options: [
      { label: "0 — I don't think I ate anything real", score: 0 },
      { label: "1 — barely qualifies", score: 0 },
      { label: "2", score: 1 },
      { label: "3", score: 3 },
      { label: "4 — I eat a lot", score: 2 },
      { label: "5+ — I'm basically always eating", score: 1 },
    ],
  },

  // Activity
  {
    id: 'activity_1',
    category: 'activity',
    type: 'ranked',
    emoji: '🏃',
    rankCount: 3,
    text: "When you do move around, what does that usually look like? Rank most to least like you:",
    options: [
      { label: "I don't really move unless I have to", score: 0 },
      { label: "Walking to get somewhere (school, store, etc.)", score: 0.3 },
      { label: "Helping out at home — chores, cooking, yard work", score: 0.6 },
      { label: "Casual stuff — bike ride, shooting hoops, etc.", score: 0.7 },
      { label: "Walking or biking around the neighborhood", score: 0.7 },
      { label: "Yoga, dance, or a mind-body thing", score: 0.9 },
      { label: "Solo sport (running, skating, swimming, etc.)", score: 0.9 },
      { label: "Team sport or group fitness", score: 1 },
      { label: "Gym, weights, or working out", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'activity_2',
    category: 'activity',
    type: 'ranked',
    emoji: '🪑',
    rankCount: 3,
    text: "You've been sitting for a while. What actually happens next?",
    blurb: "Rank most to least like you.",
    options: [
      { label: "Keep sitting — just grab my phone", score: 0 },
      { label: "Shift around or slouch differently", score: 0.2 },
      { label: "Get up, get something, sit straight back down", score: 0.5 },
      { label: "Walk around for a few minutes", score: 0.8 },
      { label: "Stretch out or do something active", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'activity_3',
    category: 'activity',
    type: 'ranked',
    emoji: '☀️',
    rankCount: 3,
    text: "Free afternoon — no school, no obligations, no one bugging you. How do you actually spend it?",
    options: [
      { label: "Binge something — YouTube, Netflix, whatever's on", score: 0.1 },
      { label: "Game online", score: 0.3 },
      { label: "Take a nap / actually rest", score: 0.3 },
      { label: "Read, cook, or something offline and low-key", score: 0.6 },
      { label: "Hang with friends IRL", score: 0.8 },
      { label: "Creative hobby (art, music, writing, etc.)", score: 0.9 },
      { label: "Go outside — walk, run, sport, whatever", score: 1 },
      { label: "Mine's different — not really on this list", score: 0.5 },
    ],
  },
  {
    id: 'activity_4',
    category: 'activity',
    type: 'single',
    emoji: '⚡',
    text: "How often do you actually feel physically energized — like your body has juice?",
    blurb: "Not caffeinated. Naturally have energy.",
    options: [
      { label: "Basically never — I'm always drained", score: 0 },
      { label: "Rarely — mostly I feel sluggish", score: 1 },
      { label: "Sometimes, on good days", score: 2 },
      { label: "More often than not", score: 2 },
      { label: "Most of the time — I've got energy to spare", score: 3 },
      { label: "I don't sit still, I have too much energy", score: 3 },
    ],
  },
];

export const categoryLabels: Record<Category, string> = {
  sleep: 'Sleep',
  screen: 'Screen Time',
  diet: 'Diet & Hydration',
  activity: 'Physical Activity',
};
