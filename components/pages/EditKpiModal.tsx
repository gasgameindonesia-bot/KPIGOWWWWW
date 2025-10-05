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
}

export const EditKpiModal: FC<EditKpiModalProps> = ({ isOpen, onClose, kpi, setKpis, users }) => {
  const [formData, setFormData] = useState({
    title: '',
    unit: '',
    frequency: KpiFrequency.Monthly,
    ownerId: '',
  });

  useEffect(() => {
    if (kpi) {
      setFormData({
        title: kpi.title,
        unit: kpi.unit,
        frequency: kpi.frequency,
        ownerId: kpi.ownerId,
      });
    }
  }, [kpi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpi) return;

    setKpis(prevKpis =>
      prevKpis.map(k =>
        k.id === kpi.id
          ? { 
              ...k, 
              title: formData.title,
              unit: formData.unit,
              frequency: formData.frequency as KpiFrequency,
              ownerId: formData.ownerId,
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
          <label htmlFor="editKpiTitle" className="block text-sm font-medium text-gray-700 mb-1">KPI Title</label>
          <input type="text" id="editKpiTitle" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div className="mb-4">
            <label htmlFor="editKpiUnit" className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g., $, %)</label>
            <input type="text" id="editKpiUnit" name="unit" value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div className="mb-4">
          <label htmlFor="editKpiFrequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select id="editKpiFrequency" name="frequency" value={formData.frequency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white">
            {Object.values(KpiFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="editKpiOwner" className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <select id="editKpiOwner" name="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white">
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