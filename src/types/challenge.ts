export type TaskCategory = 
  | 'sleep' 
  | 'wake' 
  | 'prayer' 
  | 'deepwork' 
  | 'saas' 
  | 'content' 
  | 'fitness' 
  | 'learning' 
  | 'custom';

export interface DailyTask {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: TaskCategory;
  points: number;
  targetOutcome?: string;
  isRequired: boolean;
  order: number;
}

export interface DayTaskProgress {
  taskId: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  actualOutcome?: string;
}

export interface DailySubmission {
  dayNumber: number;
  dateString: string;
  submittedAt: string;
  isEdited: boolean;
  lastEditedAt?: string;
  completedTaskIds: string[];
  totalTasksCount: number;
  accomplishedSummary: string;
  measurableResults: string;
  challengesNotes: string;
  lessonsLearned?: string;
  pointsEarned: number;
  dailyBonusAwarded: boolean;
  isFullyCompleted: boolean;
  isPartial: boolean;
  proofLinks?: string[];
}

export type DayStatus = 'not_started' | 'in_progress' | 'completed' | 'partial' | 'missed';

export interface DayRecord {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  status: DayStatus;
  taskProgress: Record<string, DayTaskProgress>;
  submission?: DailySubmission;
  dailyFocus?: string;
  pointsEarned: number;
}

export interface Achievement {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  icon: string;
  pointsReward: number;
  category: 'days' | 'streak' | 'points' | 'special';
  requirementThreshold: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface ChallengeSettings {
  challengeNameBn: string;
  challengeNameEn: string;
  startDate: string; // YYYY-MM-DD
  totalDays: number; // default 40
  timezone: string; // default Asia/Dhaka
  dailyBonusPoints: number; // default 50
  allowEditSubmissions: boolean; // default true
  allowMissedDays: boolean; // default true
  language: 'bn' | 'en';
}

export interface ChallengeState {
  settings: ChallengeSettings;
  tasks: DailyTask[];
  days: Record<number, DayRecord>;
  achievements: Achievement[];
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
}
