import React from 'react';
import { Button } from './Button';

interface PaywallProps {
    onUpgrade: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onUpgrade }) => {
  return (
    <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-md p-8 text-center transform transition-all">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <svg className="h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">Your Free Trial Has Ended</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please upgrade your plan to continue managing your team's KPIs and achieving your goals.
        </p>
        <Button onClick={onUpgrade} size="lg" className="w-full">
          Upgrade Your Plan
        </Button>
      </div>
    </div>
  );
};
