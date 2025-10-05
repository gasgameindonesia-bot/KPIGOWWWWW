import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { KPI } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LogProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI | null;
  onLogSubmit: (logData: { kpiId: string; year: number; month: number; actual: number; notes?: string }) => void;
}

const months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
];

export const LogProgressModal: FC<LogProgressModalProps> = ({ isOpen, onClose, kpi, onLogSubmit }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [actual, setActual] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && kpi) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      setYear(currentYear);
      setMonth(currentMonth);

      const existingLog = kpi.monthlyProgress.find(p => p.year === currentYear && p.month === currentMonth);
      setActual(existingLog ? String(existingLog.actual) : '');
      setNotes(existingLog?.notes ?? '');
      setError('');
    }
  }, [isOpen, kpi]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpi) return;

    const numericValue = parseFloat(actual);
    if (isNaN(numericValue) || numericValue < 0) {
      setError('Please enter a valid positive number for the actual value.');
      return;
    }
    
    setError('');

    onLogSubmit({
      kpiId: kpi.id,
      year: Number(year),
      month: Number(month),
      actual: numericValue,
      notes: notes,
    });
    onClose();
  };
  
  if (!kpi) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Progress for: ${kpi.title}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="logMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                <select id="logMonth" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text">
                    {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="logYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input type="number" id="logYear" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text" />
            </div>
        </div>

        <div className="mb-4">
          <label htmlFor="logActual" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Actual Value ({kpi.unit})
          </label>
          <input
            type="number"
            id="logActual"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text ${error ? 'border-danger' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="e.g., 5000"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="logNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
          <textarea
            id="logNotes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text"
            placeholder="Add any relevant notes..."
          ></textarea>
        </div>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Log</Button>
        </div>
      </form>
    </Modal>
  );
};