import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { KPI, User } from '../../types';
import { KpiFrequency } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface EditKpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI | null;
  setKpis: React.Dispatch<React.SetStateAction<KPI[]>>;
  users: User[];
  kpis: KPI[];
}

export const EditKpiModal: FC<EditKpiModalProps> = ({ isOpen, onClose, kpi, setKpis, users, kpis }) => {
  const [formData, setFormData] = useState({
    title: '',
    unit: '',
    frequency: KpiFrequency.Monthly,
    ownerId: '',
    weight: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (kpi) {
      setFormData({
        title: kpi.title,
        unit: kpi.unit,
        frequency: kpi.frequency,
        ownerId: kpi.ownerId,
        weight: kpi.weight || 0,
      });
      setError('');
    }
  }, [kpi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'weight' ? parseFloat(value) || 0 : value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpi) return;

    if (formData.weight <= 0 || formData.weight > 100) {
        setError('Weight must be between 1 and 100.');
        return;
    }

    const existingWeight = kpis
        .filter(k => k.goalId === kpi.goalId && k.id !== kpi.id)
        .reduce((sum, k) => sum + (k.weight || 0), 0);
    
    if (existingWeight + formData.weight > 100) {
        setError(`Total weight for this goal cannot exceed 100%. Other KPIs use ${existingWeight}%.`);
        return;
    }

    setKpis(prevKpis =>
      prevKpis.map(k =>
        k.id === kpi.id
          ? { 
              ...k, 
              title: formData.title,
              unit: formData.unit,
              frequency: formData.frequency as KpiFrequency,
              ownerId: formData.ownerId,
              weight: formData.weight,
            }
          : k
      )
    );
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
            <label htmlFor="editKpiUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit (e.g., $, %)</label>
            <input type="text" id="editKpiUnit" name="unit" value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
        </div>
        <div className="mb-4">
          <label htmlFor="editKpiFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
          <select id="editKpiFrequency" name="frequency" value={formData.frequency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
            {Object.values(KpiFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
          </select>
        </div>
         <div className="mb-4">
            <label htmlFor="editKpiWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (%)</label>
            <input 
                type="number" 
                id="editKpiWeight" 
                name="weight" 
                value={formData.weight} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${error ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`} 
            />
        </div>
        <div className="mb-6">
          <label htmlFor="editKpiOwner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner</label>
          <select id="editKpiOwner" name="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
            <option value="" disabled>Select a team member</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
        </div>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};