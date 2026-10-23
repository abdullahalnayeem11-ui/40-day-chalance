import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCurrentDay,
  calculateStreak,
  calculateTaskPoints,
  evaluateAchievements,
  toBengaliNumber,
  DEFAULT_TASKS,
  DEFAULT_ACHIEVEMENTS,
  createInitialChallengeState,
} from './challenge.js';
import { DayRecord } from '../types/challenge.js';

test('toBengaliNumber converts English digits to Bengali correctly', () => {
  assert.equal(toBengaliNumber(40), '৪০');
  assert.equal(toBengaliNumber(12), '১২');
  assert.equal(toBengaliNumber(0), '০');
  assert.equal(toBengaliNumber(1234567890), '১২৩৪৫৬৭৮৯০');
});

test('calculateCurrentDay handles start date and clamps correctly', () => {
  const resultToday = calculateCurrentDay('2026-10-23', 40, new Date(2026, 9, 23));
  assert.equal(resultToday.currentDay, 1);
  assert.equal(resultToday.isBeforeStart, false);

  const resultDay5 = calculateCurrentDay('2026-10-20', 40, new Date(2026, 9, 24));
  assert.equal(resultDay5.currentDay, 5);

  const resultPast = calculateCurrentDay('2026-08-01', 40, new Date(2026, 9, 23));
  assert.equal(resultPast.currentDay, 40);
  assert.equal(resultPast.isAfterEnd, true);
});

test('calculateTaskPoints calculates base points and full completion bonus', () => {
  const allTaskIds = DEFAULT_TASKS.map((t) => t.id);
  const fullResult = calculateTaskPoints(DEFAULT_TASKS, allTaskIds, 50);
  // Total base: 15+20+20+25+25+20 = 125. Bonus: 50. Total: 175.
  assert.equal(fullResult.basePoints, 125);
  assert.equal(fullResult.bonusPoints, 50);
  assert.equal(fullResult.totalPoints, 175);
  assert.equal(fullResult.isFullyCompleted, true);
  assert.equal(fullResult.completionRate, 100);

  // Partial completion (only 2 tasks)
  const partialIds = ['task-sleep', 'task-wake'];
  const partialResult = calculateTaskPoints(DEFAULT_TASKS, partialIds, 50);
  assert.equal(partialResult.basePoints, 35);
  assert.equal(partialResult.bonusPoints, 0); // No bonus for partial
  assert.equal(partialResult.totalPoints, 35);
  assert.equal(partialResult.isFullyCompleted, false);
  assert.equal(partialResult.completionRate, 33);
});

test('calculateStreak counts consecutive completed days correctly', () => {
  const days: Record<number, DayRecord> = {};
  for (let i = 1; i <= 10; i++) {
    days[i] = {
      dayNumber: i,
      date: `2026-10-${String(i).padStart(2, '0')}`,
      status: 'not_started',
      taskProgress: {},
      pointsEarned: 0,
    };
  }

  // Days 1, 2, 3 completed
  days[1].status = 'completed';
  days[2].status = 'completed';
  days[3].status = 'completed';

  const streakAtDay3 = calculateStreak(days, 3);
  assert.equal(streakAtDay3.currentStreak, 3);
  assert.equal(streakAtDay3.longestStreak, 3);

  // Day 4 missed, Day 5 completed
  days[4].status = 'missed';
  days[5].status = 'completed';

  const streakAtDay5 = calculateStreak(days, 5);
  assert.equal(streakAtDay5.currentStreak, 1);
  assert.equal(streakAtDay5.longestStreak, 3);

  // Today is Day 6 and in_progress, yesterday (Day 5) was completed -> current streak should be 1
  days[6].status = 'in_progress';
  const streakAtDay6 = calculateStreak(days, 6);
  assert.equal(streakAtDay6.currentStreak, 1);
});

test('evaluateAchievements unlocks First Step and streak achievements', () => {
  const state = createInitialChallengeState('2026-10-23');
  
  // Submit Day 1
  state.days[1].status = 'completed';
  state.days[1].submission = {
    dayNumber: 1,
    dateString: '2026-10-23',
    submittedAt: new Date().toISOString(),
    isEdited: false,
    completedTaskIds: DEFAULT_TASKS.map((t) => t.id),
    totalTasksCount: DEFAULT_TASKS.length,
    accomplishedSummary: 'All morning and evening routines accomplished',
    measurableResults: 'Completed 6 hours of work',
    challengesNotes: 'None',
    pointsEarned: 175,
    dailyBonusAwarded: true,
    isFullyCompleted: true,
    isPartial: false,
  };

  const { updatedAchievements, newlyUnlocked } = evaluateAchievements(
    state.days,
    1,
    175,
    DEFAULT_ACHIEVEMENTS
  );

  assert.equal(newlyUnlocked.length, 1);
  assert.equal(newlyUnlocked[0].id, 'first-step');
  assert.equal(newlyUnlocked[0].isUnlocked, true);

  const firstStepAch = updatedAchievements.find((a) => a.id === 'first-step');
  assert.equal(firstStepAch?.isUnlocked, true);
});
