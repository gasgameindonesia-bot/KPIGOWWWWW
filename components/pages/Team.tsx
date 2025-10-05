import React, { useState } from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { UserProfileView } from './UserProfileView';
import { EditUserModal } from './EditUserModal';

interface TeamProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser?: User;
}

export const Team: React.FC<TeamProps> = ({ users, setUsers, currentUser }) => {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const isAdmin = currentUser?.role === UserRole.Admin;

  const handleUserClick = (user: User) => {
    if (isAdmin) {
      setSelectedUser(user);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Team Members</h1>
        {isAdmin && <Button onClick={() => setInviteModalOpen(true)}>Invite Member</Button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map(user => <UserProfileView key={user.id} user={user} onClick={isAdmin ? () => handleUserClick(user) : undefined} />)}
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite New Team Member">
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@company.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select 
              id="role"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
              defaultValue={UserRole.Staff}
            >
              <option>{UserRole.Manager}</option>
              <option>{UserRole.Staff}</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Send Invite</Button>
          </div>
        </form>
      </Modal>

      <EditUserModal
        isOpen={!!selectedUser}
        onClose={handleCloseModal}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
};