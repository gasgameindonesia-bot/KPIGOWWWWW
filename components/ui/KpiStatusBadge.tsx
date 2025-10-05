import React from 'react';

interface KpiStatusBadgeProps {
  actual: number;
  target: number;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ExceedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
    </svg>
);

const UnmetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

export const KpiStatusBadge: React.FC<KpiStatusBadgeProps> = ({ actual, target }) => {
  if (target <= 0) {
    return null;
  }

  let status: 'exceeded' | 'met' | 'unmet';
  if (actual > target) {
      status = 'exceeded';
  } else if (actual === target) {
      status = 'met';
  } else {
      status = 'unmet';
  }

  const config = {
    exceeded: {
      bgColor: 'bg-accent/10 dark:bg-accent/20',
      textColor: 'text-accent dark:text-accent',
      icon: <ExceedIcon />,
      label: 'Exceeded',
    },
    met: {
      bgColor: 'bg-primary/10 dark:bg-primary/20',
      textColor: 'text-primary-dark dark:text-primary-light',
      icon: <CheckIcon />,
      label: 'Target Met',
    },
    unmet: {
      bgColor: 'bg-secondary/10 dark:bg-secondary/20',
      textColor: 'text-yellow-700 dark:text-secondary',
      icon: <UnmetIcon />,
      label: 'In Progress',
    },
  };

  const currentConfig = config[status];

  return (
    <div
      title={currentConfig.label}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${currentConfig.bgColor} ${currentConfig.textColor}`}
    >
      {currentConfig.icon}
      <span className="ml-1.5">{currentConfig.label}</span>
    </div>
  );
};