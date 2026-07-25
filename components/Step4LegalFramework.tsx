"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, UploadCloud, Info, X } from "lucide-react";

export function Step4LegalFramework() {
  const { state } = useWizard();

  const isLoneWolf = 
    state.clientProvided.includes('lead_gen') &&
    state.clientProvided.includes('qualification') &&
    state.clientProvided.includes('demo');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        {!isLoneWolf ? (
          <Step4LegalSelector 
            optionId="hiring_agreement"
            name="Hiring Agreement"
            description="Standard hiring and contractor agreements for your team."
            diyText="Upload my own"
            buyText="Buy as a service"
            price={400}
            sla="2 Days"
            category="service"
            purpose="Standard hiring and contractor agreements for your team."
          />
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-8 shadow-sm opacity-60 relative group transition-all">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">Hiring Agreement</h3>
                  <div className="group relative inline-flex">
                    <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl text-center z-10 animate-in fade-in zoom-in-95 duration-200">
                      Not required for solo founders
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed max-w-2xl">
                  Standard hiring and contractor agreements for your team.
                </p>
              </div>
              <div className="shrink-0 w-full xl:w-72">
                <div className="w-full text-center p-4 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 text-sm font-bold border border-transparent">
                  Not required
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Step4LegalSelector 
          optionId="service_agreement"
          name="Service Agreement"
          description="Client-facing service agreements to protect your agency."
          diyText="Upload my own"
          buyText="Buy as a service"
          price={600}
          sla="3 Days"
          category="service"
          purpose="Client-facing service agreements to protect your agency."
        />
        
        <Step4LegalSelector 
          optionId="terms_of_service"
          name="Terms of Service"
          description="Standard ToS and Privacy Policy for your platform or service."
          diyText="Upload my own"
          buyText="Buy as a service"
          price={800}
          sla="4 Days"
          category="service"
          purpose="Standard ToS and Privacy Policy for your platform or service."
        />
        
        <Step4LegalSelector 
          optionId="gdpr_compliance"
          name="GDPR Compliance"
          description="Ensure full GDPR and privacy compliance for European clients."
          diyText="I am compliant"
          buyText="Buy as a service"
          price={1500}
          sla="7 Days"
          category="service"
          purpose="Full GDPR and privacy compliance for European clients."
        />
      </div>
    </div>
  );
}

function Step4LegalSelector({ 
  optionId, 
  name, 
  description, 
  diyText,
  buyText,
  price, 
  sla,
  category,
  purpose
}: { 
  optionId: string; 
  name: string; 
  description: string; 
  diyText: string;
  buyText: string;
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
          
          {isProvided && diyText !== "I am compliant" && (
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
                {diyText}
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
              if (!isInCart) addCartItem({ allocatedHours: 0, paymentType: 'one-time', optionId, name: buyText, price, sla, category, purpose });
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
                {buyText}
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