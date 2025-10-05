import React, { useMemo } from 'react';
import type { KPI, User, Goal } from '../../types';
import { Card } from '../ui/Card';
import { KpiProgressChart } from '../charts/KpiProgressChart';
import { ProgressBar } from '../ui/ProgressBar';

interface DashboardProps {
  kpis: KPI[];
  users: User[];
  goals: Goal[];
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
        <div>
          <p className="text-sm text-light-text">{currentMonthName} Progress</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">{kpi.title}</h3>
        </div>
        {user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />}
      </div>
      <div className="mt-4 flex-grow">
        <div className="flex justify-between items-end">
          <p className="text-2xl font-bold text-primary">
            {kpi.unit}{currentValue.toLocaleString()}
          </p>
          <p className="text-sm text-light-text">
            Target: {kpi.unit}{targetValue.toLocaleString()}
          </p>
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


export const Dashboard: React.FC<DashboardProps> = ({ kpis, users, goals }) => {
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
            if (monthData && monthData.target > 0) {
                const progress = (monthData.actual / monthData.target);
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
        const managerIds = [...new Set(goals.map(goal => goal.managerId))];

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

                // Only consider KPIs with weight for the average calculation
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
    }, [goals, kpis, users]);

    const mainKpi = kpis.find(k => k.id === 'kpi-1');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
            <h4 className="text-light-text font-medium">Total KPIs</h4>
            <p className="text-4xl font-bold text-primary">{totalKpis}</p>
        </Card>
        <Card>
            <h4 className="text-light-text font-medium">KPIs On Track (Current Month)</h4>
            <p className="text-4xl font-bold text-accent">{onTrackKpis}</p>
        </Card>
        <Card>
            <h4 className="text-light-text font-medium">Overall Progress (Current Month)</h4>
            <p className="text-4xl font-bold text-secondary">{overallProgress.toFixed(0)}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-dark-text">Monthly Sales Revenue</h2>
            {mainKpi && <KpiProgressChart progress={mainKpi.monthlyProgress} unit={mainKpi.unit}/>}
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