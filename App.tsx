
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { KpiManagement } from './components/pages/KpiManagement';
import { Team } from './components/pages/Team';
import { Settings } from './components/pages/Settings';
import type { User, Goal, KPI, Notification } from './types';
import { mockUsers, mockGoals, mockKpis } from './data/mockData';
import { NavigationItem } from './types';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/pages/AuthPage';
import { Paywall } from './components/ui/Paywall';
import { PricingPage } from './components/pages/PricingPage';


const App: React.FC = () => {
  const { user, company, subscriptionStatus, login, logout, signUp } = useAuth();

  const [activePage, setActivePage] = useState<NavigationItem>(() => {
    const hash = window.location.hash.replace('#/', '');
    const page = Object.values(NavigationItem).find(item => item.toLowerCase() === hash.toLowerCase());
    return page || NavigationItem.Dashboard;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [kpis, setKpis] = useState<KPI[]>(mockKpis);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const currentUser = useMemo(() => user ? users.find(u => u.id === user.id) : undefined, [user, users]);

  useEffect(() => {
    window.location.hash = `/${activePage}`;
  }, [activePage]);

  const addNotification = useCallback((message: string, actorId: string) => {
    if (currentUser?.id === actorId) return;

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      timestamp: new Date(),
      read: false,
      actorId,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
  }, [currentUser]);

  const handlePageChange = useCallback((page: NavigationItem) => {
    setActivePage(page);
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  }, []);
  
  const handleAddNewGoal = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
    addNotification(`added a new goal: "${newGoal.title}"`, newGoal.managerId);
  };
  
  const handleUpdateGoal = (updatedGoal: Goal, actorId?: string) => {
    setGoals(prevGoals => prevGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    const effectiveActorId = actorId || updatedGoal.managerId;
    addNotification(`updated the goal: "${updatedGoal.title}"`, effectiveActorId);
  };

  const handleAddNewKpi = (newKpi: KPI) => {
    setKpis(prev => [...prev, newKpi]);
    const goal = goals.find(g => g.id === newKpi.goalId);
    if (goal) {
        addNotification(`added a new KPI: "${newKpi.title}" to goal "${goal.title}"`, goal.managerId);
    }
  };

  const handleUpdateKpi = (updatedKpi: KPI, actorId?: string) => {
      setKpis(prevKpis => prevKpis.map(k => k.id === updatedKpi.id ? updatedKpi : k));
      const goal = goals.find(g => g.id === updatedKpi.goalId);
      if (goal) {
          const effectiveActorId = actorId || goal.managerId;
          addNotification(`updated the KPI: "${updatedKpi.title}"`, effectiveActorId);
      }
  };

  const handleLogProgress = useCallback((logData: { kpiId: string; year: number; month: number; actual: number; notes?: string }) => {
    let kpiTitle = '';
    let goalId = '';
    setKpis(prevKpis =>
      prevKpis.map(kpi => {
        if (kpi.id === logData.kpiId) {
          kpiTitle = kpi.title;
          goalId = kpi.goalId;
          const newProgress = [...kpi.monthlyProgress];
          const monthIndex = newProgress.findIndex(p => p.year === logData.year && p.month === logData.month);

          if (monthIndex > -1) {
            newProgress[monthIndex] = { ...newProgress[monthIndex], actual: logData.actual, notes: logData.notes };
          }
          return { ...kpi, monthlyProgress: newProgress };
        }
        return kpi;
      })
    );
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      addNotification(`logged progress for KPI: "${kpiTitle}"`, goal.managerId);
    }
  }, [goals, addNotification]);
  
  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleClearNotifications = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);


  const renderPage = () => {
    switch (activePage) {
      case NavigationItem.Dashboard:
        return <Dashboard kpis={kpis} users={users} goals={goals} />;
      case NavigationItem.KPIs:
        return <KpiManagement 
                    goals={goals} 
                    kpis={kpis} 
                    users={users} 
                    onAddNewGoal={handleAddNewGoal}
                    onUpdateGoal={handleUpdateGoal}
                    onAddNewKpi={handleAddNewKpi}
                    onUpdateKpi={handleUpdateKpi}
                    onLogProgress={handleLogProgress} />;
      case NavigationItem.Team:
        return <Team users={users} setUsers={setUsers} />;
      case NavigationItem.Settings:
        return <Settings currentUser={currentUser} setUsers={setUsers} theme={theme} setTheme={setTheme} kpis={kpis} onUpdateKpi={handleUpdateKpi} />;
      case NavigationItem.Pricing:
        return <PricingPage />;
      default:
        return <Dashboard kpis={kpis} users={users} goals={goals} />;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      const oldIndex = goals.findIndex(item => item.id === active.id);
      const newIndex = goals.findIndex(item => item.id === over.id);
      const reorderedGoals = arrayMove(goals, oldIndex, newIndex);
      setGoals(reorderedGoals);
    }
  };

  if (!user || !company) {
    return <AuthPage onLogin={login} onSignUp={signUp} />;
  }

  return (
    <div className={`${theme}`}>
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
        <Sidebar activePage={activePage} onPageChange={handlePageChange} currentUser={currentUser} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
              notifications={notifications}
              users={users}
              onMarkAsRead={handleMarkAsRead}
              onClearNotifications={handleClearNotifications}
              onLogout={logout}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 lg:p-12 relative">
            {subscriptionStatus === 'expired' && <Paywall onUpgrade={() => setActivePage(NavigationItem.Pricing)} />}
            <div className={subscriptionStatus === 'expired' ? 'blur-sm pointer-events-none' : ''}>
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={goals} strategy={verticalListSortingStrategy}>
                  {renderPage()}
                  </SortableContext>
              </DndContext>
            </div>
            </main>
        </div>
        </div>
    </div>
  );
};

export default App;