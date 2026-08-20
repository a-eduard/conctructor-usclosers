"use client";

import React from 'react';
import { useWizardStore } from '../context/WizardStore';
import { Box, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { WIZARD_PRESETS, PresetConfig, PresetRole } from '../../../config/presets';
import { ROLE_NAMES } from '../types/wizard.types';

export const Step2PathSelection: React.FC = () => {
  const nextStep = useWizardStore(state => state.nextStep);
  const prevStep = useWizardStore(state => state.prevStep);
  const setPreset = useWizardStore(state => state.setPreset);
  
  const handleCustomSquad = () => {
    setPreset(null, {});
    nextStep();
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = WIZARD_PRESETS[presetId];
    if (preset) {
      const items: Record<string, number> = {};
      preset.roles.forEach((role: PresetRole) => {
        items[role.roleId] = role.quantity;
      });
      setPreset(presetId, items);
      nextStep();
    }
  };

  const presetValues = Object.values(WIZARD_PRESETS) as PresetConfig[];
  const solutions = presetValues.filter((p: PresetConfig) => p.category === 'solution');
  const units = presetValues.filter((p: PresetConfig) => p.category === 'unit');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 transition-theme">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-4 transition-theme">Choose Your Path</h1>
        <p className="text-text-secondary text-lg transition-theme">Pick a pre-built use case or build your own team from scratch.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text-primary transition-theme">Solutions (Use Cases)</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution: PresetConfig) => (
            <div 
              key={solution.id}
              onClick={() => handleSelectPreset(solution.id)}
              className="p-6 rounded-2xl border-2 border-border-primary bg-background-secondary hover:border-blue-500 hover:shadow-md cursor-pointer transition-theme flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 transition-theme">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-text-primary text-lg mb-2 transition-theme">{solution.title}</h3>
              <p className="text-text-secondary text-sm mb-6 flex-1 transition-theme">{solution.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {solution.roles.map((r: PresetRole) => (
                  <span key={r.roleId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-surface border border-border-primary text-text-primary transition-theme">
                    {r.quantity} {ROLE_NAMES[r.roleId] || r.roleId}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text-primary transition-theme">A-la-carte / Units</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {units.map((unit: PresetConfig) => (
            <div 
              key={unit.id}
              onClick={() => handleSelectPreset(unit.id)}
              className="p-6 rounded-2xl border-2 border-border-primary bg-background-secondary hover:border-blue-500 hover:shadow-md cursor-pointer transition-theme flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 transition-theme">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-text-primary text-lg mb-1 transition-theme">{unit.title}</h3>
              <p className="text-text-secondary text-sm mb-4 transition-theme">{unit.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {unit.roles.map((r: PresetRole) => (
                  <span key={r.roleId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background-surface border border-border-primary text-text-secondary transition-theme">
                    {r.quantity} {ROLE_NAMES[r.roleId] || r.roleId}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Custom Squad */}
          <div 
            onClick={handleCustomSquad}
            className="p-6 rounded-2xl border-2 border-dashed border-border-primary bg-background-primary hover:bg-background-secondary hover:border-blue-500 hover:shadow-md cursor-pointer transition-theme flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-background-surface flex items-center justify-center mb-3 text-text-secondary transition-theme">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-text-primary text-lg transition-theme">Custom Squad</h3>
            <p className="text-text-secondary text-sm transition-theme">Build your team from scratch</p>
          </div>
        </div>
      </div>

      <div className="pt-8 flex gap-4">
        <button 
          onClick={prevStep}
          className="px-6 py-4 rounded-xl border border-border-primary text-text-secondary font-semibold hover:bg-background-surface transition-theme"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
};