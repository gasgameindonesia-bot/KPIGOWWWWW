import React, { useState, useMemo } from 'react';
import type { Goal, KPI, User, MonthlyProgress } from '../../types';
import { KpiFrequency } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditGoalModal } from './EditGoalModal';
import { EditKpiModal } from './EditKpiModal';
import { LogProgressModal } from './LogProgressModal';
import { KpiStatusBadge } from '../ui/KpiStatusBadge';

interface KpiManagementProps {
  goals: Goal[];
  kpis: KPI[];
  users: User[];
  onAddNewGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onAddNewKpi: (kpi: KPI) => void;
  onUpdateKpi: (kpi: KPI) => void;
  onLogProgress: (logData: { kpiId: string; year: number; month: number; actual: number; notes?: string }) => void;
}

const KpiItem: React.FC<{ kpi: KPI; user?: User; onEdit: (kpi: KPI) => void; onLogProgress: (kpi: KPI) => void; }> = ({ kpi, user, onEdit, onLogProgress }) => {
  const now = new Date();
  const currentMonthData = kpi.monthlyProgress.find(p => p.year === now.getFullYear() && p.month === now.getMonth() + 1);
  
  const currentValue = currentMonthData?.actual ?? 0;
  const targetValue = currentMonthData?.target ?? 0;
  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
  
  return (
    <div className="bg-white dark:bg-dark-bg p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3 hover:shadow-md transition-shadow">
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
                <Button variant="outline" size="sm" onClick={() => onEdit(kpi)}>Edit</Button>
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
            <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(kpi)}>Edit</Button>
        </div>
    </div>
  );
};

const SortableGoalItem: React.FC<{ goal: Goal; kpis: KPI[]; users: User[]; onEditGoal: (goal: Goal) => void; onAddKpi: (goalId: string) => void; onEditKpi: (kpi: KPI) => void; onLogKpiProgress: (kpi: KPI) => void; }> = ({ goal, kpis, users, onEditGoal, onAddKpi, onEditKpi, onLogKpiProgress }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: goal.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const manager = users.find(u => u.id === goal.managerId);
  const staff = users.filter(u => goal.staffIds.includes(u.id));

  const goalProgress = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const totalWeight = kpis.reduce((sum, kpi) => sum + (kpi.weight || 0), 0);
    if (totalWeight === 0) return 0;

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
        <Card className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="flex items-center flex-grow">
                    {/* Drag Handle */}
                    <div {...attributes} {...listeners} className="p-2 cursor-grab touch-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Drag handle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
                            <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                            <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="18" r="1.5" fill="currentColor"/>
                        </svg>
                    </div>
                    <div className="ml-2 flex-grow">
                        <h3 className="text-xl font-bold text-primary">{goal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{goal.description}</p>
                    </div>
                </div>
                <div className="flex-shrink-0 flex space-x-2 mt-4 sm:mt-0 self-end sm:self-auto">
                  <Button variant="outline" size="sm" onClick={() => onEditGoal(goal)}>Edit Goal</Button>
                  <Button variant="primary" size="sm" onClick={() => onAddKpi(goal.id)}>Add KPI</Button>
                </div>
            </div>
            <div className="my-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Overall Goal Progress (Current Month)</span>
                    <span className="font-bold text-primary">{goalProgress.toFixed(0)}%</span>
                </div>
                <ProgressBar progress={goalProgress} />
            </div>
             { (manager || staff.length > 0) && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Team In-Charge</h4>
                    <div className="flex items-center space-x-6">
                        {manager && (
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Manager</p>
                                <div className="flex items-center">
                                    <img src={manager.avatar} className="w-8 h-8 rounded-full" alt={manager.name} title={manager.name} />
                                    <span className="ml-2 text-sm font-medium text-gray-800 dark:text-dark-text">{manager.name}</span>
                                </div>
                            </div>
                        )}
                        {staff.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Staff</p>
                                <div className="flex items-center -space-x-2">
                                    {staff.map(member => (
                                        <img key={member.id} src={member.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card" alt={member.name} title={member.name} />
                                    ))}
                                    {staff.length > 4 && <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-semibold z-10 border-2 border-white dark:border-dark-card dark:bg-gray-600 dark:text-dark-text">+{staff.length - 4}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                {kpis.map((kpi) => (
                <KpiItem key={kpi.id} kpi={kpi} user={users.find(u => u.id === kpi.ownerId)} onEdit={onEditKpi} onLogProgress={onLogKpiProgress}/>
                ))}
            </div>
        </Card>
    </div>
  );
};

export const KpiManagement: React.FC<KpiManagementProps> = ({ goals, kpis, users, onAddNewGoal, onUpdateGoal, onAddNewKpi, onUpdateKpi, onLogProgress }) => {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);
  const [loggingKpi, setLoggingKpi] = useState<KPI | null>(null);
  
  const [newGoalData, setNewGoalData] = useState({ title: '', description: '', managerId: '', staffIds: [] as string[] });
  const [goalErrors, setGoalErrors] = useState({ title: '', description: '', managerId: '' });

  const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false);
  const [addingKpiToGoalId, setAddingKpiToGoalId] = useState<string | null>(null);
  const [newKpiData, setNewKpiData] = useState({
    title: '',
    target: '',
    unit: '',
    frequency: KpiFrequency.Monthly,
    ownerId: '',
    weight: '',
  });
  const [kpiErrors, setKpiErrors] = useState({ title: '', target: '', ownerId: '', weight: '' });


  const handleOpenEditGoalModal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleCloseEditGoalModal = () => {
    setEditingGoal(null);
  };

  const handleOpenEditKpiModal = (kpi: KPI) => {
    setEditingKpi(kpi);
  };

  const handleCloseEditKpiModal = () => {
    setEditingKpi(null);
  };

  const handleOpenLogProgressModal = (kpi: KPI) => {
    setLoggingKpi(kpi);
  };

  const handleCloseLogProgressModal = () => {
    setLoggingKpi(null);
  };
  
  const handleOpenAddKpiModal = (goalId: string) => {
    setAddingKpiToGoalId(goalId);
    setIsAddKpiModalOpen(true);
  };
  
  const handleCloseAddKpiModal = () => {
    setIsAddKpiModalOpen(false);
    setAddingKpiToGoalId(null);
    setNewKpiData({ title: '', target: '', unit: '', frequency: KpiFrequency.Monthly, ownerId: '', weight: '' });
    setKpiErrors({ title: '', target: '', ownerId: '', weight: '' });
  };
  
  const handleNewKpiDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewKpiData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateKpiForm = () => {
    const errors = { title: '', target: '', ownerId: '', weight: '' };
    let isValid = true;

    if (!newKpiData.title.trim()) {
      errors.title = 'KPI title is required.';
      isValid = false;
    }
    
    const targetValue = parseFloat(newKpiData.target);

    if (!newKpiData.target) {
        errors.target = 'A default monthly target is required.';
        isValid = false;
    } else if (isNaN(targetValue) || targetValue <= 0) {
        errors.target = 'Target must be a positive number.';
        isValid = false;
    }

    if (!newKpiData.ownerId) {
        errors.ownerId = 'Please select an owner.';
        isValid = false;
    }

    const weightValue = parseFloat(newKpiData.weight);
    if (!newKpiData.weight) {
        errors.weight = 'Weight is required.';
        isValid = false;
    } else if (isNaN(weightValue) || weightValue <= 0 || weightValue > 100) {
        errors.weight = 'Weight must be between 1 and 100.';
        isValid = false;
    } else if (addingKpiToGoalId) {
        const existingWeight = kpis
            .filter(k => k.goalId === addingKpiToGoalId)
            .reduce((sum, k) => sum + (k.weight || 0), 0);
        
        if (existingWeight + weightValue > 100) {
            const remainingWeight = 100 - existingWeight;
            if (remainingWeight > 0) {
                errors.weight = `Total weight exceeds 100%. You can only add up to ${remainingWeight}%.`;
            } else {
                errors.weight = `Total weight for this goal is already ${existingWeight}%. Cannot add more weighted KPIs.`;
            }
            isValid = false;
        }
    }
    
    setKpiErrors(errors);
    return isValid;
  };

  const handleAddKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingKpiToGoalId || !validateKpiForm()) {
      return;
    }

    const currentYear = new Date().getFullYear();
    const monthlyProgress: MonthlyProgress[] = Array.from({ length: 12 }, (_, i) => ({
        year: currentYear,
        month: i + 1,
        actual: 0,
        target: parseFloat(newKpiData.target),
    }));
  
    const newKpi: KPI = {
      id: `kpi-${Date.now()}`,
      goalId: addingKpiToGoalId,
      title: newKpiData.title,
      monthlyProgress: monthlyProgress,
      unit: newKpiData.unit,
      frequency: newKpiData.frequency as KpiFrequency,
      ownerId: newKpiData.ownerId,
      weight: parseFloat(newKpiData.weight),
    };
  
    onAddNewKpi(newKpi);
    handleCloseAddKpiModal();
  };
  
  const validateGoalForm = () => {
    const errors = { title: '', description: '', managerId: '' };
    let isValid = true;

    if (!newGoalData.title.trim()) {
      errors.title = 'Goal title is required.';
      isValid = false;
    }

    if (newGoalData.description.length > 200) {
      errors.description = 'Description cannot exceed 200 characters.';
      isValid = false;
    }
    
    if (!newGoalData.managerId) {
      errors.managerId = 'Please select a manager.';
      isValid = false;
    }
    
    setGoalErrors(errors);
    return isValid;
  };
  
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGoalForm()) {
        return;
    }

    const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: newGoalData.title,
        description: newGoalData.description,
        managerId: newGoalData.managerId,
        staffIds: newGoalData.staffIds
    };
    onAddNewGoal(newGoal);
    setNewGoalData({ title: '', description: '', managerId: '', staffIds: [] });
    setGoalErrors({ title: '', description: '', managerId: '' });
    setIsAddGoalModalOpen(false);
  };

  const handleNewGoalDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'staffIds') {
        const options = (e.target as HTMLSelectElement).options;
        const selectedIds = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setNewGoalData(prev => ({...prev, staffIds: selectedIds}));
    } else {
        setNewGoalData(prev => ({...prev, [name]: value}));
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Goals & KPIs</h1>
        <Button onClick={() => setIsAddGoalModalOpen(true)}>Add New Goal</Button>
      </div>
      
      <div>
        {goals.map((goal) => (
            <SortableGoalItem 
                key={goal.id} 
                goal={goal} 
                kpis={kpis.filter(k => k.goalId === goal.id)} 
                users={users}
                onEditGoal={handleOpenEditGoalModal}
                onAddKpi={handleOpenAddKpiModal}
                onEditKpi={handleOpenEditKpiModal}
                onLogKpiProgress={handleOpenLogProgressModal}
            />
        ))}
      </div>

      <Modal isOpen={isAddGoalModalOpen} onClose={() => setIsAddGoalModalOpen(false)} title="Add New Goal">
        <form onSubmit={handleAddGoal}>
          <div className="mb-4">
            <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Title</label>
            <input 
              type="text" 
              id="goalTitle" 
              name="title"
              value={newGoalData.title}
              onChange={handleNewGoalDataChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${goalErrors.title ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`} 
            />
             {goalErrors.title && <p className="text-danger text-sm mt-1">{goalErrors.title}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              id="goalDescription" 
              name="description"
              rows={3} 
              value={newGoalData.description}
              onChange={handleNewGoalDataChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${goalErrors.description ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`}
            ></textarea>
            {goalErrors.description && <p className="text-danger text-sm mt-1">{goalErrors.description}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="goalManager" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
             <select id="goalManager" name="managerId" value={newGoalData.managerId} onChange={handleNewGoalDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${goalErrors.managerId ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`}>
              <option value="" disabled>Select a manager</option>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
            {goalErrors.managerId && <p className="text-danger text-sm mt-1">{goalErrors.managerId}</p>}
          </div>
           <div className="mb-6">
            <label htmlFor="goalStaff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff (hold Ctrl/Cmd to select multiple)</label>
            <select multiple id="goalStaff" name="staffIds" value={newGoalData.staffIds} onChange={handleNewGoalDataChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text h-32">
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsAddGoalModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Goal</Button>
          </div>
        </form>
      </Modal>

      <EditGoalModal
        isOpen={!!editingGoal}
        onClose={handleCloseEditGoalModal}
        goal={editingGoal}
        onUpdateGoal={onUpdateGoal}
        users={users}
      />

      <EditKpiModal
        isOpen={!!editingKpi}
        onClose={handleCloseEditKpiModal}
        kpi={editingKpi}
        onUpdateKpi={onUpdateKpi}
        users={users}
        kpis={kpis}
      />

      <LogProgressModal
        isOpen={!!loggingKpi}
        onClose={handleCloseLogProgressModal}
        kpi={loggingKpi}
        onLogSubmit={onLogProgress}
      />

      <Modal isOpen={isAddKpiModalOpen} onClose={handleCloseAddKpiModal} title="Add New KPI">
        <form onSubmit={handleAddKpi}>
          <div className="mb-4">
            <label htmlFor="kpiTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KPI Title</label>
            <input type="text" id="kpiTitle" name="title" value={newKpiData.title} onChange={handleNewKpiDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${kpiErrors.title ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`} />
            {kpiErrors.title && <p className="text-danger text-sm mt-1">{kpiErrors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="kpiTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Monthly Target</label>
              <input type="number" id="kpiTarget" name="target" value={newKpiData.target} onChange={handleNewKpiDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${kpiErrors.target ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`} />
               {kpiErrors.target && <p className="text-danger text-sm mt-1">{kpiErrors.target}</p>}
            </div>
            <div>
              <label htmlFor="kpiUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit (e.g., $, %)</label>
              <input type="text" id="kpiUnit" name="unit" value={newKpiData.unit} onChange={handleNewKpiDataChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
            </div>
          </div>
           <div className="mb-4">
            <label htmlFor="kpiWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (%)</label>
            <input 
                type="number" 
                id="kpiWeight" 
                name="weight" 
                value={newKpiData.weight} 
                onChange={handleNewKpiDataChange} 
                placeholder="e.g., 30"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${kpiErrors.weight ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`} 
            />
            {kpiErrors.weight && <p className="text-danger text-sm mt-1">{kpiErrors.weight}</p>}
        </div>
          <div className="mb-4">
            <label htmlFor="kpiFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
            <select id="kpiFrequency" name="frequency" value={newKpiData.frequency} onChange={handleNewKpiDataChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
              {Object.values(KpiFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="kpiOwner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
            <select id="kpiOwner" name="ownerId" value={newKpiData.ownerId} onChange={handleNewKpiDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${kpiErrors.ownerId ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`}>
              <option value="" disabled>Select a team member</option>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
            {kpiErrors.ownerId && <p className="text-danger text-sm mt-1">{kpiErrors.ownerId}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={handleCloseAddKpiModal}>Cancel</Button>
            <Button variant="primary" type="submit">Save KPI</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};