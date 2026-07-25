"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, UploadCloud, X } from "lucide-react";

export function Step3SalesMaterials() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        <Step3MaterialSelector 
          optionId="sales_deck"
          name="Pitch Deck (Presentation)"
          description="A high-converting 15-slide pitch deck for discovery and demo calls."
          price={1500}
          sla="7 Days"
          category="service"
          purpose="A high-converting presentation for discovery and demo calls."
        />
        <Step3MaterialSelector 
          optionId="one_pager"
          name="One-Pager (Summary Document)"
          description="Concise one-pager for quick sending and follow-ups."
          price={500}
          sla="3 Days"
          category="service"
          purpose="Concise document for quick sending and follow-ups."
        />
        <Step3MaterialSelector 
          optionId="objections_playbook"
          name="Objections Playbook"
          description="How to answer common and edge-case objections."
          price={800}
          sla="5 Days"
          category="service"
          purpose="Scripted answers to overcome common and edge-case objections."
        />
        <Step3MaterialSelector 
          optionId="sales_playbook"
          name="Sales Playbook"
          description="Comprehensive guide for the sales team."
          price={2000}
          sla="10 Days"
          category="service"
          purpose="Comprehensive sales process guide for the team."
        />
        <Step3MaterialSelector 
          optionId="battlecards"
          name="Battlecards (Competitor Comparisons)"
          description="Competitive battlecards for sales reps."
          price={1200}
          sla="7 Days"
          category="service"
          purpose="Competitive battlecards for sales reps to win deals."
        />
      </div>
    </div>
  );
}

function Step3MaterialSelector({ 
  optionId, 
  name, 
  description, 
  price, 
  sla,
  category,
  purpose
}: { 
  optionId: string; 
  name: string; 
  description: string; 
  price: number;
  sla: string;
  category: 'hire' | 'service';
  purpose: string;
}) {
  const { state, markClientProvided, removeClientProvided, addCartItem, removeCartItem } = useWizard();
  
  const isProvided = state.clientProvided.includes(optionId);
  const isInCart = state.cartItems.some(i => i.optionId === optionId);

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
            {description}
          </p>
          
          {isProvided && (
            <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
              <UploadCloud className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">File upload deferred</p>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1 font-medium">
                  Great! You will upload this file to your Dashboard after checkout.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 shrink-0 w-full md:w-[280px]">
          <button
            onClick={() => {
              if (!isProvided) markClientProvided(optionId);
            }}
            className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
              isProvided 
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-sm cursor-default' 
                : 'border-slate-200 dark:border-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer hover:-translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className={`w-5 h-5 shrink-0 transition-colors ${isProvided ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-sm transition-colors ${isProvided ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Upload my own
              </span>
            </div>
            <div className="flex items-center justify-end w-8 h-8 relative shrink-0 group">
              <span className={`text-xs text-slate-500 font-medium transition-opacity absolute right-0 ${isProvided ? 'opacity-0 md:opacity-100 md:group-hover:opacity-0' : ''}`}>$0</span>
              {isProvided && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeClientProvided(optionId);
                  }}
                  className="absolute opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 text-red-500 transition-all cursor-pointer right-0"
                >
                  <X className="w-4 h-4" />
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => {
              if (!isInCart) addCartItem({ allocatedHours: 0, paymentType: 'one-time', optionId, name: `Buy ${name}`, price, sla, category, purpose });
            }}
            className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
              isInCart 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm cursor-default' 
                : 'border-slate-200 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer hover:-translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className={`w-5 h-5 shrink-0 transition-colors ${isInCart ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-sm transition-colors ${isInCart ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Buy as a service
              </span>
            </div>
            <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
              <span className={`text-xs font-mono font-semibold text-slate-500 transition-opacity absolute right-0 ${isInCart ? 'opacity-0 md:opacity-100 md:group-hover:opacity-0' : ''}`}>+${price.toLocaleString()}</span>
              {isInCart && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCartItem(optionId);
                  }}
                  className="absolute opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 text-red-500 transition-all cursor-pointer right-0"
                >
                  <X className="w-4 h-4" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}