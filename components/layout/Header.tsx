import React, { useState, useRef, useEffect } from 'react';
import type { Notification, User } from '../../types';
import { Button } from '../ui/Button';

interface HeaderProps {
  onToggleSidebar: () => void;
  notifications: Notification[];
  users: User[];
  onMarkAsRead: (id: string) => void;
  onClearNotifications: () => void;
  onLogout: () => void;
}

const timeSince = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, notifications, users, onMarkAsRead, onClearNotifications, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 items-center relative z-10 bg-white/80 dark:bg-dark-card/70 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-700/60 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleSidebar} 
            className="text-gray-500 dark:text-gray-400 focus:outline-none md:hidden"
            aria-label="Open sidebar"
          >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(prev => !prev)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none relative">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-danger text-white text-xs items-center justify-center">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-lg shadow-xl border dark:border-gray-700 z-50">
                <div className="p-3 flex justify-between items-center border-b dark:border-gray-700">
                  <h4 className="font-semibold text-gray-800 dark:text-dark-text">Notifications</h4>
                  {notifications.length > 0 && (
                    <button onClick={onClearNotifications} className="text-sm text-primary hover:underline focus:outline-none">Mark all as read</button>
                  )}
                </div>
                <ul className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notif => {
                      const actor = users.find(u => u.id === notif.actorId);
                      return (
                        <li 
                          key={notif.id} 
                          onClick={() => onMarkAsRead(notif.id)} 
                          className={`border-b dark:border-gray-700/50 hover:bg-gray-500/10 cursor-pointer ${!notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                          <div className="flex items-start p-3">
                            {actor && <img src={actor.avatar} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" alt={actor.name} />}
                            <div className="flex-grow">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">{actor?.name || 'Someone'}</span> {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{timeSince(notif.timestamp)}</p>
                            </div>
                            {!notif.read && (
                              <div className="w-2.5 h-2.5 bg-primary rounded-full ml-2 mt-1 flex-shrink-0" title="Unread"></div>
                            )}
                          </div>
                        </li>
                      )
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-10">No new notifications</p>
                  )}
                </ul>
              </div>
            )}
          </div>
           <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
};