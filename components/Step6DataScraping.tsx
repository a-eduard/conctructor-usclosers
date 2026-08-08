"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useWizard } from "../contexts/WizardContext";
import { 
  CheckCircle, 
  Circle, 
  UploadCloud, 
  CheckCircle2, 
  Settings, 
  Zap, 
  Database,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export function Step6DataScraping({ dbSteps, isSummaryMode = false }: { dbSteps?: any[], isSummaryMode?: boolean }) {
  const { state, nextStep, addCartItem, removeCartItem, markClientProvided, removeClientProvided } = useWizard();

  const [viewMode, setViewMode] = useState<'intro' | 'content' | 'outro'>('intro');
  const [isInitialized, setIsInitialized] = useState(false);

  const stepData = dbSteps?.find(step => step.stepNumber === 6);
  const dataBlockRaw = stepData?.blocks?.[0];

  const options = useMemo(() => {
    if (!dataBlockRaw) return [];
    const enriched = dataBlockRaw.options.map((option: any) => {
      const enrichedOption = { ...option };
      
      // Перехватываем длинные тексты из базы и заменяем их на короткие емкие версии (в одну строку)
      if (enrichedOption.name === 'Bring Your Own (BYO)' || enrichedOption.name === 'Upload Own Data') {
        enrichedOption.bulletsList = [
          "Integrates your existing verified contact lists.",
          "Saves capital by utilizing data you already own.",
          "Ensures reps target specific pre-approved accounts."
        ];
      } else if (enrichedOption.name === 'Inbound Traffic') {
        enrichedOption.bulletsList = [
          "Captures high-intent active prospects.",
          "Leverages targeted B2B advertising.",
          "Generates predictable warm inbound leads."
        ];
      } else if (enrichedOption.name === 'Outbound Parsing') {
        enrichedOption.bulletsList = [
          "Extracts verified B2B contact information.",
          "Builds highly targeted prospect lists.",
          "Fuels automated outbound sequences."
        ];
      } else if (enrichedOption.name === 'Intent Data') {
        enrichedOption.bulletsList = [
          "Identifies accounts researching solutions.",
          "Prioritizes outreach by buying signals.",
          "Shortens the enterprise sales cycle."
        ];
      } else if (enrichedOption.name === 'CRM Enrichment') {
        enrichedOption.bulletsList = [
          "Revitalizes dormant historical databases.",
          "Reduces bounce rates & protects domain.",
          "Uncovers hidden revenue in your CRM."
        ];
      } else {
        // Фолбэк на случай других опций
        try {
          const parsed = JSON.parse(enrichedOption.bullets);
          enrichedOption.bulletsList = Array.isArray(parsed) ? parsed : enrichedOption.bullets.split('\n').filter(Boolean);
        } catch(e) {
          enrichedOption.bulletsList = enrichedOption.bullets ? enrichedOption.bullets.split('\n').filter(Boolean) : [];
        }
      }

      return enrichedOption;
    });

    // Строго сортируем: "Сделай сам" (myself) всегда идет первым
    return enriched.sort((a: any, b: any) => {
      if (a.type === 'myself' && b.type !== 'myself') return -1;
      if (a.type !== 'myself' && b.type === 'myself') return 1;
      return 0;
    });
  }, [dataBlockRaw]);

  useEffect(() => {
    if (options.length > 0 && !isInitialized) {
      if (isSummaryMode) {
        setViewMode('content');
      }
      setIsInitialized(true);
    }
  }, [options, isInitialized, isSummaryMode]);

  useEffect(() => {
    if (isSummaryMode) return;
    const handleTriggerError = (e: any) => {
      const elementId = e.detail;
      const element = document.getElementById(elementId);
      if (element) {
        setViewMode('content');
        requestAnimationFrame(() => {
          setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 10);
        });
      }
    };
    window.addEventListener('trigger-error-highlight', handleTriggerError as EventListener);
    return () => window.removeEventListener('trigger-error-highlight', handleTriggerError as EventListener);
  }, [isSummaryMode]);

  const handleToggleOption = (option: any) => {
    if (isSummaryMode) return;
    if (option.type === 'myself') {
      const isProvided = state.clientProvided.includes(`step6_${option.id}`);
      if (!isProvided) markClientProvided(`step6_${option.id}`);
      else removeClientProvided(`step6_${option.id}`);
    } else {
      const isInCart = state.cartItems.some(i => i.optionId === option.id);
      if (!isInCart) {
        addCartItem({ 
          allocatedHours: 0, 
          paymentType: 'one-time', 
          optionId: option.id, 
          name: option.name, 
          price: option.price || 0, 
          sla: option.sla || '7 Days', 
          category: 'service', 
          purpose: option.purpose || 'Data Scraping' 
        });
      } else {
        removeCartItem(option.id);
      }
    }
  };

  const hasAnySelection = options.some((opt: any) => {
    if (opt.type === 'myself') return state.clientProvided.includes(`step6_${opt.id}`);
    return state.cartItems.some(i => i.optionId === opt.id);
  });

  if (!options.length) {
    return <div className="text-center p-8 text-slate-500">Loading Configuration...</div>;
  }

  // --- INTRO SCREEN ---
  if (viewMode === 'intro' && !isSummaryMode) {
    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 md:p-16 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 shadow-sm max-w-4xl mx-auto min-h-[400px]">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Database className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Data & Traffic
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          Define the data sources and lead generation methods that will feed your pipeline. Ensure your team has a consistent flow of prospects.
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
          You've successfully configured your Data & Traffic sources. Let's move forward to set up your Infrastructure.
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

  if (isSummaryMode) {
    const activeOptions = options.filter((opt: any) => {
      if (opt.type === 'myself') return state.clientProvided.includes(`step6_${opt.id}`);
      return state.cartItems.some(i => i.optionId === opt.id);
    });

    return (
      <div className="space-y-3">
        {activeOptions.length > 0 ? (
          activeOptions.map((opt: any) => (
            <div key={opt.id} className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[16px] overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{opt.name}</h3>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-start sm:justify-end min-w-0">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold shrink-0 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    {opt.type === 'myself' ? <Settings className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    <span className="truncate max-w-[100px] sm:max-w-[150px] uppercase tracking-wide">{opt.name}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-mono font-bold shrink-0 bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    {opt.type === 'myself' ? '$0' : `+$${(opt.price || 0).toLocaleString()}`}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">No data sources selected</span>
        )}
      </div>
    );
  }

  // --- CONTENT SCREEN ---
  return (
    <div id={`diy-item-${dataBlockRaw?.id}`} className="animate-in fade-in duration-500 scroll-m-24">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {options.map((option: any) => {
          const isSelected = option.type === 'myself' 
            ? state.clientProvided.includes(`step6_${option.id}`)
            : state.cartItems.some(i => i.optionId === option.id);
          
          let cardClasses = "";
          if (isSelected) {
            cardClasses = "border-2 border-indigo-600 shadow-md ring-2 ring-indigo-500/10 bg-white dark:bg-slate-900/50";
          } else if (!hasAnySelection) {
            cardClasses = "border-2 border-amber-200/80 bg-amber-50/10 dark:border-amber-500/30 dark:bg-amber-500/5 hover:bg-amber-50/30";
          } else {
            cardClasses = "border-2 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50 opacity-60";
          }

          return (
            <div
              key={option.id}
              onClick={() => handleToggleOption(option)}
              className={`group relative cursor-pointer backdrop-blur-md rounded-[20px] p-4 sm:p-5 md:p-6 flex flex-col transition-colors duration-300 ${cardClasses}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-base sm:text-lg font-bold transition-colors ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                  {option.name}
                </h3>
                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <Circle className={`w-5 h-5 transition-colors shrink-0 ${!hasAnySelection ? 'text-amber-400 dark:text-amber-500 group-hover:text-amber-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'}`} />
                )}
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 font-medium min-h-[32px]">
                {option.detailsTitle}
              </p>

              <div className={`mt-auto mb-5 p-3 sm:p-4 rounded-xl transition-colors ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                <ul className="space-y-2">
                  {option.bulletsList.map((bullet: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      <div className={`w-1.5 h-1.5 rounded-full mt-[5px] sm:mt-1.5 shrink-0 transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {option.type === 'myself' ? (
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className={`text-sm sm:text-base font-mono font-bold transition-colors ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    $0
                  </span>
                  {isSelected && (
                    <div className="p-3 sm:p-4 bg-indigo-50/80 dark:bg-indigo-500/10 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 animate-in fade-in duration-300">
                      <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-200 font-semibold leading-relaxed">
                        Secure CSV upload interface will be unlocked after checkout.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className={`text-sm sm:text-base font-mono font-bold transition-colors ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    +${(option.price || 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={() => {
          setViewMode('outro');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={!hasAnySelection}
        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-indigo-600 text-white text-sm sm:text-base font-extrabold rounded-xl hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        Finish Stage
      </button>
    </div>
  );
}