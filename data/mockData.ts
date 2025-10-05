import type { User, Goal, KPI, MonthlyProgress } from '../types';
import { UserRole, KpiFrequency } from '../types';

// Fix: Added the missing `companyId` property to each mock user object to satisfy the `User` type.
export const mockUsers: User[] = [
    { id: 'user-1', name: 'Eleanor Vance', email: 'eleanor@kpi-go.com', role: UserRole.SuperAdmin, avatar: 'https://picsum.photos/seed/user1/100/100', jobTitle: 'CEO', division: 'Executive', companyId: 'comp-1' },
    { id: 'user-2', name: 'Marcus Reyes', email: 'marcus@kpi-go.com', role: UserRole.TeamMember, avatar: 'https://picsum.photos/seed/user2/100/100', jobTitle: 'Sales Manager', division: 'Sales', companyId: 'comp-1' },
    { id: 'user-3', name: 'Chloe Dubois', email: 'chloe@kpi-go.com', role: UserRole.TeamMember, avatar: 'https://picsum.photos/seed/user3/100/100', jobTitle: 'Sales Associate', division: 'Sales', companyId: 'comp-1' },
    { id: 'user-4', name: 'Kenji Tanaka', email: 'kenji@kpi-go.com', role: UserRole.TeamMember, avatar: 'https://picsum.photos/seed/user4/100/100', jobTitle: 'Support Lead', division: 'Customer Support', companyId: 'comp-1' },
];

export const mockGoals: Goal[] = [
    { id: 'goal-1', title: 'Increase Quarterly Revenue', description: 'Boost overall company revenue by 15% in Q3.', managerId: 'user-2', staffIds: ['user-3'] },
    { id: 'goal-2', title: 'Improve Customer Satisfaction', description: 'Achieve a Net Promoter Score (NPS) of 9.0 or higher.', managerId: 'user-4', staffIds: ['user-3', 'user-4'] },
    { id: 'goal-3', title: 'Expand Market Reach', description: 'Launch product in two new international markets.', managerId: 'user-1', staffIds: ['user-2'] },
];

const currentYear = new Date().getFullYear();

const generateFullYearProgress = (targets: { [month: number]: { actual: number, target: number } }): MonthlyProgress[] => {
    return Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const data = targets[month];
        return {
            year: currentYear,
            month,
            actual: data?.actual ?? 0,
            target: data?.target ?? 0,
        };
    });
};


export const mockKpis: KPI[] = [
    { 
      id: 'kpi-1', 
      goalId: 'goal-1', 
      title: 'New Sales Revenue', 
      unit: '$',
      frequency: KpiFrequency.Monthly, 
      ownerId: 'user-2',
      monthlyProgress: generateFullYearProgress({
        7: { actual: 120000, target: 160000 },
        8: { actual: 155000, target: 165000 },
        9: { actual: 100000, target: 170000 },
        10: { actual: 0, target: 175000 },
      }),
      progressBarColor: '#3498db',
      weight: 30,
    },
    { 
      id: 'kpi-2', 
      goalId: 'goal-1', 
      title: 'Upsell/Cross-sell Revenue', 
      unit: '$',
      frequency: KpiFrequency.Monthly, 
      ownerId: 'user-3',
      monthlyProgress: generateFullYearProgress({
        7: { actual: 40000, target: 50000 },
        8: { actual: 55000, target: 50000 },
        9: { actual: 15000, target: 55000 },
        10: { actual: 0, target: 55000 },
      }),
      weight: 70,
    },
    { 
      id: 'kpi-3', 
      goalId: 'goal-2', 
      title: 'Customer Support Tickets Resolved', 
      unit: 'tickets',
      frequency: KpiFrequency.Weekly, 
      ownerId: 'user-4',
      monthlyProgress: generateFullYearProgress({
        9: { actual: 480, target: 500 },
      }),
      progressBarColor: '#9b59b6',
      weight: 60,
    },
    { 
      id: 'kpi-4', 
      goalId: 'goal-2', 
      title: 'Average Response Time', 
      unit: 'hours',
      frequency: KpiFrequency.Daily, 
      ownerId: 'user-4',
      monthlyProgress: generateFullYearProgress({
        9: { actual: 5, target: 4 },
      }),
      weight: 40,
    },
    { 
      id: 'kpi-5', 
      goalId: 'goal-3', 
      title: 'New International Leads', 
      unit: 'leads',
      frequency: KpiFrequency.Weekly, 
      ownerId: 'user-2',
      monthlyProgress: generateFullYearProgress({
        9: { actual: 650, target: 1000 },
      }),
      weight: 100,
    },
];