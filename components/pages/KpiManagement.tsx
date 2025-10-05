import React, { useState } from 'react';
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

interface KpiManagementProps {
  goals: Goal[];
  kpis: KPI[];
  users: User[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setKpis: React.Dispatch<React.SetStateAction<KPI[]>>;
}

const KpiItem: React.FC<{ kpi: KPI; user?: User; onEdit: (kpi: KPI) => void; }> = ({ kpi, user, onEdit }) => {
  const now = new Date();
  const currentMonthData = kpi.monthlyProgress.find(p => p.year === now.getFullYear() && p.month === now.getMonth() + 1);
  
  const currentValue = currentMonthData?.actual ?? 0;
  const targetValue = currentMonthData?.target ?? 0;
  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div>
            <h4 className="font-semibold">{kpi.title}</h4>
            <div className="flex items-center text-sm text-gray-500 mt-1">
            {user && <img src={user.avatar} className="w-6 h-6 rounded-full mr-2" alt={user.name} />}
            <span>{user ? user.name : 'Unassigned'}</span>
            </div>
        </div>
      </div>
      <div className="flex items-center w-1/2">
        <div className="w-2/3 mr-4">
            <div className="flex justify-between text-sm mb-1">
                <span>{kpi.unit}{currentValue.toLocaleString()}</span>
                <span className="text-gray-500">/{targetValue.toLocaleString()}</span>
            </div>
            <ProgressBar progress={progress} />
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(kpi)}>Edit</Button>
      </div>
    </div>
  );
};

const SortableGoalItem: React.FC<{ goal: Goal; kpis: KPI[]; users: User[]; onEditGoal: (goal: Goal) => void; onAddKpi: (goalId: string) => void; onEditKpi: (kpi: KPI) => void; }> = ({ goal, kpis, users, onEditGoal, onAddKpi, onEditKpi }) => {
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


  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">{goal.title}</h3>
                  <p className="text-gray-600 mt-1">{goal.description}</p>
                </div>
                <div className="flex-shrink-0 flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEditGoal(goal)}>Edit Goal</Button>
                  <Button variant="primary" size="sm" onClick={() => onAddKpi(goal.id)}>Add KPI</Button>
                </div>
            </div>
             { (manager || staff.length > 0) && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">Team In-Charge</h4>
                    <div className="flex items-center space-x-6">
                        {manager && (
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Manager</p>
                                <div className="flex items-center">
                                    <img src={manager.avatar} className="w-8 h-8 rounded-full" alt={manager.name} title={manager.name} />
                                    <span className="ml-2 text-sm font-medium">{manager.name}</span>
                                </div>
                            </div>
                        )}
                        {staff.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Staff</p>
                                <div className="flex items-center -space-x-2">
                                    {staff.map(member => (
                                        <img key={member.id} src={member.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt={member.name} title={member.name} />
                                    ))}
                                    {staff.length > 4 && <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-semibold z-10 border-2 border-white">+{staff.length - 4}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="mt-4 border-t pt-4">
                {kpis.map((kpi) => (
                <KpiItem key={kpi.id} kpi={kpi} user={users.find(u => u.id === kpi.ownerId)} onEdit={onEditKpi} />
                ))}
            </div>
        </Card>
    </div>
  );
};

export const KpiManagement: React.FC<KpiManagementProps> = ({ goals, kpis, users, setGoals, setKpis }) => {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);
  
  // State for adding a new goal
  const [newGoalData, setNewGoalData] = useState({ title: '', description: '', managerId: '', staffIds: [] as string[] });
  const [goalErrors, setGoalErrors] = useState({ title: '', description: '', managerId: '' });

  // State for adding a new KPI
  const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false);
  const [addingKpiToGoalId, setAddingKpiToGoalId] = useState<string | null>(null);
  const [newKpiData, setNewKpiData] = useState({
    title: '',
    monthlyTarget: '',
    unit: '',
    frequency: KpiFrequency.Monthly,
    ownerId: '',
  });
  const [kpiErrors, setKpiErrors] = useState({ title: '', monthlyTarget: '', ownerId: '' });


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
  
  const handleOpenAddKpiModal = (goalId: string) => {
    setAddingKpiToGoalId(goalId);
    setIsAddKpiModalOpen(true);
  };
  
  const handleCloseAddKpiModal = () => {
    setIsAddKpiModalOpen(false);
    setAddingKpiToGoalId(null);
    setNewKpiData({ title: '', monthlyTarget: '', unit: '', frequency: KpiFrequency.Monthly, ownerId: '' });
    setKpiErrors({ title: '', monthlyTarget: '', ownerId: '' });
  };
  
  const handleNewKpiDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewKpiData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateKpiForm = () => {
    const errors = { title: '', monthlyTarget: '', ownerId: '' };
    let isValid = true;

    if (!newKpiData.title.trim()) {
      errors.title = 'KPI title is required.';
      isValid = false;
    }

    const targetValue = parseFloat(newKpiData.monthlyTarget);
    if (isNaN(targetValue) || targetValue <= 0) {
      errors.monthlyTarget = 'Target must be a positive number.';
      isValid = false;
    }

    if (!newKpiData.ownerId) {
        errors.ownerId = 'Please select an owner.';
        isValid = false;
    }
    
    setKpiErrors(errors);
    return isValid;
  };

  const handleAddKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingKpiToGoalId || !validateKpiForm()) {
      return;
    }
    
    const target = parseFloat(newKpiData.monthlyTarget);
    const currentYear = new Date().getFullYear();
    const monthlyProgress: MonthlyProgress[] = Array.from({ length: 12 }, (_, i) => ({
        year: currentYear,
        month: i + 1,
        target: target,
        actual: 0,
    }));
  
    const newKpi: KPI = {
      id: `kpi-${Date.now()}`,
      goalId: addingKpiToGoalId,
      title: newKpiData.title,
      monthlyProgress: monthlyProgress,
      unit: newKpiData.unit,
      frequency: newKpiData.frequency as KpiFrequency,
      ownerId: newKpiData.ownerId,
    };
  
    setKpis(prevKpis => [...prevKpis, newKpi]);
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
    setGoals(prev => [...prev, newGoal]);
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
        <h1 className="text-3xl font-bold text-dark-text">Goals & KPIs</h1>
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
            />
        ))}
      </div>

      <Modal isOpen={isAddGoalModalOpen} onClose={() => setIsAddGoalModalOpen(false)} title="Add New Goal">
        <form onSubmit={handleAddGoal}>
          <div className="mb-4">
            <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
            <input 
              type="text" 
              id="goalTitle" 
              name="title"
              value={newGoalData.title}
              onChange={handleNewGoalDataChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${goalErrors.title ? 'border-danger' : 'border-gray-300'}`} 
            />
             {goalErrors.title && <p className="text-danger text-sm mt-1">{goalErrors.title}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              id="goalDescription" 
              name="description"
              rows={3} 
              value={newGoalData.description}
              onChange={handleNewGoalDataChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${goalErrors.description ? 'border-danger' : 'border-gray-300'}`}
            ></textarea>
            {goalErrors.description && <p className="text-danger text-sm mt-1">{goalErrors.description}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="goalManager" className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
             <select id="goalManager" name="managerId" value={newGoalData.managerId} onChange={handleNewGoalDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white ${goalErrors.managerId ? 'border-danger' : 'border-gray-300'}`}>
              <option value="" disabled>Select a manager</option>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
            {goalErrors.managerId && <p className="text-danger text-sm mt-1">{goalErrors.managerId}</p>}
          </div>
           <div className="mb-6">
            <label htmlFor="goalStaff" className="block text-sm font-medium text-gray-700 mb-1">Staff (hold Ctrl/Cmd to select multiple)</label>
            <select multiple id="goalStaff" name="staffIds" value={newGoalData.staffIds} onChange={handleNewGoalDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white h-32">
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
        setGoals={setGoals}
        users={users}
      />

      <EditKpiModal
        isOpen={!!editingKpi}
        onClose={handleCloseEditKpiModal}
        kpi={editingKpi}
        setKpis={setKpis}
        users={users}
      />

      <Modal isOpen={isAddKpiModalOpen} onClose={handleCloseAddKpiModal} title="Add New KPI">
        <form onSubmit={handleAddKpi}>
          <div className="mb-4">
            <label htmlFor="kpiTitle" className="block text-sm font-medium text-gray-700 mb-1">KPI Title</label>
            <input type="text" id="kpiTitle" name="title" value={newKpiData.title} onChange={handleNewKpiDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${kpiErrors.title ? 'border-danger' : 'border-gray-300'}`} />
            {kpiErrors.title && <p className="text-danger text-sm mt-1">{kpiErrors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="kpiMonthlyTarget" className="block text-sm font-medium text-gray-700 mb-1">Default Monthly Target</label>
              <input type="number" id="kpiMonthlyTarget" name="monthlyTarget" value={newKpiData.monthlyTarget} onChange={handleNewKpiDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${kpiErrors.monthlyTarget ? 'border-danger' : 'border-gray-300'}`} />
               {kpiErrors.monthlyTarget && <p className="text-danger text-sm mt-1">{kpiErrors.monthlyTarget}</p>}
            </div>
            <div>
              <label htmlFor="kpiUnit" className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g., $, %)</label>
              <input type="text" id="kpiUnit" name="unit" value={newKpiData.unit} onChange={handleNewKpiDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="kpiFrequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select id="kpiFrequency" name="frequency" value={newKpiData.frequency} onChange={handleNewKpiDataChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white">
              {Object.values(KpiFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="kpiOwner" className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <select id="kpiOwner" name="ownerId" value={newKpiData.ownerId} onChange={handleNewKpiDataChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white ${kpiErrors.ownerId ? 'border-danger' : 'border-gray-300'}`}>
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