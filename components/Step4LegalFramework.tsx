"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useWizard } from "../contexts/WizardContext";
import { 
  CheckCircle2, 
  ChevronDown, 
  Settings, 
  Zap, 
  UploadCloud, 
  Info,
  Scale,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export function Step4LegalFramework({ dbSteps, isSummaryMode = false }: { dbSteps?: any[], isSummaryMode?: boolean }) {
  const { state, nextStep, markClientProvided, removeClientProvided, addCartItem, removeCartItem } = useWizard();

  const [viewMode, setViewMode] = useState<'intro' | 'content' | 'outro'>('intro');
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorStageId, setErrorStageId] = useState<string | null>(null);

  const stepData = dbSteps?.find(step => step.stepNumber === 4);
  const dbBlocksRaw = stepData?.blocks || [];

  const dbBlocks = useMemo(() => {
    if (!dbBlocksRaw.length) return [];
    return dbBlocksRaw.map((block: any) => {
      const enrichedOptions = block.options.map((option: any) => {
        const enrichedOption = { ...option };
        if (typeof enrichedOption.bullets === 'string') {
          try {
            const parsed = JSON.parse(enrichedOption.bullets);
            enrichedOption.bulletsList = Array.isArray(parsed) ? parsed : enrichedOption.bullets.split('\n').filter(Boolean);
          } catch(e) {
            enrichedOption.bulletsList = enrichedOption.bullets.split('\n').filter(Boolean);
          }
        } else {
          enrichedOption.bulletsList = [];
        }
        return enrichedOption;
      });
      return { ...block, options: enrichedOptions };
    });
  }, [dbBlocksRaw]);

  const isLoneWolf = useMemo(() => {
    const step2Data = dbSteps?.find(s => s.stepNumber === 2);
    if (!step2Data) return false;
    
    let myselfCount = 0;
    const targetBlocks = step2Data.blocks.filter((b: any) => [1, 2, 3].includes(b.order));
    for (const block of targetBlocks) {
      if (block.options.some((opt: any) => opt.type === 'myself' && state.clientProvided.includes(`step2_${opt.id}`))) {
        myselfCount++;
      }
    }
    return myselfCount === 3;
  }, [state.clientProvided, dbSteps]);

  const defaultExpandedId = useMemo(() => {
    if (!dbBlocks.length) return null;
    if (isLoneWolf && dbBlocks.length > 1) return dbBlocks[1].id;
    return dbBlocks[0].id;
  }, [dbBlocks, isLoneWolf]);

  useEffect(() => {
    if (dbBlocks.length > 0 && !isInitialized) {
      if (!isSummaryMode) {
        setExpandedStageId(defaultExpandedId);
      } else {
        setViewMode('content');
      }
      setIsInitialized(true);
    }
  }, [dbBlocks, isInitialized, defaultExpandedId, isSummaryMode]);

  useEffect(() => {
    if (expandedStageId && !isSummaryMode && viewMode === 'content') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById(`diy-item-${expandedStageId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 10);
      });
    }
  }, [expandedStageId, isSummaryMode, viewMode]);

  useEffect(() => {
    if (isSummaryMode) return;
    const handleTriggerError = (e: any) => {
      const elementId = e.detail;
      const element = document.getElementById(elementId);
      if (element) {
        const stageId = elementId.replace('diy-item-', '');
        setExpandedStageId(stageId);
        setViewMode('content');
        
        requestAnimationFrame(() => {
          setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 10);
        });
        
        setErrorStageId(stageId);
        setTimeout(() => setErrorStageId(null), 2500);
      }
    };
    window.addEventListener('trigger-error-highlight', handleTriggerError as EventListener);
    return () => window.removeEventListener('trigger-error-highlight', handleTriggerError as EventListener);
  }, [isSummaryMode]);

  const isOptionActive = (option: any) => {
    if (option.type === 'service') return state.cartItems.some((i: any) => i.optionId === option.id);
    if (option.type === 'myself') return state.clientProvided.includes(`step4_${option.id}`);
    return false;
  };

  const getActiveOption = (block: any) => block.options.find(isOptionActive);

  const handleSelect = (block: any, option: any) => {
    if (isSummaryMode) return;

    const isActive = isOptionActive(option);

    block.options.forEach((opt: any) => {
      if (isOptionActive(opt)) {
        if (opt.type === 'myself') removeClientProvided(`step4_${opt.id}`);
        else removeCartItem(opt.id);
      }
    });

    if (isActive) return;

    setTimeout(() => {
      if (option.type === 'myself') {
        markClientProvided(`step4_${option.id}`);
      } else if (option.type === 'service') {
        addCartItem({
          allocatedHours: 0,
          paymentType: 'one-time',
          optionId: option.id,
          name: option.name,
          price: Number(option.price) || 0,
          sla: option.sla || '4 Days',
          category: 'service',
          purpose: block.name
        });
      }
    }, 10);
  };

  const isBlockCompleted = (block: any) => {
    if (block.order === 1 && isLoneWolf) return true;
    return block.options.some(isOptionActive);
  };

  const getActiveDetails = (block: any) => {
    const activeOption = getActiveOption(block);
    if (activeOption) {
      return { bullets: activeOption.bulletsList || [] };
    }
    let defaultBullets: string[] = [];
    if (block.description) defaultBullets = block.description.split('\n').filter(Boolean);
    return { bullets: defaultBullets.length > 0 ? defaultBullets : ['Please select an option above to view details.'] };
  };

  const getActiveImage = (block: any) => {
    const activeOption = getActiveOption(block);
    if (activeOption && activeOption.imageUrl) return activeOption.imageUrl;
    if (block.imageUrl) return block.imageUrl;
    return 'legal-service_agreement.png'; 
  };

  const handleAdvance = (currentIndex: number) => {
    let nextIdx = currentIndex + 1;
    // Skip Lone Wolf block if necessary
    if (isLoneWolf && dbBlocks[nextIdx]?.order === 1) {
      nextIdx++;
    }

    if (nextIdx < dbBlocks.length) {
      setExpandedStageId(dbBlocks[nextIdx].id);
    } else {
      setExpandedStageId(null);
      setViewMode('outro');
    }
  };

  if (!dbBlocks.length) {
    return <div className="text-center p-8 text-slate-500">Loading Configuration...</div>;
  }

  // --- INTRO SCREEN ---
  if (viewMode === 'intro' && !isSummaryMode) {
    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 md:p-16 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 shadow-sm max-w-4xl mx-auto min-h-[400px]">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Scale className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Legal Framework
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          Ensure your operations are fully compliant. Set up the necessary agreements for hiring, service delivery, and data protection.
        </p>
        <button 
          onClick={() => {
            setViewMode('content');
          }}
          className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base sm:text-lg rounded-xl transition-colors shadow-md flex items-center justify-center gap-3"
        >
          Start Configuration
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // --- OUTRO SCREEN ---
  if (viewMode === 'outro' && !isSummaryMode) {
    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[24px] p-6 sm:p-8 md:p-16 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 shadow-sm max-w-4xl mx-auto min-h-[400px]">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-2xl rounded-full"></div>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Congratulations!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          You've successfully configured your Legal Framework. Let's move forward to define your Data & Traffic sources.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button 
            onClick={() => {
              setViewMode('content');
            }}
            className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-base rounded-xl transition-colors shadow-sm border-2 border-indigo-100 dark:border-slate-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Review Choices
          </button>
          <button 
            onClick={() => nextStep()}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base sm:text-lg rounded-xl transition-colors shadow-md flex items-center justify-center gap-3"
          >
            Next Step
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- CONTENT SCREEN ---
  return (
    <div className="animate-in fade-in duration-500">
      <div className="space-y-4 relative max-w-4xl mx-auto">
        
        {dbBlocks.map((block: any, idx: number) => {
          
          if (block.order === 1 && isLoneWolf) {
            return (
              <div key={block.id} className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/50 rounded-[20px] p-4 sm:p-5 sm:px-6 shadow-sm opacity-60">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-400">
                      <span className="text-base font-extrabold">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 truncate">{block.name}</h3>
                        <div className="group/tooltip relative inline-flex">
                          <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-xl shadow-xl text-center z-10 animate-in fade-in duration-200">
                            Not required since you assigned all sales roles to yourself (Lone Wolf).
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-medium truncate hidden sm:block">{block.description?.split('\n')[0]}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border border-transparent">
                      Not required
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const isCompleted = isBlockCompleted(block);
          const isExpanded = expandedStageId === block.id && !isSummaryMode;
          const displayInfo = getActiveDetails(block);
          const activeImage = getActiveImage(block);
          const activeOption = getActiveOption(block);
          
          // Strictly sort options: myself -> service
          const sortedOptions = [...block.options].sort((a, b) => {
            const weight = (type: string) => (type === 'myself' ? 1 : 2);
            return weight(a.type) - weight(b.type);
          });

          if (isSummaryMode) {
             return (
               <div key={block.id} className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[16px] overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{block.name}</h3>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-start sm:justify-end min-w-0">
                    {activeOption ? (
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold shrink-0 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          {activeOption.type === 'myself' && <Settings className="w-3.5 h-3.5" />}
                          {activeOption.type === 'service' && <Zap className="w-3.5 h-3.5" />}
                          <span className="truncate max-w-[100px] md:max-w-[150px] uppercase tracking-wide">
                            {activeOption.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-mono font-bold shrink-0 bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          {activeOption.type === 'myself' ? '$0' : `+$${(activeOption.price || 0).toLocaleString()}`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Pending</span>
                    )}
                  </div>
               </div>
             );
          }
          
          return (
            <div key={block.id} id={`diy-item-${block.id}`} className="relative group scroll-m-32 transition-colors duration-300">
              <div 
                onClick={() => !isExpanded && setExpandedStageId(block.id)}
                className={`bg-white dark:bg-slate-900/80 backdrop-blur-md border rounded-[20px] transition-colors duration-300 overflow-hidden ${
                  errorStageId === block.id
                    ? 'border-red-400 ring-2 ring-red-400/30 bg-red-50/20 dark:bg-red-500/10'
                    : isExpanded 
                      ? 'border-indigo-300 dark:border-indigo-500/50 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-900/20' 
                      : isCompleted
                        ? 'border-emerald-200 dark:border-emerald-500/30 cursor-pointer'
                        : 'border-amber-200/80 bg-amber-50/10 dark:border-amber-500/30 dark:bg-amber-500/5 cursor-pointer'
                }`}
              >
                {isExpanded ? (
                  <div className="flex flex-col p-4 sm:p-6 md:p-7">
                    <div 
                      className="flex items-center justify-between mb-5 sm:mb-6 cursor-pointer group/header"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStageId(null);
                      }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-base sm:text-lg font-extrabold shrink-0 border border-indigo-100 dark:border-indigo-500/20 transition-transform group-hover/header:scale-105">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{block.name}</h3>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover/header:bg-slate-100 dark:group-hover/header:bg-slate-700 transition-colors shrink-0">
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 rotate-180 transition-transform" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-5 sm:gap-6">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
                        
                        <div className="w-full md:w-1/2">
                          <div className="relative w-full h-[180px] md:h-full min-h-[200px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm transition-opacity duration-300">
                            <Image 
                              src={`/images/wizard/step4/${activeImage}`}
                              alt={block.name}
                              fill
                              className="object-cover transition-opacity duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-between pt-1">
                          <div className="flex flex-col gap-3">
                            
                            {sortedOptions.map((option: any) => {
                              const isActive = activeOption?.id === option.id;

                              if (option.type === 'myself') {
                                return (
                                  <div key={option.id} className="flex flex-col gap-1">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleSelect(block, option); }}
                                      className={`w-full relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${
                                        isActive
                                          ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Settings className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                        <span className="font-bold text-sm sm:text-base text-left">{option.name}</span>
                                      </div>
                                      <span className="text-xs sm:text-sm text-slate-500 font-medium shrink-0">$0</span>
                                    </button>
                                    
                                    {isActive && option.name !== "I am compliant" && (
                                      <div className="p-3 sm:p-4 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 animate-in fade-in duration-200">
                                        <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-200 font-medium leading-relaxed">
                                          File upload will be available in your dashboard after checkout.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              if (option.type === 'service') {
                                return (
                                  <button
                                    key={option.id}
                                    onClick={(e) => { e.stopPropagation(); handleSelect(block, option); }}
                                    className={`w-full relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${
                                      isActive
                                        ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-500' 
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Zap className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                      <span className="font-bold text-sm sm:text-base text-left leading-tight">
                                        {option.name}
                                      </span>
                                    </div>
                                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-500 shrink-0">
                                      +${(option.price || 0).toLocaleString()}
                                    </span>
                                  </button>
                                );
                              }
                              return null;
                            })}

                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvance(idx);
                            }}
                            disabled={!isCompleted}
                            className="mt-5 sm:mt-6 w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-indigo-600 text-white text-sm sm:text-base font-extrabold rounded-xl hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                          >
                            {idx === dbBlocks.length - 1 ? 'Finish Stage' : 'Continue'}
                          </button>
                        </div>
                      </div>

                      <div className="w-full bg-indigo-50/40 dark:bg-slate-800/50 rounded-xl p-4 md:p-6 border border-indigo-100 dark:border-slate-700 transition-colors overflow-hidden">
                        <ul className="grid grid-cols-1 gap-2.5 sm:gap-3 break-words">
                          {displayInfo.bullets.map((bullet: string, i: number) => (
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
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-base font-extrabold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{block.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-medium truncate hidden sm:block">
                          {block.description?.split('\n')[0]}
                        </p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-end min-w-0 max-w-[240px] md:max-w-[400px]">
                      {!activeOption ? (
                        <div className="px-4 py-2"></div>
                      ) : (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold shrink-0 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            {activeOption.type === 'myself' && <Settings className="w-3.5 h-3.5" />}
                            {activeOption.type === 'service' && <Zap className="w-3.5 h-3.5" />}
                            
                            <span className="truncate max-w-[100px] md:max-w-[150px] uppercase tracking-wide">
                              {activeOption.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-mono font-bold shrink-0 bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            {activeOption.type === 'myself' ? '$0' : `+$${(activeOption.price || 0).toLocaleString()}`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}