"use client";

import React, { Suspense } from 'react';
import { WizardLayout } from '../../src/components/wizard/layout/WizardLayout';
import { useWizardStore } from '../../src/components/wizard/context/WizardStore';
import { WizardState } from '../../src/components/wizard/types/wizard.types';
import { Step1Segmentation } from '../../src/components/wizard/steps/Step1Segmentation';
import { Step2PathSelection } from '../../src/components/wizard/steps/Step2PathSelection';
import { Step3SquadBuilder } from '../../src/components/wizard/steps/Step3SquadBuilder';
import { Step4Infrastructure } from '../../src/components/wizard/steps/Step4Infrastructure';
import { Step5Checkout } from '../../src/components/wizard/steps/Step5Checkout';

export default function SetupWizardPage() {
  const currentStep = useWizardStore((state: WizardState) => state.currentStep);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-primary text-text-primary flex items-center justify-center transition-theme">
        <div className="flex items-center gap-3 font-medium">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          Loading Wizard...
        </div>
      </div>
    }>
      <WizardLayout>
        {currentStep === 1 && <Step1Segmentation />}
        {currentStep === 2 && <Step2PathSelection />}
        {currentStep === 3 && <Step3SquadBuilder />}
        {currentStep === 4 && <Step4Infrastructure />}
        {currentStep === 5 && <Step5Checkout />}
      </WizardLayout>
    </Suspense>
  );
}