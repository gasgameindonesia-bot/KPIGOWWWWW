import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Goal, User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onUpdateGoal: (goal: Goal) => void;
  users: User[];
}

export const EditGoalModal: FC<EditGoalModalProps> = ({ isOpen, onClose, goal, onUpdateGoal, users }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedManagerId, setEditedManagerId] = useState('');
  const [editedStaffIds, setEditedStaffIds] = useState<string[]>([]);

  useEffect(() => {
    if (goal) {
      setEditedTitle(goal.title);
      setEditedDescription(goal.description);
      setEditedManagerId(goal.managerId);
      setEditedStaffIds(goal.staffIds);
    }
  }, [goal]);
  
  const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedIds = Array.from(options)
        // Fix: Explicitly type `option` as `HTMLOptionElement` to resolve TypeScript errors
        // where it was being inferred as `unknown`, allowing access to `selected` and `value`.
        .filter((option: HTMLOptionElement) => option.selected)
        .map((option: HTMLOptionElement) => option.value);
    setEditedStaffIds(selectedIds);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    onUpdateGoal({ 
      ...goal, 
      title: editedTitle, 
      description: editedDescription,
      managerId: editedManagerId,
      staffIds: editedStaffIds
    });
    onClose();
  };

  if (!goal) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Goal">
      <form onSubmit={handleSaveChanges}>
        <div className="mb-4">
          <label htmlFor="editGoalTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Title</label>
          <input
            type="text"
            id="editGoalTitle"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editGoalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            id="editGoalDescription"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
            <label htmlFor="editGoalManager" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
             <select id="editGoalManager" name="managerId" value={editedManagerId} onChange={(e) => setEditedManagerId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
              <option value="" disabled>Select a manager</option>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
          </div>
           <div className="mb-6">
            <label htmlFor="editGoalStaff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff (hold Ctrl/Cmd to select multiple)</label>
            <select multiple id="editGoalStaff" name="staffIds" value={editedStaffIds} onChange={handleStaffChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text h-32">
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