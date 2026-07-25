"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, X } from "lucide-react";

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
  const isMethodologyProvided = ['MEDDIC', 'SPIN', 'Challenger', 'Other', "I don't know"].includes(state.step1Data.methodology);

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
                {['MEDDIC', 'SPIN', 'Challenger', 'Other', "I don't know"].map(method => (
                  <button
                    key={method}
                    onClick={() => {
                      if (state.step1Data.methodology !== method) {
                        updateStep1Data({ methodology: method });
                        if (!state.clientProvided.includes('sales_methodology')) {
                          markClientProvided('sales_methodology');
                        }
                      }
                    }}
                    className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-300 ${
                      state.step1Data.methodology === method
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/50 dark:text-emerald-400 shadow-sm cursor-default'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{method}</span>
                    {state.step1Data.methodology === method && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStep1Data({ methodology: '' });
                          if (state.clientProvided.includes('sales_methodology')) {
                            removeClientProvided('sales_methodology');
                          }
                        }}
                        className="ml-1 -mr-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!isConsultingInCart) {
                    updateStep1Data({ methodology: 'Consulting' });
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
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-500/50 shadow-sm cursor-default'
                    : 'border-slate-200 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer hover:-translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 transition-colors ${isConsultingInCart ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm transition-colors ${isConsultingInCart ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    Buy Sales Consulting
                  </span>
                </div>
                <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
                  <span className={`text-xs font-mono font-semibold text-slate-500 transition-opacity absolute right-0 ${isConsultingInCart ? 'opacity-0 md:opacity-100 md:group-hover:opacity-0' : ''}`}>+$1,500</span>
                  {isConsultingInCart && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStep1Data({ methodology: '' });
                        removeCartItem('sales_consulting');
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

        {/* Channels */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Primary Channels <span className="text-red-500">*</span></h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Which channels do you plan to use for outreach?</p>
            </div>
            
            <div className="flex flex-wrap gap-3 shrink-0">
              {['Cold Email', 'LinkedIn', 'Inbound'].map(channel => {
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Pricing Strategy <span className="text-red-500">*</span></h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Set your target contract value and subscription model.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 flex-1 max-w-2xl">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Target ACV
                </label>
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
          name="Competitors *"
          description="Upload your own data or buy our intelligence service."
          diyText="Upload my own data"
          buyText="Buy Competitor Intel"
          price={800}
          sla="7 Days"
          category="service"
          purpose="Deep market and competitor analysis to position your offering."
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
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
            {description}
          </p>
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