
import React, { useState } from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface TeamProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <Card className="text-center flex flex-col items-center">
    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4 shadow-lg" />
    <h3 className="text-lg font-bold">{user.name}</h3>
    <p className="text-light-text text-sm">{user.email}</p>
    <span className={`mt-3 px-3 py-1 text-xs font-semibold rounded-full ${user.role === UserRole.SuperAdmin ? 'bg-primary/20 text-primary-dark' : 'bg-gray-200 text-gray-700'}`}>
      {user.role}
    </span>
  </Card>
);

export const Team: React.FC<TeamProps> = ({ users, setUsers }) => {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-text">Team Members</h1>
        <Button onClick={() => setInviteModalOpen(true)}>Invite Member</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map(user => <UserCard key={user.id} user={user} />)}
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite New Team Member">
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              id="role"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white"
              defaultValue={UserRole.TeamMember}
            >
              <option>{UserRole.TeamMember}</option>
              <option>{UserRole.SuperAdmin}</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Send Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
