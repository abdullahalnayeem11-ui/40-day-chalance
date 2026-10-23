import React, { useState } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { DayDetailModal } from './DayDetailModal';
import {
  History,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  formatDisplayDate,
  formatNumberByLang,
  toBengaliNumber,
} from '../utils/challenge';

interface DailyHistoryViewProps {
  onNavigateToSubmit?: (dayNumber: number) => void;
}

export const DailyHistoryView: React.FC<DailyHistoryViewProps> = ({ onNavigateToSubmit }) => {
  const { state, currentDay, language } = useChallenge();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  // List past and current days that have submissions or completed tasks
  const daysHistory = Array.from({ length: currentDay }, (_, i) => i + 1)
    .reverse()
    .map((dayNum) => {
      const day = state.days[dayNum];
      return {
        dayNum,
        day,
      };
    })
    .filter(({ dayNum, day }) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const summary = day?.submission?.accomplishedSummary?.toLowerCase() || '';
      const metrics = day?.submission?.measurableResults?.toLowerCase() || '';
      const notes = day?.submission?.challengesNotes?.toLowerCase() || '';
      const focus = day?.dailyFocus?.toLowerCase() || '';
      return (
        summary.includes(q) ||
        metrics.includes(q) ||
        notes.includes(q) ||
        focus.includes(q) ||
        String(dayNum).includes(q)
      );
    });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c162e] border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isBn ? 'সংরক্ষিত দৈনিক রেকর্ড' : 'Daily Logs & Records'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isBn ? 'দৈনিক সাবমিশন হিস্ট্রি' : 'Daily Progress History'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isBn
              ? 'আপনার পূর্ববর্তী প্রতিটি দিনের ফলাফল, পরিমাপযোগ্য মেট্রিক্স এবং নোট পর্যালোচনা করুন।'
              : 'Review your past logs, outcomes, challenge notes, and points records.'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'কীওয়ার্ড বা ফলাফল খুঁজুন...' : 'Search logs or metrics...'}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* History Entries */}
      {daysHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300 mb-1">
            {isBn ? 'কোনো পূর্ববর্তী রেকর্ড পাওয়া যায়নি' : 'No submission history found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'অগ্রগতি সাবমিট করলে এখানে আপনার দৈনিক সমস্ত কাজের ইতিহাস সংরক্ষিত থাকবে।'
              : 'Once you submit daily progress, all your accomplishments will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {daysHistory.map(({ dayNum, day }) => {
            const isCompleted = day?.status === 'completed';
            const isPartial = day?.status === 'partial';
            const submission = day?.submission;
            const completedCount = Object.values(day?.taskProgress || {}).filter((p) => p.completed).length;

            return (
              <div
                key={dayNum}
                onClick={() => setSelectedDayNumber(dayNum)}
                className="p-5 rounded-2xl bg-gradient-to-r from-[#0c162c] to-[#080f1e] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-md group"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {isBn ? `দিন ${toBengaliNumber(dayNum)}` : `Day ${dayNum}`}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {formatDisplayDate(day?.date || state.settings.startDate, language)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isBn ? '১০০% সম্পূর্ণ' : '100% Completed'}
                      </span>
                    ) : isPartial ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {isBn ? 'আংশিক' : 'Partial'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {isBn ? 'রিপোর্টহীন' : 'Unsubmitted'}
                      </span>
                    )}

                    <span className="text-xs font-extrabold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      +{formatNumberByLang(day?.pointsEarned || 0, language)} {isBn ? 'পয়েন্ট' : 'pts'}
                    </span>
                  </div>
                </div>

                {/* Focus Goal if exists */}
                {day?.dailyFocus && (
                  <p className="text-xs font-bold text-cyan-300 mb-2">
                    🎯 {isBn ? 'ফোকাস:' : 'Focus:'} {day.dailyFocus}
                  </p>
                )}

                {/* Accomplished Summary */}
                {submission?.accomplishedSummary ? (
                  <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed mb-2">
                    {submission.accomplishedSummary}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic mb-2">
                    {isBn ? 'টাস্ক সম্পন্ন হয়েছে, কিন্তু বিস্তারিত নোট লেখা হয়নি।' : 'Tasks marked, no summary log.'}
                  </p>
                )}

                {/* Metrics snippet */}
                {submission?.measurableResults && (
                  <div className="text-xs text-amber-300/90 font-medium bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 mb-2">
                    📊 {isBn ? 'ফলাফল:' : 'Metrics:'} {submission.measurableResults}
                  </div>
                )}

                {/* Bottom Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <span>
                    {formatNumberByLang(completedCount, language)} / {formatNumberByLang(state.tasks.length, language)}{' '}
                    {isBn ? 'টাস্ক সম্পন্ন' : 'tasks completed'}
                  </span>

                  <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform font-bold">
                    {isBn ? 'বিস্তারিত দেখুন' : 'View Details'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day Details Inspector Modal */}
      <DayDetailModal
        dayNumber={selectedDayNumber}
        onClose={() => setSelectedDayNumber(null)}
        onNavigateToSubmit={onNavigateToSubmit}
      />
    </div>
  );
};
