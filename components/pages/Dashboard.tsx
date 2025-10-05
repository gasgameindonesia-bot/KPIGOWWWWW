import React, { useState, useMemo } from 'react';
import type { KPI, User } from '../../types';
import { Card } from '../ui/Card';
import { KpiProgressChart } from '../charts/KpiProgressChart';
import { ProgressBar } from '../ui/ProgressBar';
import { LogProgressModal } from './LogProgressModal';

interface DashboardProps {
  kpis: KPI[];
  users: User[];
  onLogProgress: (logData: { kpiId: string; year: number; month: number; actual: number; notes?: string }) => void;
}

const KpiCard: React.FC<{ kpi: KPI, user?: User, onLogProgressClick: (kpi: KPI) => void }> = ({ kpi, user, onLogProgressClick }) => {
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
          <h3 className="text-lg font-semibold text-dark-text">{kpi.title}</h3>
        </div>
        {user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />}
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
        <ProgressBar progress={progress} className="mt-2" />
      </div>
       <button 
        onClick={() => onLogProgressClick(kpi)}
        className="mt-4 w-full bg-primary-light/10 text-primary font-semibold py-2 rounded-lg hover:bg-primary-light/20 transition-colors">
          Log Progress
       </button>
    </Card>
  );
};


export const Dashboard: React.FC<DashboardProps> = ({ kpis, users, onLogProgress }) => {
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);

    const handleOpenLogModal = (kpi: KPI) => {
        setSelectedKpi(kpi);
        setIsLogModalOpen(true);
    };

    const handleCloseLogModal = () => {
        setSelectedKpi(null);
        setIsLogModalOpen(false);
    };

    const totalKpis = kpis.length;
    const { onTrackKpis, overallProgress } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        let onTrackCount = 0;
        let totalProgress = 0;

        kpis.forEach(kpi => {
            const monthData = kpi.monthlyProgress.find(p => p.year === currentYear && p.month === currentMonth);
            if (monthData) {
                const progress = monthData.target > 0 ? (monthData.actual / monthData.target) : 0;
                if (progress >= 0.75) {
                    onTrackCount++;
                }
                totalProgress += progress;
            }
        });
        
        return {
            onTrackKpis: onTrackCount,
            overallProgress: totalKpis > 0 ? (totalProgress / totalKpis) * 100 : 0,
        };
    }, [kpis]);

    const mainKpi = kpis.find(k => k.id === 'kpi-1');

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Dashboard</h1>

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
            <h2 className="text-xl font-semibold mb-4">Monthly Sales Revenue</h2>
            {mainKpi && <KpiProgressChart progress={mainKpi.monthlyProgress} unit={mainKpi.unit}/>}
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-dark-text mb-4">Your KPIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map(kpi => {
                const owner = users.find(u => u.id === kpi.ownerId);
                return <KpiCard key={kpi.id} kpi={kpi} user={owner} onLogProgressClick={handleOpenLogModal} />;
            })}
        </div>
      </div>
      
      <LogProgressModal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        kpi={selectedKpi}
        onLogSubmit={onLogProgress}
      />
    </div>
  );
};
