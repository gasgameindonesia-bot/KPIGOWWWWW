export enum NavigationItem {
    Dashboard = 'Dashboard',
    KPIs = 'KPIs',
    Team = 'Team',
    Settings = 'Settings',
    Pricing = 'Pricing',
}

export enum UserRole {
    SuperAdmin = 'Super Admin',
    TeamMember = 'Team Member',
}

export type SubscriptionStatus = 'trialing' | 'active' | 'expired' | 'canceled';

export interface Company {
    id: string;
    name: string;
    subdomain: string;
    ownerId: string;
    subscriptionStatus: SubscriptionStatus;
    trialEndsAt: string; // ISO 8601 date string
    createdAt: string; // ISO 8601 date string
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    jobTitle: string;
    division: string;
    companyId: string;
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
  actual: number;
  target: number;
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

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actorId: string;
}