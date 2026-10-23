import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  AlertCircle,
  ExternalLink,
  Edit2,
  Send,
} from 'lucide-react';
import {
  formatDisplayDate,
  formatNumberByLang,
  toBengaliNumber,
} from '../utils/challenge';

interface DayDetailModalProps {
  dayNumber: number | null;
  onClose: () => void;
  onNavigateToSubmit?: (dayNumber: number) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dayNumber,
  onClose,
  onNavigateToSubmit,
}) => {
  const { state, currentDay, language, setActiveDayNumber } = useChallenge();

  if (dayNumber === null) return null;

  const dayRecord = state.days[dayNumber];
  const isBn = language === 'bn';
  const submission = dayRecord?.submission;
  const isFuture = dayNumber > currentDay;
  const isToday = dayNumber === currentDay;

  const getStatusBadge = () => {
    if (!dayRecord) return null;
    switch (dayRecord.status) {
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ✓ {isBn ? 'সম্পূর্ণ সফল' : 'Fully Completed'}
          </span>
        );
      case 'partial':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ◐ {isBn ? 'আংশিক সম্পন্ন' : 'Partially Completed'}
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            ⏳ {isBn ? 'চলমান' : 'In Progress'}
          </span>
        );
      case 'missed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            ✕ {isBn ? 'বাদ পড়েছে' : 'Missed Day'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
            {isFuture ? (isBn ? 'আসন্ন দিন' : 'Upcoming') : (isBn ? 'শুরু হয়নি' : 'Not Started')}
          </span>
        );
    }
  };

  const completedCount = Object.values(dayRecord?.taskProgress || {}).filter((p) => p.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c162e] border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isBn ? `দিন ${toBengaliNumber(dayNumber)} / ৪০` : `DAY ${dayNumber} OF 40`}
              </span>
              {getStatusBadge()}
              {isToday && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {isBn ? 'আজকের দিন' : 'Today'}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {formatDisplayDate(dayRecord?.date || state.settings.startDate, language)}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Close day modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Goal if set */}
        {dayRecord?.dailyFocus && (
          <div className="mt-5 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              🎯 {isBn ? 'দিনের মূল লক্ষ্য (Daily Focus):' : 'Daily Core Focus:'}
            </span>
            <p className="text-sm font-semibold text-slate-100">{dayRecord.dailyFocus}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">{isBn ? 'টাস্ক সম্পন্ন' : 'Tasks Done'}</span>
            <span className="text-base font-extrabold text-white">
              {formatNumberByLang(completedCount, language)} / {formatNumberByLang(state.tasks.length, language)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">{isBn ? 'অর্জিত পয়েন্ট' : 'Points Earned'}</span>
            <span className="text-base font-extrabold text-amber-400">
              +{formatNumberByLang(dayRecord?.pointsEarned || 0, language)} {isBn ? 'পয়েন্ট' : 'pts'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">{isBn ? 'বোনাস স্ট্যাটাস' : 'Bonus'}</span>
            <span className="text-sm font-bold text-emerald-400">
              {dayRecord?.submission?.dailyBonusAwarded
                ? (isBn ? '✓ +৫০ বোনাসপ্রাপ্ত' : '✓ Full Bonus')
                : (isBn ? 'বোনাস নেই' : 'No bonus')}
            </span>
          </div>
        </div>

        {/* Tasks list breakdown */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            {isBn ? 'টাস্ক তালিকা ও সম্পন্নতার বিবরণ' : 'Daily Tasks Status'}
          </h4>

          <div className="space-y-2">
            {state.tasks.map((task) => {
              const p = dayRecord?.taskProgress[task.id];
              const done = !!p?.completed;

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs sm:text-sm ${
                    done
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-600" />
                      )}
                    </span>
                    <div>
                      <p className={`font-bold ${done ? 'text-white' : 'text-slate-300'}`}>{task.title}</p>
                      <p className="text-xs text-slate-400">{task.description}</p>
                      {p?.actualOutcome && (
                        <p className="text-xs text-cyan-300 mt-1">
                          📊 {isBn ? 'ফলাফল:' : 'Outcome:'} {p.actualOutcome}
                        </p>
                      )}
                      {p?.notes && (
                        <p className="text-xs text-slate-400 italic mt-0.5">
                          📝 {p.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="font-extrabold text-amber-400 text-xs shrink-0">
                    +{formatNumberByLang(task.points, language)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Submission Report */}
        {submission ? (
          <div className="mt-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {isBn ? 'সাবমিটকৃত রিপোর্ট' : 'Submitted Work Report'}
              </span>

              <div className="text-[11px] text-slate-400">
                {isBn ? 'সাবমিশন সময়:' : 'Submitted:'}{' '}
                {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {submission.isEdited && (
                  <span className="ml-1 text-amber-400">({isBn ? 'সম্পাদিত' : 'Edited'})</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                {isBn ? 'অর্জিত কাজ (Accomplished):' : 'Accomplished Summary:'}
              </span>
              <p className="text-sm text-slate-100 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {submission.accomplishedSummary}
              </p>
            </div>

            {submission.measurableResults && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  {isBn ? 'পরিমাপযোগ্য ফলাফল (Metrics):' : 'Measurable Metrics:'}
                </span>
                <p className="text-xs sm:text-sm text-cyan-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {submission.measurableResults}
                </p>
              </div>
            )}

            {submission.challengesNotes && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  {isBn ? 'চ্যালেঞ্জ ও বাধা:' : 'Challenges Faced:'}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {submission.challengesNotes}
                </p>
              </div>
            )}

            {submission.lessonsLearned && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  {isBn ? 'শিক্ষা ও উন্নতি:' : 'Lessons Learned:'}
                </span>
                <p className="text-xs sm:text-sm text-emerald-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {submission.lessonsLearned}
                </p>
              </div>
            )}

            {submission.proofLinks && submission.proofLinks.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  {isBn ? 'প্রমাণ লিঙ্ক:' : 'Proof Links:'}
                </span>
                <div className="space-y-1">
                  {submission.proofLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !isFuture && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-xs sm:text-sm text-slate-400 mb-3">
                {isBn
                  ? 'এই দিনের কোনো বিস্তারিত কাজের রিপোর্ট এখনও সাবমিট করা হয়নি।'
                  : 'No detailed work report submitted for this day yet.'}
              </p>
              <button
                onClick={() => {
                  setActiveDayNumber(dayNumber);
                  onClose();
                  if (onNavigateToSubmit) onNavigateToSubmit(dayNumber);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
              >
                {isBn ? 'এখনই অগ্রগতি সাবমিট করুন' : 'Submit Progress Now'}
              </button>
            </div>
          )
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>

          {!isFuture && (
            <button
              onClick={() => {
                setActiveDayNumber(dayNumber);
                onClose();
                if (onNavigateToSubmit) onNavigateToSubmit(dayNumber);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>
                {submission ? (isBn ? 'রিপোর্ট এডিট করুন' : 'Edit Report') : (isBn ? 'রিপোর্ট সাবমিট করুন' : 'Submit Report')}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
