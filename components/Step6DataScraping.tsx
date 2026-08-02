"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, Circle, UploadCloud, Sparkles } from "lucide-react";

export function Step6DataScraping() {
  const { state, addCartItem, removeCartItem, markClientProvided, removeClientProvided } = useWizard();

  const selectedFunnel = state.step5Data?.selectedFunnel;

  const dataSources = [
    {
      id: "inbound_traffic",
      name: "Inbound Traffic",
      description: "Setup of targeted ad campaigns (LinkedIn, Google) to generate hot inbound leads.",
      price: 2500,
      sla: "10 Days",
      isRecommended: selectedFunnel === "inbound_demo_funnel" || selectedFunnel === "automated_webinar" || selectedFunnel === "quick_callback",
      category: 'service' as const,
      purpose: "Setup of hot lead generation (paid ads, forms)."
    },
    {
      id: "outbound_parsing",
      name: "Outbound Parsing",
      description: "Custom scraping of verified B2B targets from LinkedIn, Apollo, and niche directories.",
      price: 1200,
      sla: "5 Days",
      isRecommended: selectedFunnel === "outbound_cold_meeting" || selectedFunnel === "micro_consulting",
      category: 'service' as const,
      purpose: "Scraping targets from LinkedIn and other databases."
    },
    {
      id: "crm_enrichment",
      name: "CRM Enrichment",
      description: "Waterfall enrichment (email & phone verification) to clean and revive your existing database.",
      price: 800,
      sla: "3 Days",
      isRecommended: selectedFunnel === "outbound_cold_meeting",
      category: 'service' as const,
      purpose: "Cleaning and updating old/existing databases."
    },
    {
      id: "intent_data",
      name: "Intent Data",
      description: "Purchase active buying signals (e.g., companies currently searching for your solution keywords).",
      price: 1500,
      sla: "7 Days",
      isRecommended: false,
      category: 'service' as const,
      purpose: "Purchasing signals about companies actively looking for solutions."
    }
  ];

  const handleToggleService = (item: typeof dataSources[0]) => {
    const isInCart = state.cartItems.some(i => i.optionId === item.id);
    if (!isInCart) {
      addCartItem({ allocatedHours: 0, paymentType: 'one-time', optionId: item.id, name: item.name, price: item.price, sla: item.sla, category: item.category, purpose: item.purpose });
    } else {
      removeCartItem(item.id);
    }
  };

  const handleToggleBYO = () => {
    const isProvided = state.clientProvided.includes("byo_data");
    if (!isProvided) {
      markClientProvided("byo_data");
    } else {
      removeClientProvided("byo_data");
    }
  };

  return (
    <div id="diy-item-data-sources" className="animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-m-24">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-8">
        {dataSources.map(source => {
          const isInCart = state.cartItems.some(i => i.optionId === source.id);
          return (
            <div
              key={source.id}
              onClick={() => handleToggleService(source)}
              className={`group relative cursor-pointer bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
                isInCart 
                  ? 'border-2 border-indigo-600 shadow-lg scale-[1.02] ring-4 ring-indigo-500/10' 
                  : 'border-2 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {source.isRecommended && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-[11px] font-bold rounded-full border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" /> Highly Recommended
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-lg font-bold transition-colors ${isInCart ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                  {source.name}
                </h3>
                {isInCart ? (
                  <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 scale-110 transition-transform" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-indigo-300 dark:group-hover:text-indigo-500/50 transition-colors" />
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 font-medium">
                {source.description}
              </p>
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                  +${source.price.toLocaleString()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  SLA: {source.sla}
                </span>
              </div>
            </div>
          );
        })}

        {/* Bring Your Own (BYO) - Standardized to Indigo */}
        <div
          onClick={handleToggleBYO}
          className={`group relative cursor-pointer bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
            state.clientProvided.includes("byo_data")
              ? 'border-2 border-indigo-600 shadow-lg scale-[1.02] ring-4 ring-indigo-500/10' 
              : 'border-2 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-lg font-bold transition-colors ${state.clientProvided.includes("byo_data") ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
              Bring Your Own (BYO)
            </h3>
            {state.clientProvided.includes("byo_data") ? (
              <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 scale-110 transition-transform" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-indigo-300 dark:group-hover:text-indigo-500/50 transition-colors" />
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 font-medium">
            Upload your own verified B2B database via CSV file.
          </p>
          <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              $0
            </span>
          </div>

          {state.clientProvided.includes("byo_data") && (
            <div className="mt-4 p-3 bg-indigo-50/80 dark:bg-indigo-500/10 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
              <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-800 dark:text-indigo-200 font-semibold leading-relaxed">
                Secure CSV upload interface will be unlocked in your dashboard after checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}