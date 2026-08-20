"use client";

import React from 'react';
import { useWizardStore } from '../context/WizardStore';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { USClosersLogo } from '../../USClosersLogo';

export const WizardHeader: React.FC = () => {
  const currentStep = useWizardStore((state) => state.currentStep);
  const setStep = useWizardStore((state) => state.setStep);
  const router = useRouter();

  const STEPS = [
    { id: 1, label: 'Business Profile' },
    { id: 2, label: 'Select Solution' },
    { id: 3, label: 'Team Builder' },
    { id: 4, label: 'Infrastructure' },
    { id: 5, label: 'Checkout' }
  ];

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="bg-background-primary border-b border-border-primary px-6 py-4 sticky top-0 z-50 transition-theme">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={goHome}
            className="mr-4 hover:opacity-80 transition-opacity"
          >
            <USClosersLogo className="h-8" />
          </button>
          
          <div className="hidden lg:flex items-center space-x-2">
            {STEPS.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => {
                      if (isCompleted) {
                        setStep(step.id);
                      }
                    }}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isCompleted ? 'text-blue-600 cursor-pointer hover:text-blue-500' :
                      isCurrent ? 'text-blue-600 cursor-default' :
                      'text-text-secondary pointer-events-none'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-theme ${
                      isCompleted ? 'bg-blue-600 text-white' :
                      isCurrent ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      'bg-background-secondary text-text-secondary'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className="hidden xl:inline">{step.label}</span>
                  </button>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`h-px w-8 xl:w-12 mx-2 transition-theme ${
                      isCompleted ? 'bg-blue-600' : 'bg-border-primary'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
      
      {/* Mobile Steps indicator */}
      <div className="lg:hidden mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 transition-theme">
          Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}
        </span>
        <div className="flex gap-1">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className={`h-2 rounded-full w-4 transition-theme ${
                step.id <= currentStep ? 'bg-blue-600' : 'bg-border-primary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};