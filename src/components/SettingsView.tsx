import React, { useState } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  Settings as SettingsIcon,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Upload,
  RefreshCcw,
  ShieldAlert,
  Check,
  Globe,
  Sliders,
} from 'lucide-react';
import { getDateForDayNumber } from '../utils/challenge';

export const SettingsView: React.FC = () => {
  const {
    state,
    updateSettings,
    resetChallenge,
    exportData,
    importData,
    language,
    setLanguage,
  } = useChallenge();

  const isBn = language === 'bn';

  const [challengeNameBn, setChallengeNameBn] = useState(state.settings.challengeNameBn);
  const [challengeNameEn, setChallengeNameEn] = useState(state.settings.challengeNameEn);
  const [startDate, setStartDate] = useState(state.settings.startDate);
  const [timezone, setTimezone] = useState(state.settings.timezone);
  const [dailyBonus, setDailyBonus] = useState(state.settings.dailyBonusPoints);
  const [allowEdit, setAllowEdit] = useState(state.settings.allowEditSubmissions);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // Reset dialog states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetOption, setResetOption] = useState<'keep_tasks' | 'full_wipe'>('keep_tasks');

  const timezones = [
    'Asia/Dhaka',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Riyadh',
    'Asia/Singapore',
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'UTC',
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      challengeNameBn: challengeNameBn.trim(),
      challengeNameEn: challengeNameEn.trim(),
      startDate,
      timezone,
      dailyBonusPoints: Number(dailyBonus) || 50,
      allowEditSubmissions: allowEdit,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `40-day-challenge-backup-${startDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExecuteImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importData(importJsonText);
    if (ok) {
      setImportFeedback(isBn ? '✓ ব্যাকআপ সফলভাবে পুনরুদ্ধার করা হয়েছে!' : '✓ Backup restored successfully!');
      setImportJsonText('');
    } else {
      setImportFeedback(isBn ? '✕ অবৈধ JSON ফাইল।' : '✕ Invalid JSON data.');
    }
    setTimeout(() => setImportFeedback(null), 3500);
  };

  const handleConfirmReset = () => {
    resetChallenge({
      clearAllData: resetOption === 'full_wipe',
      newStartDate: startDate,
    });
    setShowResetModal(false);
  };

  const calculatedEndDate = getDateForDayNumber(startDate, state.settings.totalDays);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c162e] border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isBn ? 'সিস্টেম ও চ্যালেঞ্জ কনফিগারেশন' : 'System & Challenge Setup'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isBn ? 'সেটিংস ও সময়সূচি' : 'Challenge Settings'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isBn
              ? 'চ্যালেঞ্জের শুরুর তারিখ, টাইমজোন, দৈনিক বোনাস পয়েন্ট ও ভাষা নিয়ন্ত্রণ করুন।'
              : 'Configure challenge schedule, timezone, daily bonus rules, and preferences.'}
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c162c] to-[#080f1e] border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>{isBn ? 'চ্যালেঞ্জ পরামিতি (Parameters)' : 'Challenge Parameters'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isBn ? 'চ্যালেঞ্জের নাম (বাংলা)' : 'Challenge Name (Bengali)'}
            </label>
            <input
              type="text"
              value={challengeNameBn}
              onChange={(e) => setChallengeNameBn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isBn ? 'চ্যালেঞ্জের নাম (ইংরেজি)' : 'Challenge Name (English)'}
            </label>
            <input
              type="text"
              value={challengeNameEn}
              onChange={(e) => setChallengeNameEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Start Date & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{isBn ? 'শুরুর তারিখ (Start Date) *' : 'Start Date *'}</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-300 focus:outline-none focus:border-amber-400"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isBn ? `৪০তম দিন শেষ হবে: ${calculatedEndDate}` : `Day 40 ends on: ${calculatedEndDate}`}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isBn ? 'টাইমজোন (Timezone)' : 'Timezone'}</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isBn ? 'ডিফল্ট: Asia/Dhaka (বাংলাদেশ সময়)' : 'Default: Asia/Dhaka'}
            </span>
          </div>
        </div>

        {/* Daily Completion Bonus & Allow Edit Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? '১০০% টাস্ক পূর্ণতা বোনাস পয়েন্ট' : 'Full Completion Bonus Points'}</span>
            </label>
            <input
              type="number"
              min={0}
              max={200}
              step={10}
              value={dailyBonus}
              onChange={(e) => setDailyBonus(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isBn ? 'প্রতিদিনের সব টাস্ক সম্পন্ন করলে এই বোনাস মিলবে।' : 'Awarded only when 100% tasks are completed.'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{isBn ? 'ভাষা নির্বাচন (Language)' : 'Default Language'}</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  language === 'bn'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Save button and status */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> {isBn ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings successfully saved!'}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            {isBn ? 'সেটিংস সংরক্ষণ করুন' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Backup & Data Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{isBn ? 'ডাটা ব্যাকআপ ও রিস্টোর' : 'Data Backup & Restore'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {isBn ? 'JSON ব্যাকআপ ডাউনলোড' : 'Download JSON Backup'}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {isBn
                  ? 'আপনার সমস্ত ৪০ দিনের টাস্ক, সাবমিশন হিস্ট্রি ও অর্জনের ব্যাকআপ ফাইল ডাউনলোড করুন।'
                  : 'Save all your daily logs, task progress, and achievement history into a local JSON file.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isBn ? 'ব্যাকআপ ডাউনলোড করুন (.json)' : 'Export Backup File'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white">
              {isBn ? 'ব্যাকআপ ফাইল রিস্টোর' : 'Restore from JSON'}
            </h4>
            <textarea
              rows={2}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={isBn ? 'ব্যাকআপ JSON কোড এখানে পেস্ট করুন...' : 'Paste JSON content here to restore...'}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-cyan-400"
            />
            <div className="flex items-center justify-between">
              {importFeedback && (
                <span className="text-xs font-bold text-cyan-400">{importFeedback}</span>
              )}
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={!importJsonText.trim()}
                className="ml-auto py-1.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-30 transition-colors cursor-pointer"
              >
                {isBn ? 'রিস্টোর করুন' : 'Restore Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Challenge */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">
            {isBn ? 'বিপদজনক অঞ্চল (Danger Zone): চ্যালেঞ্জ রিসেট' : 'Danger Zone: Reset Challenge'}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {isBn
            ? 'আপনি যদি নতুন করে ৪০ দিনের চ্যালেঞ্জ শুরু করতে চান, তবে এখান থেকে রিসেট করতে পারবেন।'
            : 'Resetting the challenge allows restarting your 40 days. You can choose whether to keep your customized daily tasks or perform a complete wipe.'}
        </p>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-500/40 transition-colors cursor-pointer"
        >
          {isBn ? 'চ্যালেঞ্জ রিসেট করুন...' : 'Reset Challenge...'}
        </button>
      </div>

      {/* Confirmation Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0d172e] border-2 border-rose-500/40 shadow-2xl text-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>{isBn ? 'চ্যালেঞ্জ রিসেট নিশ্চিতকরণ' : 'Confirm Challenge Reset'}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300">
              {isBn
                ? 'অনুগ্রহ করে নির্বাচন করুন কীভাবে রিসেট করতে চান:'
                : 'Please select how you want to reset your challenge:'}
            </p>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-700 bg-slate-900/60 cursor-pointer">
                <input
                  type="radio"
                  name="resetOption"
                  checked={resetOption === 'keep_tasks'}
                  onChange={() => setResetOption('keep_tasks')}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isBn ? 'কাস্টম টাস্ক রেখে প্রগ্রেস রিসেট' : 'Keep Custom Tasks (Reset Progress Only)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? 'আপনার সাজানো কাজের তালিকা অপরিবর্তিত থাকবে।' : 'Preserves your custom tasks and categories.'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-rose-900/50 bg-rose-950/20 cursor-pointer">
                <input
                  type="radio"
                  name="resetOption"
                  checked={resetOption === 'full_wipe'}
                  onChange={() => setResetOption('full_wipe')}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-rose-300 block">
                    {isBn ? 'সম্পূর্ণ ফ্যাক্টরি রিসেট (Full Reset)' : 'Complete Wipe (Factory Defaults)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? 'সমস্ত সাবমিশন, পয়েন্ট এবং কাস্টম টাস্ক মুছে যাবে।' : 'Resets everything to initial 6 default tasks.'}
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                {isBn ? 'হ্যাঁ, রিসেট করুন' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
