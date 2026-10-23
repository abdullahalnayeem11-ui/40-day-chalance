import React, { useState, useEffect } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  HelpCircle,
  FileCheck,
  Edit3,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import {
  calculateTaskPoints,
  formatDisplayDate,
  formatNumberByLang,
  toBengaliNumber,
} from '../utils/challenge';

interface SubmitProgressViewProps {
  onNavigateToCalendar?: () => void;
  onNavigateToDashboard?: () => void;
}

export const SubmitProgressView: React.FC<SubmitProgressViewProps> = ({
  onNavigateToCalendar,
  onNavigateToDashboard,
}) => {
  const {
    state,
    currentDay,
    activeDayNumber,
    setActiveDayNumber,
    submitDayProgress,
    toggleTask,
    language,
  } = useChallenge();

  const isBn = language === 'bn';
  const targetDay = activeDayNumber;
  const dayRecord = state.days[targetDay];

  // Prepopulate form if existing submission
  const existingSub = dayRecord?.submission;

  const [accomplished, setAccomplished] = useState(existingSub?.accomplishedSummary || '');
  const [measurableResults, setMeasurableResults] = useState(existingSub?.measurableResults || '');
  const [challenges, setChallenges] = useState(existingSub?.challengesNotes || '');
  const [lessonsLearned, setLessonsLearned] = useState(existingSub?.lessonsLearned || '');
  const [proofLinks, setProofLinks] = useState(existingSub?.proofLinks?.join('\n') || '');

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Sync inputs when target day changes
  useEffect(() => {
    const sub = state.days[targetDay]?.submission;
    if (sub) {
      setAccomplished(sub.accomplishedSummary || '');
      setMeasurableResults(sub.measurableResults || '');
      setChallenges(sub.challengesNotes || '');
      setLessonsLearned(sub.lessonsLearned || '');
      setProofLinks(sub.proofLinks?.join('\n') || '');
    } else {
      setAccomplished('');
      setMeasurableResults('');
      setChallenges('');
      setLessonsLearned('');
      setProofLinks('');
    }
    setSubmittedSuccess(false);
    setValidationError('');
  }, [targetDay, state.days]);

  // Completed tasks count
  const completedTaskIds = Object.keys(dayRecord?.taskProgress || {}).filter(
    (id) => dayRecord?.taskProgress[id]?.completed
  );

  const { basePoints, bonusPoints, totalPoints, isFullyCompleted, completionRate } = calculateTaskPoints(
    state.tasks,
    completedTaskIds,
    state.settings.dailyBonusPoints
  );

  const isFutureDay = targetDay > currentDay;

  const handleOpenSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFutureDay) {
      setValidationError(
        isBn
          ? 'ভবিষ্যতের দিনের জন্য অগ্রগতি সাবমিট করা সম্ভব নয়।'
          : 'Cannot submit progress for future days before they start.'
      );
      return;
    }

    if (!accomplished.trim()) {
      setValidationError(
        isBn
          ? 'অনুগ্রহ করে আজকের অর্জিত কাজের বিবরণ লিখুন।'
          : 'Please enter what you accomplished today.'
      );
      return;
    }

    setValidationError('');
    setShowSummaryModal(true);
  };

  const handleFinalSubmit = () => {
    const linksArray = proofLinks
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    submitDayProgress(targetDay, {
      accomplishedSummary: accomplished.trim(),
      measurableResults: measurableResults.trim(),
      challengesNotes: challenges.trim(),
      lessonsLearned: lessonsLearned.trim() || undefined,
      proofLinks: linksArray.length > 0 ? linksArray : undefined,
    });

    setShowSummaryModal(false);
    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* View Header with day navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b1428] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {isBn ? 'দৈনিক কাজের রিপোর্ট' : 'Daily Work Report'}
            </span>
            {existingSub && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isBn ? 'পূর্বে সাবমিট করা হয়েছে' : 'Already Submitted'}
              </span>
            )}
            {existingSub?.isEdited && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isBn ? 'সম্পাদিত' : 'Edited'}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isBn ? 'আজকের অগ্রগতি সাবমিট করুন' : "Submit Today's Progress"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isBn
              ? `দিন ${formatNumberByLang(targetDay, 'bn')} (${formatDisplayDate(dayRecord?.date || state.settings.startDate, 'bn')})`
              : `Day ${targetDay} (${formatDisplayDate(dayRecord?.date || state.settings.startDate, 'en')})`}
          </p>
        </div>

        {/* Day selector dropdown / pills */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">{isBn ? 'দিন নির্বাচন:' : 'Select Day:'}</label>
          <select
            value={targetDay}
            onChange={(e) => setActiveDayNumber(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
          >
            {Array.from({ length: state.settings.totalDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d} disabled={d > currentDay}>
                {isBn ? `দিন ${toBengaliNumber(d)}` : `Day ${d}`} {d === currentDay ? (isBn ? ' (আজ)' : ' (Today)') : ''} {d > currentDay ? (isBn ? ' (আসন্ন)' : ' (Upcoming)') : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success banner after submission */}
      {submittedSuccess && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-[#091b24] border-2 border-emerald-500/50 shadow-xl flex items-start gap-4 animate-in fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              {isBn ? 'অগ্রগতি সফলভাবে সংরক্ষিত হয়েছে!' : 'Daily Progress Successfully Submitted!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-3">
              {isBn
                ? `দিন ${formatNumberByLang(targetDay, 'bn')}-এর জন্য মোট +${formatNumberByLang(totalPoints, 'bn')} পয়েন্ট যোগ করা হয়েছে। আপনার স্ট্রিক ও ড্যাশবোর্ড আপডেট করা হয়েছে।`
                : `Added +${totalPoints} points for Day ${targetDay}. Your streak and challenge stats are updated.`}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onNavigateToDashboard}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
              >
                {isBn ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
              </button>
              <button
                onClick={onNavigateToCalendar}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {isBn ? '৪০ দিনের ক্যালেন্ডার দেখুন' : 'View 40-Day Calendar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main submission form */}
      <form onSubmit={handleOpenSummary} className="space-y-6">
        {/* Step 1: Tasks Checklist review */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isBn ? 'কাজের তালিকা যাচাই ও সম্পন্নকরণ' : 'Task Completion Checklist'}
              </h3>
            </div>

            <div className="text-xs font-extrabold text-cyan-400">
              {formatNumberByLang(completedTaskIds.length, language)} / {formatNumberByLang(state.tasks.length, language)}{' '}
              {isBn ? 'সম্পন্ন' : 'completed'} ({completionRate}%)
            </div>
          </div>

          <div className="space-y-2.5">
            {state.tasks.map((task) => {
              const isChecked = !!dayRecord?.taskProgress[task.id]?.completed;
              return (
                <div
                  key={task.id}
                  onClick={() => !isFutureDay && toggleTask(targetDay, task.id)}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  } ${isFutureDay ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'border border-slate-600 bg-slate-950'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className={`text-sm font-bold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                        {task.title}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
                        — {task.description}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-400/90 shrink-0">
                    +{formatNumberByLang(task.points, language)} {isBn ? 'পয়েন্ট' : 'pts'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bonus pill */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {isFullyCompleted
                ? (isBn ? '🌟 সব টাস্ক সম্পন্ন হয়েছে! ১০০% দৈনিক বোনাস প্রাপ্তব্য।' : '🌟 All tasks completed! 100% completion bonus unlocked.')
                : (isBn ? '⚠️ আংশিক সাবমিশন: দৈনিক বোনাস পেতে সব টাস্ক সম্পন্ন করুন।' : '⚠️ Partial submission: Complete all tasks to earn daily completion bonus.')}
            </span>
            <span className="font-extrabold text-amber-400">
              {isFullyCompleted ? `+${state.settings.dailyBonusPoints} ${isBn ? 'বোনাস' : 'Bonus'}` : (isBn ? '০ বোনাস' : '0 Bonus')}
            </span>
          </div>
        </div>

        {/* Step 2: Accomplishments and Measurable Results */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isBn ? 'আজকের অর্জিত কাজ ও পরিমাপযোগ্য ফলাফল' : 'Accomplishments & Measurable Results'}
            </h3>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
              {isBn ? '১. আজকে আপনি কী কী কাজ সম্পন্ন করেছেন? *' : '1. What did you accomplish today? *'}
            </label>
            <textarea
              rows={3}
              value={accomplished}
              onChange={(e) => setAccomplished(e.target.value)}
              placeholder={
                isBn
                  ? 'যেমন: ফজরের পর ৪ ঘণ্টা ডিপ ওয়ার্ক করেছি, SaaS অ্যাপে নতুন অথেন্টিকেশন মডিউল ও ডাটাবেস স্কিমা ডিজাইন সম্পন্ন করেছি...'
                  : 'e.g. Completed 4 hours of deep work, developed user auth module and database schema for SaaS...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
              {isBn
                ? '২. পরিমাপযোগ্য ফলাফল (Measurable Metrics / Outcomes)'
                : '2. Measurable Outcomes (e.g. articles written, code commits, workouts)'}
            </label>
            <input
              type="text"
              value={measurableResults}
              onChange={(e) => setMeasurableResults(e.target.value)}
              placeholder={
                isBn
                  ? 'যেমন: ১টি লিংকডইন পোস্ট, ৫০০ লাইন কোড, ৪.৫ ঘণ্টা ডিপ ওয়ার্ক, ৩০ মিনিট দৌড়ানো'
                  : 'e.g. 1 blog post, 4.5 hours deep work, 1 SaaS feature shipped'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Step 3: Challenges and Lessons */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isBn ? 'চ্যালেঞ্জ, প্রতিবন্ধকতা ও শিক্ষা' : 'Obstacles & Lessons Learned'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                {isBn ? 'আজকে কী কী সমস্যার মুখোমুখি হয়েছেন?' : 'What challenges did you face?'}
              </label>
              <textarea
                rows={2}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder={isBn ? 'যেমন: দুপুরে কিছুটা ক্লান্তি লেগেছিল, ফোনের নোটিফিকেশন ফোকাস নষ্ট করেছিল...' : 'e.g. Afternoon fatigue, distractions...'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                {isBn ? 'আগামীকালকে আরও ভালো করার জন্য কী শিক্ষা পেলেন?' : 'Lessons learned for tomorrow'}
              </label>
              <textarea
                rows={2}
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder={isBn ? 'যেমন: কাজের সময় ফোন অন্য রুমে রাখব...' : 'e.g. Keep phone in another room during deep work...'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Proof links or reference notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isBn ? 'প্রমাণ লিঙ্ক বা রেফারেন্স URL (প্রতি লাইনে ১টি লিঙ্ক)' : 'Proof URLs or links (optional, 1 per line)'}
            </label>
            <textarea
              rows={2}
              value={proofLinks}
              onChange={(e) => setProofLinks(e.target.value)}
              placeholder="https://github.com/my-project/commit/...&#10;https://x.com/my-post/..."
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Validation error display */}
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="text-xs text-slate-400">
            {isBn
              ? 'সাবমিট করার আগে ফলাফল সারসংক্ষেপ দেখতে পারবেন।'
              : 'Review submission summary before final confirmation.'}
          </div>

          <button
            type="submit"
            disabled={isFutureDay}
            className={`px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/25 active:scale-[0.98] flex items-center gap-2 cursor-pointer ${
              isFutureDay ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>
              {existingSub
                ? (isBn ? 'অগ্রগতি আপডেট ও সাবমিট' : 'Update & Re-Submit')
                : (isBn ? 'আজকের অগ্রগতি সাবমিট করুন' : "Submit Today's Progress")}
            </span>
          </button>
        </div>
      </form>

      {/* Confirmation Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#0d172e] border border-amber-500/40 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>{isBn ? 'সাবমিশন সারসংক্ষেপ' : 'Submission Summary'}</span>
              </h3>
              <span className="text-xs font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                {isBn ? `দিন ${toBengaliNumber(targetDay)}` : `Day ${targetDay}`}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">{isBn ? 'টাস্ক সম্পন্ন:' : 'Completed Tasks:'}</span>
                <span className="font-extrabold text-white">
                  {completedTaskIds.length} / {state.tasks.length} ({completionRate}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">{isBn ? 'মোট অর্জিত পয়েন্ট:' : 'Total Points Awarded:'}</span>
                <span className="font-extrabold text-amber-400 text-base">
                  +{totalPoints} {isBn ? 'পয়েন্ট' : 'pts'}
                  {bonusPoints > 0 && <span className="text-xs text-emerald-400 ml-1">(+৫০ বোনাসসহ)</span>}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  {isBn ? 'অর্জিত কাজ:' : 'Accomplished:'}
                </span>
                <p className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 line-clamp-3">
                  {accomplished}
                </p>
              </div>

              {measurableResults && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    {isBn ? 'পরিমাপযোগ্য ফলাফল:' : 'Measurable Results:'}
                  </span>
                  <p className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-cyan-300">
                    {measurableResults}
                  </p>
                </div>
              )}

              {!isFullyCompleted && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {isBn
                      ? 'কিছু টাস্ক এখনও বাকি রয়েছে। এটি আংশিক সাবমিশন হিসেবে সংরক্ষিত হবে।'
                      : 'Some tasks are unfinished. This will be recorded as a partial day.'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                {isBn ? 'ফিরে গিয়ে এডিট' : 'Go Back & Edit'}
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20"
              >
                {isBn ? 'চূড়ান্ত সাবমিশন নিশ্চিত করুন' : 'Confirm & Finalize'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
