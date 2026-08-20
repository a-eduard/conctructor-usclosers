"use client";

import React from 'react';
import { WizardHeader } from './WizardHeader';
import { OrderSummary } from './OrderSummary';
import { useWizardUrlParser } from '../hooks/useWizardUrlParser';

interface WizardLayoutProps {
  children: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  // Parse URL to initialize wizard state
  useWizardUrlParser();

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col font-sans pb-32 lg:pb-0 transition-theme">
      <WizardHeader />
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        <div className="grid grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8">
            {children}
          </div>
          
          {/* Right Sidebar (Order Summary) */}
          <div className="col-span-12 lg:col-span-4 relative">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};