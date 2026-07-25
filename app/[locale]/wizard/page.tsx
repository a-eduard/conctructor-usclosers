"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useWizard } from "../../../contexts/WizardContext";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { LanguageSwitcher } from "../../../components/LanguageSwitcher";
import { CheckCircle, Circle, ChevronLeft, ChevronRight, ShoppingCart, Target, Users, FileText, Scale, Filter, Database, Server } from "lucide-react";

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

export const getFirstIncompleteStageId = (state: any) => {
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
};

export const isStepValid = (state: any) => {
  if (state.currentStep === 1) {
    const hasChannels = state.step1Data.channels && state.step1Data.channels.length > 0;
    const hasPricing = !!state.step1Data.acv && !!state.step1Data.subscriptionModel;
    const hasCompetitors = state.clientProvided.includes('competitor_intel') || state.cartItems.some((i: any) => i.optionId === 'competitor_intel');
    return hasChannels && hasPricing && hasCompetitors;
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
  const { state, nextStep, prevStep, setStep } = useWizard();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentStep]);

  const isInitialized = state.cartItems.length > 0 || state.clientProvided.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`}>
              <img
                src="/usc_logo_s.png"
                alt="USClosers Logo"
                className="h-8 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Guided Setup
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => router.push(`/${locale}`)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
        
        {state.currentStep > 0 && (
        <div className="bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/60 px-6 py-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:flex-1">
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {state.currentStep}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {state.currentStep} of 8</p>
                  <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {STEP_TITLES[state.currentStep - 1]}
                  </h1>
                </div>
              </div>
              <p className="hidden md:block text-xs font-medium text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-3">
                {STEP_SUBTITLES[state.currentStep - 1]}
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-end gap-2 pr-4">
              {Array.from({ length: 8 }).map((_, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === state.currentStep;
                const isCompleted = stepNum < state.currentStep || isInitialized;
                const Icon = STEP_ICONS[idx];
                return (
                  <button 
                    key={stepNum}
                    onClick={() => {
                      if (state.currentStep === 2 && stepNum > 2) {
                        const incompleteStageId = getFirstIncompleteStageId(state);
                        if (incompleteStageId) {
                          window.dispatchEvent(new CustomEvent('trigger-error-highlight', { detail: incompleteStageId }));
                          return;
                        }
                      }
                      if (isCompleted || isActive) {
                        setStep(stepNum);
                      }
                    }}
                    className={`flex items-center justify-center outline-none cursor-pointer p-2 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-indigo-600 text-white shadow-md scale-110' :
                      isCompleted ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30' :
                      'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    aria-label={`Go to step ${stepNum}`}
                    title={STEP_TITLES[idx]}
                    disabled={!isCompleted && !isActive}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </nav>

      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        <main className={`flex-1 py-12 px-6 pb-32 ${state.currentStep !== 8 && state.currentStep !== 0 ? 'lg:pr-[380px]' : ''}`}>
          <WizardContent step={state.currentStep} />
        </main>

        {state.currentStep !== 8 && state.currentStep !== 0 && (
          <>
            <aside className="hidden lg:block w-[350px] absolute right-6 top-12 bottom-12 z-10">
              <YourBuildSummary />
            </aside>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/50 p-4 z-50 pb-safe">
               <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
                 {state.currentStep > 1 ? (
                   <button
                     onClick={prevStep}
                     className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                   >
                     Back
                   </button>
                 ) : (
                   <div className="px-4 w-16"></div> 
                 )}

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
          </>
        )}
      </div>
    </div>
  );
}

function WizardContent({ step }: { step: number }) {
  const { state } = useWizard();

  const renderAlerts = () => {
    if (!state.ruleResults?.alerts?.length) return null;
    return (
      <div className="mb-8 space-y-3">
        {state.ruleResults.alerts.map((alert, idx) => (
          <div key={idx} className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200/50 dark:border-amber-500/20 p-4 rounded-2xl shadow-sm flex items-start gap-3 transition-all">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-amber-500 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
              {alert}
            </p>
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