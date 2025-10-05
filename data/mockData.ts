import type { User, Goal, KPI } from '../types';
import { UserRole, KpiFrequency } from '../types';

export const mockUsers: User[] = [
    { id: 'user-1', name: 'Eleanor Vance', email: 'eleanor@kpi-go.com', role: UserRole.SuperAdmin, avatar: 'https://picsum.photos/seed/user1/100/100', jobTitle: 'CEO', division: 'Executive' },
    { id: 'user-2', name: 'Marcus Reyes', email: 'marcus@kpi-go.com', role: UserRole.TeamMember, avatar: 'https://picsum.photos/seed/user2/100/100', jobTitle: 'Sales Manager', division: 'Sales' },
    { id: 'user-3', name: 'Chloe Dubois', email: 'chloe@kpi-go.com', role: UserRole.TeamMember, avatar: 'https://picsum.photos/seed/user3/100/100', jobTitle: 'Sales Associate', division: 'Sales' },
    { id: 'user-4', name: 'Kenji Tanaka', email: 'kenji@kpi-go.com', role: UserRole.TeamMember, avatar: 'https://picsum.photos/seed/user4/100/100', jobTitle: 'Support Lead', division: 'Customer Support' },
];

export const mockGoals: Goal[] = [
    { id: 'goal-1', title: 'Increase Quarterly Revenue', description: 'Boost overall company revenue by 15% in Q3.', managerId: 'user-2', staffIds: ['user-3'] },
    { id: 'goal-2', title: 'Improve Customer Satisfaction', description: 'Achieve a Net Promoter Score (NPS) of 9.0 or higher.', managerId: 'user-4', staffIds: ['user-3', 'user-4'] },
    { id: 'goal-3', title: 'Expand Market Reach', description: 'Launch product in two new international markets.', managerId: 'user-1', staffIds: ['user-2'] },
];

const currentYear = new Date().getFullYear();

export const mockKpis: KPI[] = [
    { 
      id: 'kpi-1', 
      goalId: 'goal-1', 
      title: 'New Sales Revenue', 
      unit: '$', 
      frequency: KpiFrequency.Monthly, 
      ownerId: 'user-2',
      monthlyProgress: [
        { year: currentYear, month: 7, target: 167000, actual: 120000 },
        { year: currentYear, month: 8, target: 167000, actual: 155000 },
        { year: currentYear, month: 9, target: 167000, actual: 100000 },
      ],
      progressBarColor: '#3498db',
    },
    { 
      id: 'kpi-2', 
      goalId: 'goal-1', 
      title: 'Upsell/Cross-sell Revenue', 
      unit: '$', 
      frequency: KpiFrequency.Monthly, 
      ownerId: 'user-3',
      monthlyProgress: [
        { year: currentYear, month: 7, target: 50000, actual: 40000 },
        { year: currentYear, month: 8, target: 50000, actual: 55000 },
        { year: currentYear, month: 9, target: 50000, actual: 15000 },
      ]
    },
    // FIX: Removed `targetValue` and `currentValue` as they are not properties of the KPI type.
    // The data is correctly represented within the `monthlyProgress` array.
    { 
      id: 'kpi-3', 
      goalId: 'goal-2', 
      title: 'Customer Support Tickets Resolved', 
      unit: 'tickets', 
      frequency: KpiFrequency.Weekly, 
      ownerId: 'user-4',
      monthlyProgress: [
        { year: currentYear, month: 9, target: 500, actual: 480 },
      ],
      progressBarColor: '#9b59b6',
    },
    { 
      id: 'kpi-4', 
      goalId: 'goal-2', 
      title: 'Average Response Time', 
      unit: 'hours', 
      frequency: KpiFrequency.Daily, 
      ownerId: 'user-4',
      monthlyProgress: [
        { year: currentYear, month: 9, target: 4, actual: 5 },
      ]
    },
    { 
      id: 'kpi-5', 
      goalId: 'goal-3', 
      title: 'New International Leads', 
      unit: 'leads', 
      frequency: KpiFrequency.Weekly, 
      ownerId: 'user-2',
      monthlyProgress: [
        { year: currentYear, month: 9, target: 1000, actual: 650 },
      ]
    },
];