
import React from 'react';
import type { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200/80 ${className}`}>
      {children}
    </div>
  );
};
