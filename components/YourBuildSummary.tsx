"use client";

import React, { useMemo } from "react";
import { useWizard, DIY_HOURS_MAP } from "../contexts/WizardContext";
import { ChevronRight, ArrowRight } from "lucide-react";
// Assuming isStepValid and getFirstIncompleteStageId will be in page.tsx or similar now
import { isStepValid, getFirstIncompleteStageId } from "../app/[locale]/wizard/page";

const STEP_NAMES: Record<number, string> = {
  1: 'Strategy',
  2: 'Team Structure',
  3: 'Materials',
  4: 'Legal',
  5: 'Funnels',
  6: 'Data & Traffic',
  7: 'Infrastructure',
};

const getStepForOption = (optionId: string): number => {
  if (['sales_methodology', 'competitor_intel', 'partner_mou', 'sales_consulting'].includes(optionId)) return 1;
  if (['lead_gen', 'qualification', 'demo', 'negotiation', 'closed_won_lost', 'scout_hire', 'agency_leadgen', 'sdr', 'ai_sdr', 'closer', 'team_lead', 'sales_ops'].includes(optionId)) return 2;
  if (['sales_deck', 'one_pager', 'objections_playbook', 'sales_playbook', 'battlecards'].includes(optionId)) return 3;
  if (['hiring_agreement', 'service_agreement', 'terms_of_service', 'gdpr_compliance', 'legal_setup'].includes(optionId)) return 4;
  if (['inbound_demo_funnel', 'micro_consulting', 'outbound_cold_meeting', 'automated_webinar', 'quick_callback', 'custom_funnel'].includes(optionId)) return 5;
  if (['byo_data', 'inbound_traffic', 'outbound_parsing', 'crm_enrichment', 'intent_data'].includes(optionId)) return 6;
  if (['sales_meeting_room', 'sales_team_chat', 'document_signing', 'dataroom', 'email_infra', 'calendar_booking', 'preconfigured_crm', 'power_dialer_voip', 'call_intelligence_qa', 'cpq_invoicing', 'knowledge_base'].includes(optionId)) return 7;
  return 0;
};

export function YourBuildSummary() {
  const { state, nextStep, prevStep } = useWizard();

  const totalFounderHours = useMemo(() => {
    return state.clientProvided.reduce((sum, id) => sum + (DIY_HOURS_MAP[id] || 0), 0);
  }, [state.clientProvided]);

  const totalDelegatedHours = useMemo(() => {
    return state.cartItems.reduce((sum, item) => {
      if (item.paymentType === 'monthly') {
        return sum + (item.allocatedHours || 0);
      }
      return sum;
    }, 0);
  }, [state.cartItems]);

  const getStepTotals = (stepNumber: number) => {
    const stepCartItems = state.cartItems.filter(item => getStepForOption(item.optionId) === stepNumber);
    const stepClientItems = state.clientProvided.filter(id => getStepForOption(id) === stepNumber);
    
    const stepCost = stepCartItems.reduce((acc, item) => acc + item.price, 0);
    const stepFounderHours = stepClientItems.reduce((acc, id) => acc + (DIY_HOURS_MAP[id] || 0), 0);
    
    return { cost: stepCost, founderHours: stepFounderHours };
  };

  if (state.currentStep === 8 || state.currentStep === 0) {
    return null;
  }

  const stepsToRender = [1, 2, 3, 4, 5, 6, 7].map(step => {
    return { step, ...getStepTotals(step) };
  });

  return (
    <div className="sticky top-24 bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col max-h-[calc(100vh-120px)] transition-all max-w-[320px] w-full">
      {/* Block 1: Global KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">One-Time</p>
          <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-slate-100">${state.totalOneTime.toLocaleString()}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Monthly Burn</p>
          <p className="text-lg font-mono font-extrabold text-indigo-700 dark:text-indigo-400">${state.totalMonthly.toLocaleString()}/mo</p>
        </div>
        <div className={`p-3 rounded-2xl border ${totalFounderHours > 100 ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${totalFounderHours > 100 ? 'text-rose-500' : 'text-emerald-500'}`}>Your Time</p>
          <p className={`text-lg font-mono font-extrabold ${totalFounderHours > 100 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{totalFounderHours} hr/mo</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 p-3 rounded-2xl border border-purple-100 dark:border-purple-500/20">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Delegated</p>
          <p className="text-lg font-mono font-extrabold text-purple-700 dark:text-purple-400">{totalDelegatedHours} hr/mo</p>
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700/50 w-full mb-6" />

      {/* Block 2: Breakdown by Steps */}
      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-2 custom-scrollbar">
        {stepsToRender.map(({ step, cost, founderHours }) => (
          <div key={step} className={`flex items-center justify-between p-2 rounded-xl transition-colors ${state.currentStep === step ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700' : ''}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-bold text-slate-400 w-3">{step}.</span>
              <span className={`text-sm font-semibold truncate ${state.currentStep === step ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                {STEP_NAMES[step]}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                ${cost > 0 ? (cost >= 1000 ? `${(cost / 1000).toFixed(1).replace('.0', '')}k` : cost) : '0'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${founderHours > 20 ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'}`}>
                {founderHours}h 👤
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= BLOCK 3: Navigation (Call to Action) ================= */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3 mt-auto">
        
        {/* Кнопка НАЗАД (Скрыта на 1 шаге) */}
        {state.currentStep > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Back
          </button>
        ) : (
          // Пустой блок для сохранения верстки (чтобы Next Step оставалась справа)
          <div className="px-4 w-16"></div> 
        )}

        {/* Кнопка ВПЕРЕД (Скрыта на 8 шаге) */}
        {state.currentStep < 8 && (() => {
          const isStep2Incomplete = state.currentStep === 2 && getFirstIncompleteStageId(state) !== null;
          
          const handleNextClick = (e: React.MouseEvent) => {
            e.preventDefault();
            if (isStep2Incomplete) {
              const incompleteStageId = getFirstIncompleteStageId(state);
              window.dispatchEvent(new CustomEvent('trigger-error-highlight', { detail: incompleteStageId }));
              return;
            }
            if (isStepValid(state)) {
              nextStep();
            }
          };

          return (
            <button
              onClick={handleNextClick}
              disabled={state.currentStep === 1 && !isStepValid(state)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                isStep2Incomplete ? 'opacity-60 grayscale-[50%] cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''
              }`}
            >
              {state.currentStep === 7 ? "Go to Summary" : "Next Step"}
            </button>
          );
        })()}
        
      </div>
    </div>
  );
}