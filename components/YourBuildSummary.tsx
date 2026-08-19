"use client";

import React, { useMemo } from "react";
import { useWizard, DIY_HOURS_MAP } from "../contexts/WizardContext";
import { AnimatedNumber } from "./AnimatedNumber"; 
import { CheckCircle2 } from "lucide-react";

const STEP_NAMES: Record<number, string> = {
  1: 'Strategy',
  2: 'Team Structure',
  3: 'Materials',
  4: 'Legal',
  5: 'Funnels', // Временно скрыт в интерфейсе
  6: 'Data & Traffic',
  7: 'Infrastructure',
};

const normalizeSharedResource = (name: string) => {
  if (!name) return '';
  const lower = name.toLowerCase();
  if (lower.includes('account executive') || lower.includes('ae') || lower.includes('closer')) return 'ae';
  if (lower.includes('sdr') || lower.includes('sales development')) return 'sdr';
  if (lower.includes('scout')) return 'scout';
  if (lower.includes('team lead') || lower.includes('manager')) return 'team_lead';
  return lower.replace(/^(buy |hire )/i, '').split('(')[0].trim();
};

const getStepForOption = (optionId: string, dbSteps: any[] = []): number => {
  for (const step of dbSteps) {
    if (step.blocks) {
      for (const block of step.blocks) {
        for (const opt of block.options) {
           if (
             opt.id === optionId || 
             `step2_${opt.id}` === optionId ||
             `step3_${opt.id}` === optionId ||
             `step4_${opt.id}` === optionId ||
             `step5_${opt.id}` === optionId ||
             `step6_${opt.id}` === optionId ||
             `step7_${opt.id}` === optionId ||
             `competitor_intel_${opt.id}` === optionId ||
             `partner_mou_${opt.id}` === optionId
           ) {
             return step.stepNumber;
           }
        }
      }
    }
  }
  if (['sales_methodology', 'competitor_intel', 'partner_mou', 'sales_consulting'].includes(optionId)) return 1;
  if (['lead_gen', 'qualification', 'demo', 'negotiation', 'closed_won_lost', 'scout_hire', 'agency_leadgen', 'sdr', 'ai_sdr', 'closer', 'team_lead', 'sales_ops'].includes(optionId)) return 2;
  if (['sales_deck', 'one_pager', 'objections_playbook', 'sales_playbook', 'battlecards'].includes(optionId)) return 3;
  if (['hiring_agreement', 'service_agreement', 'terms_of_service', 'gdpr_compliance', 'legal_setup'].includes(optionId)) return 4;
  if (['inbound_demo_funnel', 'micro_consulting', 'outbound_cold_meeting', 'automated_webinar', 'quick_callback', 'custom_funnel'].includes(optionId)) return 5;
  if (['byo_data', 'inbound_traffic', 'outbound_parsing', 'crm_enrichment', 'intent_data'].includes(optionId)) return 6;
  if (['sales_meeting_room', 'sales_team_chat', 'document_signing', 'dataroom', 'email_infra', 'calendar_booking', 'preconfigured_crm', 'power_dialer_voip', 'call_intelligence_qa', 'cpq_invoicing', 'knowledge_base'].includes(optionId)) return 7;
  return 0;
};

const getFounderHoursForId = (id: string, dbSteps: any[] = []) => {
  if (id.startsWith('step2_')) return 40; 
  if (id.startsWith('step3_')) {
    const uuid = id.replace('step3_', '');
    const step3 = dbSteps.find(s => s.stepNumber === 3);
    if (step3) {
      for (const block of step3.blocks) {
        if (block.options.some((opt: any) => opt.id === uuid)) {
          if (block.name.includes('Pitch Deck')) return 25;
          if (block.name.includes('One-Pager')) return 8;
          if (block.name.includes('Objections')) return 15;
          if (block.name.includes('Sales Playbook')) return 40;
          if (block.name.includes('Battlecards')) return 20;
        }
      }
    }
    return 20;
  }
  if (id.startsWith('step4_')) {
    const uuid = id.replace('step4_', '');
    const step4 = dbSteps.find(s => s.stepNumber === 4);
    if (step4) {
      for (const block of step4.blocks) {
        if (block.options.some((opt: any) => opt.id === uuid)) {
          if (block.name.includes('Hiring')) return 10;
          if (block.name.includes('Service Agreement')) return 15;
          if (block.name.includes('Terms of Service')) return 20;
          if (block.name.includes('GDPR')) return 30;
        }
      }
    }
    return 15;
  }
  if (id.startsWith('step5_')) return 20; 
  if (id.startsWith('step6_')) return 10; 
  if (id.startsWith('step7_')) return 3; 
  if (id.startsWith('competitor_intel_')) return 25;
  if (id.startsWith('partner_mou_')) return 20;
  return DIY_HOURS_MAP[id] || 0;
};

const checkStepValid = (step: number, state: any, dbSteps: any[] = []) => {
  if (step === 1) {
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
  
  if (step === 2) {
    const step2Data = dbSteps.find((s: any) => s.stepNumber === 2);
    if (!step2Data || !step2Data.blocks) return false;
    const isOptionActive = (option: any) => {
      if (option.type === 'service' || option.type === 'hire') {
        return state.cartItems.some((i: any) => {
          if (i.optionId === option.id) return true;
          if (i.category === option.type) return normalizeSharedResource(i.name) === normalizeSharedResource(option.name);
          return false;
        });
      }
      if (option.type === 'myself') return state.clientProvided.includes(`step2_${option.id}`);
      return false;
    };
    return step2Data.blocks.every((block: any) => block.options.some((opt: any) => isOptionActive(opt)));
  }

  if (step === 3) {
    const step3Data = dbSteps.find((s: any) => s.stepNumber === 3);
    if (!step3Data || !step3Data.blocks) return false;
    const isOptionActive = (option: any) => {
      if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
      if (option.type === 'myself') return state.clientProvided.includes(`step3_${option.id}`);
      return false;
    };
    return step3Data.blocks.every((block: any) => block.options.some((opt: any) => isOptionActive(opt)));
  }

  if (step === 4) {
    const step4Data = dbSteps.find((s: any) => s.stepNumber === 4);
    if (!step4Data || !step4Data.blocks) return false;
    const isLoneWolf = (() => {
      if (state.clientProvided.includes('lead_gen') && state.clientProvided.includes('qualification') && state.clientProvided.includes('demo')) return true;
      const step2Data = dbSteps.find((s: any) => s.stepNumber === 2);
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

  if (step === 5) {
    // Временно всегда возвращаем true, чтобы он не блокировал финальный чек, 
    // так как мы исключили этот шаг из логики.
    return true; 
  }

  if (step === 6) {
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

  if (step === 7) {
    const step7Data = dbSteps.find((s: any) => s.stepNumber === 7);
    if (!step7Data || !step7Data.blocks) return false;
    const isOptionActive = (option: any) => {
      if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
      if (option.type === 'myself') return state.clientProvided.includes(`step7_${option.id}`);
      return false;
    };
    return step7Data.blocks.every((block: any) => block.options.some((opt: any) => isOptionActive(opt)));
  }

  return false;
};

export function YourBuildSummary({ dbSteps = [] }: { dbSteps?: any[] }) {
  const { state } = useWizard();

  const totalFounderHours = useMemo(() => {
    return state.clientProvided.reduce((sum, id) => sum + getFounderHoursForId(id, dbSteps), 0);
  }, [state.clientProvided, dbSteps]);

  const totalDelegatedHours = useMemo(() => {
    return state.cartItems.reduce((sum, item) => {
      if (item.paymentType === 'monthly') {
        return sum + (item.allocatedHours || 0);
      }
      return sum;
    }, 0);
  }, [state.cartItems]);

  const getStepTotals = (stepNumber: number) => {
    const stepCartItems = state.cartItems.filter(item => getStepForOption(item.optionId, dbSteps) === stepNumber);
    const stepClientItems = state.clientProvided.filter(id => getStepForOption(id, dbSteps) === stepNumber);
    
    const stepCost = stepCartItems.reduce((acc, item) => acc + item.price, 0);
    const stepFounderHours = stepClientItems.reduce((acc, id) => acc + getFounderHoursForId(id, dbSteps), 0);
    
    return { cost: stepCost, founderHours: stepFounderHours };
  };

  if (state.currentStep === 8 || state.currentStep === 0) {
    return null;
  }

  // Убираем шаг 5 из массива рендера
  const visibleSteps = [1, 2, 3, 4, 6, 7];
  const stepsToRender = visibleSteps.map(step => {
    return { step, ...getStepTotals(step) };
  });

  return (
    <div className="bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col transition-all w-full">
      {/* Block 1: Global KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3.5">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">One-Time</p>
          <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            <AnimatedNumber value={state.totalOneTime} format={(val) => `$${val.toLocaleString()}`} />
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Monthly Burn</p>
          <p className="text-xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">
            <AnimatedNumber value={state.totalMonthly} format={(val) => `$${val.toLocaleString()}/mo`} />
          </p>
        </div>
        <div className={`p-3.5 rounded-2xl border ${totalFounderHours > 100 ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${totalFounderHours > 100 ? 'text-rose-500' : 'text-emerald-500'}`}>Your Time</p>
          <p className={`text-xl font-extrabold tracking-tight ${totalFounderHours > 100 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
            <AnimatedNumber value={totalFounderHours} format={(val) => `${val} hr/mo`} />
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-500/20">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Delegated</p>
          <p className="text-xl font-extrabold tracking-tight text-purple-700 dark:text-purple-400">
            <AnimatedNumber value={totalDelegatedHours} format={(val) => `${val} hr/mo`} />
          </p>
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700/50 w-full mb-6" />

      {/* Block 2: Breakdown by Steps */}
      <div className="flex-1 space-y-2.5">
        {stepsToRender.map(({ step, cost, founderHours }, index) => {
          const isActive = state.currentStep === step;
          const isCompleted = checkStepValid(step, state, dbSteps);
          
          // Динамический номер для отображения (чтобы не было разрыва после 4)
          const displayStepNumber = index + 1;

          return (
            <div 
              key={step} 
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-500/20 scale-[1.02] ml-1' 
                  : isCompleted 
                    ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-400 dark:border-emerald-500/40 shadow-sm'
                    : 'border border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {isCompleted && !isActive ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                ) : (
                  <span className={`text-sm font-bold w-4 text-center shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {displayStepNumber}.
                  </span>
                )}
                
                <span className={`text-[15px] font-bold truncate transition-colors ${
                  isActive ? 'text-indigo-700 dark:text-indigo-300' : 
                  isCompleted ? 'text-emerald-800 dark:text-emerald-200' : 
                  'text-slate-500 dark:text-slate-400'
                }`}>
                  {STEP_NAMES[step]}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 pl-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-500/30' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <AnimatedNumber 
                    value={cost} 
                    format={(val) => val > 0 ? (val >= 1000 ? `$${(val / 1000).toFixed(1).replace('.0', '')}k` : `$${val}`) : '$0'} 
                  />
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                  founderHours > 20 
                    ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' 
                    : isActive 
                      ? 'text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30'
                      : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
                }`}>
                  <AnimatedNumber value={founderHours} format={(val) => `${val}h`} /> <span className="text-[11px]">👤</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}