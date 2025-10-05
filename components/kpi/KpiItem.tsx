import React from 'react';
import type { KPI, User } from '../../types';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { KpiStatusBadge } from '../ui/KpiStatusBadge';

interface KpiItemProps {
    kpi: KPI;
    user?: User;
    currentUser?: User;
    goalManagerId: string;
    onEdit: (kpi: KPI) => void;
    onLogProgress: (kpi: KPI) => void;
}

export const KpiItem: React.FC<KpiItemProps> = ({ kpi, user, currentUser, goalManagerId, onEdit, onLogProgress }) => {
  const now = new Date();
  const currentMonthData = kpi.monthlyProgress.find(p => p.year === now.getFullYear() && p.month === now.getMonth() + 1);
  
  const currentValue = currentMonthData?.actual ?? 0;
  const targetValue = currentMonthData?.target ?? 0;
  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  const canEdit = currentUser?.role === UserRole.Admin || currentUser?.id === goalManagerId || currentUser?.id === kpi.ownerId;
  
  return (
    <div className="bg-light-bg/50 dark:bg-dark-bg/50 p-4 rounded-lg border border-gray-200/80 dark:border-gray-700/80 mb-3 last:mb-0 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center flex-wrap gap-2">
                    <h4 className="font-semibold text-gray-800 dark:text-dark-text">{kpi.title}</h4>
                    <KpiStatusBadge actual={currentValue} target={targetValue} />
                    {kpi.weight && (
                        <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">
                            Weight: {kpi.weight}%
                        </span>
                    )}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user && <img src={user.avatar} className="w-6 h-6 rounded-full mr-2" alt={user.name} />}
                <span>{user ? user.name : 'Unassigned'}</span>
                </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 flex-shrink-0 ml-4">
                <Button variant="outline" size="sm" onClick={() => onLogProgress(kpi)}>Log</Button>
                {canEdit && <Button variant="outline" size="sm" onClick={() => onEdit(kpi)}>Edit</Button>}
            </div>
        </div>
        <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Actual</span>
                    <p className="font-semibold text-gray-800 dark:text-dark-text">
                        {kpi.unit}{currentValue.toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Target</span>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        {kpi.unit}{targetValue.toLocaleString()}
                    </p>
                </div>
            </div>
            <ProgressBar progress={progress} customColor={kpi.progressBarColor} />
        </div>
        <div className="sm:hidden flex space-x-2 mt-4">
            <Button variant="outline" size="sm" className="w-full" onClick={() => onLogProgress(kpi)}>Log Progress</Button>
            {canEdit && <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(kpi)}>Edit</Button>}
        </div>
    </div>
  );
};