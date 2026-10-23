import React, { useState } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { Quote, RefreshCw, Target, BookOpen, Check, Edit2 } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../utils/challenge';

export const MotivationalCard: React.FC = () => {
  const { currentDay, state, language, updateDailyFocus } = useChallenge();
  const isBn = language === 'bn';

  const [quoteIndex, setQuoteIndex] = useState(0);
  const currentDayRecord = state.days[currentDay];
  const [focusInput, setFocusInput] = useState(currentDayRecord?.dailyFocus || '');
  const [isEditingFocus, setIsEditingFocus] = useState(!currentDayRecord?.dailyFocus);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleSaveFocus = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyFocus(currentDay, focusInput.trim());
    setIsEditingFocus(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const activeQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
      {/* Motivational Quote Card */}
      <div className="md:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1830] to-[#070e20] border border-amber-500/30 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Quote className="w-4 h-4" />
            <span>{isBn ? 'দৈনিক অনুপ্রেরণা' : 'Daily Motivation'}</span>
          </div>

          <button
            onClick={handleNextQuote}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 transition-colors"
            title={isBn ? 'অন্য উক্তি দেখুন' : 'Next quote'}
            aria-label="Refresh motivational quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <blockquote className="my-2">
          <p className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed">
            "{isBn ? activeQuote.bn : activeQuote.en}"
          </p>
        </blockquote>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-amber-400/90">— {activeQuote.author}</span>
          <span className="text-[11px] text-slate-500">
            {quoteIndex + 1}/{MOTIVATIONAL_QUOTES.length}
          </span>
        </div>
      </div>

      {/* Daily Focus Card */}
      <div className="md:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#09152b] to-[#070e1e] border border-cyan-500/30 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>{isBn ? 'আজকের মূল ফোকাস (ONE THING)' : "Today's Core Focus Goal"}</span>
          </div>

          {currentDayRecord?.dailyFocus && !isEditingFocus && (
            <button
              onClick={() => setIsEditingFocus(true)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="Edit focus goal"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
            </button>
          )}
        </div>

        {isEditingFocus ? (
          <form onSubmit={handleSaveFocus} className="mt-2 space-y-3">
            <input
              type="text"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder={
                isBn
                  ? 'আজকের সবচেয়ে গুরুত্বপূর্ণ কাজটি কী যা অবশ্যই সম্পন্ন করতে হবে?'
                  : 'What is the single most important milestone today?'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {isBn ? 'একটি পরিষ্কার লক্ষ্য দিনটিকে সফল করবে।' : 'Clarity drives relentless execution.'}
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
              >
                {isBn ? 'সংরক্ষণ করুন' : 'Save Focus'}
              </button>
            </div>
          </form>
        ) : (
          <div className="my-2">
            <p className="text-base font-bold text-white bg-slate-900/60 p-3 rounded-xl border border-cyan-500/20">
              🎯 {currentDayRecord?.dailyFocus}
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{isBn ? 'লক্ষ্য অর্জন না হওয়া পর্যন্ত বিশ্রাম নেই।' : 'No rest until mission is accomplished.'}</span>
          {savedFeedback && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3 h-3" /> {isBn ? 'সংরক্ষিত!' : 'Saved!'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
