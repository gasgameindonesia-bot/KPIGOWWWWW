
import { useState, useEffect, useMemo } from 'react';
import type { User, Company, SubscriptionStatus } from '../types';
import { UserRole } from '../types';
import { mockUsers } from '../data/mockData';

const MOCK_USER_STORAGE_KEY = 'kpi_go_user';
const MOCK_COMPANY_STORAGE_KEY = 'kpi_go_company';

const getMockUser = (email: string): User | undefined => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) return { ...foundUser }; // Return a copy
    return undefined;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
            const storedCompany = localStorage.getItem(MOCK_COMPANY_STORAGE_KEY);
            if (storedUser && storedCompany) {
                setUser(JSON.parse(storedUser));
                setCompany(JSON.parse(storedCompany));
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            localStorage.removeItem(MOCK_USER_STORAGE_KEY);
            localStorage.removeItem(MOCK_COMPANY_STORAGE_KEY);
        }
    }, []);

    const subscriptionStatus: SubscriptionStatus | null = useMemo(() => {
        if (!company) return null;
        if (company.subscriptionStatus === 'active') return 'active';
        
        const trialEnds = new Date(company.trialEndsAt);
        const now = new Date();

        if (now < trialEnds) {
            return 'trialing';
        }
        return 'expired';
    }, [company]);

    const login = (email: string): boolean => {
        const foundUser = getMockUser(email);
        if (foundUser) {
            // In a real app, you'd fetch the company data based on user's companyId
            // Here, we'll just use a mock company tied to the first user for demo purposes
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            
            const mockCompany: Company = {
                id: 'comp-1',
                name: 'Mock Industries',
                ownerId: 'user-1',
                subdomain: 'mock',
                subscriptionStatus: 'trialing',
                trialEndsAt: trialEndDate.toISOString(),
                createdAt: new Date().toISOString(),
            };

            localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(foundUser));
            localStorage.setItem(MOCK_COMPANY_STORAGE_KEY, JSON.stringify(mockCompany));
            setUser(foundUser);
            setCompany(mockCompany);
            return true;
        }
        return false;
    };

    const loginWithGoogle = () => {
        // Simulate logging in with Google as an existing mock user
        login('eleanor@kpi-go.com');
    };

    const logout = () => {
        localStorage.removeItem(MOCK_USER_STORAGE_KEY);
        localStorage.removeItem(MOCK_COMPANY_STORAGE_KEY);
        setUser(null);
        setCompany(null);
    };

    const signUp = (name: string, email: string, companyName: string) => {
        const ownerId = `user-${Date.now()}`;
        const companyId = `comp-${Date.now()}`;
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 30);

        const newUser: User = {
            id: ownerId,
            name,
            email,
            avatar: `https://picsum.photos/seed/${ownerId}/100/100`,
            role: UserRole.Admin,
            jobTitle: 'Founder',
            division: 'Executive',
            companyId: companyId,
        };

        const newCompany: Company = {
            id: companyId,
            name: companyName,
            subdomain: companyName.toLowerCase().replace(/[^a-z0-9]/g, ''),
            ownerId: ownerId,
            subscriptionStatus: 'trialing',
            trialEndsAt: trialEndDate.toISOString(),
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem(MOCK_COMPANY_STORAGE_KEY, JSON.stringify(newCompany));
        setUser(newUser);
        setCompany(newCompany);
    };


    return { user, company, subscriptionStatus, login, logout, signUp, loginWithGoogle };
};
