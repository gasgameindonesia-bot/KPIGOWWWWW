import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const CheckmarkIcon = () => (
    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

export const PricingPage: React.FC = () => {
    
    const handleChoosePlan = (plan: 'monthly' | 'yearly') => {
        // This is where you will trigger the Midtrans Snap popup
        console.log(`Chose the ${plan} plan. Integrating Midtrans here.`);
        alert(`You've selected the ${plan} plan!\n(Payment gateway integration pending backend setup)`);
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">Find the perfect plan for your team</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Start with a 30-day free trial. No credit card required. Cancel anytime.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Monthly Plan */}
                <Card className="flex flex-col">
                    <h2 className="text-2xl font-semibold text-primary mb-2">Monthly</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Pay month-to-month.</p>
                    
                    <div className="my-4">
                        <span className="text-5xl font-bold text-gray-800 dark:text-dark-text">75K</span>
                        <span className="text-lg text-gray-500 dark:text-gray-400"> IDR / month</span>
                    </div>

                    <ul className="space-y-3 my-8 flex-grow">
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Unlimited Users</span></li>
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Unlimited Goals & KPIs</span></li>
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Drag & Drop Management</span></li>
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Email Support</span></li>
                    </ul>

                    <Button onClick={() => handleChoosePlan('monthly')} variant="outline" size="lg" className="w-full">
                        Choose Monthly
                    </Button>
                </Card>

                {/* Yearly Plan */}
                 <Card className="flex flex-col border-2 border-primary relative">
                    <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                        <span className="px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full">Save 30%</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-primary mb-2">Yearly</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Pay for a full year.</p>
                    
                    <div className="my-4">
                        <span className="text-5xl font-bold text-gray-800 dark:text-dark-text">630K</span>
                        <span className="text-lg text-gray-500 dark:text-gray-400"> IDR / year</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-through">900K IDR</p>
                    </div>

                    <ul className="space-y-3 my-8 flex-grow">
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Unlimited Users</span></li>
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Unlimited Goals & KPIs</span></li>
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Drag & Drop Management</span></li>
                        <li className="flex items-center"><CheckmarkIcon /><span className="ml-3 text-gray-700 dark:text-gray-300">Priority Email Support</span></li>
                    </ul>

                    <Button onClick={() => handleChoosePlan('yearly')} variant="primary" size="lg" className="w-full">
                        Choose Yearly
                    </Button>
                </Card>
            </div>
        </div>
    );
};
