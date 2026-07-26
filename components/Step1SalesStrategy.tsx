"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, Zap, Settings, Info, UploadCloud } from "lucide-react";

export function Step1SalesStrategy() {
  const { state, updateStep1Data, markClientProvided, addCartItem, removeCartItem, removeClientProvided } = useWizard();
  
  const handleChannelToggle = (channel: string) => {
    const current = state.step1Data.channels;
    if (current.includes(channel)) {
      updateStep1Data({ channels: current.filter(c => c !== channel) });
    } else {
      updateStep1Data({ channels: [...current, channel] });
    }
  };

  const isConsultingInCart = state.cartItems.some(i => i.optionId === 'sales_consulting');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        
        {/* Sales Methodology */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Sales Methodology</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Select your existing framework or get expert consulting to build one.</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex flex-wrap gap-2">
                {['MEDDIC', 'SPIN', 'Challenger', 'Other', "I don't know"].map(method => {
                  const isSelected = state.step1Data.methodology === method;
                  return (
                    <button
                      key={method}
                      onClick={() => {
                        if (isSelected) {
                          updateStep1Data({ methodology: '' });
                          if (state.clientProvided.includes('sales_methodology')) {
                            removeClientProvided('sales_methodology');
                          }
                        } else {
                          updateStep1Data({ methodology: method });
                          if (!state.clientProvided.includes('sales_methodology')) {
                            markClientProvided('sales_methodology');
                          }
                          if (isConsultingInCart) {
                            removeCartItem('sales_consulting');
                          }
                        }
                      }}
                      className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/50 dark:text-indigo-400 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{method}</span>
                    </button>
                  );
                })}
              </div>
              <button
                id="diy-item-sales_consulting"
                onClick={() => {
                  if (isConsultingInCart) {
                    if (state.step1Data.methodology === 'Consulting') updateStep1Data({ methodology: '' });
                    removeCartItem('sales_consulting');
                  } else {
                    updateStep1Data({ methodology: 'Consulting' });
                    if (state.clientProvided.includes('sales_methodology')) {
                      removeClientProvided('sales_methodology');
                    }
                    addCartItem({ 
                      allocatedHours: 0, paymentType: 'one-time', optionId: 'sales_consulting', 
                      name: 'Sales Consulting', 
                      price: 1500, 
                      sla: '7 Days',
                      category: 'service',
                      purpose: 'For expert guidance in building your sales methodology'
                    });
                  }
                }}
                className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  isConsultingInCart
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm'
                    : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 shadow-sm hover:-translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 transition-colors ${isConsultingInCart ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm transition-colors ${isConsultingInCart ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    Buy Sales Consulting
                  </span>
                </div>
                <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
                  <span className={`text-xs font-mono font-semibold text-slate-500 right-0`}>+$1,500</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Primary Channels</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Which channels do you plan to use for outreach?</p>
            </div>
            
            <div className="flex flex-wrap gap-3 shrink-0">
              {['Cold Email', 'Cold Calling', 'LinkedIn', 'Inbound'].map(channel => {
                const isSelected = state.step1Data.channels.includes(channel);
                return (
                  <label key={channel} className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
                    isSelected ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500/50 dark:bg-indigo-500/10 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800/50 dark:bg-slate-800/50 dark:hover:border-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleChannelToggle(channel)}
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>
                      {channel}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing Strategy */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 max-w-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Pricing Strategy</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Set your target contract value and subscription model.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 flex-1 max-w-xl">
              <div className="w-full sm:w-[180px] shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Target ACV
                  </label>
                  <div className="group/tooltip relative flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-500 cursor-help transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 text-center shadow-xl">
                      Annual Contract Value - the average annual revenue per customer contract.
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium transition-colors group-focus-within:text-indigo-500">$</span>
                  <input
                    type="number"
                    placeholder="10,000"
                    value={state.step1Data.acv}
                    onChange={(e) => updateStep1Data({ acv: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-800/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white font-mono font-medium text-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Model
                </label>
                <div className="flex gap-2 h-[48px]">
                  <button
                    onClick={() => {
                      if (state.step1Data.subscriptionModel === 'recurring') {
                        updateStep1Data({ subscriptionModel: '' });
                      } else {
                        updateStep1Data({ subscriptionModel: 'recurring' });
                      }
                    }}
                    className={`flex-1 text-center py-2 px-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center text-sm ${
                      state.step1Data.subscriptionModel === 'recurring'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    Recurring
                  </button>
                  
                  <button
                    onClick={() => {
                      if (state.step1Data.subscriptionModel === 'one-time') {
                        updateStep1Data({ subscriptionModel: '' });
                      } else {
                        updateStep1Data({ subscriptionModel: 'one-time' });
                      }
                    }}
                    className={`flex-1 text-center py-2 px-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center text-sm ${
                      state.step1Data.subscriptionModel === 'one-time'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    One-time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Step1BinarySelector 
          optionId="competitor_intel"
          name="Competitors"
          description="Upload your own data or buy our intelligence service."
          diyText="Upload my own data"
          buyText="Buy Competitor Intel"
          price={800}
          sla="7 Days"
          category="service"
          purpose="Deep market and competitor analysis to position your offering."
          providedInfoMessage="Data upload will be available in your dashboard after checkout."
        />
        
        <Step1BinarySelector 
          optionId="partner_mou"
          name="Partnerships"
          description="Bring your own network or buy 100 Partner MoU setup."
          diyText="I have my own network"
          buyText="Buy 100 Partner MoU"
          price={1500}
          sla="14 Days"
          category="service"
          purpose="Rapidly expand your reach with 100 ready-to-sign Partner MoUs."
        />

      </div>
    </div>
  );
}

function Step1BinarySelector({ 
  optionId, 
  name, 
  description, 
  diyText,
  buyText,
  price, 
  sla,
  category,
  purpose,
  providedInfoMessage
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
  providedInfoMessage?: string;
}) {
  const { state, markClientProvided, removeClientProvided, addCartItem, removeCartItem } = useWizard();
  
  const isProvided = state.clientProvided.includes(optionId);
  const isInCart = state.cartItems.some(i => i.optionId === optionId);

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 shrink-0 w-full md:w-[280px]">
          <button
            onClick={() => {
              if (isProvided) {
                removeClientProvided(optionId);
              } else {
                if (isInCart) removeCartItem(optionId);
                markClientProvided(optionId);
              }
            }}
            className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
              isProvided 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' 
                : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 shadow-sm hover:-translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Settings className={`w-5 h-5 shrink-0 transition-colors ${isProvided ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-sm transition-colors ${isProvided ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {diyText}
              </span>
            </div>
            <div className="flex items-center justify-end w-8 h-8 relative shrink-0 group">
              <span className={`text-xs text-slate-500 font-medium right-0`}>$0</span>
            </div>
          </button>

          {isProvided && providedInfoMessage && (
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-500/10 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
              <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-800 dark:text-indigo-200 font-semibold leading-relaxed text-left">
                {providedInfoMessage}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (isInCart) {
                removeCartItem(optionId);
              } else {
                if (isProvided) removeClientProvided(optionId);
                addCartItem({ allocatedHours: 0, paymentType: 'one-time', optionId, name: buyText, price, sla, category, purpose });
              }
            }}
            className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
              isInCart 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' 
                : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 shadow-sm hover:-translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Zap className={`w-5 h-5 shrink-0 transition-colors ${isInCart ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-sm transition-colors ${isInCart ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {buyText}
              </span>
            </div>
            <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
              <span className={`text-xs font-mono font-semibold text-slate-500 right-0`}>+${price.toLocaleString()}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}