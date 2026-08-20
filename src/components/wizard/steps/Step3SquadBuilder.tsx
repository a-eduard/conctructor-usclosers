"use client";

import React from 'react';
import { useWizardStore } from '../context/WizardStore';
import { ArrowRight, Users, Zap, Database, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { AVAILABLE_ROLES, RoleConfig } from '../../../config/roles';

const ROLE_ICONS: Record<string, React.ElementType> = {
  'scout': Database,
  'sdr': Zap,
  'closer': TrendingUp,
  'team-lead': Users,
};

export const Step3SquadBuilder: React.FC = () => {
  const nextStep = useWizardStore(state => state.nextStep);
  const prevStep = useWizardStore(state => state.prevStep);
  const cart = useWizardStore(state => state.cart);
  const updateCartItemQuantity = useWizardStore(state => state.updateCartItemQuantity);

  const getQty = (roleId: string) => cart[roleId]?.quantity || 0;

  const handleIncrement = (role: RoleConfig) => {
    updateCartItemQuantity(role.id, getQty(role.id) + 1, role.pricePerUnit);
  };

  const handleDecrement = (role: RoleConfig) => {
    const qty = getQty(role.id);
    if (qty > 0) {
      updateCartItemQuantity(role.id, qty - 1, role.pricePerUnit);
    }
  };

  // Smart Rules logic
  const teamLeadQty = getQty('team-lead');
  const sdrQty = getQty('sdr');
  const closerQty = getQty('closer');
  const scoutQty = getQty('scout');
  
  const linearSpecialistsCount = scoutQty + sdrQty + closerQty;
  
  const rule1Active = linearSpecialistsCount >= 3 && teamLeadQty === 0;
  const rule2Active = closerQty >= 1 && sdrQty === 0;

  const handleAddTeamLead = () => {
    const tl = AVAILABLE_ROLES.find((r: RoleConfig) => r.id === 'team-lead');
    if (tl) updateCartItemQuantity(tl.id, 1, tl.pricePerUnit);
  };

  const handleAddSdr = () => {
    const sdr = AVAILABLE_ROLES.find((r: RoleConfig) => r.id === 'sdr');
    if (sdr) updateCartItemQuantity(sdr.id, 1, sdr.pricePerUnit);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 transition-theme">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-4 transition-theme">Build Your Squad</h1>
        <p className="text-text-secondary text-lg transition-theme">Customize the exact team composition you need.</p>
      </div>

      {rule1Active && (
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-900/50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-theme">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 shrink-0 mt-1 sm:mt-0 transition-theme" />
            <div>
              <h4 className="font-bold text-orange-900 dark:text-orange-100 transition-theme">Team Lead Required</h4>
              <p className="text-orange-800 dark:text-orange-300 text-sm mt-1 transition-theme">
                To ensure SLA and effective management for a team of 3 or more, a Fractional Team Lead is required.
              </p>
            </div>
          </div>
          <button 
            onClick={handleAddTeamLead}
            className="shrink-0 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
          >
            + Add Team Lead for $1,500
          </button>
        </div>
      )}

      {rule2Active && !rule1Active && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-theme">
          <div className="flex gap-3">
            <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1 sm:mt-0 transition-theme" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-100 transition-theme">Recommendation: Add SDR</h4>
              <p className="text-amber-800 dark:text-amber-300 text-sm mt-1 transition-theme">
                A Closer works most effectively with a steady stream of meetings. We recommend adding at least 1 SDR.
              </p>
            </div>
          </div>
          <button 
            onClick={handleAddSdr}
            className="shrink-0 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
          >
            + Add 1 SDR for $3,500
          </button>
        </div>
      )}

      <div className="space-y-4">
        {AVAILABLE_ROLES.map((role: RoleConfig) => {
          const Icon = ROLE_ICONS[role.id] || Users;
          const qty = getQty(role.id);
          const isSelected = qty > 0;
          
          return (
            <div 
              key={role.id}
              className={`p-5 rounded-2xl border-2 transition-theme flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-border-primary bg-background-secondary hover:border-blue-300 dark:hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-theme ${
                  isSelected ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-background-surface text-text-secondary'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-lg transition-theme">{role.title}</h3>
                  <p className="text-text-secondary text-sm mt-1 transition-theme">{role.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="font-bold text-text-primary transition-theme">
                  ${role.pricePerUnit.toLocaleString()}<span className="text-text-secondary text-sm font-medium transition-theme">/mo</span>
                </div>
                
                <div className="flex items-center gap-3 bg-background-primary border border-border-primary rounded-lg p-1 shadow-sm transition-theme">
                  <button 
                    onClick={() => handleDecrement(role)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-text-secondary hover:bg-background-surface disabled:opacity-30 disabled:hover:bg-transparent transition-theme"
                  >
                    <span className="text-xl font-medium leading-none">-</span>
                  </button>
                  <span className="w-6 text-center font-bold text-text-primary transition-theme">{qty}</span>
                  <button 
                    onClick={() => handleIncrement(role)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-text-secondary hover:bg-background-surface transition-theme"
                  >
                    <span className="text-xl font-medium leading-none">+</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-8 flex gap-4">
        <button 
          onClick={prevStep}
          className="px-6 py-4 rounded-xl border border-border-primary text-text-secondary font-semibold hover:bg-background-surface transition-theme"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={rule1Active}
          className="flex-1 sm:flex-none sm:ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] disabled:shadow-none disabled:bg-background-surface disabled:text-text-secondary disabled:cursor-not-allowed"
        > 
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};