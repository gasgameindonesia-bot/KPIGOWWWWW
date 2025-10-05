import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface LoginFormProps {
  onLogin: (email: string) => boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
