import React, { useState } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { DayDetailModal } from './DayDetailModal';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Filter,
  Flame,
} from 'lucide-react';
import { formatNumberByLang, toBengaliNumber } from '../utils/challenge';

interface CalendarGridProps {
  onNavigateToSubmit?: (dayNumber: number) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ onNavigateToSubmit }) => {
  const { state, currentDay, language, stats } = useChallenge();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'partial' | 'in_progress' | 'missed' | 'not_started'>('all');

  const isBn = language === 'bn';

  const filterOptions = [
    { id: 'all', labelBn: 'সব দিন (৪০)', labelEn: 'All (40)' },
    { id: 'completed', labelBn: `সম্পূর্ণ (${stats.completedDays})`, labelEn: `Completed (${stats.completedDays})` },
    { id: 'partial', labelBn: `আংশিক (${stats.partialDays})`, labelEn: `Partial (${stats.partialDays})` },
    { id: 'missed', labelBn: `মিসড (${stats.missedDays})`, labelEn: `Missed (${stats.missedDays})` },
  ];

  const daysList = Array.from({ length: state.settings.totalDays }, (_, i) => i + 1);

  const filteredDays = daysList.filter((dayNum) => {
    if (statusFilter === 'all') return true;
    const record = state.days[dayNum];
    if (statusFilter === 'missed') {
      return record?.status === 'missed' || (dayNum < currentDay && (!record || record.status === 'not_started'));
    }
    return record?.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c162e] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isBn ? '৪০ দিনের পূর্ণাঙ্গ ম্যাট্রিক্স' : '40-Day Full Journey Matrix'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isBn ? 'প্রতিদিনের অগ্রগতি ক্যালেন্ডার' : 'Daily Progress Calendar'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isBn
              ? 'যেকোনো দিনের উপর ক্লিক করে বিস্তারিত টাস্ক, ফলাফল ও হিস্ট্রি দেখুন।'
              : 'Click any day tile to inspect tasks, measurable outcomes, and submission logs.'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {isBn ? 'সম্পূর্ণ' : 'Completed'}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/40 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {isBn ? 'আংশিক' : 'Partial'}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {isBn ? 'আজ' : 'Today'}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            {isBn ? 'আসন্ন' : 'Upcoming'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Day status filter">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id as typeof statusFilter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              statusFilter === f.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {isBn ? f.labelBn : f.labelEn}
          </button>
        ))}
      </div>

      {/* The 40 Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
        {filteredDays.map((dayNum) => {
          const record = state.days[dayNum];
          const isToday = dayNum === currentDay;
          const isFuture = dayNum > currentDay;
          const isPast = dayNum < currentDay;

          const completedCount = record
            ? Object.values(record.taskProgress || {}).filter((p) => p.completed).length
            : 0;

          // Status styling
          let borderStyle = 'border-slate-800 bg-[#0d1629]/70 hover:border-slate-700';
          let dayBadgeBg = 'bg-slate-800 text-slate-300';
          let statusText = isBn ? 'শুরু হয়নি' : 'Not started';

          if (record?.status === 'completed') {
            borderStyle = 'border-emerald-500/50 bg-[#0a1f28]/85 hover:border-emerald-400 shadow-md shadow-emerald-500/10';
            dayBadgeBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            statusText = isBn ? '✓ সম্পূর্ণ' : '✓ Completed';
          } else if (record?.status === 'partial') {
            borderStyle = 'border-amber-500/50 bg-[#1f170a]/75 hover:border-amber-400 shadow-md shadow-amber-500/10';
            dayBadgeBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
            statusText = isBn ? '◐ আংশিক' : '◐ Partial';
          } else if (isPast && (!record || record.status === 'not_started' || record.status === 'missed')) {
            borderStyle = 'border-rose-900/40 bg-[#1a0f14]/50 opacity-80 hover:opacity-100 hover:border-rose-500/40';
            dayBadgeBg = 'bg-rose-500/10 text-rose-300 border border-rose-500/20';
            statusText = isBn ? '✕ মিসড' : '✕ Missed';
          }

          if (isToday) {
            borderStyle += ' ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20';
          }

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => setSelectedDayNumber(dayNum)}
              className={`relative p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group cursor-pointer min-h-[115px] ${borderStyle}`}
            >
              {/* Day Number and Today Indicator */}
              <div className="flex items-center justify-between gap-1 w-full mb-2">
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${dayBadgeBg}`}>
                  {isBn ? `দিন ${toBengaliNumber(dayNum)}` : `D${dayNum}`}
                </span>

                {isToday && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 shadow-sm animate-pulse">
                    {isBn ? 'আজ' : 'TODAY'}
                  </span>
                )}
              </div>

              {/* Points badge / tasks count */}
              <div className="my-1">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{statusText}</span>
                  {record?.pointsEarned ? (
                    <span className="text-amber-400 text-[11px] font-extrabold">
                      +{record.pointsEarned}
                    </span>
                  ) : null}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5">
                  {formatNumberByLang(completedCount, language)}/{formatNumberByLang(state.tasks.length, language)}{' '}
                  {isBn ? 'টাস্ক' : 'tasks'}
                </div>
              </div>

              {/* Mini progress tick */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all ${
                    record?.status === 'completed'
                      ? 'bg-emerald-400'
                      : record?.status === 'partial'
                      ? 'bg-amber-400'
                      : isPast
                      ? 'bg-rose-500'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    width: `${Math.round((completedCount / (state.tasks.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Day details modal */}
      <DayDetailModal
        dayNumber={selectedDayNumber}
        onClose={() => setSelectedDayNumber(null)}
        onNavigateToSubmit={onNavigateToSubmit}
      />
    </div>
  );
};
