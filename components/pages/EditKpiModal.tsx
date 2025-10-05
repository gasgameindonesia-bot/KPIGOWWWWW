import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { KPI, User, MonthlyProgress } from '../../types';
import { KpiFrequency } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface EditKpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI | null;
  onUpdateKpi: (kpi: KPI) => void;
  users: User[];
  kpis: KPI[];
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const EditKpiModal: FC<EditKpiModalProps> = ({ isOpen, onClose, kpi, onUpdateKpi, users, kpis: allKpis }) => {
  const [formData, setFormData] = useState({
    title: '',
    unit: '',
    frequency: KpiFrequency.Monthly,
    ownerId: '',
    weight: 0,
    monthlyTargets: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, target: 0 })),
  });
  const [errors, setErrors] = useState<{ weight?: string; targets?: string }>({});

  useEffect(() => {
    if (kpi) {
      const currentYear = new Date().getFullYear();
      const targetsForCurrentYear = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const progressForMonth = kpi.monthlyProgress.find(p => p.year === currentYear && p.month === month);
        return { month, target: progressForMonth?.target ?? 0 };
      });

      setFormData({
        title: kpi.title,
        unit: kpi.unit,
        frequency: kpi.frequency,
        ownerId: kpi.ownerId,
        weight: kpi.weight || 0,
        monthlyTargets: targetsForCurrentYear,
      });
      setErrors({});
    }
  }, [kpi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'weight' ? parseFloat(value) || 0 : value }));
  };

  const handleTargetChange = (month: number, value: string) => {
    const newTargets = formData.monthlyTargets.map(mt => 
      mt.month === month ? { ...mt, target: parseFloat(value) || 0 } : mt
    );
    setFormData(prev => ({ ...prev, monthlyTargets: newTargets }));
  };

  const validateForm = () => {
    const newErrors: { weight?: string; targets?: string } = {};
    let isValid = true;
    
    if (formData.weight <= 0 || formData.weight > 100) {
        newErrors.weight = 'Weight must be between 1 and 100.';
        isValid = false;
    } else if (kpi) {
        const existingWeight = allKpis
            .filter(k => k.goalId === kpi.goalId && k.id !== kpi.id)
            .reduce((sum, k) => sum + (k.weight || 0), 0);
        
        if (existingWeight + formData.weight > 100) {
            const remainingWeight = 100 - existingWeight;
            newErrors.weight = `Total weight exceeds 100%. Max is ${remainingWeight}%.`;
            isValid = false;
        }
    }

    if (formData.monthlyTargets.some(mt => mt.target < 0)) {
        newErrors.targets = 'All monthly targets must be positive numbers.';
        isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  }

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpi || !validateForm()) return;
    
    const currentYear = new Date().getFullYear();
    const newMonthlyProgress = kpi.monthlyProgress.map(p => {
        if (p.year === currentYear) {
            const newTargetData = formData.monthlyTargets.find(mt => mt.month === p.month);
            return { ...p, target: newTargetData?.target ?? p.target };
        }
        return p;
    });

    const updatedKpi: KPI = {
        ...kpi,
        title: formData.title,
        unit: formData.unit,
        frequency: formData.frequency as KpiFrequency,
        ownerId: formData.ownerId,
        weight: formData.weight,
        monthlyProgress: newMonthlyProgress,
    };

    onUpdateKpi(updatedKpi);
    onClose();
  };

  if (!kpi) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit KPI">
      <form onSubmit={handleSaveChanges}>
        <div className="mb-4">
          <label htmlFor="editKpiTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KPI Title</label>
          <input type="text" id="editKpiTitle" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Targets ({new Date().getFullYear()})</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
                {formData.monthlyTargets.map((mt, index) => (
                    <div key={mt.month}>
                        <label htmlFor={`target-${mt.month}`} className="text-xs text-gray-600 dark:text-gray-400">{monthNames[index]}</label>
                        <input
                            type="number"
                            id={`target-${mt.month}`}
                            name={`target-${mt.month}`}
                            value={mt.target}
                            onChange={(e) => handleTargetChange(mt.month, e.target.value)}
                            className="w-full mt-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text text-sm"
                        />
                    </div>
                ))}
            </div>
            {errors.targets && <p className="text-danger text-sm mt-2">{errors.targets}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="editKpiUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit (e.g., $, %)</label>
                <input type="text" id="editKpiUnit" name="unit" value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
            </div>
            <div>
                <label htmlFor="editKpiWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (%)</label>
                <input 
                    type="number" 
                    id="editKpiWeight" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${errors.weight ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`} 
                />
            </div>
        </div>
        {errors.weight && <p className="text-danger text-sm -mt-2 mb-4">{errors.weight}</p>}


        <div className="mb-4">
          <label htmlFor="editKpiFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
          <select id="editKpiFrequency" name="frequency" value={formData.frequency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
            {Object.values(KpiFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="editKpiOwner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
          <select id="editKpiOwner" name="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
            <option value="" disabled>Select a team member</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};
