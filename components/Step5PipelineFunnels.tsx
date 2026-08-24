"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useWizard } from "../contexts/WizardContext";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  User, 
  Settings, 
  Briefcase, 
  Zap, 
  Calendar, 
  MessageSquare, 
  Video, 
  Phone, 
  Users, 
  CheckCircle2,
  ArrowLeft,
  Filter
} from "lucide-react";

// Helper to format S3 URL
const getS3Url = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || "";
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ReactNode> = {
  calendar: <Calendar className="w-4 h-4" />,
  bot: <BotIcon className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />
};

export function Step5PipelineFunnels({ dbSteps, isSummaryMode = false }: { dbSteps?: any[], isSummaryMode?: boolean }) {
  const { state, nextStep, updateStep5Data, markClientProvided, removeClientProvided, addCartItem, removeCartItem } = useWizard();

  const [viewMode, setViewMode] = useState<'intro' | 'content' | 'outro'>('intro');
  const [isInitialized, setIsInitialized] = useState(false);

  const stepData = dbSteps?.find(step => step.stepNumber === 5);
  
  const templatesBlockRaw = stepData?.blocks?.find((b: any) => b.name === 'Funnel Templates');
  const configBlockRaw = stepData?.blocks?.find((b: any) => b.name === 'Configure Implementation');

  const FUNNEL_TEMPLATES = useMemo(() => {
    if (!templatesBlockRaw) return [];
    return templatesBlockRaw.options.map((opt: any) => {
      let config: any = {};
      try { config = JSON.parse(opt.grades || "{}"); } catch(e) {}
      
      let features: string[] = [];
      try { features = JSON.parse(opt.bullets || "[]"); } catch(e) { features = opt.bullets ? opt.bullets.split('\n') : []; }

      return {
        id: opt.id,
        name: opt.name,
        tagline: opt.detailsTitle || "",
        flow: config.flow || [],
        features: features,
        service: config.service || { price: 0, sla: "N/A" },
        hire: config.hire || { price: 0, sla: "N/A" }
      };
    });
  }, [templatesBlockRaw]);

  const configBlock = useMemo(() => {
    if (!configBlockRaw) return null;
    const enrichedOptions = configBlockRaw.options.map((option: any) => {
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
    return { ...configBlockRaw, options: enrichedOptions };
  }, [configBlockRaw]);

  useEffect(() => {
    if (FUNNEL_TEMPLATES.length > 0 && !isInitialized) {
      if (isSummaryMode) {
        setViewMode('content');
      }
      setIsInitialized(true);
    }
  }, [FUNNEL_TEMPLATES, isInitialized, isSummaryMode]);

  const handleSelectTemplate = (templateId: string) => {
    if (isSummaryMode) return;
    if (state.step5Data.selectedFunnel !== templateId) {
      updateStep5Data({ selectedFunnel: templateId });
      if (configBlock) {
        configBlock.options.forEach((opt: any) => {
           if (opt.type === 'myself') removeClientProvided(`step5_${opt.id}`);
           else removeCartItem(opt.id);
        });
      }
      setTimeout(() => {
        const configEl = document.getElementById('diy-item-funnel-config');
        if (configEl) configEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      updateStep5Data({ selectedFunnel: '' });
      if (configBlock) {
        configBlock.options.forEach((opt: any) => {
           if (opt.type === 'myself') removeClientProvided(`step5_${opt.id}`);
           else removeCartItem(opt.id);
        });
      }
    }
  };

  const selectedTemplate = FUNNEL_TEMPLATES.find((t: any) => t.id === state.step5Data.selectedFunnel);
  const hasGlobalSelection = !!state.step5Data.selectedFunnel;

  const getImplementationSelection = () => {
    if (!configBlock) return null;
    const myselfOpt = configBlock.options.find((o: any) => o.type === 'myself');
    const serviceOpt = configBlock.options.find((o: any) => o.type === 'service');
    const hireOpt = configBlock.options.find((o: any) => o.type === 'hire');

    if (myselfOpt && state.clientProvided.includes(`step5_${myselfOpt.id}`)) return 'myself';
    if (serviceOpt && state.cartItems.some((i: any) => i.optionId === serviceOpt.id)) return 'service';
    if (hireOpt && state.cartItems.some((i: any) => i.optionId === hireOpt.id)) return 'hire';
    return null;
  };

  const isCompleted = !!selectedTemplate && !!getImplementationSelection();

  const handleSelection = (template: typeof FUNNEL_TEMPLATES[0], type: 'diy' | 'service' | 'hire') => {
    if (isSummaryMode || !configBlock) return;

    const myselfOpt = configBlock.options.find((o: any) => o.type === 'myself');
    const serviceOpt = configBlock.options.find((o: any) => o.type === 'service');
    const hireOpt = configBlock.options.find((o: any) => o.type === 'hire');

    const currentSelection = getImplementationSelection();
    
    if (myselfOpt) removeClientProvided(`step5_${myselfOpt.id}`);
    if (serviceOpt) removeCartItem(serviceOpt.id);
    if (hireOpt) removeCartItem(hireOpt.id);

    if (currentSelection === (type === 'diy' ? 'myself' : type)) return;

    if (type === 'diy' && myselfOpt) {
      markClientProvided(`step5_${myselfOpt.id}`);
    } else if (type === 'service' && serviceOpt) {
      addCartItem({ 
        allocatedHours: 0, 
        paymentType: 'one-time', 
        optionId: serviceOpt.id, 
        name: `${serviceOpt.name} (${template.name})`, 
        price: template.service.price, 
        sla: template.service.sla, 
        category: 'service', 
        purpose: template.name 
      });
    } else if (type === 'hire' && hireOpt) {
      addCartItem({ 
        allocatedHours: 0, 
        paymentType: 'monthly', 
        optionId: hireOpt.id, 
        name: `${hireOpt.name} (${template.name})`, 
        price: template.hire.price, 
        sla: template.hire.sla, 
        category: 'hire', 
        purpose: template.name 
      });
    }
  };

  const getDisplayInfo = () => {
    const selection = getImplementationSelection();
    if (!selection || !configBlock) {
       let defaultBullets: string[] = [];
       if (configBlock?.description) defaultBullets = configBlock.description.split('\n').filter(Boolean);
       return { bullets: defaultBullets.length ? defaultBullets : ['Select a method above.'] };
    }
    
    const activeType = selection;
    const activeOption = configBlock.options.find((o: any) => o.type === activeType);
    
    if (activeOption) {
       return { bullets: activeOption.bulletsList || [] };
    }
    
    return { bullets: [] };
  };

  const getImageSrc = () => {
    const selection = getImplementationSelection();
    if (!selection || !configBlock) return configBlock?.imageUrl || 'funnel-setup-default.png';
    
    const activeType = selection;
    const activeOption = configBlock.options.find((o: any) => o.type === activeType);
    
    return activeOption?.imageUrl || configBlock.imageUrl || 'funnel-setup-default.png';
  };

  const displayInfo = getDisplayInfo();

  if (!FUNNEL_TEMPLATES.length) {
    return <div className="text-center p-8 text-slate-500">Loading Configuration...</div>;
  }

  // --- INTRO SCREEN ---
  if (viewMode === 'intro' && !isSummaryMode) {
    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 md:p-16 text-center flex flex-col items-center justify-center animate-in fade-in duration-500 shadow-sm max-w-4xl mx-auto min-h-[400px]">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Filter className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Pipeline Funnels
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          Select a proven pipeline architecture and configure how you want to deploy it to start generating revenue automatically.
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
          You've successfully configured your Pipeline Funnel. Let's move forward to secure Data & Traffic.
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
  if (isSummaryMode) {
    const selection = getImplementationSelection();
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[16px] overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {selectedTemplate ? selectedTemplate.name : 'Pipeline Funnel'}
              </h3>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-start sm:justify-end min-w-0">
            {selection ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold shrink-0 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                {selection === 'myself' ? 'Set it up myself' : selection === 'service' ? 'Buy Setup as a Service' : 'Hire an Expert'}
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="diy-item-funnels" className="animate-in fade-in duration-500 scroll-m-24 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {FUNNEL_TEMPLATES.map((template: any) => {
          const isSelected = state.step5Data.selectedFunnel === template.id;
          
          let cardClasses = "";
          if (isSelected) {
            cardClasses = "border-2 border-indigo-600 shadow-md ring-2 ring-indigo-500/10 bg-white dark:bg-slate-900/50 z-10";
          } else if (!hasGlobalSelection) {
            cardClasses = "border-2 border-amber-200/80 bg-amber-50/10 dark:border-amber-500/30 dark:bg-amber-500/5 cursor-pointer hover:bg-amber-50/30";
          } else {
            cardClasses = "border-2 border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 opacity-60 cursor-pointer";
          }

          return (
            <div 
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`group relative backdrop-blur-md rounded-2xl p-4 sm:p-5 transition-colors duration-300 ${cardClasses}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-base sm:text-lg font-bold transition-colors ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>
                    {template.name}
                  </h3>
                  <span className={`inline-block px-2.5 py-1 mt-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {template.tagline}
                  </span>
                </div>
                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <Circle className={`w-5 h-5 shrink-0 ${!hasGlobalSelection ? 'text-amber-400 dark:text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                {template.flow.map((step: any, idx: number) => (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${isSelected ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                      <span className={`${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                        {ICON_MAP[step.icon] || <Settings className="w-3.5 h-3.5" />}
                      </span>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-300'}`}>{step.label}</span>
                    </div>
                    {idx < template.flow.length - 1 && (
                      <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-indigo-300 dark:text-indigo-500/50' : 'text-slate-300 dark:text-slate-600'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="space-y-2 mt-auto">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Key Features</p>
                <ul className="space-y-1.5">
                  {template.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTemplate && configBlock && (() => {
        const myselfOpt = configBlock.options.find((o: any) => o.type === 'myself');
        const serviceOpt = configBlock.options.find((o: any) => o.type === 'service');
        const hireOpt = configBlock.options.find((o: any) => o.type === 'hire');

        const isDiyActive = myselfOpt && state.clientProvided.includes(`step5_${myselfOpt.id}`);
        const isServiceActive = serviceOpt && state.cartItems.some((i: any) => i.optionId === serviceOpt.id);
        const isHireActive = hireOpt && state.cartItems.some((i: any) => i.optionId === hireOpt.id);
        const hasSelection = isDiyActive || isServiceActive || isHireActive;
        
        const configBlockClasses = hasSelection 
          ? "bg-white dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 rounded-[20px] shadow-sm ring-1 ring-emerald-50 dark:ring-emerald-900/20 animate-in fade-in duration-300"
          : "bg-amber-50/10 dark:bg-amber-500/5 backdrop-blur-md border border-amber-200/80 dark:border-amber-500/30 rounded-[20px] shadow-sm ring-1 ring-amber-50 dark:ring-amber-900/20 animate-in fade-in duration-300";

        return (
          <div id="diy-item-funnel-config" className={`scroll-m-24 ${configBlockClasses}`}>
            <div className="flex flex-col p-4 sm:p-5 md:p-6">
              
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    {configBlock.name}
                    {hasSelection && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                    How would you like to build and deploy the <strong className="text-indigo-600 dark:text-indigo-400">{selectedTemplate.name}</strong>?
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-stretch">
                  
                  <div className="w-full md:w-1/2">
                    <div className="relative w-full h-[180px] md:h-full min-h-[200px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm transition-opacity duration-300">
                      <Image 
                        src={getS3Url(`/images/wizard/step5/${getImageSrc()}`)}
                        alt={configBlock.name}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col justify-between pt-1">
                    <div className="flex flex-col gap-3">
                      
                      {myselfOpt && (
                        <button
                          onClick={() => handleSelection(selectedTemplate, 'diy')}
                          className={`w-full relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${
                            isDiyActive
                              ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-500' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Settings className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isDiyActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                            <span className="font-bold text-sm sm:text-base">{myselfOpt.name}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-slate-500 font-medium">$0</span>
                        </button>
                      )}

                      {hireOpt && (
                        <button
                          onClick={() => handleSelection(selectedTemplate, 'hire')}
                          className={`w-full relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${
                            isHireActive
                              ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-500' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <User className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isHireActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                            <span className="font-bold text-sm sm:text-base text-left leading-tight">
                              {hireOpt.name}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-mono font-bold text-slate-500 shrink-0">
                            +${selectedTemplate.hire.price.toLocaleString()}/m
                          </span>
                        </button>
                      )}

                      {serviceOpt && (
                        <button
                          onClick={() => handleSelection(selectedTemplate, 'service')}
                          className={`w-full relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-colors duration-200 ${
                            isServiceActive
                              ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-500' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Zap className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isServiceActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                            <span className="font-bold text-sm sm:text-base text-left leading-tight">
                              {serviceOpt.name}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-mono font-bold text-slate-500 shrink-0">
                            +${selectedTemplate.service.price.toLocaleString()}
                          </span>
                        </button>
                      )}

                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('outro');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={!isCompleted}
                      className="mt-5 sm:mt-6 w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-indigo-600 text-white text-sm sm:text-base font-extrabold rounded-xl hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      Finish Stage
                    </button>

                  </div>
                </div>

                <div className="w-full bg-indigo-50/40 dark:bg-slate-800/50 rounded-xl p-4 md:p-5 border border-indigo-100 dark:border-slate-700 transition-colors overflow-hidden">
                  <ul className="grid grid-cols-1 gap-2.5 sm:gap-3 break-words">
                    {displayInfo.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="text-indigo-500 font-bold mt-[1px] sm:mt-[2px] shrink-0">•</span>
                        <span className="break-words overflow-hidden">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}