"use client";

import React from 'react';
import { useWizardStore } from '../context/WizardStore';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientSegment } from '../types/wizard.types';

export const Step1Segmentation: React.FC = () => {
  const segment = useWizardStore(state => state.segment);
  const setSegment = useWizardStore(state => state.setSegment);
  const nextStep = useWizardStore(state => state.nextStep);

  const handleSegmentClick = (id: ClientSegment) => {
    setSegment(id);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const segments: { id: ClientSegment; label: string; desc: string }[] = [
    { id: 'startup', label: 'Startup', desc: 'Seed & Series A, looking to build first sales process.' },
    { id: 'smb', label: 'SMB', desc: 'Scaling operations, establishing predictable revenue.' },
    { id: 'enterprise', label: 'Enterprise', desc: 'Large scale operations, custom SLA required.' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 transition-theme">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-4 transition-theme">
          What&apos;s the scale of your operation?
        </h1>
        <p className="text-text-secondary text-lg transition-theme">
          Select the profile that best describes your company stage.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {segments.map(s => (
          <div 
            key={s.id}
            onClick={() => handleSegmentClick(s.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-theme ${
              segment === s.id 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md' 
                : 'border-border-primary bg-background-secondary hover:border-blue-300 dark:hover:border-blue-500/50'
            }`}
          >
            <h3 className="font-bold text-text-primary text-xl mb-2 transition-theme">{s.label}</h3>
            <p className="text-text-secondary text-sm transition-theme">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <button 
          onClick={nextStep}
          disabled={!segment}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] disabled:shadow-none disabled:bg-background-surface disabled:text-text-secondary disabled:cursor-not-allowed"
        > 
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};