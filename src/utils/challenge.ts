import {
  Achievement,
  ChallengeSettings,
  ChallengeState,
  DailySubmission,
  DailyTask,
  DayRecord,
  DayStatus,
} from '../types/challenge';

export const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'task-sleep',
    title: 'Sleep on time',
    titleEn: 'Sleep on time',
    description: 'রাত ১২:৩০-এর মধ্যে ঘুমানো।',
    descriptionEn: 'Go to sleep by 12:30 AM.',
    category: 'sleep',
    points: 15,
    targetOutcome: 'রাত ১২:৩০ AM',
    isRequired: true,
    order: 1,
  },
  {
    id: 'task-wake',
    title: 'Wake up early',
    titleEn: 'Wake up early',
    description: 'ভোর ৫:০০টায় ঘুম থেকে ওঠা।',
    descriptionEn: 'Wake up early at 5:00 AM.',
    category: 'wake',
    points: 20,
    targetOutcome: 'ভোর ৫:০০ AM',
    isRequired: true,
    order: 2,
  },
  {
    id: 'task-prayer',
    title: 'Fajr prayer',
    titleEn: 'Fajr prayer',
    description: 'ফজরের নামাজ আদায় করা।',
    descriptionEn: 'Perform Fajr prayer with devotion.',
    category: 'prayer',
    points: 20,
    targetOutcome: 'জামাত / সময়মত',
    isRequired: true,
    order: 3,
  },
  {
    id: 'task-deepwork',
    title: 'Deep work',
    titleEn: 'Deep work',
    description: 'ফজরের পর থেকে দুপুর ১২টা পর্যন্ত মনোযোগ দিয়ে কাজ করা।',
    descriptionEn: 'Focused deep work from Fajr until 12:00 PM.',
    category: 'deepwork',
    points: 25,
    targetOutcome: '৫-৬ ঘণ্টা গভীর কাজ',
    isRequired: true,
    order: 4,
  },
  {
    id: 'task-saas',
    title: 'SaaS business',
    titleEn: 'SaaS business development',
    description: 'নিজের SaaS কোম্পানির উন্নতির জন্য নির্দিষ্ট কাজ করা।',
    descriptionEn: 'Build features, fix bugs, or acquire customers for SaaS.',
    category: 'saas',
    points: 25,
    targetOutcome: 'SaaS মাইলস্টোন অগ্রগতি',
    isRequired: true,
    order: 5,
  },
  {
    id: 'task-content',
    title: 'Content creation',
    titleEn: 'Content & Marketing',
    description: 'নির্ধারিত কনটেন্ট বা মার্কেটিংয়ের কাজ সম্পন্ন করা।',
    descriptionEn: 'Publish content, marketing outreach, or audience building.',
    category: 'content',
    points: 20,
    targetOutcome: '১টি কনটেন্ট / পোস্ট',
    isRequired: true,
    order: 6,
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    titleBn: 'প্রথম পদক্ষেপ (First Step)',
    titleEn: 'First Step',
    descriptionBn: 'প্রথম দিনের অগ্রগতি সফলভাবে সাবমিট করা।',
    descriptionEn: 'Successfully submitted your very first day progress.',
    icon: 'footprints',
    pointsReward: 50,
    category: 'days',
    requirementThreshold: 1,
    isUnlocked: false,
  },
  {
    id: 'getting-started',
    titleBn: 'যাত্রা শুরু (Getting Started)',
    titleEn: 'Getting Started',
    descriptionBn: '৩টি দিন সফলভাবে সম্পন্ন করা।',
    descriptionEn: 'Completed 3 full challenge days.',
    icon: 'flame',
    pointsReward: 100,
    category: 'days',
    requirementThreshold: 3,
    isUnlocked: false,
  },
  {
    id: 'discipline-builder',
    titleBn: 'শৃঙ্খলার ভিত্তি (Discipline Builder)',
    titleEn: 'Discipline Builder',
    descriptionBn: '৭টি দিন সফলভাবে সম্পন্ন করা।',
    descriptionEn: 'Completed 7 full challenge days.',
    icon: 'shield-check',
    pointsReward: 200,
    category: 'days',
    requirementThreshold: 7,
    isUnlocked: false,
  },
  {
    id: 'consistency-master',
    titleBn: 'ধারাবাহিকতার মাস্টার (Consistency Master)',
    titleEn: 'Consistency Master',
    descriptionBn: '১৪টি দিন সফলভাবে সম্পন্ন করা।',
    descriptionEn: 'Completed 14 full challenge days.',
    icon: 'award',
    pointsReward: 350,
    category: 'days',
    requirementThreshold: 14,
    isUnlocked: false,
  },
  {
    id: 'halfway-hero',
    titleBn: 'অর্ধেক বিজয়ী (Halfway Hero)',
    titleEn: 'Halfway Hero',
    descriptionBn: '২০টি দিন সফলভাবে জয় করা (৫০% সম্পন্ন)।',
    descriptionEn: 'Conquered 20 days (50% of the challenge).',
    icon: 'medal',
    pointsReward: 500,
    category: 'days',
    requirementThreshold: 20,
    isUnlocked: false,
  },
  {
    id: 'unstoppable',
    titleBn: 'দুর্বার গতি (Unstoppable)',
    titleEn: 'Unstoppable',
    descriptionBn: '৩০টি দিন সফলভাবে সম্পন্ন করা।',
    descriptionEn: 'Completed 30 full challenge days with persistence.',
    icon: 'zap',
    pointsReward: 750,
    category: 'days',
    requirementThreshold: 30,
    isUnlocked: false,
  },
  {
    id: 'challenge-champion',
    titleBn: '৪০ দিনের চ্যাম্পিয়ন (Challenge Champion)',
    titleEn: 'Challenge Champion',
    descriptionBn: 'পুরো ৪০ দিনের চ্যালেঞ্জ বিজয়ের মুকুট অর্জন!',
    descriptionEn: 'Fully conquered all 40 days of the challenge!',
    icon: 'crown',
    pointsReward: 1000,
    category: 'days',
    requirementThreshold: 40,
    isUnlocked: false,
  },
  {
    id: 'streak-7',
    titleBn: '৭ দিনের স্ট্রিক (7-Day Streak)',
    titleEn: '7-Day Streak Master',
    descriptionBn: 'টানা ৭ দিন কোনো বিরতি ছাড়া প্রতিদিন কাজ সম্পন্ন করা।',
    descriptionEn: 'Maintained a flawless 7-day completion streak.',
    icon: 'sparkles',
    pointsReward: 150,
    category: 'streak',
    requirementThreshold: 7,
    isUnlocked: false,
  },
  {
    id: 'points-1000',
    titleBn: '১,০০০ পয়েন্ট ক্লাব (Century Club)',
    titleEn: '1,000 Points Club',
    descriptionBn: 'মোট ১,০০০ এর বেশি পয়েন্ট অর্জন।',
    descriptionEn: 'Amassed over 1,000 total challenge points.',
    icon: 'gem',
    pointsReward: 200,
    category: 'points',
    requirementThreshold: 1000,
    isUnlocked: false,
  },
];

export const MOTIVATIONAL_QUOTES = [
  {
    bn: 'আজ কষ্ট করলে, কাল সফলতা আসবেই।',
    en: 'If you endure the hard work today, success will surely arrive tomorrow.',
    author: 'Daily Discipline',
  },
  {
    bn: 'শৃঙ্খলা মানে তুমি যা চাও তা ত্যাগ করে তুমি যা সবচেয়ে বেশি চাও তা অর্জন করা।',
    en: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
  },
  {
    bn: 'প্রতিদিনের ছোট ছোট প্রচেষ্টাই একদিন বিশাল রূপ নেয়। ধারাবাহিকতাই বিজয়ের মূল চাবিকাঠি।',
    en: 'Small daily efforts compound into extraordinary results. Consistency is key.',
    author: 'James Clear',
  },
  {
    bn: 'ফজরের স্নিগ্ধ ভোরে জাগ্রত হও, তোমার রিজিক ও বুদ্ধিমত্তায় বরকত আসবে।',
    en: 'Rise with the dawn of Fajr, for in early mornings lie barakah and clarity.',
    author: 'Sunnah Wisdom',
  },
  {
    bn: 'অজুহাতকে বিদায় দাও, কর্ম দিয়ে নিজের ভাগ্য গড়ে তোলো।',
    en: 'Say goodbye to excuses; forge your own destiny through intentional action.',
    author: 'Focus Mindset',
  },
];

// Bengali number mapping
const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(value: number | string): string {
  const str = String(value);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
}

export function formatNumberByLang(value: number | string, lang: 'bn' | 'en'): string {
  if (lang === 'bn') {
    return toBengaliNumber(value);
  }
  return String(value);
}

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate the challenge day number (1-based, clamped between 1 and totalDays)
 * based on start date and timezone.
 */
export function calculateCurrentDay(
  startDateStr: string,
  totalDays: number = 40,
  currentDateObj: Date = new Date()
): { currentDay: number; isBeforeStart: boolean; isAfterEnd: boolean; totalElapsed: number } {
  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
  const start = new Date(sYear, sMonth - 1, sDay);
  start.setHours(0, 0, 0, 0);

  const current = new Date(
    currentDateObj.getFullYear(),
    currentDateObj.getMonth(),
    currentDateObj.getDate()
  );
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const totalElapsed = diffDays + 1; // day 1 is start day
  const isBeforeStart = totalElapsed < 1;
  const isAfterEnd = totalElapsed > totalDays;

  let currentDay = totalElapsed;
  if (currentDay < 1) currentDay = 1;
  if (currentDay > totalDays) currentDay = totalDays;

  return {
    currentDay,
    isBeforeStart,
    isAfterEnd,
    totalElapsed,
  };
}

/**
 * Get date string for a specific day number given the start date
 */
export function getDateForDayNumber(startDateStr: string, dayNumber: number): string {
  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
  const date = new Date(sYear, sMonth - 1, sDay);
  date.setDate(date.getDate() + (dayNumber - 1));
  return formatDateKey(date);
}

/**
 * Format date nicely for display
 */
export function formatDisplayDate(dateStr: string, lang: 'bn' | 'en' = 'bn'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const dayNamesBn = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
  ];

  if (lang === 'bn') {
    const dayBn = toBengaliNumber(day);
    const monthBn = monthNamesBn[date.getMonth()];
    const yearBn = toBengaliNumber(year);
    const dayOfWeekBn = dayNamesBn[date.getDay()];
    return `${dayBn} ${monthBn}, ${yearBn} (${dayOfWeekBn})`;
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

/**
 * Calculate streak based on daily records.
 * A day counts towards streak if its status is 'completed'.
 * If the current day is not finished yet, streak can continue from yesterday if yesterday was completed.
 */
export function calculateStreak(
  days: Record<number, DayRecord>,
  currentDay: number
): { currentStreak: number; longestStreak: number } {
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate longest streak across all days up to currentDay
  for (let i = 1; i <= currentDay; i++) {
    const day = days[i];
    if (day && day.status === 'completed') {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak backwards from today or yesterday
  let currentStreak = 0;
  const todayRecord = days[currentDay];
  let checkStart = currentDay;

  // If today is completed, count starting from today
  if (todayRecord && todayRecord.status === 'completed') {
    checkStart = currentDay;
  } else {
    // If today is in_progress/not_started, check if streak from yesterday is active
    checkStart = currentDay - 1;
  }

  for (let i = checkStart; i >= 1; i--) {
    const day = days[i];
    if (day && day.status === 'completed') {
      currentStreak++;
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

/**
 * Calculate points for completing specific tasks
 */
export function calculateTaskPoints(
  tasks: DailyTask[],
  completedTaskIds: string[],
  dailyBonusPoints: number
): {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  isFullyCompleted: boolean;
  completionRate: number;
} {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  let basePoints = 0;

  completedTaskIds.forEach((id) => {
    const t = taskMap.get(id);
    if (t) {
      basePoints += t.points;
    }
  });

  const totalTasks = tasks.length;
  const completedCount = completedTaskIds.length;
  const isFullyCompleted = totalTasks > 0 && completedCount === totalTasks;
  const bonusPoints = isFullyCompleted ? dailyBonusPoints : 0;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return {
    basePoints,
    bonusPoints,
    totalPoints: basePoints + bonusPoints,
    isFullyCompleted,
    completionRate,
  };
}

/**
 * Evaluate all achievements and return updated list + newly unlocked list
 */
export function evaluateAchievements(
  days: Record<number, DayRecord>,
  currentStreak: number,
  totalPoints: number,
  existingAchievements: Achievement[]
): { updatedAchievements: Achievement[]; newlyUnlocked: Achievement[] } {
  let completedDaysCount = 0;
  let totalSubmissionsCount = 0;

  Object.values(days).forEach((d) => {
    if (d.status === 'completed') completedDaysCount++;
    if (d.submission) totalSubmissionsCount++;
  });

  const newlyUnlocked: Achievement[] = [];
  const updatedAchievements = existingAchievements.map((ach) => {
    if (ach.isUnlocked) return ach;

    let qualifies = false;
    if (ach.id === 'first-step' && totalSubmissionsCount >= 1) {
      qualifies = true;
    } else if (ach.category === 'days' && completedDaysCount >= ach.requirementThreshold) {
      qualifies = true;
    } else if (ach.category === 'streak' && currentStreak >= ach.requirementThreshold) {
      qualifies = true;
    } else if (ach.category === 'points' && totalPoints >= ach.requirementThreshold) {
      qualifies = true;
    }

    if (qualifies) {
      const unlockedAch: Achievement = {
        ...ach,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedAch);
      return unlockedAch;
    }
    return ach;
  });

  return { updatedAchievements, newlyUnlocked };
}

/**
 * Calculate overall stats across 40 days
 */
export function calculateOverallStats(
  days: Record<number, DayRecord>,
  tasks: DailyTask[],
  currentDay: number,
  totalDays: number = 40
) {
  let completedDays = 0;
  let partialDays = 0;
  let missedDays = 0;
  let notStartedDays = 0;
  let totalTasksCompleted = 0;
  const totalTasksTarget = totalDays * tasks.length;

  for (let i = 1; i <= totalDays; i++) {
    const day = days[i];
    if (!day || day.status === 'not_started') {
      if (i < currentDay) {
        missedDays++;
      } else {
        notStartedDays++;
      }
    } else if (day.status === 'completed') {
      completedDays++;
      const doneCount = Object.values(day.taskProgress || {}).filter((p) => p.completed).length;
      totalTasksCompleted += doneCount || tasks.length;
    } else if (day.status === 'partial') {
      partialDays++;
      const doneCount = Object.values(day.taskProgress || {}).filter((p) => p.completed).length;
      totalTasksCompleted += doneCount;
    } else if (day.status === 'missed') {
      missedDays++;
    }
  }

  const remainingDays = Math.max(0, totalDays - completedDays);
  const challengeProgressPercent = Math.min(
    100,
    Math.round((completedDays / totalDays) * 100)
  );

  return {
    completedDays,
    partialDays,
    missedDays,
    notStartedDays,
    remainingDays,
    totalTasksCompleted,
    totalTasksTarget,
    totalTasksRemaining: Math.max(0, totalTasksTarget - totalTasksCompleted),
    challengeProgressPercent,
  };
}

/**
 * Initialize default state for 40 days
 */
export function createInitialChallengeState(
  customStartDate?: string
): ChallengeState {
  const today = new Date();
  const startDateStr = customStartDate || formatDateKey(today);

  const settings: ChallengeSettings = {
    challengeNameBn: '৪০ দিনের চ্যালেঞ্জ',
    challengeNameEn: '40-Day Challenge',
    startDate: startDateStr,
    totalDays: 40,
    timezone: 'Asia/Dhaka',
    dailyBonusPoints: 50,
    allowEditSubmissions: true,
    allowMissedDays: true,
    language: 'bn',
  };

  const days: Record<number, DayRecord> = {};
  for (let i = 1; i <= 40; i++) {
    const date = getDateForDayNumber(startDateStr, i);
    days[i] = {
      dayNumber: i,
      date,
      status: 'not_started',
      taskProgress: {},
      pointsEarned: 0,
    };
  }

  // Pre-seed day 1 with initial task progress structures
  DEFAULT_TASKS.forEach((t) => {
    days[1].taskProgress[t.id] = {
      taskId: t.id,
      completed: false,
    };
  });

  return {
    settings,
    tasks: [...DEFAULT_TASKS],
    days,
    achievements: [...DEFAULT_ACHIEVEMENTS],
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
}
