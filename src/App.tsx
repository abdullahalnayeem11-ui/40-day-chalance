/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChallengeProvider, useChallenge } from './context/ChallengeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TodayTasksView } from './components/TodayTasksView';
import { SubmitProgressView } from './components/SubmitProgressView';
import { CalendarGrid } from './components/CalendarGrid';
import { AnalyticsView } from './components/AnalyticsView';
import { RewardsView } from './components/RewardsView';
import { DailyHistoryView } from './components/DailyHistoryView';
import { TaskManagementView } from './components/TaskManagementView';
import { SettingsView } from './components/SettingsView';
import { AchievementPopup } from './components/AchievementPopup';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { setActiveDayNumber, currentDay } = useChallenge();

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSubmitForDay = (dayNum: number) => {
    setActiveDayNumber(dayNum);
    setCurrentView('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'tasks':
        return <TodayTasksView onNavigateToSubmit={() => handleNavigate('submit')} />;
      case 'submit':
        return (
          <SubmitProgressView
            onNavigateToCalendar={() => handleNavigate('calendar')}
            onNavigateToDashboard={() => handleNavigate('dashboard')}
          />
        );
      case 'calendar':
        return <CalendarGrid onNavigateToSubmit={handleNavigateToSubmitForDay} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'rewards':
        return <RewardsView />;
      case 'history':
        return <DailyHistoryView onNavigateToSubmit={handleNavigateToSubmitForDay} />;
      case 'task-settings':
        return <TaskManagementView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <div className="flex-1 flex w-full">
        {/* Collapsible Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
          {renderView()}
        </main>
      </div>

      {/* Global Achievement Celebration Modal */}
      <AchievementPopup />
    </div>
  );
}

export default function App() {
  return (
    <ChallengeProvider>
      <AppContent />
    </ChallengeProvider>
  );
}
