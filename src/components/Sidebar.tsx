import React from 'react';
import { useChallenge } from '../context/ChallengeContext';
import {
  LayoutDashboard,
  CheckSquare,
  Send,
  Calendar,
  BarChart3,
  Award,
  History,
  ListTodo,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  X,
} from 'lucide-react';
import { formatNumberByLang } from '../utils/challenge';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  collapsed,
  onToggleCollapse,
}) => {
  const { currentDay, language, state, stats } = useChallenge();
  const isBn = language === 'bn';

  const navItems = [
    {
      id: 'dashboard',
      labelBn: 'ড্যাশবোর্ড',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks',
      labelBn: 'আজকের কাজ',
      labelEn: "Today's Tasks",
      icon: CheckSquare,
      badge: isBn ? `দিন ${formatNumberByLang(currentDay, 'bn')}` : `Day ${currentDay}`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'submit',
      labelBn: 'অগ্রগতি সাবমিট',
      labelEn: 'Submit Progress',
      icon: Send,
      badge: null,
    },
    {
      id: 'calendar',
      labelBn: '৪০ দিনের ক্যালেন্ডার',
      labelEn: '40-Day Calendar',
      icon: Calendar,
      badge: isBn ? `${formatNumberByLang(stats.completedDays, 'bn')}/৪০` : `${stats.completedDays}/40`,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    {
      id: 'analytics',
      labelBn: 'অগ্রগতি অ্যানালিটিক্স',
      labelEn: 'Progress Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'rewards',
      labelBn: 'রিওয়ার্ড ও অর্জন',
      labelEn: 'Rewards & Badges',
      icon: Award,
      badge: `${state.achievements.filter((a) => a.isUnlocked).length}/${state.achievements.length}`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'history',
      labelBn: 'দৈনিক হিস্ট্রি',
      labelEn: 'Daily History',
      icon: History,
      badge: null,
    },
    {
      id: 'task-settings',
      labelBn: 'টাস্ক ম্যানেজমেন্ট',
      labelEn: 'Task Management',
      icon: ListTodo,
      badge: formatNumberByLang(state.tasks.length, language),
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'settings',
      labelBn: 'সেটিংস ও সেটআপ',
      labelEn: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a1022] border-r border-slate-800/80 text-slate-300 select-none">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/60">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isBn ? 'ন্যাভিগেশন মেনু' : 'Navigation Menu'}
            </span>
          </div>
        )}
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 ml-auto transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const label = isBn ? item.labelBn : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border-l-4 border-amber-400 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 hover:bg-slate-900/60'
              }`}
              title={label}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-cyan-400'
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between text-left overflow-hidden">
                  <span className="truncate">{label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ml-2 ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom streak widget */}
      {!collapsed && (
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0e172e] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              {isBn ? 'স্ট্রিক স্থিতি' : 'Streak Health'}
            </span>
            <span className="text-xs font-extrabold text-orange-400">
              {formatNumberByLang(state.currentStreak, language)} {isBn ? 'দিন' : 'days'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(5, (state.currentStreak / 7) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {isBn
              ? 'পরবর্তী অর্জনের জন্য প্রতিদিন অন্তত ১টি সাবমিশন বজায় রাখুন।'
              : 'Keep submitting daily to unlock higher milestone badges.'}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 sticky top-[57px] h-[calc(100vh-57px)] ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
