import React from 'react';
import type { FC } from 'react';
import { NavigationItem } from '../../types';

interface SidebarProps {
  activePage: NavigationItem;
  onPageChange: (page: NavigationItem) => void;
}

const NavLink: FC<{
  icon: React.ReactElement;
  label: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-gray-600 hover:bg-primary-light hover:text-white'
    }`}
  >
    {React.cloneElement(icon, { className: 'h-6 w-6' })}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

export const Sidebar: FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const navItems = [
    {
      label: NavigationItem.Dashboard,
      icon: <DashboardIcon />,
    },
    {
      label: NavigationItem.KPIs,
      icon: <KpiIcon />,
    },
    {
      label: NavigationItem.Team,
      icon: <TeamIcon />,
    },
  ];

  return (
    <div className="w-64 bg-white h-full flex flex-col p-4 border-r border-gray-200 shadow-sm">
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
        <h1 className="text-2xl font-bold text-primary ml-2">KPI GO</h1>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
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
      <div className="mt-auto p-3 bg-gray-100 rounded-lg flex items-center">
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-white">
          ?
        </div>
        <div className="ml-3">
            <p className="text-sm font-semibold">Help Center</p>
            <p className="text-xs text-gray-500">Get support</p>
        </div>
      </div>
    </div>
  );
};

// FIX: Update icon components to accept props. This resolves an error where React.cloneElement attempted to pass a `className` prop to components that did not accept any props.
const DashboardIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const KpiIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const TeamIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 10a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);