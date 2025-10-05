import React, { useMemo } from 'react';
import type { KPI, User, Goal } from '../../types';
import { UserRole } from '../../types';
import { Card } from '../ui/Card';
import { KpiProgressChart } from '../charts/KpiProgressChart';
import { ProgressBar } from '../ui/ProgressBar';
import { KpiStatusBadge } from '../ui/KpiStatusBadge';

interface DashboardProps {
  kpis: KPI[];
  users: User[];
  goals: Goal[];
  currentUser?: User;
}

const KpiCard: React.FC<{ kpi: KPI, user?: User }> = ({ kpi, user }) => {
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    return kpi.monthlyProgress.find(p => p.year === currentYear && p.month === currentMonth);
  }, [kpi.monthlyProgress]);

  const currentValue = currentMonthData?.actual ?? 0;
  const targetValue = currentMonthData?.target ?? 0;
  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-start">
        <div className="flex-grow mr-2">
          <p className="text-sm text-light-text">{currentMonthName} Progress</p>
          <div className="flex items-center flex-wrap gap-x-2 mt-1">
             <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">{kpi.title}</h3>
             <KpiStatusBadge actual={currentValue} target={targetValue} />
          </div>
        </div>
        {user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
      </div>
      <div className="mt-4 flex-grow">
        <div className="flex justify-between items-baseline">
            <div>
                <span className="text-sm text-light-text">Actual</span>
                <p className="text-2xl font-bold text-primary dark:text-white">
                    {kpi.unit}{currentValue.toLocaleString()}
                </p>
            </div>
            <div className="text-right">
                <span className="text-sm text-light-text">Target</span>
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {kpi.unit}{targetValue.toLocaleString()}
                </p>
            </div>
        </div>
        <ProgressBar progress={progress} className="mt-2" customColor={kpi.progressBarColor} />
      </div>
    </Card>
  );
};

interface ManagerAchievement {
  manager: User;
  totalKpisManaged: number;
  teamSize: number;
  averageProgress: number;
}

const ManagerCard: React.FC<{ achievement: ManagerAchievement }> = ({ achievement }) => {
  const { manager, teamSize, totalKpisManaged, averageProgress } = achievement;
  return (
    <Card>
      <div className="flex items-center mb-4">
        <img src={manager.avatar} alt={manager.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-dark-text">{manager.name}</h3>
          <p className="text-sm text-light-text">{manager.division}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">KPIs Managed</span>
          <span className="font-semibold text-gray-800 dark:text-dark-text">{totalKpisManaged}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Team Size</span>
          <span className="font-semibold text-gray-800 dark:text-dark-text">{teamSize}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Avg. Progress (This Month)</span>
            <span className="font-semibold text-gray-800 dark:text-dark-text">{averageProgress.toFixed(0)}%</span>
          </div>
          <ProgressBar progress={averageProgress} />
        </div>
      </div>
    </Card>
  );
};

const StatCardIcon: React.FC<{ icon: React.ElementType, color: string }> = ({ icon: Icon, color }) => (
    <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
    </div>
);

const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);


export const Dashboard: React.FC<DashboardProps> = ({ kpis, users, goals, currentUser }) => {
    const totalKpis = kpis.length;
    const { onTrackKpis, overallProgress } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        let onTrackCount = 0;
        let totalProgress = 0;
        let kpisWithProgressCount = 0;

        kpis.forEach(kpi => {
            const monthData = kpi.monthlyProgress.find(p => p.year === currentYear && p.month === currentMonth);
            const target = monthData?.target ?? 0;
            if (monthData && target > 0) {
                const progress = (monthData.actual / target);
                if (progress >= 0.75) { // Assuming "on track" is 75% or more of the target
                    onTrackCount++;
                }
                totalProgress += progress;
                kpisWithProgressCount++;
            }
        });
        
        return {
            onTrackKpis: onTrackCount,
            overallProgress: kpisWithProgressCount > 0 ? (totalProgress / kpisWithProgressCount) * 100 : 0,
        };
    }, [kpis]);
    
    const managerAchievements = useMemo(() => {
        let managerIds = [...new Set(goals.map(goal => goal.managerId))];

        // If user is not an Admin, only show their own manager card (if they are a manager)
        if (currentUser && currentUser.role !== UserRole.Admin) {
            managerIds = managerIds.filter(id => id === currentUser.id);
        }

        return managerIds.map(managerId => {
            const manager = users.find(u => u.id === managerId);
            if (!manager) return null;

            const managerGoals = goals.filter(g => g.managerId === managerId);
            
            const staffIds = new Set<string>();
            managerGoals.forEach(g => {
                g.staffIds.forEach(id => staffIds.add(id));
            });
            const teamSize = staffIds.size;
            
            const managerGoalIds = managerGoals.map(g => g.id);
            const managerKpis = kpis.filter(k => managerGoalIds.includes(k.goalId));
            const totalKpisManaged = managerKpis.length;
            
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            let totalWeightedProgressSum = 0;
            let totalWeightSum = 0;
            
            managerKpis.forEach(kpi => {
                const monthData = kpi.monthlyProgress.find(p => p.year === currentYear && p.month === currentMonth);
                const kpiWeight = kpi.weight || 0;

                if (monthData && kpiWeight > 0) {
                    const currentValue = monthData.actual ?? 0;
                    const targetValue = monthData.target ?? 0;
                    const kpiProgress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
                    
                    totalWeightedProgressSum += kpiProgress * kpiWeight;
                    totalWeightSum += kpiWeight;
                }
            });
            
            const averageProgress = totalWeightSum > 0 ? totalWeightedProgressSum / totalWeightSum : 0;

            return {
                manager,
                teamSize,
                totalKpisManaged,
                averageProgress,
            };
        }).filter((a): a is ManagerAchievement => a !== null);
    }, [goals, kpis, users, currentUser]);

    const mainKpi = kpis.find(k => k.id === 'kpi-1');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text mb-6">Welcome back, {currentUser?.name.split(' ')[0]}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-light-text font-medium">Total KPIs</h4>
                    <p className="text-4xl font-bold text-primary dark:text-white">{totalKpis}</p>
                </div>
                <StatCardIcon icon={ChartBarIcon} color="bg-primary/80" />
            </div>
        </Card>
        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-light-text font-medium">On Track (This Month)</h4>
                    <p className="text-4xl font-bold text-accent">{onTrackKpis}</p>
                </div>
                 <StatCardIcon icon={CheckCircleIcon} color="bg-accent/80" />
            </div>
        </Card>
        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-light-text font-medium">Overall Progress</h4>
                    <p className="text-4xl font-bold text-secondary">{overallProgress.toFixed(0)}%</p>
                </div>
                <StatCardIcon icon={TrendingUpIcon} color="bg-secondary/80" />
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-dark-text">Monthly Sales Revenue</h2>
            {mainKpi && <KpiProgressChart progress={mainKpi.monthlyProgress} unit={mainKpi.unit} />}
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">Your KPIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map(kpi => {
                const owner = users.find(u => u.id === kpi.ownerId);
                return <KpiCard key={kpi.id} kpi={kpi} user={owner} />;
            })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">Manager Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerAchievements.map(achievement => (
                <ManagerCard key={achievement.manager.id} achievement={achievement} />
            ))}
        </div>
      </div>
    </div>
  );
};