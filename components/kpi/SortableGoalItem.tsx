import React, { useMemo } from 'react';
import type { Goal, KPI, User } from '../../types';
import { UserRole } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { KpiItem } from './KpiItem';

interface SortableGoalItemProps {
    goal: Goal;
    kpis: KPI[];
    users: User[];
    currentUser?: User;
    onEditGoal: (goal: Goal) => void;
    onAddKpi: (goalId: string) => void;
    onEditKpi: (kpi: KPI) => void;
    onLogKpiProgress: (kpi: KPI) => void;
}

export const SortableGoalItem: React.FC<SortableGoalItemProps> = ({ goal, kpis, users, currentUser, onEditGoal, onAddKpi, onEditKpi, onLogKpiProgress }) => {
  const isAdmin = currentUser?.role === UserRole.Admin;
  const isManager = currentUser?.id === goal.managerId;
  const canEditGoal = isAdmin || isManager;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: goal.id,
    disabled: !isAdmin,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const manager = users.find(u => u.id === goal.managerId);
  const staff = users.filter(u => goal.staffIds.includes(u.id));

  const goalProgress = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const totalWeight = kpis.reduce((sum, kpi) => sum + (kpi.weight || 0), 0);
    if (totalWeight === 0 || totalWeight > 100) return 0; // Handle cases with no weight or incorrect weight sum

    const weightedProgressSum = kpis.reduce((sum, kpi) => {
        const monthData = kpi.monthlyProgress.find(p => p.year === currentYear && p.month === currentMonth);
        const currentValue = monthData?.actual ?? 0;
        const targetValue = monthData?.target ?? 0;
        const kpiProgress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
        const kpiWeight = kpi.weight || 0;
        
        return sum + (kpiProgress * kpiWeight);
    }, 0);

    return weightedProgressSum / totalWeight;
  }, [kpis]);


  return (
    <div ref={setNodeRef} style={style}>
        <Card className="mb-6 overflow-hidden p-0">
            <div className="p-4 sm:p-6 bg-gray-50/50 dark:bg-white/5 border-b border-gray-200/80 dark:border-gray-700/80">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex items-start flex-grow">
                        {isAdmin && (
                            <div {...attributes} {...listeners} className="p-2 -ml-2 mt-1 cursor-grab touch-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Drag handle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
                                    <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                                    <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
                                    <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
                                    <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                                    <circle cx="15" cy="18" r="1.5" fill="currentColor"/>
                                </svg>
                            </div>
                        )}
                        <div className={isAdmin ? "ml-2 flex-grow" : "flex-grow"}>
                            <h3 className="text-xl font-bold text-primary dark:text-primary-light">{goal.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">{goal.description}</p>
                        </div>
                    </div>
                    {canEditGoal && (
                        <div className="flex-shrink-0 flex space-x-2 mt-4 sm:mt-0 self-end sm:self-auto">
                            <Button variant="outline" size="sm" onClick={() => onEditGoal(goal)}>Edit Goal</Button>
                            <Button variant="primary" size="sm" onClick={() => onAddKpi(goal.id)}>Add KPI</Button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Overall Goal Progress (Current Month)</span>
                        <span className="font-bold text-primary dark:text-primary-light">{goalProgress.toFixed(0)}%</span>
                    </div>
                    <ProgressBar progress={goalProgress} />
                </div>
                { (manager || staff.length > 0) && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Team In-Charge</h4>
                        <div className="flex items-center space-x-6">
                            {manager && (
                                <div>
                                    <p className="text-xs text-light-text mb-1">Manager</p>
                                    <div className="flex items-center">
                                        <img src={manager.avatar} className="w-8 h-8 rounded-full" alt={manager.name} title={manager.name} />
                                        <span className="ml-2 text-sm font-medium text-gray-800 dark:text-dark-text">{manager.name}</span>
                                    </div>
                                </div>
                            )}
                            {staff.length > 0 && (
                                <div>
                                    <p className="text-xs text-light-text mb-1">Staff</p>
                                    <div className="flex items-center -space-x-2">
                                        {staff.slice(0, 4).map(member => (
                                            <img key={member.id} src={member.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card" alt={member.name} title={member.name} />
                                        ))}
                                        {staff.length > 4 && <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-semibold z-10 border-2 border-white dark:border-dark-card dark:bg-gray-600 dark:text-dark-text">+{staff.length - 4}</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {kpis.length > 0 && 
              <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="border-t border-gray-200/80 dark:border-gray-700/80 pt-4">
                      {kpis.map((kpi) => (
                          <KpiItem 
                              key={kpi.id} 
                              kpi={kpi} 
                              user={users.find(u => u.id === kpi.ownerId)} 
                              onEdit={onEditKpi} 
                              onLogProgress={onLogKpiProgress}
                              currentUser={currentUser}
                              goalManagerId={goal.managerId}
                          />
                      ))}
                  </div>
              </div>
            }
        </Card>
    </div>
  );
};