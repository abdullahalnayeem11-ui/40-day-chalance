import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { Award, Crown, Flame, Footprints, Gem, Medal, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import { formatNumberByLang } from '../utils/challenge';

export const AchievementPopup: React.FC = () => {
  const { unlockedAchievementPopup, dismissAchievementPopup, language } = useChallenge();

  if (!unlockedAchievementPopup) return null;

  const isBn = language === 'bn';
  const title = isBn ? unlockedAchievementPopup.titleBn : unlockedAchievementPopup.titleEn;
  const desc = isBn ? unlockedAchievementPopup.descriptionBn : unlockedAchievementPopup.descriptionEn;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'footprints':
        return <Footprints className="w-12 h-12 text-amber-400 animate-bounce" />;
      case 'flame':
        return <Flame className="w-12 h-12 text-orange-500 animate-pulse" />;
      case 'shield-check':
        return <ShieldCheck className="w-12 h-12 text-emerald-400" />;
      case 'award':
        return <Award className="w-12 h-12 text-cyan-400" />;
      case 'medal':
        return <Medal className="w-12 h-12 text-yellow-400" />;
      case 'zap':
        return <Zap className="w-12 h-12 text-amber-400 animate-pulse" />;
      case 'crown':
        return <Crown className="w-12 h-12 text-yellow-300 animate-bounce" />;
      case 'sparkles':
        return <Sparkles className="w-12 h-12 text-purple-400" />;
      case 'gem':
        return <Gem className="w-12 h-12 text-teal-400" />;
      default:
        return <Award className="w-12 h-12 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f1d3a] to-[#091124] border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={dismissAchievementPopup}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-yellow-500/30 border border-amber-400/40 shadow-inner">
          {renderIcon(unlockedAchievementPopup.icon)}
        </div>

        <div className="inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 rounded-full border border-amber-500/30">
          {isBn ? 'নতুন অর্জন আনলক!' : 'Achievement Unlocked!'}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 gold-gradient-text">
          {title}
        </h3>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {desc}
        </p>

        <div className="flex items-center justify-center gap-2 py-2 px-4 mb-6 rounded-xl bg-slate-900/80 border border-slate-700/60">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-slate-200">
            {isBn ? 'বোনাস পয়েন্ট অর্জন:' : 'Points Earned:'}
          </span>
          <span className="text-base font-extrabold text-amber-400">
            +{formatNumberByLang(unlockedAchievementPopup.pointsReward, language)} {isBn ? 'পয়েন্ট' : 'pts'}
          </span>
        </div>

        <button
          onClick={dismissAchievementPopup}
          className="w-full py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
        >
          {isBn ? 'চমৎকার! এগিয়ে যাও' : 'Awesome! Keep Going'}
        </button>
      </div>
    </div>
  );
};
