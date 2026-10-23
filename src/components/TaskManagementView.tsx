import React, { useState } from 'react';
import { DailyTask, TaskCategory } from '../types/challenge';
import { useChallenge } from '../context/ChallengeContext';
import {
  ListTodo,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Target,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { formatNumberByLang, toBengaliNumber } from '../utils/challenge';

export const TaskManagementView: React.FC = () => {
  const { state, addTask, editTask, deleteTask, reorderTasks, language } = useChallenge();
  const isBn = language === 'bn';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('custom');
  const [points, setPoints] = useState<number>(20);
  const [targetOutcome, setTargetOutcome] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  const categories: Array<{ id: TaskCategory; labelBn: string; labelEn: string }> = [
    { id: 'sleep', labelBn: 'ঘুম ও স্বাস্থ্য (Sleep)', labelEn: 'Sleep & Health' },
    { id: 'wake', labelBn: 'ভোর জাগরণ (Wake Up)', labelEn: 'Early Rising' },
    { id: 'prayer', labelBn: 'ইবাদত ও প্রার্থনা (Prayer)', labelEn: 'Spiritual / Prayer' },
    { id: 'deepwork', labelBn: 'ডিপ ওয়ার্ক (Deep Work)', labelEn: 'Deep Work' },
    { id: 'saas', labelBn: 'SaaS কোম্পানি (Business)', labelEn: 'SaaS Business' },
    { id: 'content', labelBn: 'কনটেন্ট ক্রিয়েশন (Content)', labelEn: 'Content Creation' },
    { id: 'fitness', labelBn: 'শরীরচর্চা (Fitness)', labelEn: 'Fitness & Health' },
    { id: 'learning', labelBn: 'শিক্ষা ও রিডিং (Learning)', labelEn: 'Learning & Books' },
    { id: 'custom', labelBn: 'কাস্টম অভ্যাস (Custom)', labelEn: 'Custom Habit' },
  ];

  const handleOpenAdd = () => {
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setCategory('custom');
    setPoints(20);
    setTargetOutcome('');
    setIsRequired(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setPoints(task.points);
    setTargetOutcome(task.targetOutcome || '');
    setIsRequired(task.isRequired);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTaskId) {
      editTask(editingTaskId, {
        title: title.trim(),
        description: description.trim(),
        category,
        points: Number(points) || 10,
        targetOutcome: targetOutcome.trim() || undefined,
        isRequired,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        points: Number(points) || 10,
        targetOutcome: targetOutcome.trim() || undefined,
        isRequired,
      });
    }

    setIsModalOpen(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTasks = [...state.tasks];
    const temp = newTasks[index - 1];
    newTasks[index - 1] = newTasks[index];
    newTasks[index] = temp;
    reorderTasks(newTasks);
  };

  const handleMoveDown = (index: number) => {
    if (index === state.tasks.length - 1) return;
    const newTasks = [...state.tasks];
    const temp = newTasks[index + 1];
    newTasks[index + 1] = newTasks[index];
    newTasks[index] = temp;
    reorderTasks(newTasks);
  };

  const totalPossiblePoints = state.tasks.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#0c162e] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListTodo className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {isBn ? 'দৈনিক অভ্যাসের তালিকা ও স্কোরিং' : 'Daily Tasks & Habits Configuration'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isBn ? 'টাস্ক ও অভ্যাস ম্যানেজমেন্ট' : 'Daily Task Management'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            {isBn
              ? 'আপনার প্রয়োজন অনুযায়ী প্রতিটি টাস্কের শিরোনাম, বিবরণ, পয়েন্ট এবং লক্ষ্য কাস্টমাইজ করুন।'
              : 'Customize titles, descriptions, targets, and point values for your 40-day routine.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950 font-bold" />
          <span>{isBn ? 'নতুন টাস্ক যোগ করুন' : 'Add New Task'}</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isBn ? 'মোট দৈনিক টাস্ক' : 'Daily Tasks'}</span>
          <span className="text-xl font-extrabold text-white">
            {formatNumberByLang(state.tasks.length, language)} {isBn ? 'টি' : 'tasks'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isBn ? 'টাস্ক বেস পয়েন্ট' : 'Base Task Points'}</span>
          <span className="text-xl font-extrabold text-amber-400">
            {formatNumberByLang(totalPossiblePoints, language)} {isBn ? 'পয়েন্ট' : 'pts'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isBn ? 'দৈনিক পূর্ণতা বোনাস' : 'Daily Completion Bonus'}</span>
          <span className="text-xl font-extrabold text-teal-400">
            +{formatNumberByLang(state.settings.dailyBonusPoints, language)} {isBn ? 'বোনাস' : 'Bonus'}
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {state.tasks.map((task, index) => (
          <div
            key={task.id}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c162c] to-[#080f1e] border border-slate-800 hover:border-slate-700 transition-all flex flex-wrap items-center justify-between gap-4 shadow-md"
          >
            <div className="flex items-start gap-3.5 flex-1 min-w-[260px]">
              <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                  aria-label="Move task up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === state.tasks.length - 1}
                  className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                  aria-label="Move task down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase text-[10px]">
                    {task.category}
                  </span>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                    +{formatNumberByLang(task.points, language)} {isBn ? 'পয়েন্ট' : 'pts'}
                  </span>
                  {task.targetOutcome && (
                    <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      🎯 {task.targetOutcome}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white">{task.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{task.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(task)}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                title={isBn ? 'টাস্ক এডিট করুন' : 'Edit task'}
                aria-label={`Edit ${task.title}`}
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                disabled={state.tasks.length <= 1}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors disabled:opacity-30"
                title={isBn ? 'টাস্ক মুছুন' : 'Delete task'}
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#0c162e] border border-amber-500/40 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingTaskId
                  ? (isBn ? 'টাস্ক সম্পাদনা করুন' : 'Edit Task')
                  : (isBn ? 'নতুন টাস্ক তৈরি করুন' : 'Create New Task')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isBn ? 'টাস্কের নাম / শিরোনাম *' : 'Task Title *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isBn ? 'যেমন: ভোর ৫:০০টায় ঘুম থেকে ওঠা' : 'e.g. Wake up early'}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isBn ? 'সংক্ষিপ্ত বিবরণ বা নিয়ম' : 'Description / Rule'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isBn ? 'যেমন: অ্যালার্ম বাজার সাথে সাথে কোনো স্নুজ ছাড়া বিছানা ত্যাগ করা।' : 'e.g. Leave bed immediately without snooze.'}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isBn ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isBn ? c.labelBn : c.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isBn ? 'পয়েন্ট মান (Points)' : 'Points Awarded'}
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    step={5}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isBn ? 'পরিমাপযোগ্য লক্ষ্য (Target Outcome)' : 'Target Outcome (Optional)'}
                </label>
                <input
                  type="text"
                  value={targetOutcome}
                  onChange={(e) => setTargetOutcome(e.target.value)}
                  placeholder={isBn ? 'যেমন: ভোর ৫:০০ AM / ৪ ঘণ্টা ডিপ ওয়ার্ক' : 'e.g. 5:00 AM / 4 hours'}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md shadow-amber-500/20"
                >
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
