"use client";

import React, { useState } from 'react';
import { useWizardStore } from '../context/WizardStore';
import { Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLE_NAMES } from '../types/wizard.types';

export const OrderSummary: React.FC = () => {
  const cart = useWizardStore((state) => state.cart);
  const currentStep = useWizardStore((state) => state.currentStep);
  const segment = useWizardStore((state) => state.segment);
  const chosenPresetId = useWizardStore((state) => state.chosenPresetId);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const cartItems = Object.values(cart);
  const totalRolesCost = cartItems.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);
  
  const totalSeats = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const infrastructureCost = chosenPresetId ? 0 : (999 + (10 * totalSeats));
  const showInfrastructure = currentStep >= 4;

  const totalMonthlyCost = totalRolesCost + (showInfrastructure ? infrastructureCost : 0);

  const isEnterprise = segment === 'enterprise';

  const getSegmentName = () => {
    switch (segment) {
      case 'startup': return 'Startup Profile';
      case 'smb': return 'SMB Profile';
      case 'enterprise': return 'Enterprise Profile';
      default: return null;
    }
  };

  const summaryContent = (
    <>
      <div className="space-y-4 mb-6 max-h-[40vh] lg:max-h-none overflow-y-auto pr-2">
        {currentStep === 1 && !segment && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl text-blue-800 dark:text-blue-300 text-sm transition-theme">
            Please select your business profile to proceed.
          </div>
        )}
        
        {segment && (
          <div className="flex justify-between items-start pb-4 border-b border-border-primary transition-theme">
            <div>
              <div className="font-semibold text-text-primary transition-theme">Business Profile</div>
              <div className="text-xs text-text-secondary transition-theme">{getSegmentName()}</div>
            </div>
            {isEnterprise && (
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-bold transition-theme">
                SLA
              </div>
            )}
          </div>
        )}

        {cartItems.length === 0 ? (
          currentStep > 1 && <p className="text-text-secondary text-sm italic transition-theme">Your team is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.roleId} className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-text-primary transition-theme">
                  {item.quantity} × {ROLE_NAMES[item.roleId] || item.roleId}
                </div>
              </div>
              <div className="font-medium text-text-primary transition-theme">
                ${(item.pricePerUnit * item.quantity).toLocaleString()}/mo
              </div>
            </div>
          ))
        )}

        {showInfrastructure && (
          <div className="flex justify-between items-start pt-4 border-t border-border-primary transition-theme">
            <div>
              <div className="font-semibold text-text-primary transition-theme">Sales Ops Cloud</div>
              <div className="text-xs text-text-secondary transition-theme">Infrastructure & Tools</div>
            </div>
            <div className="font-medium text-text-primary transition-theme">
              {chosenPresetId ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold transition-theme">Included</span>
              ) : (
                `$${infrastructureCost.toLocaleString()}/mo`
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-border-primary flex justify-between items-center mb-6 transition-theme">
        <div className="font-bold text-text-primary text-lg transition-theme">Total</div>
        {isEnterprise ? (
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold transition-theme">
            Custom SLA
          </div>
        ) : (
          <div className="text-2xl font-extrabold text-text-primary transition-theme">
            ${totalMonthlyCost.toLocaleString()}<span className="text-sm text-text-secondary font-medium transition-theme">/mo</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-text-secondary bg-background-surface p-4 rounded-xl transition-theme">
        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 transition-theme" />
        Secure 256-bit SSL encryption. Cancel anytime.
      </div>
    </>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block sticky top-24 bg-background-secondary rounded-2xl border border-border-primary p-8 shadow-sm transition-theme">
        <h3 className="text-xl font-bold text-text-primary mb-6 transition-theme">Order Summary</h3>
        {summaryContent}
      </div>

      {/* Mobile View - Bottom Sheet Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-secondary border-t border-border-primary shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] transition-theme">
        
        {/* Toggle Area */}
        <div 
          className="px-6 py-4 flex items-center justify-between cursor-pointer"
          onClick={() => setMobileExpanded(!mobileExpanded)}
        >
          <div>
            <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1 transition-theme">
              Estimated Total
            </div>
            {isEnterprise ? (
              <div className="font-bold text-blue-600 dark:text-blue-400 transition-theme">Custom Quote</div>
            ) : (
              <div className="text-2xl font-extrabold text-text-primary transition-theme">
                ${totalMonthlyCost.toLocaleString()}<span className="text-sm text-text-secondary font-normal transition-theme">/mo</span>
              </div>
            )}
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-background-surface rounded-full text-text-primary transition-theme">
            {mobileExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-background-secondary border-t border-border-primary transition-theme"
            >
              <div className="p-6">
                {summaryContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};