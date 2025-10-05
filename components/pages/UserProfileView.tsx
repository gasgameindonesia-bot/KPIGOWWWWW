import React from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { Card } from '../ui/Card';

interface UserProfileViewProps {
  user: User;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ user }) => (
  <Card className="text-center flex flex-col items-center">
    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4 shadow-lg" />
    <h3 className="text-lg font-bold text-gray-800 dark:text-dark-text">{user.name}</h3>
    <p className="text-light-text text-sm">{user.email}</p>
    <div className="my-3 text-center">
        <p className="font-semibold text-primary dark:text-primary-light">{user.jobTitle}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.division}</p>
    </div>
    <span className={`mt-auto px-3 py-1 text-xs font-semibold rounded-full ${user.role === UserRole.SuperAdmin ? 'bg-primary/20 text-primary-dark dark:text-primary-light' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
      {user.role}
    </span>
  </Card>
);
