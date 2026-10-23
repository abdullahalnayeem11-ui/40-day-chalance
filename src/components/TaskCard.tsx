import React, { useState } from 'react';
import { DailyTask, DayTaskProgress } from '../types/challenge';
import { useChallenge } from '../context/ChallengeContext';
import {
  Check,
  Moon,
  Sun,
  Flame,
  Brain,
  Rocket,
  Video,
  Dumbbell,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Sparkles,
} from 'lucide-react';
import { formatNumberByLang } from '../utils/challenge';

interface TaskCardProps {
  task: DailyTask;
  dayNumber: number;
  progress?: DayTaskProgress;
  isEditableDay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  dayNumber,
  progress,
  isEditableDay = true,
}) => {
  const { toggleTask, updateTaskNote, language } = useChallenge();
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState(progress?.notes || '');
  const [outcomeText, setOutcomeText] = useState(progress?.actualOutcome || '');
  const [savedNoteIndicator, setSavedNoteIndicator] = useState(false);

  const isCompleted = !!progress?.completed;
  const isBn = language === 'bn';

  const handleToggle = () => {
    if (!isEditableDay) return;
    toggleTask(dayNumber, task.id);
  };

  const handleSaveNotes = () => {
    updateTaskNote(dayNumber, task.id, noteText, outcomeText);
    setSavedNoteIndicator(true);
    setTimeout(() => setSavedNoteIndicator(false), 2000);
  };

  // Category Icon & Styling
  const getCategoryConfig = (cat: DailyTask['category']) => {
    switch (cat) {
      case 'sleep':
        return {
          icon: Moon,
          labelBn: 'ঘুম ও স্বাস্থ্য',
          labelEn: 'Sleep & Rest',
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        };
      case 'wake':
        return {
          icon: Sun,
          labelBn: 'ভোর জাগরণ',
          labelEn: 'Early Rise',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
      case 'prayer':
        return {
          icon: Flame,
          labelBn: 'ইবাদত ও আধ্যাত্মিকতা',
          labelEn: 'Spiritual',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'deepwork':
        return {
          icon: Brain,
          labelBn: 'ডিপ ওয়ার্ক',
          labelEn: 'Deep Work',
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        };
      case 'saas':
        return {
          icon: Rocket,
          labelBn: 'SaaS কোম্পানি',
          labelEn: 'SaaS Business',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
      case 'content':
        return {
          icon: Video,
          labelBn: 'কনটেন্ট ও বিপণন',
          labelEn: 'Content & Mktg',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        };
      case 'fitness':
        return {
          icon: Dumbbell,
          labelBn: 'ফিটনেস',
          labelEn: 'Fitness',
          color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
        };
      default:
        return {
          icon: HelpCircle,
          labelBn: 'সাধারণ টাস্ক',
          labelEn: 'General Task',
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
        };
    }
  };

  const catConfig = getCategoryConfig(task.category);
  const CategoryIcon = catConfig.icon;

  return (
    <div
      className={`relative rounded-2xl transition-all duration-200 border ${
        isCompleted
          ? 'bg-[#0b172e]/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
          : 'bg-[#0d1629]/75 border-slate-800/90 hover:border-slate-700 hover:bg-[#0f1a32]/85'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5 sm:gap-4">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={!isEditableDay}
            className={`mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                : 'bg-slate-900 border-2 border-slate-600 hover:border-amber-400 text-transparent'
            } ${!isEditableDay ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={`Mark task ${task.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
          >
            <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3]" />
          </button>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${catConfig.color}`}
              >
                <CategoryIcon className="w-3 h-3" />
                <span>{isBn ? catConfig.labelBn : catConfig.labelEn}</span>
              </span>

              {/* Points Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                +{formatNumberByLang(task.points, language)} {isBn ? 'পয়েন্ট' : 'pts'}
              </span>

              {/* Target / Target Outcome */}
              {task.targetOutcome && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  <Target className="w-3 h-3 text-cyan-400" />
                  <span>{task.targetOutcome}</span>
                </span>
              )}
            </div>

            {/* Task Title */}
            <h4
              className={`text-base sm:text-lg font-bold transition-colors ${
                isCompleted ? 'text-emerald-300 line-through/40' : 'text-white'
              }`}
            >
              {task.title}
            </h4>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300/90 mt-0.5 leading-relaxed">
              {task.description}
            </p>

            {/* Completed timestamp if completed */}
            {isCompleted && progress?.completedAt && (
              <span className="inline-block mt-2 text-[11px] font-medium text-emerald-400/90">
                ✓ {isBn ? 'সম্পন্ন হয়েছে' : 'Completed at'}{' '}
                {new Date(progress.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Expand for notes / outcomes button */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={expanded ? 'Collapse details' : 'Add notes or measurable result'}
            aria-label="Toggle notes and outcome"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible notes & outcome drawer */}
        {expanded && (
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {isBn ? 'অর্জিত ফলাফল (যেমন: ৪ ঘণ্টা, ১টি ভিডিও)' : 'Measurable Outcome (e.g., 4 hrs, 1 post)'}
                </label>
                <input
                  type="text"
                  value={outcomeText}
                  onChange={(e) => setOutcomeText(e.target.value)}
                  placeholder={task.targetOutcome || (isBn ? 'যেমন: ৫ ঘণ্টা ডিপ ওয়ার্ক' : 'e.g. 5 hours done')}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {isBn ? 'টাস্ক নোট বা পর্যবেক্ষণ' : 'Task Notes / Observations'}
                </label>
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={isBn ? 'কোনো চ্যালেঞ্জ বা বিশেষ সাফল্য...' : 'Any obstacle or key win...'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {savedNoteIndicator ? (
                <span className="text-xs text-emerald-400 font-semibold">
                  ✓ {isBn ? 'সংরক্ষিত হয়েছে!' : 'Notes saved!'}
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  {isBn ? 'প্রতিদিনের অগ্রগতির সাথে সংরক্ষিত থাকবে।' : 'Saved to daily record.'}
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                {isBn ? 'নোট সেভ করুন' : 'Save Notes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
