"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useWizard } from "../../../contexts/WizardContext";
import { Target, Users, FileText, Scale, Database, Server, ShoppingCart, Settings } from "lucide-react";

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

// Helper to normalize shared resources for validation
const normalizeSharedResource = (name: string) => {
  if (!name) return '';
  const lower = name.toLowerCase();
  if (lower.includes('account executive') || lower.includes('ae') || lower.includes('closer')) return 'ae';
  if (lower.includes('sdr') || lower.includes('sales development')) return 'sdr';
  if (lower.includes('scout')) return 'scout';
  if (lower.includes('team lead') || lower.includes('manager')) return 'team_lead';
  return lower.replace(/^(buy |hire )/i, '').split('(')[0].trim();
};

export const getFirstIncompleteStageId = (state: any, dbSteps: any[] = []) => {
  if (state.currentStep === 2) {
    const step2Data = dbSteps.find((s: any) => s.stepNumber === 2);
    if (step2Data && step2Data.blocks) {
      const isOptionActive = (option: any) => {
        if (option.type === 'service' || option.type === 'hire') {
          return state.cartItems.some((i: any) => {
            if (i.optionId === option.id) return true;
            if (i.category === option.type) {
               return normalizeSharedResource(i.name) === normalizeSharedResource(option.name);
            }
            return false;
          });
        }
        if (option.type === 'myself') return state.clientProvided.includes(`step2_${option.id}`);
        return false;
      };
      const incompleteBlock = step2Data.blocks.find((block: any) => !block.options.some((opt: any) => isOptionActive(opt)));
      return incompleteBlock ? `diy-item-${incompleteBlock.id}` : null;
    }
  }
  if (state.currentStep === 3) {
    const step3Data = dbSteps.find((s: any) => s.stepNumber === 3);
    if (step3Data && step3Data.blocks) {
      const isOptionActive = (option: any) => {
        if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
        if (option.type === 'myself') return state.clientProvided.includes(`step3_${option.id}`);
        return false;
      };
      const incompleteBlock = step3Data.blocks.find((block: any) => !block.options.some((opt: any) => isOptionActive(opt)));
      return incompleteBlock ? `diy-item-${incompleteBlock.id}` : null;
    }
  }

  if (state.currentStep === 4) {
    const step4Data = dbSteps.find((s: any) => s.stepNumber === 4);
    if (step4Data && step4Data.blocks) {
      const isLoneWolf = (() => {
        if (state.clientProvided.includes('lead_gen') && state.clientProvided.includes('qualification') && state.clientProvided.includes('demo')) return true;
        const step2Data = dbSteps.find(s => s.stepNumber === 2);
        if (!step2Data) return false;
        let myselfCount = 0;
        const targetBlocks = step2Data.blocks.filter((b: any) => [1, 2, 3].includes(b.order));
        for (const block of targetBlocks) {
          if (block.options.some((opt: any) => opt.type === 'myself' && state.clientProvided.includes(`step2_${opt.id}`))) myselfCount++;
        }
        return myselfCount === 3;
      })();

      const isOptionActive = (option: any) => {
        if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
        if (option.type === 'myself') return state.clientProvided.includes(`step4_${option.id}`);
        return false;
      };

      const incompleteBlock = step4Data.blocks.find((block: any) => {
        if (block.order === 1 && isLoneWolf) return false; 
        return !block.options.some((opt: any) => isOptionActive(opt));
      });

      return incompleteBlock ? `diy-item-${incompleteBlock.id}` : null;
    }
  }

  if (state.currentStep === 6) {
    const step6Data = dbSteps.find((s: any) => s.stepNumber === 6);
    if (step6Data && step6Data.blocks) {
      const dataBlock = step6Data.blocks[0];
      if (dataBlock) {
        const hasSelection = dataBlock.options.some((opt: any) => {
          if (opt.type === 'service') return state.cartItems.some((i: any) => i.optionId === opt.id);
          if (opt.type === 'myself') return state.clientProvided.includes(`step6_${opt.id}`);
          return false;
        });
        if (!hasSelection) return `diy-item-${dataBlock.id}`;
      }
    }
  }

  if (state.currentStep === 7) {
    const step7Data = dbSteps.find((s: any) => s.stepNumber === 7);
    if (step7Data && step7Data.blocks) {
      const isOptionActive = (option: any) => {
        if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
        if (option.type === 'myself') return state.clientProvided.includes(`step7_${option.id}`);
        return false;
      };
      const incompleteBlock = step7Data.blocks.find((block: any) => !block.options.some((opt: any) => isOptionActive(opt)));
      return incompleteBlock ? `diy-item-${incompleteBlock.id}` : null;
    }
  }

  return null;
};

export const isStepValid = (state: any, dbSteps: any[] = []) => {
  if (state.currentStep === 1) {
    const step1Data = dbSteps.find((s: any) => s.stepNumber === 1);
    if (!step1Data || !step1Data.blocks) return false;
    const isOptionActive = (option: any, blockName: string) => {
      if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
      if (option.type === 'myself') {
        if (blockName === 'Sales Methodology') return state.step1Data.methodology === option.name;
        if (blockName === 'Primary Channels') return state.step1Data.channels.includes(option.name);
        if (blockName === 'Pricing Strategy') return state.step1Data.subscriptionModel === option.name;
        if (blockName === 'Competitor Intelligence') return state.clientProvided.includes(`competitor_intel_${option.id}`);
        if (blockName === 'Partnerships') return state.clientProvided.includes(`partner_mou_${option.id}`);
      }
      return false;
    };
    return step1Data.blocks.every((block: any) => {
      if (block.name === 'Pricing Strategy') {
         const acvValue = parseFloat(state.step1Data.acv);
         return !isNaN(acvValue) && acvValue > 0 && !!state.step1Data.subscriptionModel;
      }
      return block.options.some((opt: any) => isOptionActive(opt, block.name));
    });
  }
  if (state.currentStep === 2) {
     return getFirstIncompleteStageId(state, dbSteps) === null;
  }
  if (state.currentStep === 3) {
    const step3Data = dbSteps.find((s: any) => s.stepNumber === 3);
    if (!step3Data || !step3Data.blocks) return false;
    const isOptionActive = (option: any) => {
      if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
      if (option.type === 'myself') return state.clientProvided.includes(`step3_${option.id}`);
      return false;
    };
    return step3Data.blocks.every((block: any) => block.options.some((opt: any) => isOptionActive(opt)));
  }

  if (state.currentStep === 4) {
    const step4Data = dbSteps.find((s: any) => s.stepNumber === 4);
    if (!step4Data || !step4Data.blocks) return false;

    const isLoneWolf = (() => {
      if (state.clientProvided.includes('lead_gen') && state.clientProvided.includes('qualification') && state.clientProvided.includes('demo')) return true;
      const step2Data = dbSteps.find(s => s.stepNumber === 2);
      if (!step2Data) return false;
      let myselfCount = 0;
      const targetBlocks = step2Data.blocks.filter((b: any) => [1, 2, 3].includes(b.order));
      for (const block of targetBlocks) {
        if (block.options.some((opt: any) => opt.type === 'myself' && state.clientProvided.includes(`step2_${opt.id}`))) myselfCount++;
      }
      return myselfCount === 3;
    })();

    const isOptionActive = (option: any) => {
      if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
      if (option.type === 'myself') return state.clientProvided.includes(`step4_${option.id}`);
      return false;
    };

    return step4Data.blocks.every((block: any) => {
      if (block.order === 1 && isLoneWolf) return true; 
      return block.options.some((opt: any) => isOptionActive(opt));
    });
  }

  if (state.currentStep === 6) {
    const step6Data = dbSteps.find((s: any) => s.stepNumber === 6);
    if (!step6Data || !step6Data.blocks) return false;
    const dataBlock = step6Data.blocks[0];
    if (!dataBlock) return false;
    return dataBlock.options.some((opt: any) => {
      if (opt.type === 'service') return state.cartItems.some((i: any) => i.optionId === opt.id);
      if (opt.type === 'myself') return state.clientProvided.includes(`step6_${opt.id}`);
      return false;
    });
  }

  if (state.currentStep === 7) {
    const step7Data = dbSteps.find((s: any) => s.stepNumber === 7);
    if (!step7Data || !step7Data.blocks) return false;
    const isOptionActive = (option: any) => {
      if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
      if (option.type === 'myself') return state.clientProvided.includes(`step7_${option.id}`);
      return false;
    };
    return step7Data.blocks.every((block: any) => block.options.some((opt: any) => isOptionActive(opt)));
  }

  return true;
};

// Pipeline Funnels (Step 5) is excluded from the visible steps array
const VISIBLE_STEPS = [
  { originalStep: 1, title: "Sales Strategy", subtitle: "Define your go-to-market approach and identify foundational gaps.", icon: Target },
  { originalStep: 2, title: "Team Structure", subtitle: "Build your sales funnel from Lead Gen to Close.", icon: Users },
  { originalStep: 3, title: "Sales Materials", subtitle: "Equip your team with high-converting collateral.", icon: FileText },
  { originalStep: 4, title: "Legal Framework", subtitle: "Formalize legal processes so you don't lose deals at the finish line.", icon: Scale },
  { originalStep: 6, title: "Data Scraping", subtitle: "Define the data sources and lead generation methods that will feed your pipeline.", icon: Database },
  { originalStep: 7, title: "Infrastructure", subtitle: "Equip your team with the necessary cloud-based automation tools.", icon: Server },
  { originalStep: 8, title: "Checkout & Summary", subtitle: "Review your pipeline configuration and our service guarantees before launching.", icon: ShoppingCart },
];

export default function WizardClient({ 
  dbSteps, 
  adminSolution, 
  adminPreset, 
  dbPresets 
}: { 
  dbSteps: any[], 
  adminSolution?: any, 
  adminPreset?: any, 
  dbPresets?: any[] 
}) {
  const { state, setStep, resetWizard, applyDynamicSolution } = useWizard();
  const router = useRouter();
  const locale = useLocale();
  const [maxReached, setMaxReached] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const isGodMode = !!(adminSolution || adminPreset);
  const builderModeName = adminSolution?.name || adminPreset?.name;

  useEffect(() => {
    if (adminSolution) {
      applyDynamicSolution(adminSolution);
    } else if (adminPreset) {
      applyDynamicSolution(adminPreset);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (isGodMode) {
      setStep(stepNum);
      return;
    }

    if (stepNum > state.currentStep) {
      if (!isStepValid(state, dbSteps)) {
        const incompleteStageId = getFirstIncompleteStageId(state, dbSteps);
        if (incompleteStageId) {
            window.dispatchEvent(new CustomEvent('trigger-error-highlight', { detail: incompleteStageId }));
        }
        return;
      }

      if (stepNum <= maxReached || stepNum === state.currentStep + 1 || (state.currentStep === 4 && stepNum === 6)) {
        setStep(stepNum);
      }
    } else {
      setStep(stepNum);
    }
  };

  const handleAdminSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        id: adminSolution?.id || adminPreset?.id,
        step1Data: JSON.stringify(state.step1Data),
        step5Data: JSON.stringify(state.step5Data),
        clientProvided: JSON.stringify(state.clientProvided),
        cartItems: JSON.stringify(state.cartItems)
      };
      
      const endpoint = adminSolution ? "/api/solutions" : "/api/presets";
      const returnTab = adminSolution ? "solutions" : "presets";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to save configuration");
      
      alert("Configuration saved successfully!");
      router.push(`/${locale}/admin/marketplace?tab=${returnTab}`);
    } catch(e) {
      console.error(e);
      alert("Error saving configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  const getVisibleStepIndex = (currentStep: number) => {
    return VISIBLE_STEPS.findIndex(s => s.originalStep === currentStep);
  };
  
  const currentVisibleStep = VISIBLE_STEPS[getVisibleStepIndex(state.currentStep)] || VISIBLE_STEPS[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {isGodMode && (
        <div className="bg-indigo-900 text-white px-6 py-3 flex flex-col sm:flex-row items-center justify-between z-[60] relative shadow-md gap-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold leading-none mb-1">Visual Builder Mode: {builderModeName}</h3>
              <p className="text-xs text-indigo-200">God Mode Active: Navigate freely and select the options to include.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => router.push(`/${locale}/admin/marketplace?tab=${adminSolution ? 'solutions' : 'presets'}`)}
              className="px-4 py-2 text-sm font-semibold text-indigo-200 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAdminSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      )}

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
              resetWizard();
              router.push(`/${locale}`);
            }}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mr-2"
          >
            Exit
          </button>
        }
      />

      <div className="relative z-40 bg-white dark:bg-[#0B0F19]">
        {state.currentStep > 0 && (
        <div className="px-6 pt-2 pb-6 transition-all">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center w-full">
            
            <div className="text-center mb-5">
              <p className="text-[10px] font-sans font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
                Step {getVisibleStepIndex(state.currentStep) + 1} of {VISIBLE_STEPS.length}
              </p>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">
                {currentVisibleStep.title}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                {currentVisibleStep.subtitle}
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-between w-full px-4 relative">
              {VISIBLE_STEPS.map((stepInfo, idx) => {
                const stepNum = stepInfo.originalStep;
                const isActive = stepNum === state.currentStep;
                const isPast = stepNum < state.currentStep || (state.currentStep === 8); 
                const Icon = stepInfo.icon;

                let isClickable = false;
                if (isGodMode) {
                  isClickable = true;
                } else if (stepNum <= state.currentStep) {
                  isClickable = true;
                } else if (stepNum <= maxReached || stepNum === (state.currentStep === 4 ? 6 : state.currentStep + 1)) {
                  isClickable = isStepValid(state, dbSteps);
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
                        {stepInfo.title}
                      </span>
                    </div>

                    {idx < VISIBLE_STEPS.length - 1 && (
                      <div className={`flex-1 h-[2px] mx-2 rounded-full transition-colors duration-500 ${
                        isPast && !isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
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

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full relative px-6">
        
        <div className="flex flex-col lg:flex-row flex-1 gap-8 pt-8 pb-16">
          
          <main className="flex-1 flex flex-col min-w-0">
            <WizardContent step={state.currentStep} dbSteps={dbSteps} dbPresets={dbPresets} />
          </main>

          {state.currentStep !== 8 && state.currentStep !== 0 && (
            <aside className="hidden lg:block w-[320px] shrink-0 relative">
              <div className="sticky top-28 z-10">
                <YourBuildSummary dbSteps={dbSteps} />
              </div>
            </aside>
          )}

        </div>

        <div className="mt-auto pb-32 lg:pb-8">
          <WizardFooter />
        </div>

        {state.currentStep !== 8 && state.currentStep !== 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/50 p-4 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
             <div className="flex items-center justify-start gap-3 max-w-7xl mx-auto">
               {state.currentStep > 1 && (
                 <button
                   onClick={() => {
                     const prev = state.currentStep === 6 ? 4 : state.currentStep - 1;
                     handleStepClick(prev);
                   }}
                   className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                 >
                   &larr; Back to Previous Step
                 </button>
               )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

function WizardContent({ step, dbSteps, dbPresets }: { step: number; dbSteps: any[], dbPresets?: any[] }) {
  if (step === 0) return <div className="relative animate-in fade-in duration-700 ease-out fill-mode-both"><Step0Onboarding dbPresets={dbPresets} /></div>;
  if (step === 1) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step1SalesStrategy dbSteps={dbSteps} /></div>;
  if (step === 2) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step2TeamStructure dbSteps={dbSteps} /></div>;
  if (step === 3) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step3SalesMaterials dbSteps={dbSteps} /></div>;
  if (step === 4) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step4LegalFramework dbSteps={dbSteps} /></div>;
  
  // Шаг 5 исключен
  
  if (step === 6) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step6DataScraping dbSteps={dbSteps} /></div>;
  if (step === 7) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step7Infrastructure dbSteps={dbSteps} /></div>;
  if (step === 8) return <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><Step8OrderSummary dbSteps={dbSteps} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Missing Step</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Please proceed back.</p>
      </div>
    </div>
  );
}