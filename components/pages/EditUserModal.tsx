import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (user: User) => void;
}

export const EditUserModal: FC<EditUserModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    division: '',
    role: UserRole.Staff,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        division: user.division,
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    onUpdateUser({ 
      ...user, 
      ...formData
    });
    onClose();
  };

  if (!user) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Profile: ${user.name}`}>
      <form onSubmit={handleSaveChanges}>
        <div className="flex justify-center mb-6">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full shadow-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="editUserName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                    type="text"
                    id="editUserName"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="editUserEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                    type="email"
                    id="editUserEmail"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
             <div>
                <label htmlFor="editUserJobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                <input
                    type="text"
                    id="editUserJobTitle"
                    name="jobTitle"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
                    value={formData.jobTitle}
                    onChange={handleChange}
                />
            </div>
             <div>
                <label htmlFor="editUserDivision" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Division</label>
                <input
                    type="text"
                    id="editUserDivision"
                    name="division"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
                    value={formData.division}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="mb-6">
            <label htmlFor="editUserRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select 
              id="editUserRole"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
            >
              <option value={UserRole.Manager}>{UserRole.Manager}</option>
              <option value={UserRole.Staff}>{UserRole.Staff}</option>
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