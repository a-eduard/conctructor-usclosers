"use client";

import React from 'react';
import { useWizardStore } from '../context/WizardStore';
import { ArrowRight, Cloud, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Step4Infrastructure: React.FC = () => {
  const nextStep = useWizardStore(state => state.nextStep);
  const prevStep = useWizardStore(state => state.prevStep);
  const cart = useWizardStore(state => state.cart);
  const chosenPresetId = useWizardStore(state => state.chosenPresetId);

  const cartItems = Object.values(cart);
  const totalSeats = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isIncluded = !!chosenPresetId;
  const basePrice = 999;
  const perSeatPrice = 10;
  const calculatedPrice = basePrice + (perSeatPrice * totalSeats);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 transition-theme">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-4 transition-theme">Infrastructure</h1>
        <p className="text-text-secondary text-lg transition-theme">Sales Ops Cloud is required to power your fractional team.</p>
      </div>

      <div className="bg-background-secondary p-8 rounded-2xl border-2 border-blue-500 shadow-sm relative overflow-hidden transition-theme">
        <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1 text-sm font-bold rounded-bl-xl transition-theme">
          Required
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 transition-theme">
            <Cloud className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-2 transition-theme">Sales Ops Cloud</h3>
            <p className="text-text-secondary mb-6 transition-theme">Complete technical infrastructure including CRM setup, dialers, domain warming, and analytics dashboards.</p>
            
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                'CRM Configuration & Hygiene',
                'IP Telephony & Dialers',
                'Email Domain Warming',
                'Real-time Analytics Dashboard'
              ].map(feature => (
                <div key={feature} className="flex items-center gap-2 text-text-primary font-medium transition-theme">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-border-primary flex items-end justify-between transition-theme">
              <div>
                <div className="text-sm text-text-secondary font-medium mb-1 transition-theme">Pricing</div>
                {isIncluded ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-text-secondary line-through transition-theme">${calculatedPrice.toLocaleString()}/mo</span>
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 transition-theme">$0 <span className="text-lg font-medium">Included</span></span>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-extrabold text-text-primary transition-theme">${calculatedPrice.toLocaleString()}</span>
                    <span className="text-lg font-medium text-text-secondary mb-1 transition-theme">/mo</span>
                  </div>
                )}
              </div>
            </div>
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
        <button 
          onClick={nextStep}
          className="flex-1 sm:flex-none sm:ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
        > 
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};