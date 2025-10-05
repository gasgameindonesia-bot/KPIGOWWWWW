import React from 'react';
import type { FC, ReactNode, HTMLAttributes } from 'react';

// Fix: Updated the Card component to accept standard div HTML attributes (like onClick)
// by extending HTMLAttributes<HTMLDivElement> and spreading props. This resolves the
// type error in UserProfileView where an `onClick` handler was being passed.
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-200/80 dark:border-gray-700/80 ${className}`} {...props}>
      {children}
    </div>
  );
};
