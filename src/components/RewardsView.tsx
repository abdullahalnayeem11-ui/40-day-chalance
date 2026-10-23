import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  Award,
  Crown,
  Flame,
  Footprints,
  Gem,
  Lock,
  Medal,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { formatNumberByLang, toBengaliNumber } from '../utils/challenge';

export const RewardsView: React.FC = () => {
  const { state, language, stats } = useChallenge();
  const isBn = language === 'bn';

  const unlockedCount = state.achievements.filter((a) => a.isUnlocked).length;
  const totalCount = state.achievements.length;

  // Level Progression: Level 1 (0-299 pts), Level 2 (300-799 pts), Level 3 (800-1499 pts), Level 4 (1500-2499 pts), Level 5 (2500+ pts)
  const getLevelInfo = (pts: number) => {
    if (pts < 300) {
      return {
        level: 1,
        titleBn: 'লেভেল ১: উদ্যমী পথিক (Seeker)',
        titleEn: 'Level 1: The Seeker',
        nextTarget: 300,
        color: 'from-blue-500 to-cyan-400',
      };
    } else if (pts < 800) {
      return {
        level: 2,
        titleBn: 'লেভেল ২: সুশৃঙ্খল যোদ্ধা (Disciplined)',
        titleEn: 'Level 2: The Disciplined',
        nextTarget: 800,
        color: 'from-cyan-400 to-teal-400',
      };
    } else if (pts < 1500) {
      return {
        level: 3,
        titleBn: 'লেভেল ৩: অটল সাধক (Warrior)',
        titleEn: 'Level 3: Consistency Warrior',
        nextTarget: 1500,
        color: 'from-amber-400 to-orange-500',
      };
    } else if (pts < 2500) {
      return {
        level: 4,
        titleBn: 'লেভেল ৪: ধারাবাহিকতার ওস্তাদ (Master)',
        titleEn: 'Level 4: Habit Master',
        nextTarget: 2500,
        color: 'from-purple-500 to-pink-500',
      };
    } else {
      return {
        level: 5,
        titleBn: 'লেভেল ৫: অপরাজেয় টাইটান (Titan)',
        titleEn: 'Level 5: 40-Day Titan',
        nextTarget: 5000,
        color: 'from-yellow-400 via-amber-400 to-red-500',
      };
    }
  };

  const levelInfo = getLevelInfo(state.totalPoints);
  const levelProgressPct = Math.min(100, Math.round((state.totalPoints / levelInfo.nextTarget) * 100));

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const size = 'w-7 h-7';
    if (!isUnlocked) {
      return <Lock className={`${size} text-slate-500`} />;
    }

    switch (iconName) {
      case 'footprints':
        return <Footprints className={`${size} text-amber-400`} />;
      case 'flame':
        return <Flame className={`${size} text-orange-500`} />;
      case 'shield-check':
        return <ShieldCheck className={`${size} text-emerald-400`} />;
      case 'award':
        return <Award className={`${size} text-cyan-400`} />;
      case 'medal':
        return <Medal className={`${size} text-yellow-400`} />;
      case 'zap':
        return <Zap className={`${size} text-amber-400`} />;
      case 'crown':
        return <Crown className={`${size} text-yellow-300`} />;
      case 'sparkles':
        return <Sparkles className={`${size} text-purple-400`} />;
      case 'gem':
        return <Gem className={`${size} text-teal-400`} />;
      default:
        return <Award className={`${size} text-amber-400`} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0f1d3a] via-[#0a1226] to-[#070c18] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isBn ? 'গ্যামিফিকেশন ও রিওয়ার্ড গ্যালারি' : 'Gamification & Rewards Gallery'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {isBn ? 'ভার্চুয়াল অর্জন ও পদক সংগ্রহ' : 'Virtual Achievements & Badges'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {isBn
                ? 'শৃঙ্খলা বজায় রেখে প্রতিদিন কাজ সম্পন্ন করুন, স্ট্রিক বাড়ান এবং নতুন পদক ও পয়েন্ট আনলক করুন।'
                : 'Conquer tasks daily, maintain unyielding consistency, and unlock legendary milestones.'}
            </p>
          </div>

          {/* Points summary badge */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Gem className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">
                {isBn ? 'মোট অর্জিত পয়েন্ট' : 'Total Points'}
              </span>
              <span className="text-2xl font-black text-amber-400">
                {formatNumberByLang(state.totalPoints, language)}
              </span>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400">
                {isBn ? 'আপনার বর্তমান র‍্যাঙ্ক:' : 'Current Rank:'}
              </span>
              <span className="text-sm font-black text-white">
                {isBn ? levelInfo.titleBn : levelInfo.titleEn}
              </span>
            </div>

            <span className="text-xs font-bold text-amber-400">
              {formatNumberByLang(state.totalPoints, language)} / {formatNumberByLang(levelInfo.nextTarget, language)}{' '}
              {isBn ? 'পয়েন্ট' : 'pts'} ({levelProgressPct}%)
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className={`h-full bg-gradient-to-r ${levelInfo.color} rounded-full transition-all duration-700`}
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'সকল চ্যালেঞ্জ ব্যাজ ও মাইলস্টোন' : 'All Milestone Badges'}</span>
          </h3>

          <span className="text-xs font-bold text-slate-400">
            {isBn ? 'আনলক হয়েছে' : 'Unlocked'}: {unlockedCount} / {totalCount}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.achievements.map((ach) => {
            const isUnlocked = ach.isUnlocked;

            return (
              <div
                key={ach.id}
                className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-[#0c1830] to-[#070e20] border-amber-500/40 shadow-xl shadow-amber-500/5'
                    : 'bg-[#091022]/60 border-slate-800/80 opacity-70 hover:opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-500/20 to-orange-500/30 border-amber-500/40 shadow-inner'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      {renderIcon(ach.icon, isUnlocked)}
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                          isUnlocked
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        +{formatNumberByLang(ach.pointsReward, language)} {isBn ? 'পয়েন্ট' : 'pts'}
                      </span>

                      {isUnlocked && (
                        <span className="block text-[10px] text-emerald-400 font-semibold mt-1">
                          ✓ {isBn ? 'আনলক হয়েছে' : 'Unlocked'}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4
                    className={`text-base font-bold mb-1 ${
                      isUnlocked ? 'text-white gold-gradient-text' : 'text-slate-300'
                    }`}
                  >
                    {isBn ? ach.titleBn : ach.titleEn}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isBn ? ach.descriptionBn : ach.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {ach.category === 'days'
                      ? isBn ? `শর্ত: ${toBengaliNumber(ach.requirementThreshold)} দিন সম্পন্ন` : `Req: ${ach.requirementThreshold} days completed`
                      : ach.category === 'streak'
                      ? isBn ? `শর্ত: ${toBengaliNumber(ach.requirementThreshold)} দিনের স্ট্রিক` : `Req: ${ach.requirementThreshold}-day streak`
                      : isBn ? `শর্ত: ${toBengaliNumber(ach.requirementThreshold)} পয়েন্ট অর্জন` : `Req: ${ach.requirementThreshold} total points`}
                  </span>

                  {isUnlocked && ach.unlockedAt && (
                    <span className="text-slate-400">
                      {new Date(ach.unlockedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
