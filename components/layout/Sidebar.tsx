import React from 'react';
import type { FC } from 'react';
import { NavigationItem, UserRole, type User, type Company, type SubscriptionStatus } from '../../types';

interface SidebarProps {
  activePage: NavigationItem;
  onPageChange: (page: NavigationItem) => void;
  currentUser?: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  company: Company | null;
  subscriptionStatus: SubscriptionStatus | null;
}

const NavLink: FC<{
  icon: React.ElementType;
  label: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 relative ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white font-semibold'
        : 'text-light-text hover:bg-gray-500/10 dark:text-gray-300 dark:hover:bg-white/5'
    }`}
  >
    {isActive && <div className="absolute left-0 h-3/5 w-1 bg-primary rounded-r-full"></div>}
    <Icon className="h-6 w-6" />
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

const TrialStatus: FC<{ company: Company | null }> = ({ company }) => {
    if (!company?.trialEndsAt) return null;

    const trialEndDate = new Date(company.trialEndsAt);
    const now = new Date();
    
    if (now > trialEndDate) return null;

    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isEndingSoon = diffDays <= 3;

    return (
        <div className={`p-3 rounded-lg text-center mb-4 ${isEndingSoon ? 'bg-danger/10 animate-pulse' : 'bg-primary/10'}`}>
            <p className={`font-semibold ${isEndingSoon ? 'text-danger' : 'text-primary'}`}>
                {diffDays} Day{diffDays !== 1 ? 's' : ''} Left
            </p>
            <p className={`text-xs ${isEndingSoon ? 'text-danger/80' : 'text-primary/80'}`}>in your trial</p>
        </div>
    );
};

export const Sidebar: FC<SidebarProps> = ({ activePage, onPageChange, currentUser, isOpen, setIsOpen, company, subscriptionStatus }) => {
  const navItems = [
    {
      label: NavigationItem.Dashboard,
      icon: DashboardIcon,
      roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    },
    {
      label: NavigationItem.KPIs,
      icon: KpiIcon,
      roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    },
    {
      label: NavigationItem.Team,
      icon: TeamIcon,
      roles: [UserRole.Admin],
    },
    {
      label: NavigationItem.Settings,
      icon: SettingsIcon,
      roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    },
  ];

  const visibleNavItems = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <div className={`fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-dark-card/70 backdrop-blur-lg h-full flex flex-col p-4 border-r border-gray-200/80 dark:border-gray-700/60 shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center mb-10 px-2">
          <svg
            className="w-10 h-10 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-2xl font-bold text-primary dark:text-white ml-2">KPI GO</h1>
        </div>
        <nav className="flex-grow">
          <ul>
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={activePage === item.label}
                onClick={() => onPageChange(item.label)}
              />
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
            {subscriptionStatus === 'trialing' && <TrialStatus company={company} />}
            {currentUser && (
              <div className="p-3 bg-gray-500/10 rounded-lg flex items-center">
                  <img src={currentUser.avatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-800 dark:text-dark-text">{currentUser.name}</p>
                      <p className="text-xs text-light-text dark:text-gray-400">{currentUser.role}</p>
                  </div>
              </div>
          )}
        </div>
      </div>
    </>
  );
};

const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const KpiIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const TeamIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 10a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);