"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useWizard } from "../contexts/WizardContext";
import { 
  CheckCircle, 
  Zap, 
  Settings, 
  Target, 
  MessageSquare, 
  DollarSign, 
  LineChart, 
  Briefcase,
  ChevronDown,
  Check,
  UploadCloud,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const BLOCK_ICONS: Record<string, React.ElementType> = {
  'Sales Methodology': Target,
  'Primary Channels': MessageSquare,
  'Pricing Strategy': DollarSign,
  'Competitor Intelligence': LineChart,
  'Partnerships': Briefcase,
};

const CUSTOM_TITLES: Record<string, string> = {
  'Pricing Strategy': 'What is the price of your product?',
  'Competitor Intelligence': 'Who are your competitors?',
  'Partnerships': 'How will you leverage partnerships?',
  'Primary Channels': 'What are your primary channels?',
  'Sales Methodology': 'Which framework fits your team?'
};

const RENAME_MAP: Record<string, string> = {
  'Upload Own Data': 'I will provide this list myself',
  'Use Own Network': 'I will provide this list myself',
  'One-Time Payment': 'One-Time',
  'Recurring Model (SaaS)': 'Recurring'
};

const getDisplayName = (name: string) => {
  if (name.includes('Partner MoU')) {
    return 'Order a partner network development service';
  }
  return RENAME_MAP[name] || name;
};

export function Step1SalesStrategy({ dbSteps, isSummaryMode = false }: { dbSteps?: any[], isSummaryMode?: boolean }) {
  const { state, nextStep, updateStep1Data, markClientProvided, addCartItem, removeCartItem, removeClientProvided } = useWizard();
  
  const [viewMode, setViewMode] = useState<'intro' | 'content' | 'outro'>('intro');
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeOptionHistory, setActiveOptionHistory] = useState<string[]>([]);
  
  const stepData = dbSteps?.find(step => step.stepNumber === 1);
  const dbBlocks = stepData?.blocks || [];

  useEffect(() => {
    if (dbBlocks.length > 0 && !isInitialized) {
      if (!isSummaryMode) {
        setExpandedStageId(dbBlocks[0].id);
      } else {
        setViewMode('content');
      }
      setIsInitialized(true);
    }
  }, [dbBlocks, isInitialized, isSummaryMode]);

  useEffect(() => {
    if (expandedStageId && !isSummaryMode && viewMode === 'content') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById(`block-${expandedStageId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 10);
      });
    }
  }, [expandedStageId, isSummaryMode, viewMode]);

  const handleAdvance = (currentIndex: number) => {
    if (currentIndex < dbBlocks.length - 1) {
      setExpandedStageId(dbBlocks[currentIndex + 1].id);
    } else {
      setExpandedStageId(null);
      setViewMode('outro');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isOptionActive = (option: any, blockName: string) => {
    if (option.type === 'service') {
      return state.cartItems.some((i: any) => i.optionId === option.id);
    }
    if (option.type === 'myself') {
      if (blockName === 'Sales Methodology') return state.step1Data.methodology === option.name;
      if (blockName === 'Primary Channels') return state.step1Data.channels.includes(option.name);
      if (blockName === 'Pricing Strategy') return state.step1Data.subscriptionModel === option.name;
      if (blockName === 'Competitor Intelligence') return state.clientProvided.includes(`competitor_intel_${option.id}`);
      if (blockName === 'Partnerships') return state.clientProvided.includes(`partner_mou_${option.id}`);
    }
    return false;
  };

  const handleOptionToggle = (option: any, blockName: string) => {
    if (isSummaryMode) return;

    const isActive = isOptionActive(option, blockName);

    setActiveOptionHistory(prev => {
      if (!isActive) return [...prev.filter(id => id !== option.id), option.id];
      return prev.filter(id => id !== option.id);
    });

    if (blockName === 'Sales Methodology') {
      if (option.type === 'myself') {
        updateStep1Data({ methodology: option.name });
        const serviceOpts = dbBlocks.find((b: any) => b.name === blockName)?.options.filter((o: any) => o.type === 'service') || [];
        serviceOpts.forEach((so: any) => removeCartItem(so.id));
      } else {
        updateStep1Data({ methodology: '' }); 
        if (!isActive) addCartItem({ ...option, optionId: option.id, category: 'service', paymentType: 'one-time' });
        else removeCartItem(option.id);
      }
    }
    else if (blockName === 'Primary Channels') {
      const current = state.step1Data.channels;
      if (current.includes(option.name)) updateStep1Data({ channels: current.filter((c: string) => c !== option.name) });
      else updateStep1Data({ channels: [...current, option.name] });
    }
    else if (blockName === 'Pricing Strategy') {
      updateStep1Data({ subscriptionModel: isActive ? '' : option.name });
    }
    else if (blockName === 'Competitor Intelligence' || blockName === 'Partnerships') {
      const prefix = blockName === 'Competitor Intelligence' ? 'competitor_intel' : 'partner_mou';
      if (option.type === 'myself') {
        if (!isActive) {
           markClientProvided(`${prefix}_${option.id}`);
           const serviceOpts = dbBlocks.find((b: any) => b.name === blockName)?.options.filter((o: any) => o.type === 'service') || [];
           serviceOpts.forEach((so: any) => removeCartItem(so.id));
        } else {
           removeClientProvided(`${prefix}_${option.id}`);
        }
      } else {
        if (!isActive) {
           addCartItem({ ...option, optionId: option.id, category: 'service', paymentType: 'one-time' });
           const myselfOpts = dbBlocks.find((b: any) => b.name === blockName)?.options.filter((o: any) => o.type === 'myself') || [];
           myselfOpts.forEach((mo: any) => removeClientProvided(`${prefix}_${mo.id}`));
        } else {
           removeCartItem(option.id);
        }
      }
    }
  };

  const isBlockCompleted = (block: any) => {
    if (block.name === 'Pricing Strategy') {
       const acvValue = parseFloat(state.step1Data.acv);
       return !isNaN(acvValue) && acvValue > 0 && !!state.step1Data.subscriptionModel;
    }
    return block.options.some((opt: any) => isOptionActive(opt, block.name));
  };

  const getBlockSummary = (block: any) => {
    if (block.name === 'Pricing Strategy' && state.step1Data.acv) {
      const acvValue = parseFloat(state.step1Data.acv);
      if(isNaN(acvValue) || acvValue <= 0) return '';
      return `$${state.step1Data.acv} • ${getDisplayName(state.step1Data.subscriptionModel || 'Pending')}`;
    }
    const activeOptions = block.options.filter((opt: any) => isOptionActive(opt, block.name));
    if (activeOptions.length === 0) return '';
    return activeOptions.map((opt: any) => getDisplayName(opt.name)).join(', ');
  };

  const getActiveImage = (block: any) => {
    const activeOptions = block.options.filter((opt: any) => isOptionActive(opt, block.name));
    if (activeOptions.length === 0) return block.imageUrl || 'methodology.png';

    for (let i = activeOptionHistory.length - 1; i >= 0; i--) {
      const id = activeOptionHistory[i];
      const found = activeOptions.find((o: any) => o.id === id && o.imageUrl);
      if (found) return found.imageUrl;
    }

    const activeOptionWithImage = activeOptions.find((opt: any) => opt.imageUrl);
    return activeOptionWithImage ? activeOptionWithImage.imageUrl : block.imageUrl || 'methodology.png'; 
  };

  const getActiveDetails = (block: any) => {
    const activeOptions = block.options.filter((opt: any) => isOptionActive(opt, block.name));
    
    if (activeOptions.length > 0) {
      let activeOpt = activeOptions[activeOptions.length - 1]; 

      for (let i = activeOptionHistory.length - 1; i >= 0; i--) {
        const id = activeOptionHistory[i];
        const found = activeOptions.find((o: any) => o.id === id);
        if (found) {
          activeOpt = found;
          break;
        }
      }

      let bullets = [];
      try {
        bullets = activeOpt.bullets ? JSON.parse(activeOpt.bullets) : [];
      } catch (e) {
        bullets = activeOpt.bullets ? activeOpt.bullets.split('\n').filter(Boolean) : [];
      }
      return { bullets };
    }
    
    let defaultBullets: string[] = [];
    if (block.description) {
       defaultBullets = block.description.split('\n').filter(Boolean);
    }
    return { bullets: defaultBullets.length > 0 ? defaultBullets : ['Please select an option above to view details.'] };
  };

  const renderOptions = (block: any) => {
    const myselfOptions = block.options.filter((o: any) => o.type === 'myself');
    const serviceOptions = block.options.filter((o: any) => o.type === 'service');

    if (block.name === 'Sales Methodology') {
      const sortedMyself = [...myselfOptions].sort((a, b) => {
        if (a.name.toLowerCase() === 'other') return 1;
        if (b.name.toLowerCase() === 'other') return -1;
        return 0;
      });

      return (
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {sortedMyself.map((option: any) => {
              const isActive = isOptionActive(option, block.name);
              return (
                <button
                  key={option.id}
                  onClick={(e) => { e.stopPropagation(); handleOptionToggle(option, block.name); }}
                  disabled={isSummaryMode}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm transition-colors duration-300 ${isSummaryMode ? 'cursor-default' : 'cursor-pointer'} ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500'
                      : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:hover:border-slate-600'
                  }`}
                >
                  {getDisplayName(option.name)}
                </button>
              );
            })}
          </div>
          {serviceOptions.length > 0 && (
            <div className="space-y-2">
              {serviceOptions.map((option: any) => {
                const isActive = isOptionActive(option, block.name);
                const displayName = option.name.toLowerCase().startsWith('buy') ? option.name : `Buy ${option.name}`;
                return (
                  <button
                    key={option.id}
                    onClick={(e) => { e.stopPropagation(); handleOptionToggle(option, block.name); }}
                    disabled={isSummaryMode}
                    className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${isSummaryMode ? 'cursor-default' : ''} ${
                      isActive 
                        ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className={`font-bold text-sm sm:text-base ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {displayName}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-500">+${option.price}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (block.name === 'Primary Channels') {
      return (
        <div className="flex flex-wrap gap-2.5 mb-2">
          {myselfOptions.map((option: any) => {
            const isActive = isOptionActive(option, block.name);
            return (
              <label 
                key={option.id} 
                className={`flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 transition-colors duration-300 ${isSummaryMode ? 'cursor-default' : 'cursor-pointer'} ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
              }`}>
                <input type="checkbox" className="sr-only" disabled={isSummaryMode} checked={isActive} onChange={() => handleOptionToggle(option, block.name)} />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isActive ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isActive && <Check className="w-3 h-3" />}
                </div>
                <span className={`font-bold text-xs sm:text-sm ${isActive ? 'text-indigo-700 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>{getDisplayName(option.name)}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (block.name === 'Pricing Strategy') {
      return (
        <div className="flex flex-col gap-4 mb-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-xl sm:text-2xl font-black text-slate-300 dark:text-slate-500">$</span>
            </div>
            <input
              type="number"
              disabled={isSummaryMode}
              placeholder="15000"
              value={state.step1Data.acv || ''}
              onChange={(e) => updateStep1Data({ acv: e.target.value })}
              className={`w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white font-mono font-bold text-lg sm:text-xl transition-colors ${isSummaryMode ? 'opacity-80 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {myselfOptions.map((option: any) => {
              const isActive = isOptionActive(option, block.name);
              return (
                <button
                  key={option.id}
                  disabled={isSummaryMode}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionToggle(option, block.name);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-colors ${isSummaryMode ? 'cursor-default' : ''} ${
                    isActive 
                      ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {getDisplayName(option.name)}
                </button>
              )
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {myselfOptions.map((option: any) => {
          const isActive = isOptionActive(option, block.name);
          return (
            <button
              key={option.id}
              disabled={isSummaryMode}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionToggle(option, block.name);
              }}
              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${isSummaryMode ? 'cursor-default' : ''} ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                  : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`font-bold text-sm sm:text-base ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{getDisplayName(option.name)}</span>
              </div>
              {option.price > 0 ? (
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-500">${option.price}</span>
              ) : (
                <span className="text-xs sm:text-sm text-slate-500 font-medium">$0</span>
              )}
            </button>
          );
        })}
        
        {serviceOptions.map((option: any) => {
          const isActive = isOptionActive(option, block.name);
          return (
            <button
              key={option.id}
              disabled={isSummaryMode}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionToggle(option, block.name);
              }}
              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${isSummaryMode ? 'cursor-default' : ''} ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                  : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`font-bold text-sm sm:text-base ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{getDisplayName(option.name)}</span>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-500">+${option.price}</span>
            </button>
          );
        })}

        {myselfOptions.some((opt: any) => isOptionActive(opt, block.name)) && !isSummaryMode && (
          <div className="mt-2 p-3 sm:p-4 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-dashed border-indigo-200 flex items-start gap-3 animate-in fade-in duration-300">
            <UploadCloud className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-200 font-medium leading-relaxed">
              Data/Resources for this option will be available in your dashboard after checkout.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!dbBlocks.length) {
    return <div className="text-center p-8 text-slate-500">Loading Configuration...</div>;
  }

  // --- ЭКРАН INTRO ---
  if (viewMode === 'intro' && !isSummaryMode) {
    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 md:p-16 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 shadow-sm max-w-4xl mx-auto min-h-[400px]">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Target className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Sales Strategy
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          On this first step, we need to define your core go-to-market approach. There will be 5 quick configuration blocks to establish your strategic foundation.
        </p>
        <button 
          onClick={() => {
            setViewMode('content');
            // Убрали window.scrollTo чтобы избежать скачков
          }}
          className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base sm:text-lg rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3"
        >
          Start Configuration
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // --- ЭКРАН OUTRO ---
  if (viewMode === 'outro' && !isSummaryMode) {
    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[24px] p-6 sm:p-8 md:p-16 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 shadow-sm max-w-4xl mx-auto min-h-[400px]">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-2xl rounded-full"></div>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-500/20">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Congratulations!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          You've successfully configured your Sales Strategy. All foundational settings are saved. Let's move forward to build your Team Structure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button 
            onClick={() => {
              setViewMode('content');
            }}
            className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-base rounded-xl transition-all shadow-sm border-2 border-indigo-100 dark:border-slate-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Review Choices
          </button>
          <button 
            onClick={() => nextStep()}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base sm:text-lg rounded-xl transition-all shadow-md flex items-center justify-center gap-3"
          >
            Next Step
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН CONTENT (Аккордеоны) ---
  return (
    <div className="space-y-4 relative max-w-4xl mx-auto animate-in fade-in duration-500">
      {dbBlocks.map((block: any, index: number) => {
        const isExpanded = expandedStageId === block.id && !isSummaryMode;
        const Icon = BLOCK_ICONS[block.name] || Target;
        const isCompleted = isBlockCompleted(block);
        const displayInfo = getActiveDetails(block);
        const activeImage = getActiveImage(block);
        
        if (isSummaryMode) {
           return (
             <div key={block.id} className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[16px] overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{block.name}</h3>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-start sm:justify-end min-w-0">
                   <p className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate uppercase tracking-wide">
                     {getBlockSummary(block)}
                   </p>
                </div>
             </div>
           );
        }

        return (
          <div 
            key={block.id}
            id={`block-${block.id}`}
            onClick={() => !isExpanded && setExpandedStageId(block.id)}
            className={`bg-white dark:bg-slate-900/80 backdrop-blur-md border rounded-[20px] transition-colors duration-300 overflow-hidden scroll-m-32 ${
              isExpanded 
                ? 'border-indigo-300 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-50 dark:ring-indigo-900/20' 
                : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-500/30 cursor-pointer'
                  : 'border-amber-200/80 bg-amber-50/10 dark:border-amber-500/30 dark:bg-amber-500/5 cursor-pointer'
            }`}
          >
            {isExpanded ? (
              <div className="flex flex-col p-4 sm:p-6 md:p-7">
                <div 
                  className="flex items-center justify-between mb-5 sm:mb-6 cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedStageId(null);
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 transition-transform group-hover:scale-105">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {CUSTOM_TITLES[block.name] || block.name}
                    </h3>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors shrink-0">
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 rotate-180 transition-transform" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-5 sm:gap-6">
                  
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
                    
                    <div className="w-full md:w-1/2">
                      <div className="relative w-full h-[180px] md:h-full min-h-[200px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm">
                        <Image 
                          src={`/images/wizard/step1/${activeImage}`}
                          alt={block.name}
                          fill
                          className="object-cover transition-opacity duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-between pt-1">
                      
                      <div className="flex-1 flex flex-col gap-3">
                        {renderOptions(block)}
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdvance(index);
                        }}
                        disabled={!isCompleted}
                        className="mt-5 sm:mt-6 w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-indigo-600 text-white text-sm sm:text-base font-extrabold rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {index < dbBlocks.length - 1 ? 'Continue' : 'Finish Stage'}
                      </button>
                    </div>
                  </div>

                  <div className="w-full bg-indigo-50/40 dark:bg-slate-800/50 rounded-xl p-4 md:p-6 border border-indigo-100 dark:border-slate-700 transition-colors overflow-hidden">
                    <ul className="grid grid-cols-1 gap-2.5 sm:gap-3 break-words">
                      {Array.isArray(displayInfo.bullets) && displayInfo.bullets.map((bullet: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="text-indigo-500 font-bold mt-[1px] sm:mt-[2px] shrink-0">•</span>
                          <span className="break-words overflow-hidden">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                      : 'bg-amber-100/50 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{block.name}</h3>
                    {isCompleted && (
                      <p className="text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5 uppercase tracking-wide">
                        {getBlockSummary(block)}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 dark:text-slate-600 shrink-0" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}