import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { TaskCard } from './TaskCard';
import {
  CheckSquare,
  Sparkles,
  Send,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  formatDisplayDate,
  formatNumberByLang,
  toBengaliNumber,
} from '../utils/challenge';

interface TodayTasksViewProps {
  onNavigateToSubmit: () => void;
}

export const TodayTasksView: React.FC<TodayTasksViewProps> = ({ onNavigateToSubmit }) => {
  const {
    state,
    currentDay,
    activeDayNumber,
    setActiveDayNumber,
    language,
  } = useChallenge();

  const isBn = language === 'bn';
  const targetDay = activeDayNumber;
  const dayRecord = state.days[targetDay];
  const isToday = targetDay === currentDay;
  const isFuture = targetDay > currentDay;

  const completedCount = Object.values(dayRecord?.taskProgress || {}).filter((p) => p.completed).length;
  const totalTasks = state.tasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {isBn
                  ? `দিন ${formatNumberByLang(targetDay, 'bn')} / ${formatNumberByLang(state.settings.totalDays, 'bn')}`
                  : `DAY ${targetDay} OF ${state.settings.totalDays}`}
              </span>
              {isToday && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isBn ? 'আজকের দিন' : 'Today'}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isToday
                ? (isBn ? 'আজকের নির্ধারিত কাজ ও রুটিন' : "Today's Assigned Daily Tasks")
                : (isBn ? `দিন ${toBengaliNumber(targetDay)}-এর কাজের তালিকা` : `Day ${targetDay} Tasks Checklist`)}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{formatDisplayDate(dayRecord?.date || state.settings.startDate, language)}</span>
            </p>
          </div>

          {/* Quick day switcher dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold">{isBn ? 'দিন পাল্টান:' : 'Change Day:'}</label>
            <select
              value={targetDay}
              onChange={(e) => setActiveDayNumber(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
            >
              {Array.from({ length: state.settings.totalDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {isBn ? `দিন ${toBengaliNumber(d)}` : `Day ${d}`} {d === currentDay ? (isBn ? ' (আজ)' : ' (Today)') : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress summary meter */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
            <span className="text-slate-300">
              {isBn ? 'সম্পন্নতার অগ্রগতি' : 'Task Completion Progress'}
            </span>
            <span className="text-teal-400">
              {formatNumberByLang(completedCount, language)} / {formatNumberByLang(totalTasks, language)}{' '}
              {isBn ? 'কাজ সম্পন্ন' : 'tasks done'} ({completionPct}%)
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning for future days */}
      {isFuture && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>
            {isBn
              ? 'এটি একটি আসন্ন দিন। ভবিষ্যতের দিনের টাস্ক শুরু হওয়ার আগে টিক দেওয়া যাবে না।'
              : 'This is an upcoming day. Tasks can only be checked once this day arrives.'}
          </span>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {state.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            dayNumber={targetDay}
            progress={dayRecord?.taskProgress[task.id]}
            isEditableDay={!isFuture}
          />
        ))}
      </div>

      {/* Bottom CTA to Submit Progress */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1e3d] via-[#09152b] to-[#070e1e] border-2 border-cyan-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {isBn ? 'আজকের কাজ শেষ করেছেন?' : 'Finished your tasks for today?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {isBn
              ? 'আপনার বাস্তব ফলাফল ও মেট্রিক্স সাবমিট করুন এবং আজকের সম্পূর্ণ পয়েন্ট অর্জন করুন।'
              : 'Submit your measurable results and claim your daily points & streak bonus.'}
          </p>
        </div>

        <button
          onClick={onNavigateToSubmit}
          className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4 text-slate-950 font-bold" />
          <span>{isBn ? 'আজকের অগ্রগতি সাবমিট করুন' : "Submit Today's Progress"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
