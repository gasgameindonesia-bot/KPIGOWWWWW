import React, { useState } from 'react';
import { LoginForm } from '../auth/LoginForm';
import { SignUpForm } from '../auth/SignUpForm';

interface AuthPageProps {
  onLogin: (email: string) => boolean;
  onSignUp: (name: string, email: string, companyName: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-4xl font-bold text-primary ml-3">KPI GO</h1>
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-8 border border-gray-200/80 dark:border-gray-700/80">
          {isLoginView ? <LoginForm onLogin={onLogin} /> : <SignUpForm onSignUp={onSignUp} />}
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLoginView(!isLoginView)} 
              className="text-sm font-medium text-primary hover:underline focus:outline-none"
            >
              {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
