"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useWizard } from "../../../contexts/WizardContext";
import { Target, Users, FileText, Scale, Filter, Database, Server, ShoppingCart } from "lucide-react";

import { Step0Onboarding } from "../../../components/Step0Onboarding";
import { Step1SalesStrategy } from "../../../components/Step1SalesStrategy";
import { Step2TeamStructure } from "../../../components/Step2TeamStructure";
import { Step3SalesMaterials } from "../../../components/Step3SalesMaterials";
import { Step4LegalFramework } from "../../../components/Step4LegalFramework";
import { Step5PipelineFunnels } from "../../../components/Step5PipelineFunnels";
import { Step6DataScraping } from "../../../components/Step6DataScraping";
import { Step7Infrastructure } from "../../../components/Step7Infrastructure";
import { Step8OrderSummary } from "../../../components/Step8OrderSummary";
import { YourBuildSummary } from "../../../components/YourBuildSummary";
import { WizardFooter } from "../../../components/WizardFooter";
import { Header } from "../../../components/Header";

export const getFirstIncompleteStageId = (state: any) => {
  if (state.currentStep === 2) {
    const FUNNEL_STAGES = [
      { id: 'lead_gen', hireIds: ['scout_hire'], serviceIds: ['agency_leadgen', 'parsing', 'agency_leadgen_parsing', 'parsing_enrichment'] },
      { id: 'qualification', hireIds: ['sdr'], serviceIds: ['ai_sdr'] },
      { id: 'demo', hireIds: ['closer'], serviceIds: [] },
      { id: 'negotiation', hireIds: ['closer'], serviceIds: ['legal_setup'] },
      { id: 'closed_won_lost', hireIds: ['team_lead', 'sales_ops'], serviceIds: [] }
    ];

    const getSelection = (stageId: string, stage: any) => {
      if (state.clientProvided.includes(stageId)) return 'myself';
      if (stage.serviceIds.some((id: string) => state.cartItems.some((i: any) => i.optionId === id))) return 'service';
      if (stage.hireIds.some((id: string) => state.cartItems.some((i: any) => i.optionId === id))) return 'hire';
      return null;
    };

    const incompleteStage = FUNNEL_STAGES.find(stage => getSelection(stage.id, stage) === null);
    return incompleteStage ? `diy-item-${incompleteStage.id}` : null;
  }
  
  if (state.currentStep === 3) {
    const materials = ['sales_deck', 'one_pager', 'objections_playbook', 'sales_playbook', 'battlecards'];
    for (const materialId of materials) {
      const isProvided = state.clientProvided.includes(materialId);
      const isBought = state.cartItems.some((i: any) => i.optionId === materialId);
      if (!isProvided && !isBought) {
         return `diy-item-${materialId}`;
      }
    }
  }

  if (state.currentStep === 4) {
    const isLoneWolf = state.clientProvided.includes('lead_gen') && state.clientProvided.includes('qualification') && state.clientProvided.includes('demo');
    const legals = ['service_agreement', 'terms_of_service', 'gdpr_compliance'];
    if (!isLoneWolf) legals.unshift('hiring_agreement');

    for (const legalId of legals) {
      const isProvided = state.clientProvided.includes(legalId);
      const isBought = state.cartItems.some((i: any) => i.optionId === legalId);
      if (!isProvided && !isBought) {
         return `diy-item-${legalId}`;
      }
    }
  }

  if (state.currentStep === 5) {
    const selected = state.step5Data.selectedFunnel;
    if (!selected) {
      return 'diy-item-funnels';
    }
    
    const isProvided = state.clientProvided.includes(selected);
    const hasBoughtFunnel = state.cartItems.some((i: any) => i.purpose?.includes('Funnel'));
    
    if (!isProvided && !hasBoughtFunnel) {
      return 'diy-item-funnel-config';
    }
  }

  if (state.currentStep === 6) {
    const isProvided = state.clientProvided.includes('byo_data');
    const dataServices = ['inbound_traffic', 'outbound_parsing', 'crm_enrichment', 'intent_data'];
    const hasBoughtData = dataServices.some(id => state.cartItems.some((i: any) => i.optionId === id));
    
    if (!isProvided && !hasBoughtData) {
      return 'diy-item-inbound_traffic';
    }
  }

  if (state.currentStep === 7) {
    const infraTools = ['sales_meeting_room', 'sales_team_chat', 'document_signing', 'dataroom', 'email_infra', 'calendar_booking', 'preconfigured_crm', 'power_dialer_voip', 'call_intelligence_qa', 'cpq_invoicing', 'knowledge_base'];
    for (const toolId of infraTools) {
      const isProvided = state.clientProvided.includes(toolId);
      const isBought = state.cartItems.some((i: any) => i.optionId === toolId);
      if (!isProvided && !isBought) {
         return `diy-item-${toolId}`;
      }
    }
  }

  return null;
};

export const isStepValid = (state: any) => {
  if (state.currentStep === 1) {
    const hasValidMethodology = 
      (state.step1Data.methodology && state.step1Data.methodology !== "I don't know") || 
      state.cartItems.some((i: any) => i.optionId === 'sales_consulting');

    const hasChannels = state.step1Data.channels && state.step1Data.channels.length > 0;
    const hasPricing = !!state.step1Data.acv && !!state.step1Data.subscriptionModel;
    const hasCompetitors = state.clientProvided.includes('competitor_intel') || state.cartItems.some((i: any) => i.optionId === 'competitor_intel');

    return hasValidMethodology && hasChannels && hasPricing && hasCompetitors;
  }
  
  if (state.currentStep === 2) {
     return getFirstIncompleteStageId(state) === null;
  }

  if (state.currentStep === 3) {
      const materials = ['sales_deck', 'one_pager', 'objections_playbook', 'sales_playbook', 'battlecards'];
      return materials.every(materialId => 
          state.clientProvided.includes(materialId) || state.cartItems.some((i: any) => i.optionId === materialId)
      );
  }

  if (state.currentStep === 4) {
      const isLoneWolf = state.clientProvided.includes('lead_gen') && state.clientProvided.includes('qualification') && state.clientProvided.includes('demo');
      const legals = ['service_agreement', 'terms_of_service', 'gdpr_compliance'];
      if (!isLoneWolf) legals.push('hiring_agreement');

      return legals.every(legalId => 
          state.clientProvided.includes(legalId) || state.cartItems.some((i: any) => i.optionId === legalId)
      );
  }

  if (state.currentStep === 5) {
      if (!state.step5Data.selectedFunnel) return false;
      const isProvided = state.clientProvided.includes(state.step5Data.selectedFunnel);
      const hasBoughtFunnel = state.cartItems.some((i: any) => i.purpose?.includes('Funnel'));
      return isProvided || hasBoughtFunnel;
  }

  if (state.currentStep === 6) {
      const isProvided = state.clientProvided.includes('byo_data');
      const dataServices = ['inbound_traffic', 'outbound_parsing', 'crm_enrichment', 'intent_data'];
      const hasBoughtData = dataServices.some(id => state.cartItems.some((i: any) => i.optionId === id));
      return isProvided || hasBoughtData;
  }

  if (state.currentStep === 7) {
      const infraTools = ['sales_meeting_room', 'sales_team_chat', 'document_signing', 'dataroom', 'email_infra', 'calendar_booking', 'preconfigured_crm', 'power_dialer_voip', 'call_intelligence_qa', 'cpq_invoicing', 'knowledge_base'];
      return infraTools.every(toolId => 
          state.clientProvided.includes(toolId) || state.cartItems.some((i: any) => i.optionId === toolId)
      );
  }

  return true;
};

const STEP_SUBTITLES = [
  "Define your go-to-market approach and identify foundational gaps.",
  "Build your sales funnel from Lead Gen to Close.",
  "Equip your team with high-converting collateral.",
  "Formalize legal processes so you don't lose deals at the finish line.",
  "Select and configure your overarching B2B sales funnel structure.",
  "Define the data sources and lead generation methods that will feed your pipeline.",
  "Equip your team with the necessary cloud-based automation tools.",
  "Review your pipeline configuration and our service guarantees before launching."
];

const STEP_TITLES = [
  "Sales Strategy",
  "Team Structure",
  "Sales Materials",
  "Legal Framework",
  "Pipeline Funnels",
  "Data Scraping",
  "Infrastructure",
  "Checkout & Summary",
];

const STEP_ICONS = [
  Target,
  Users,
  FileText,
  Scale,
  Filter,
  Database,
  Server,
  ShoppingCart,
];

export default function Wizard() {
  const { state, nextStep, prevStep, setStep, resetWizard } = useWizard();
  const router = useRouter();
  const locale = useLocale();
  const [maxReached, setMaxReached] = useState(1);

  useEffect(() => {
    if (state.currentStep > maxReached) {
      setMaxReached(state.currentStep);
    }
  }, [state.currentStep, maxReached]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentStep]);

  const handleStepClick = (stepNum: number) => {
    if (stepNum === state.currentStep) return;

    if (stepNum > state.currentStep) {
      if (!isStepValid(state)) {
        const incompleteStageId = getFirstIncompleteStageId(state);
        if (incompleteStageId) {
            window.dispatchEvent(new CustomEvent('trigger-error-highlight', { detail: incompleteStageId }));
        }
        return;
      }

      if (stepNum <= maxReached || stepNum === state.currentStep + 1) {
        setStep(stepNum);
      }
    } else {
      setStep(stepNum);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Global Header */}
      <Header 
        isSticky={false}
        className="border-none bg-transparent"
        leftContent={
          <>
            <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 -ml-2" />
            <span className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
              Guided Setup
            </span>
          </>
        }
        rightContent={
          <button
            onClick={() => {
              resetWizard(); // <-- ТЕПЕРЬ EXIT ТОЖЕ ОЧИЩАЕТ КОРЗИНУ
              router.push(`/${locale}`);
            }}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mr-2"
          >
            Exit
          </button>
        }
      />

      {/* Progress Bar Container */}
      <div className="relative z-40 bg-white dark:bg-[#0B0F19]">
        {state.currentStep > 0 && (
        <div className="px-6 pt-2 pb-6 transition-all">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center w-full">
            
            <div className="text-center mb-5">
              <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
                Step {state.currentStep} of 8
              </p>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">
                {STEP_TITLES[state.currentStep - 1]}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                {STEP_SUBTITLES[state.currentStep - 1]}
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-between w-full px-4 relative">
              {Array.from({ length: 8 }).map((_, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === state.currentStep;
                const isPast = stepNum < state.currentStep;
                const Icon = STEP_ICONS[idx];

                let isClickable = false;
                if (stepNum <= state.currentStep) {
                  isClickable = true;
                } else if (stepNum <= maxReached || stepNum === state.currentStep + 1) {
                  isClickable = isStepValid(state);
                }

                return (
                  <React.Fragment key={stepNum}>
                    <div className="relative group flex flex-col items-center">
                      <button 
                        onClick={() => isClickable && handleStepClick(stepNum)}
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/30' 
                            : isPast 
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' 
                              : 'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600'
                        } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                      
                      <span className={`absolute -bottom-6 text-[10px] font-bold whitespace-nowrap transition-all duration-300 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400 opacity-100 translate-y-0' : 'text-slate-400 opacity-0 group-hover:opacity-100 translate-y-1'
                      }`}>
                        {STEP_TITLES[idx]}
                      </span>
                    </div>

                    {idx < 7 && (
                      <div className={`flex-1 h-[2px] mx-2 rounded-full transition-colors duration-500 ${
                        stepNum < state.currentStep ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

          </div>
        </div>
        )}
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        <main className={`flex-1 flex flex-col py-8 px-6 pb-32 ${state.currentStep !== 8 && state.currentStep !== 0 ? 'lg:pr-[380px]' : ''}`}>
          <WizardContent step={state.currentStep} />
          <div className="mt-auto">
            <WizardFooter />
          </div>
        </main>

        {state.currentStep !== 8 && state.currentStep !== 0 && (
          <>
            <aside className="hidden lg:block w-[350px] absolute right-6 top-8 bottom-12 z-10">
              <YourBuildSummary />
            </aside>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/50 p-4 z-50 pb-safe">
               <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
                 {state.currentStep > 1 ? (
                   <button
                     onClick={() => handleStepClick(state.currentStep - 1)}
                     className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                   >
                     Back
                   </button>
                 ) : (
                   <div className="px-4 w-16"></div> 
                 )}

                 {state.currentStep < 8 && (() => {
                   const isNextDisabled = !isStepValid(state);
                   
                   const handleNextClick = (e: React.MouseEvent) => {
                     e.preventDefault();
                     if (isNextDisabled) {
                       const incompleteStageId = getFirstIncompleteStageId(state);
                       if (incompleteStageId) {
                         window.dispatchEvent(new CustomEvent('trigger-error-highlight', { detail: incompleteStageId }));
                       }
                       return;
                     }
                     nextStep();
                   };

                   return (
                     <button
                       onClick={handleNextClick}
                       className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                         isNextDisabled 
                           ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed hover:translate-y-0 hover:shadow-none' 
                           : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:scale-95'
                       }`}
                     >
                       {state.currentStep === 7 ? "Go to Summary" : "Next Step"}
                     </button>
                   );
                 })()}
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WizardContent({ step }: { step: number }) {
  const { state, setStep } = useWizard();

  const handleAlertClick = (targetStep: number, elementId: string) => {
    setStep(targetStep);
    
    setTimeout(() => {
      let el = document.getElementById(elementId);
      
      if (!el) {
         el = document.querySelector('[id^="diy-item-"]');
      }

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-amber-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'shadow-2xl', 'scale-[1.02]', 'transition-all', 'duration-500', 'z-50', 'relative');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-amber-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'shadow-2xl', 'scale-[1.02]', 'z-50', 'relative');
        }, 3000);
      }
    }, 300);
  };

  const renderAlerts = () => {
    if (!state.ruleResults?.alerts?.length) return null;
    return (
      <div className="mb-8 space-y-4">
        {state.ruleResults.alerts.map((alert: any) => (
          <div key={alert.id} className="bg-amber-50/90 dark:bg-amber-900/20 backdrop-blur-md border border-amber-200 dark:border-amber-500/30 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center border border-amber-200 dark:border-amber-500/30">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Architecture Warning</span>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed max-w-xl">
                  {alert.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAlertClick(alert.targetStep, alert.targetElementId)}
              className="shrink-0 w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-amber-600/50 cursor-pointer"
            >
              {alert.actionText}
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (step === 0) return <div className="relative animate-in fade-in duration-700 ease-out fill-mode-both">{renderAlerts()}<Step0Onboarding /></div>;
  if (step === 1) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step1SalesStrategy /></div>;
  if (step === 2) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step2TeamStructure /></div>;
  if (step === 3) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step3SalesMaterials /></div>;
  if (step === 4) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step4LegalFramework /></div>;
  if (step === 5) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step5PipelineFunnels /></div>;
  if (step === 6) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step6DataScraping /></div>;
  if (step === 7) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step7Infrastructure /></div>;
  if (step === 8) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">{renderAlerts()}<Step8OrderSummary /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Missing Step</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Please proceed back.</p>
      </div>
    </div>
  );
}