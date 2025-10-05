
import React, { useState } from 'react';
import { Button } from '../ui/Button';

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8.653l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path>
      <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.687 46 30.655 46 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
  );

interface LoginFormProps {
  onLogin: (email: string) => boolean;
  onLoginWithGoogle: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onLoginWithGoogle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-dark-text mb-6">Welcome Back!</h2>
      {error && <p className="bg-danger/10 text-danger text-sm text-center p-3 rounded-md mb-4">{error}</p>}
      
      <div className="space-y-4">
        <Button variant="outline" type="button" className="w-full !font-medium" onClick={onLoginWithGoogle}>
            <GoogleIcon />
            <span className="ml-3">Continue with Google</span>
        </Button>

        <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" size="lg">
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
};
