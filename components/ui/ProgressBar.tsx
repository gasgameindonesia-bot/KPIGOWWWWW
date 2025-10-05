
import React from 'react';
import type { FC } from 'react';

interface ProgressBarProps {
  progress: number; // A value between 0 and 100
  className?: string;
  customColor?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, className = '', customColor }) => {
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  const defaultColorClass = () => {
    if (normalizedProgress < 40) return 'bg-danger';
    if (normalizedProgress < 75) return 'bg-secondary';
    return 'bg-accent';
  };

  const barStyle = {
    width: `${normalizedProgress}%`,
    ...(customColor && { backgroundColor: customColor })
  };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${!customColor ? defaultColorClass() : ''}`}
        style={barStyle}
      ></div>
    </div>
  );
};