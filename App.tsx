import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { KpiManagement } from './components/pages/KpiManagement';
import { Team } from './components/pages/Team';
import { Settings } from './components/pages/Settings';
import type { User, Goal, KPI, MonthlyProgress } from './types';
import { mockUsers, mockGoals, mockKpis } from './data/mockData';
import { NavigationItem } from './types';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<NavigationItem>(() => {
    // Simple router based on hash
    const hash = window.location.hash.replace('#/', '');
    const page = Object.values(NavigationItem).find(item => item.toLowerCase() === hash.toLowerCase());
    return page || NavigationItem.Dashboard;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Mock Data State ---
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [kpis, setKpis] = useState<KPI[]>(mockKpis);
  
  // --- Mock logged-in user (Super Admin) ---
  const currentUser = useMemo(() => users.find(u => u.role === 'Super Admin'), [users]);

  // Update URL hash on page change for basic routing/bookmarking
  useEffect(() => {
    window.location.hash = `/${activePage}`;
  }, [activePage]);

  const handlePageChange = useCallback((page: NavigationItem) => {
    setActivePage(page);
    // Close sidebar on navigation in mobile view
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  }, []);

  const handleLogProgress = useCallback((logData: { kpiId: string; year: number; month: number; actual: number; notes?: string }) => {
    setKpis(prevKpis =>
      prevKpis.map(kpi => {
        if (kpi.id === logData.kpiId) {
          const newProgress = [...kpi.monthlyProgress];
          const monthIndex = newProgress.findIndex(p => p.year === logData.year && p.month === logData.month);

          if (monthIndex > -1) {
            // Update existing month
            newProgress[monthIndex] = { ...newProgress[monthIndex], actual: logData.actual, notes: logData.notes };
          } else {
            // This case should ideally be handled by ensuring months are pre-initialized
            // But as a fallback, we can add it.
            newProgress.push({
              year: logData.year,
              month: logData.month,
              target: 0, // Or a default target
              actual: logData.actual,
              notes: logData.notes
            });
          }
          return { ...kpi, monthlyProgress: newProgress };
        }
        return kpi;
      })
    );
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case NavigationItem.Dashboard:
        return <Dashboard kpis={kpis} users={users} />;
      case NavigationItem.KPIs:
        return <KpiManagement goals={goals} kpis={kpis} users={users} setGoals={setGoals} setKpis={setKpis} onLogProgress={handleLogProgress} />;
      case NavigationItem.Team:
        return <Team users={users} setUsers={setUsers} />;
      case NavigationItem.Settings:
        return <Settings currentUser={currentUser} setUsers={setUsers} theme={theme} setTheme={setTheme} kpis={kpis} setKpis={setKpis} />;
      default:
        return <Dashboard kpis={kpis} users={users} />;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  return (
    <div className={`${theme}`}>
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
        <Sidebar activePage={activePage} onPageChange={handlePageChange} currentUser={currentUser} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 lg:p-12">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={goals} strategy={verticalListSortingStrategy}>
                {renderPage()}
                </SortableContext>
            </DndContext>
            </main>
        </div>
        </div>
    </div>
  );
};

export default App;