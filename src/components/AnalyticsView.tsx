import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { formatNumberByLang, toBengaliNumber } from '../utils/challenge';

export const AnalyticsView: React.FC = () => {
  const { state, currentDay, language, stats } = useChallenge();
  const isBn = language === 'bn';

  // Calculate points by day for the chart (days 1 to 40)
  const pointsData = Array.from({ length: 40 }, (_, i) => {
    const dayNum = i + 1;
    const day = state.days[dayNum];
    return {
      dayNum,
      points: day?.pointsEarned || 0,
      status: day?.status || 'not_started',
      isPastOrToday: dayNum <= currentDay,
    };
  });

  const maxPoints = Math.max(175, ...pointsData.map((d) => d.points));

  // Weekly breakdown (Weeks 1 to 6)
  // Week 1: Days 1-7, Week 2: Days 8-14, Week 3: Days 15-21, Week 4: Days 22-28, Week 5: Days 29-35, Week 6: Days 36-40
  const weeks = [
    { num: 1, start: 1, end: 7, label: isBn ? 'সপ্তাহ ১ (দিন ১-৭)' : 'Week 1 (Days 1-7)' },
    { num: 2, start: 8, end: 14, label: isBn ? 'সপ্তাহ ২ (দিন ৮-১৪)' : 'Week 2 (Days 8-14)' },
    { num: 3, start: 15, end: 21, label: isBn ? 'সপ্তাহ ৩ (দিন ১৫-২১)' : 'Week 3 (Days 15-21)' },
    { num: 4, start: 22, end: 28, label: isBn ? 'সপ্তাহ ৪ (দিন ২২-২৮)' : 'Week 4 (Days 22-28)' },
    { num: 5, start: 29, end: 35, label: isBn ? 'সপ্তাহ ৫ (দিন ২৯-৩৫)' : 'Week 5 (Days 29-35)' },
    { num: 6, start: 36, end: 40, label: isBn ? 'সপ্তাহ ৬ (দিন ৩৬-৪০)' : 'Week 6 (Days 36-40)' },
  ].map((w) => {
    let completed = 0;
    let totalInWeek = w.end - w.start + 1;
    let points = 0;

    for (let d = w.start; d <= w.end; d++) {
      const dayRecord = state.days[d];
      if (dayRecord?.status === 'completed') completed++;
      points += dayRecord?.pointsEarned || 0;
    }

    const rate = Math.round((completed / totalInWeek) * 100);
    return { ...w, completed, totalInWeek, points, rate };
  });

  // Category breakdown
  const categoryStats = state.tasks.map((task) => {
    let completedCount = 0;
    let eligibleDays = currentDay;

    for (let d = 1; d <= currentDay; d++) {
      if (state.days[d]?.taskProgress[task.id]?.completed) {
        completedCount++;
      }
    }

    const rate = eligibleDays > 0 ? Math.round((completedCount / eligibleDays) * 100) : 0;
    return {
      task,
      completedCount,
      eligibleDays,
      rate,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c162e] border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {isBn ? 'বিশ্লেষণ ও পারফরম্যান্স' : 'Analytics & Performance'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isBn ? 'অগ্রগতি ও পারফরম্যান্স বিশ্লেষণ' : 'Challenge Progress & Insights'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isBn
              ? 'আপনার বাস্তব সাবমিশন ও রেকর্ড থেকে স্বয়ংক্রিয়ভাবে পরিমাপকৃত পরিসংখ্যান।'
              : 'Real-time metrics computed directly from your saved submissions and task entries.'}
          </p>
        </div>

        {/* Challenge Percentage Pill */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 text-center min-w-[140px]">
          <span className="text-xs font-bold text-amber-300 block mb-0.5">
            {isBn ? 'সামগ্রিক পূর্ণতা' : 'Completion'}
          </span>
          <span className="text-3xl font-black gold-gradient-text">
            {stats.challengeProgressPercent}%
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'সম্পন্ন দিন' : 'Days Conquered'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatNumberByLang(stats.completedDays, language)}
            <span className="text-xs font-normal text-slate-500"> / {formatNumberByLang(state.settings.totalDays, language)}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isBn ? `বাকি রয়েছে ${formatNumberByLang(stats.remainingDays, 'bn')} দিন` : `${stats.remainingDays} days remaining`}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'বর্তমান স্ট্রিক' : 'Current Streak'}</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-400">
            {formatNumberByLang(state.currentStreak, language)} {isBn ? 'দিন' : 'd'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isBn ? `সর্বোচ্চ স্ট্রিক: ${formatNumberByLang(state.longestStreak, 'bn')} দিন` : `Best streak: ${state.longestStreak} days`}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'মোট অর্জিত পয়েন্ট' : 'Total Points'}</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {formatNumberByLang(state.totalPoints, language)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isBn ? 'টাস্ক ও বোনাস পয়েন্ট' : 'Includes daily bonus'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{isBn ? 'টাস্ক সম্পন্নতা' : 'Tasks Completed'}</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300">
            {formatNumberByLang(stats.totalTasksCompleted, language)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isBn ? `লক্ষ্য: ${formatNumberByLang(stats.totalTasksTarget, 'bn')}টি টাস্ক` : `Goal: ${stats.totalTasksTarget} tasks`}
          </span>
        </div>
      </div>

      {/* Daily Points Bar Chart (Pure SVG) */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isBn ? 'প্রতিদিনের পয়েন্ট অর্জন গ্রাফ (৪০ দিন)' : 'Daily Points Trajectory (Days 1 - 40)'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {isBn ? 'সর্বোচ্চ সম্ভাব্য দৈনিক: ১৭৫ পয়েন্ট' : 'Max daily target: 175 pts'}
          </span>
        </div>

        <div className="h-44 sm:h-52 w-full flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 px-1 border-b border-slate-800">
          {pointsData.map((d) => {
            const heightPct = Math.max(4, Math.round((d.points / maxPoints) * 100));
            const isToday = d.dayNum === currentDay;

            let barColor = 'bg-slate-800/60';
            if (d.status === 'completed') {
              barColor = 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/20';
            } else if (d.status === 'partial') {
              barColor = 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-sm shadow-amber-500/20';
            } else if (d.isPastOrToday && d.points === 0) {
              barColor = isToday ? 'bg-cyan-500/50 animate-pulse' : 'bg-rose-950/60';
            }

            return (
              <div
                key={d.dayNum}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none bg-slate-900 border border-slate-700 text-[10px] font-bold text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {isBn ? `দিন ${toBengaliNumber(d.dayNum)}: +${d.points} পয়েন্ট` : `Day ${d.dayNum}: +${d.points} pts`}
                </div>

                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${barColor}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X axis labels */}
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
          <span>{isBn ? 'দিন ১' : 'Day 1'}</span>
          <span>{isBn ? 'দিন ১০' : 'Day 10'}</span>
          <span>{isBn ? 'দিন ২০' : 'Day 20'}</span>
          <span>{isBn ? 'দিন ৩০' : 'Day 30'}</span>
          <span>{isBn ? 'দিন ৪০' : 'Day 40'}</span>
        </div>
      </div>

      {/* Weekly Progress Breakdown */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          <span>{isBn ? 'সাপ্তাহিক সাফল্যের হার' : 'Weekly Completion Breakdown'}</span>
        </h3>

        <div className="space-y-3">
          {weeks.map((week) => (
            <div key={week.num} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
                <span>{week.label}</span>
                <span className="text-amber-400">
                  {formatNumberByLang(week.completed, language)} / {formatNumberByLang(week.totalInWeek, language)}{' '}
                  {isBn ? 'দিন সম্পন্ন' : 'days done'} ({week.rate}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${week.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Habits Consistency Breakdown */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'প্রতিটি অভ্যাসের ধারাবাহিকতার হার' : 'Habit Consistency by Category'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryStats.map(({ task, completedCount, eligibleDays, rate }) => (
            <div key={task.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-bold text-white">{task.title}</h4>
                <span className="text-xs font-black text-amber-400">{rate}%</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{task.description}</p>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${rate}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                {isBn
                  ? `এখন পর্যন্ত ${formatNumberByLang(eligibleDays, 'bn')} দিনের মধ্যে ${formatNumberByLang(completedCount, 'bn')} দিন সম্পন্ন`
                  : `${completedCount} of ${eligibleDays} days completed so far`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
