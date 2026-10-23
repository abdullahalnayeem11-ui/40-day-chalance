import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Achievement,
  ChallengeSettings,
  ChallengeState,
  DailySubmission,
  DailyTask,
  DayRecord,
} from '../types/challenge';
import {
  calculateCurrentDay,
  calculateOverallStats,
  calculateStreak,
  calculateTaskPoints,
  createInitialChallengeState,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_TASKS,
  evaluateAchievements,
  getDateForDayNumber,
} from '../utils/challenge';
import { fireConfetti } from '../utils/confetti';

interface ChallengeContextType {
  state: ChallengeState;
  currentDay: number;
  activeDayNumber: number;
  setActiveDayNumber: (day: number) => void;
  stats: ReturnType<typeof calculateOverallStats>;
  toggleTask: (dayNumber: number, taskId: string) => void;
  updateTaskNote: (dayNumber: number, taskId: string, notes: string, outcome?: string) => void;
  updateDailyFocus: (dayNumber: number, focus: string) => void;
  submitDayProgress: (
    dayNumber: number,
    data: {
      accomplishedSummary: string;
      measurableResults: string;
      challengesNotes: string;
      lessonsLearned?: string;
      proofLinks?: string[];
    }
  ) => { isNewUnlock: boolean; unlockedList: Achievement[] };
  addTask: (task: Omit<DailyTask, 'id' | 'order'>) => void;
  editTask: (taskId: string, updates: Partial<DailyTask>) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (tasks: DailyTask[]) => void;
  updateSettings: (newSettings: Partial<ChallengeSettings>) => void;
  resetChallenge: (options: { clearAllData: boolean; newStartDate?: string }) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  unlockedAchievementPopup: Achievement | null;
  dismissAchievementPopup: () => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
}

const STORAGE_KEY = 'FORTY_DAY_CHALLENGE_STATE_V1';

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChallengeState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChallengeState;
        if (parsed.settings && parsed.days && parsed.tasks) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored challenge state, resetting to default', e);
    }
    return createInitialChallengeState();
  });

  const [unlockedAchievementPopup, setUnlockedAchievementPopup] = useState<Achievement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [state]);

  // Determine current day from start date
  const { currentDay } = useMemo(() => {
    return calculateCurrentDay(state.settings.startDate, state.settings.totalDays);
  }, [state.settings.startDate, state.settings.totalDays]);

  const [activeDayNumber, setActiveDayNumber] = useState<number>(currentDay);

  // Keep active day in sync if currentDay changes initially
  useEffect(() => {
    if (activeDayNumber > state.settings.totalDays) {
      setActiveDayNumber(state.settings.totalDays);
    }
  }, [state.settings.totalDays, activeDayNumber]);

  // Calculate overall stats
  const stats = useMemo(() => {
    return calculateOverallStats(state.days, state.tasks, currentDay, state.settings.totalDays);
  }, [state.days, state.tasks, currentDay, state.settings.totalDays]);

  // Recalculate streak whenever days update
  useEffect(() => {
    const { currentStreak, longestStreak } = calculateStreak(state.days, currentDay);
    if (currentStreak !== state.currentStreak || longestStreak !== state.longestStreak) {
      setState((prev) => ({
        ...prev,
        currentStreak,
        longestStreak,
      }));
    }
  }, [state.days, currentDay, state.currentStreak, state.longestStreak]);

  // Toggle completion of a task on a given day
  const toggleTask = (dayNumber: number, taskId: string) => {
    // Prevent modifying days that are locked in the future beyond currentDay
    if (dayNumber > currentDay) {
      return;
    }

    setState((prev) => {
      const dayRecord = prev.days[dayNumber] || {
        dayNumber,
        date: getDateForDayNumber(prev.settings.startDate, dayNumber),
        status: 'not_started',
        taskProgress: {},
        pointsEarned: 0,
      };

      const currentProgress = dayRecord.taskProgress[taskId] || { taskId, completed: false };
      const nextCompleted = !currentProgress.completed;

      const updatedProgress = {
        ...dayRecord.taskProgress,
        [taskId]: {
          ...currentProgress,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        },
      };

      // Determine completed tasks
      const completedIds = Object.keys(updatedProgress).filter((id) => updatedProgress[id]?.completed);
      const { totalPoints, isFullyCompleted } = calculateTaskPoints(
        prev.tasks,
        completedIds,
        prev.settings.dailyBonusPoints
      );

      // Determine day status
      let nextStatus: DayRecord['status'] = 'not_started';
      if (completedIds.length === 0) {
        nextStatus = dayRecord.submission ? 'partial' : 'not_started';
      } else if (isFullyCompleted) {
        nextStatus = 'completed';
      } else {
        nextStatus = 'partial';
      }

      const nextDays = {
        ...prev.days,
        [dayNumber]: {
          ...dayRecord,
          status: nextStatus,
          taskProgress: updatedProgress,
          pointsEarned: totalPoints,
        },
      };

      // Recalculate total points
      const newTotalPoints = Object.values(nextDays).reduce((acc, d) => acc + (d.pointsEarned || 0), 0);
      const { currentStreak, longestStreak } = calculateStreak(nextDays, currentDay);

      // Check achievements
      const { updatedAchievements, newlyUnlocked } = evaluateAchievements(
        nextDays,
        currentStreak,
        newTotalPoints,
        prev.achievements
      );

      if (newlyUnlocked.length > 0) {
        setUnlockedAchievementPopup(newlyUnlocked[0]);
        fireConfetti();
      }

      return {
        ...prev,
        days: nextDays,
        totalPoints: newTotalPoints,
        currentStreak,
        longestStreak,
        achievements: updatedAchievements,
      };
    });
  };

  // Update notes/outcome for a specific task
  const updateTaskNote = (dayNumber: number, taskId: string, notes: string, outcome?: string) => {
    setState((prev) => {
      const day = prev.days[dayNumber];
      if (!day) return prev;
      const current = day.taskProgress[taskId] || { taskId, completed: false };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNumber]: {
            ...day,
            taskProgress: {
              ...day.taskProgress,
              [taskId]: {
                ...current,
                notes,
                actualOutcome: outcome ?? current.actualOutcome,
              },
            },
          },
        },
      };
    });
  };

  // Update today's focus goal
  const updateDailyFocus = (dayNumber: number, focus: string) => {
    setState((prev) => {
      const day = prev.days[dayNumber] || {
        dayNumber,
        date: getDateForDayNumber(prev.settings.startDate, dayNumber),
        status: 'not_started',
        taskProgress: {},
        pointsEarned: 0,
      };

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNumber]: {
            ...day,
            dailyFocus: focus,
          },
        },
      };
    });
  };

  // Submit day progress
  const submitDayProgress = (
    dayNumber: number,
    data: {
      accomplishedSummary: string;
      measurableResults: string;
      challengesNotes: string;
      lessonsLearned?: string;
      proofLinks?: string[];
    }
  ) => {
    let unlockedList: Achievement[] = [];

    setState((prev) => {
      const dayRecord = prev.days[dayNumber] || {
        dayNumber,
        date: getDateForDayNumber(prev.settings.startDate, dayNumber),
        status: 'not_started',
        taskProgress: {},
        pointsEarned: 0,
      };

      const completedIds = Object.keys(dayRecord.taskProgress).filter(
        (id) => dayRecord.taskProgress[id]?.completed
      );

      const { totalPoints, isFullyCompleted, bonusPoints } = calculateTaskPoints(
        prev.tasks,
        completedIds,
        prev.settings.dailyBonusPoints
      );

      const isEdited = !!dayRecord.submission;
      const nowIso = new Date().toISOString();

      const submission: DailySubmission = {
        dayNumber,
        dateString: dayRecord.date,
        submittedAt: isEdited && dayRecord.submission ? dayRecord.submission.submittedAt : nowIso,
        isEdited,
        lastEditedAt: isEdited ? nowIso : undefined,
        completedTaskIds: completedIds,
        totalTasksCount: prev.tasks.length,
        accomplishedSummary: data.accomplishedSummary,
        measurableResults: data.measurableResults,
        challengesNotes: data.challengesNotes,
        lessonsLearned: data.lessonsLearned,
        proofLinks: data.proofLinks,
        pointsEarned: totalPoints,
        dailyBonusAwarded: bonusPoints > 0,
        isFullyCompleted,
        isPartial: !isFullyCompleted,
      };

      const nextStatus = isFullyCompleted ? 'completed' : completedIds.length > 0 ? 'partial' : 'in_progress';

      const nextDays = {
        ...prev.days,
        [dayNumber]: {
          ...dayRecord,
          status: nextStatus,
          submission,
          pointsEarned: totalPoints,
        },
      };

      const newTotalPoints = Object.values(nextDays).reduce((acc, d) => acc + (d.pointsEarned || 0), 0);
      const { currentStreak, longestStreak } = calculateStreak(nextDays, currentDay);

      const { updatedAchievements, newlyUnlocked } = evaluateAchievements(
        nextDays,
        currentStreak,
        newTotalPoints,
        prev.achievements
      );

      unlockedList = newlyUnlocked;
      if (newlyUnlocked.length > 0) {
        setUnlockedAchievementPopup(newlyUnlocked[0]);
      }
      fireConfetti();

      return {
        ...prev,
        days: nextDays,
        totalPoints: newTotalPoints,
        currentStreak,
        longestStreak,
        achievements: updatedAchievements,
      };
    });

    return {
      isNewUnlock: unlockedList.length > 0,
      unlockedList,
    };
  };

  // Add task
  const addTask = (taskData: Omit<DailyTask, 'id' | 'order'>) => {
    setState((prev) => {
      const newId = `task-${Date.now()}`;
      const newTask: DailyTask = {
        ...taskData,
        id: newId,
        order: prev.tasks.length + 1,
      };
      return {
        ...prev,
        tasks: [...prev.tasks, newTask],
      };
    });
  };

  // Edit task
  const editTask = (taskId: string, updates: Partial<DailyTask>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Reorder tasks
  const reorderTasks = (newTasks: DailyTask[]) => {
    setState((prev) => ({
      ...prev,
      tasks: newTasks.map((t, idx) => ({ ...t, order: idx + 1 })),
    }));
  };

  // Update challenge settings
  const updateSettings = (newSettings: Partial<ChallengeSettings>) => {
    setState((prev) => {
      const updated = { ...prev.settings, ...newSettings };
      // If start date changed, update dates on all 40 days
      let updatedDays = prev.days;
      if (newSettings.startDate && newSettings.startDate !== prev.settings.startDate) {
        updatedDays = { ...prev.days };
        for (let i = 1; i <= updated.totalDays; i++) {
          if (updatedDays[i]) {
            updatedDays[i] = {
              ...updatedDays[i],
              date: getDateForDayNumber(updated.startDate, i),
            };
          }
        }
      }
      return {
        ...prev,
        settings: updated,
        days: updatedDays,
      };
    });
  };

  // Reset challenge
  const resetChallenge = (options: { clearAllData: boolean; newStartDate?: string }) => {
    if (options.clearAllData) {
      const fresh = createInitialChallengeState(options.newStartDate);
      setState(fresh);
      setActiveDayNumber(1);
    } else {
      // Keep tasks, reset progress
      setState((prev) => {
        const fresh = createInitialChallengeState(options.newStartDate || prev.settings.startDate);
        return {
          ...fresh,
          tasks: prev.tasks,
          settings: {
            ...fresh.settings,
            challengeNameBn: prev.settings.challengeNameBn,
            challengeNameEn: prev.settings.challengeNameEn,
            language: prev.settings.language,
          },
        };
      });
      setActiveDayNumber(1);
    }
  };

  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr) as ChallengeState;
      if (parsed.settings && parsed.days && parsed.tasks) {
        setState(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON import', e);
      return false;
    }
  };

  const dismissAchievementPopup = () => {
    setUnlockedAchievementPopup(null);
  };

  const language = state.settings.language || 'bn';
  const setLanguage = (lang: 'bn' | 'en') => {
    updateSettings({ language: lang });
  };

  return (
    <ChallengeContext.Provider
      value={{
        state,
        currentDay,
        activeDayNumber,
        setActiveDayNumber,
        stats,
        toggleTask,
        updateTaskNote,
        updateDailyFocus,
        submitDayProgress,
        addTask,
        editTask,
        deleteTask,
        reorderTasks,
        updateSettings,
        resetChallenge,
        exportData,
        importData,
        unlockedAchievementPopup,
        dismissAchievementPopup,
        language,
        setLanguage,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};
