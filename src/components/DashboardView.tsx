import React, { useState } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { DashboardHeader } from './DashboardHeader';
import { MotivationalCard } from './MotivationalCard';
import { TaskCard } from './TaskCard';
import { DayDetailModal } from './DayDetailModal';
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Award,
  Send,
  Zap,
} from 'lucide-react';
import {
  formatNumberByLang,
  toBengaliNumber,
} from '../utils/challenge';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { state, currentDay, language, stats } = useChallenge();
  const isBn = language === 'bn';
  const todayRecord = state.days[currentDay];

  const [inspectDayNumber, setInspectDayNumber] = useState<number | null>(null);

  const completedTodayCount = todayRecord
    ? Object.values(todayRecord.taskProgress || {}).filter((p) => p.completed).length
    : 0;

  const totalTodayTasks = state.tasks.length;
  const todayPct = totalTodayTasks > 0 ? Math.round((completedTodayCount / totalTodayTasks) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Grand Hero Dashboard Header */}
      <DashboardHeader onNavigate={onNavigate} />

      {/* 2. Motivational Quote & Daily Focus (One Thing) */}
      <MotivationalCard />

      {/* 3. Today's Tasks & Quick Progress Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isBn ? 'আজকের করণীয় কাজসমূহ' : "Today's Assigned Tasks"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isBn ? 'আজকের টাস্ক ও চেকলিস্ট' : "Today's Tasks & Checklist"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              {formatNumberByLang(completedTodayCount, language)} / {formatNumberByLang(totalTodayTasks, language)}{' '}
              {isBn ? 'সম্পন্ন' : 'completed'} ({todayPct}%)
            </span>

            <button
              onClick={() => onNavigate('submit')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isBn ? 'অগ্রগতি সাবমিট' : 'Submit Progress'}</span>
            </button>
          </div>
        </div>

        {/* Task Cards Grid (2 cols on large, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              dayNumber={currentDay}
              progress={todayRecord?.taskProgress[task.id]}
              isEditableDay={true}
            />
          ))}
        </div>
      </div>

      {/* 4. 40-Day Journey Matrix Heatmap Preview */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isBn ? '৪০ দিনের পূর্ণাঙ্গ জার্নি প্রিভিউ' : '40-Day Journey Progress Matrix'}
            </h3>
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>{isBn ? 'সম্পূর্ণ ক্যালেন্ডার দেখুন' : 'Full Calendar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini 40-cell grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: state.settings.totalDays }, (_, i) => i + 1).map((dayNum) => {
            const record = state.days[dayNum];
            const isToday = dayNum === currentDay;
            const isPast = dayNum < currentDay;

            let bg = 'bg-slate-900 border-slate-800 text-slate-400';
            if (record?.status === 'completed') {
              bg = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold';
            } else if (record?.status === 'partial') {
              bg = 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold';
            } else if (isPast && (!record || record.status === 'not_started' || record.status === 'missed')) {
              bg = 'bg-rose-950/40 border-rose-900/40 text-rose-400';
            }

            if (isToday) {
              bg += ' ring-2 ring-cyan-400 text-cyan-200 font-black';
            }

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setInspectDayNumber(dayNum)}
                className={`p-2 rounded-xl border text-center transition-all hover:scale-105 cursor-pointer ${bg}`}
                title={isBn ? `দিন ${dayNum}` : `Day ${dayNum}`}
              >
                <span className="text-[11px] block">
                  {isBn ? toBengaliNumber(dayNum) : dayNum}
                </span>
                <span className="text-[9px] opacity-80 block truncate">
                  {record?.status === 'completed' ? '✓' : record?.status === 'partial' ? '◐' : isToday ? 'TODAY' : ''}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            {isBn
              ? `৪০ দিনের মধ্যে ${formatNumberByLang(stats.completedDays, 'bn')} দিন সফলভাবে সম্পন্ন হয়েছে।`
              : `${stats.completedDays} of 40 days conquered successfully.`}
          </span>
          <span className="text-amber-400 font-semibold">
            {stats.remainingDays} {isBn ? 'দিন বাকি' : 'days remaining'}
          </span>
        </div>
      </div>

      {/* 5. Recent Achievements Widget */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isBn ? 'মাইলস্টোন ও অর্জন' : 'Milestones & Badges'}
            </h3>
          </div>

          <button
            onClick={() => onNavigate('rewards')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>{isBn ? 'সব ব্যাজ দেখুন' : 'View All Badges'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.achievements.slice(0, 3).map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                ach.isUnlocked
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-700">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {isBn ? ach.titleBn : ach.titleEn}
                </h4>
                <span className="text-[11px] text-amber-400 font-bold block">
                  +{formatNumberByLang(ach.pointsReward, language)} {isBn ? 'পয়েন্ট' : 'pts'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day details modal if clicked in heatmap */}
      <DayDetailModal
        dayNumber={inspectDayNumber}
        onClose={() => setInspectDayNumber(null)}
        onNavigateToSubmit={() => {
          onNavigate('submit');
        }}
      />
    </div>
  );
};
