import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { Flame, Gem, Menu, Sparkles, Globe, Calendar, CheckCircle2 } from 'lucide-react';
import { formatNumberByLang } from '../utils/challenge';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, onNavigate, currentView }) => {
  const { currentDay, state, language, setLanguage, setActiveDayNumber } = useChallenge();
  const isBn = language === 'bn';

  const handleGoToToday = () => {
    setActiveDayNumber(currentDay);
    onNavigate('tasks');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070c18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile menu button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {isBn ? '৪০ দিনের চ্যালেঞ্জ' : '40-Day Challenge'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isBn ? 'ব্যক্তিগত শৃঙ্খলা ও প্রবৃদ্ধি ট্র্যাকার' : 'Personal Discipline SaaS'}
              </p>
            </div>
          </button>
        </div>

        {/* Center: Current Day pill badge */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-sm shadow-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-semibold text-slate-300">
              {isBn ? 'বর্তমান দিন:' : 'Current Day:'}
            </span>
            <span className="text-sm font-extrabold text-amber-400 tracking-wide">
              {isBn
                ? `দিন ${formatNumberByLang(currentDay, 'bn')} / ${formatNumberByLang(state.settings.totalDays, 'bn')}`
                : `DAY ${currentDay} OF ${state.settings.totalDays}`}
            </span>
          </div>
        </div>

        {/* Right: Streak, Points, Language, Today button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick jump to Today */}
          <button
            onClick={handleGoToToday}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              currentView === 'tasks'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
            title="Open today's task sheet"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{isBn ? 'আজকের কাজ' : "Today's Tasks"}</span>
          </button>

          {/* Streak pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400"
            title={`${state.currentStreak} day streak`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="text-xs sm:text-sm font-black">
              {formatNumberByLang(state.currentStreak, language)}
            </span>
            <span className="text-[11px] font-medium hidden sm:inline text-orange-300/80">
              {isBn ? 'স্ট্রিক' : 'streak'}
            </span>
          </div>

          {/* Points pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400"
            title={`${state.totalPoints} total points`}
          >
            <Gem className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-black">
              {formatNumberByLang(state.totalPoints, language)}
            </span>
            <span className="text-[11px] font-medium hidden sm:inline text-amber-300/80">
              {isBn ? 'পয়েন্ট' : 'pts'}
            </span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(isBn ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-bold transition-colors"
            title={isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isBn ? 'EN' : 'বাং'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
