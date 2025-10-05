export enum NavigationItem {
    Dashboard = 'Dashboard',
    KPIs = 'KPIs',
    Team = 'Team',
    Settings = 'Settings',
}

export enum UserRole {
    SuperAdmin = 'Super Admin',
    TeamMember = 'Team Member',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    jobTitle: string;
    division: string;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    managerId: string;
    staffIds: string[];
}

export enum KpiFrequency {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Quarterly = 'Quarterly',
    Semester = 'Semester',
    Yearly = 'Yearly',
}

export interface MonthlyProgress {
  year: number;
  month: number; // 1-12 for Jan-Dec
  target: number;
  actual: number;
  notes?: string;
}

export interface KPI {
    id: string;
    goalId: string;
    title: string;
    unit: string;
    frequency: KpiFrequency;
    ownerId: string;
    monthlyProgress: MonthlyProgress[];
    progressBarColor?: string;
    weight?: number;
}