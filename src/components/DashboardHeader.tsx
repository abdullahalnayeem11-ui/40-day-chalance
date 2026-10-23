import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  Calendar,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowRight,
} from 'lucide-react';
import {
  formatDisplayDate,
  formatNumberByLang,
  getDateForDayNumber,
  toBengaliNumber,
} from '../utils/challenge';

interface DashboardHeaderProps {
  onNavigate: (view: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNavigate }) => {
  const { currentDay, state, language, stats, setActiveDayNumber } = useChallenge();
  const isBn = language === 'bn';

  const startDateStr = state.settings.startDate;
  const endDateStr = getDateForDayNumber(startDateStr, state.settings.totalDays);
  const todayRecord = state.days[currentDay];
  const todayCompletedCount = todayRecord
    ? Object.values(todayRecord.taskProgress || {}).filter((p) => p.completed).length
    : 0;
  const todayTotalTasks = state.tasks.length;
  const todayCompletionPct = todayTotalTasks > 0 ? Math.round((todayCompletedCount / todayTotalTasks) * 100) : 0;

  const handleOpenTodayTasks = () => {
    setActiveDayNumber(currentDay);
    onNavigate('tasks');
  };

  const handleOpenSubmit = () => {
    setActiveDayNumber(currentDay);
    onNavigate('submit');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1935] via-[#091226] to-[#070c18] border border-slate-800/90 shadow-2xl p-6 sm:p-8 lg:p-10 mb-8">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          {/* DAY BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-amber-300">
              {isBn
                ? `দিন ${formatNumberByLang(currentDay, 'bn')} / ${formatNumberByLang(state.settings.totalDays, 'bn')}`
                : `DAY ${currentDay} OF ${state.settings.totalDays}`}
            </span>
          </div>

          {/* Start and End date range */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {isBn ? 'সময়সীমা:' : 'Duration:'} {startDateStr} → {endDateStr}
            </span>
          </div>
        </div>

        {/* Today's local date & timezone */}
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-200/90 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-800/40">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatDisplayDate(todayRecord?.date || startDateStr, language)}</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400 font-mono text-[11px]">{state.settings.timezone}</span>
        </div>
      </div>

      {/* Main Title Hero Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
              {isBn ? 'ব্যক্তিগত স্ব-উন্নয়ন প্রোগ্রাম' : 'Personal Self-Improvement SaaS'}
            </span>
          </div>

          {/* Large Golden Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
            <span className="gold-gradient-text drop-shadow-sm">
              {isBn ? '৪০ দিনের চ্যালেঞ্জ' : '40-Day Challenge'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-200/95 font-medium leading-relaxed max-w-2xl mb-6">
            {isBn
              ? 'শৃঙ্খলা, ফোকাস আর ধারাবাহিকতা — প্রতিদিন নিজেকে আরও উন্নত করো।'
              : 'Discipline, focus, and unrelenting consistency — elevate yourself every single day.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenTodayTasks}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-slate-950 font-bold" />
              <span>{isBn ? 'আজকের কাজ দেখুন ও পূরণ করুন' : "Check Today's Tasks"}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={handleOpenSubmit}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/40 hover:border-cyan-400 transition-all active:scale-95 cursor-pointer"
            >
              <span>{isBn ? 'অগ্রগতি সাবমিট করুন' : 'Submit Progress'}</span>
            </button>
          </div>
        </div>

        {/* Right side stats badge */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-slate-400">
                {isBn ? 'আজকের অগ্রগতি' : "Today's Completion"}
              </span>
              <span className="text-sm font-extrabold text-teal-400">
                {formatNumberByLang(todayCompletedCount, language)} / {formatNumberByLang(todayTotalTasks, language)}{' '}
                {isBn ? 'কাজ' : 'tasks'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${todayCompletionPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{todayCompletionPct}% {isBn ? 'সম্পন্ন' : 'Done'}</span>
              <span className="text-amber-400 font-semibold">
                {todayCompletionPct === 100
                  ? (isBn ? '🎉 বোনাস প্রাপ্য!' : '🎉 Full Bonus Ready!')
                  : (isBn ? 'বাকি কাজগুলো শেষ করুন' : 'Complete remaining tasks')}
              </span>
            </div>
          </div>

          {/* Quick stats mini card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                {isBn ? 'সম্পন্ন দিন' : 'Days Done'}
              </span>
              <span className="text-xl font-black text-white">
                {formatNumberByLang(stats.completedDays, language)}
                <span className="text-xs font-normal text-slate-500"> / {formatNumberByLang(state.settings.totalDays, language)}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                {isBn ? 'মোট অর্জিত পয়েন্ট' : 'Total Points'}
              </span>
              <span className="text-xl font-black text-amber-400">
                {formatNumberByLang(state.totalPoints, language)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
