import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlyProgress } from '../../types';

interface KpiProgressChartProps {
  progress: MonthlyProgress[];
  unit: string;
}

const getMonthName = (monthNumber: number) => {
    return new Date(2000, monthNumber - 1, 1).toLocaleString('en-US', { month: 'short' });
}

export const KpiProgressChart: React.FC<KpiProgressChartProps> = ({ progress, unit }) => {
  const data = progress
    .slice()
    .sort((a, b) => a.month - b.month)
    .map(p => ({
      name: getMonthName(p.month),
      Actual: p.actual,
      Target: p.target,
    }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#a0aec0" />
          <YAxis stroke="#a0aec0" tickFormatter={(value) => `${unit}${value / 1000}k`} />
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), '']}
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '8px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="Actual" stroke="#0D47A1" strokeWidth={3} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Target" stroke="#FFC107" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
