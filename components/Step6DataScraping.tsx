"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, Circle, UploadCloud, Sparkles, XCircle } from "lucide-react";

export function Step6DataScraping() {
  const { state, addCartItem, removeCartItem, markClientProvided, removeClientProvided } = useWizard();

  const selectedFunnel = state.step5Data?.selectedFunnel;

  const dataSources = [
    {
      id: "inbound_traffic",
      name: "Inbound Traffic",
      description: "Setup of hot lead generation (paid ads, forms).",
      price: 2500,
      sla: "10 Days",
      isRecommended: selectedFunnel === "inbound_demo_funnel",
      category: 'service' as const,
      purpose: "Setup of hot lead generation (paid ads, forms)."
    },
    {
      id: "outbound_parsing",
      name: "Outbound Parsing",
      description: "Scraping targets from LinkedIn and other databases.",
      price: 1200,
      sla: "5 Days",
      isRecommended: selectedFunnel === "outbound_cold_meeting",
      category: 'service' as const,
      purpose: "Scraping targets from LinkedIn and other databases."
    },
    {
      id: "crm_enrichment",
      name: "CRM Enrichment",
      description: "Cleaning and updating old/existing databases.",
      price: 800,
      sla: "3 Days",
      isRecommended: selectedFunnel === "outbound_cold_meeting",
      category: 'service' as const,
      purpose: "Cleaning and updating old/existing databases."
    },
    {
      id: "intent_data",
      name: "Intent Data",
      description: "Purchasing signals about companies actively looking for solutions.",
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
    }
  };

  const handleToggleBYO = () => {
    const isProvided = state.clientProvided.includes("byo_data");
    if (!isProvided) {
      markClientProvided("byo_data");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-8">
        {dataSources.map(source => {
          const isInCart = state.cartItems.some(i => i.optionId === source.id);
          return (
            <div
              key={source.id}
              id={`diy-item-${source.id}`}
              onClick={() => handleToggleService(source)}
              className={`scroll-m-24 group relative cursor-pointer bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
                isInCart 
                  ? 'border-2 border-indigo-600 shadow-lg scale-[1.02] ring-4 ring-indigo-500/10 cursor-default' 
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
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCartItem(source.id);
                    }}
                    className="relative w-6 h-6 flex items-center justify-center text-red-500 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 absolute opacity-0 md:opacity-100 md:group-hover:opacity-0 transition-opacity scale-110" />
                    <XCircle className="w-6 h-6 text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute scale-110" />
                  </div>
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

        {/* Bring Your Own (BYO) */}
        <div
          onClick={handleToggleBYO}
          className={`scroll-m-24 group relative cursor-pointer bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
            state.clientProvided.includes("byo_data")
              ? 'border-2 border-emerald-500 shadow-lg scale-[1.02] ring-4 ring-emerald-500/10 cursor-default' 
              : 'border-2 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-lg font-bold transition-colors ${state.clientProvided.includes("byo_data") ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
              Bring Your Own (BYO)
            </h3>
            {state.clientProvided.includes("byo_data") ? (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  removeClientProvided("byo_data");
                }}
                className="relative w-6 h-6 flex items-center justify-center text-red-500 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400 absolute opacity-0 md:opacity-100 md:group-hover:opacity-0 transition-opacity scale-110" />
                <XCircle className="w-6 h-6 text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute scale-110" />
              </div>
            ) : (
              <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-emerald-300 dark:group-hover:text-emerald-500/50 transition-colors" />
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 font-medium">
            Upload my own CSV file.
          </p>
          <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              $0
            </span>
          </div>

          {state.clientProvided.includes("byo_data") && (
            <div className="mt-4 p-3 bg-emerald-50/80 dark:bg-emerald-500/10 rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
              <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-emerald-200 font-semibold leading-relaxed">
                CSV upload will be available in your dashboard after checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}