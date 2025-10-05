import React, { useState, useEffect } from 'react';
import type { User, KPI } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface SettingsProps {
    currentUser?: User;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    kpis: KPI[];
    setKpis: React.Dispatch<React.SetStateAction<KPI[]>>;
}

export const Settings: React.FC<SettingsProps> = ({ currentUser, setUsers, theme, setTheme, kpis, setKpis }) => {
    const [profileData, setProfileData] = useState({ 
        name: '', 
        email: '', 
        jobTitle: '', 
        division: '' 
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    
    useEffect(() => {
        if (currentUser) {
            setProfileData({ 
                name: currentUser.name, 
                email: currentUser.email,
                jobTitle: currentUser.jobTitle,
                division: currentUser.division
            });
        }
    }, [currentUser]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setUsers(prevUsers => prevUsers.map(user => 
            user.id === currentUser.id ? { ...user, ...profileData } : user
        ));
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    const [notifications, setNotifications] = useState({
        kpiUpdates: true,
        goalAssignments: true,
        teamMentions: false,
    });

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleColorChange = (kpiId: string, color: string) => {
        setKpis(prevKpis =>
            prevKpis.map(kpi =>
                kpi.id === kpiId ? { ...kpi, progressBarColor: color } : kpi
            )
        );
    };
    
    if (!currentUser) {
        return <p>Loading...</p>;
    }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-dark-text">Profile Settings</h2>
                <form onSubmit={handleProfileSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" id="name" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
                        </div>
                        <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                            <input type="text" id="jobTitle" name="jobTitle" value={profileData.jobTitle} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
                        </div>
                        <div>
                            <label htmlFor="division" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Division</label>
                            <input type="text" id="division" name="division" value={profileData.division} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end items-center space-x-4">
                        {showSuccessMessage && (
                            <p className="text-accent text-sm font-medium">
                                Profile updated successfully!
                            </p>
                        )}
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Card>
            
            {/* Notification Settings */}
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-dark-text">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-dark-text">KPI Updates</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when progress is logged on your KPIs.</p>
                        </div>
                        <ToggleSwitch checked={notifications.kpiUpdates} onChange={() => handleNotificationChange('kpiUpdates')} />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-dark-text">Goal Assignments</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you are assigned to a new goal.</p>
                        </div>
                        <ToggleSwitch checked={notifications.goalAssignments} onChange={() => handleNotificationChange('goalAssignments')} />
                    </div>
                     <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-dark-text">Team Mentions</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when a team member mentions you.</p>
                        </div>
                        <ToggleSwitch checked={notifications.teamMentions} onChange={() => handleNotificationChange('teamMentions')} />
                    </div>
                </div>
            </Card>

            {/* KPI Color Settings */}
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-dark-text">KPI Progress Bar Colors</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {kpis.map(kpi => (
                        <div key={kpi.id} className="flex justify-between items-center">
                            <p className="font-medium text-gray-800 dark:text-dark-text truncate pr-4">{kpi.title}</p>
                            <input
                                type="color"
                                value={kpi.progressBarColor || '#FFFFFF'}
                                onChange={(e) => handleColorChange(kpi.id, e.target.value)}
                                className="w-10 h-10 p-1 border-0 rounded cursor-pointer bg-transparent"
                                style={{
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none'
                                }}
                                title={`Customize color for ${kpi.title}`}
                            />
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        <div className="lg:col-span-1">
             {/* Appearance Settings */}
             <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-dark-text">Appearance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose how KPI GO looks to you.</p>
                <div className="space-y-3">
                    <button onClick={() => setTheme('light')} className={`w-full p-3 border rounded-lg text-left flex items-center ${theme === 'light' ? 'border-primary ring-2 ring-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" /></svg>
                        <span className="font-medium text-gray-800 dark:text-dark-text">Light Mode</span>
                    </button>
                    <button onClick={() => setTheme('dark')} className={`w-full p-3 border rounded-lg text-left flex items-center ${theme === 'dark' ? 'border-primary ring-2 ring-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                        <span className="font-medium text-gray-800 dark:text-dark-text">Dark Mode</span>
                    </button>
                </div>
             </Card>
        </div>
      </div>
    </div>
  );
};