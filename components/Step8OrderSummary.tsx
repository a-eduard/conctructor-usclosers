"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWizard, DIY_HOURS_MAP } from "../contexts/WizardContext";
import { processCheckout, saveOrderDraft } from "../app/actions/orderActions";
import { 
  Clock, ShieldCheck, Target, 
  Save, CreditCard, ChevronDown, ChevronUp, Users, 
  FileText, Scale, Database, Server, RefreshCw,
  ArrowRight, AlertTriangle
} from "lucide-react";

import { Step1SalesStrategy } from "./Step1SalesStrategy";
import { Step2TeamStructure } from "./Step2TeamStructure";
import { Step3SalesMaterials } from "./Step3SalesMaterials";
import { Step4LegalFramework } from "./Step4LegalFramework";
import { Step6DataScraping } from "./Step6DataScraping";
import { Step7Infrastructure } from "./Step7Infrastructure";
import { useLocale } from "next-intl";

// Helper to format S3 URL
const getS3Url = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || "";
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

function SummaryAccordion({ 
  title, 
  subtitle, 
  icon, 
  iconBgClass, 
  iconColorClass, 
  children,
  stepNum
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  children: React.ReactNode;
  stepNum: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById(`summary-step-${stepNum}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 10);
      });
    }
  }, [isExpanded, stepNum]);

  return (
    <div 
      id={`summary-step-${stepNum}`}
      className={`bg-white dark:bg-slate-900/80 backdrop-blur-md border transition-all duration-300 rounded-[24px] overflow-hidden scroll-m-32 ${
      isExpanded 
        ? 'border-indigo-300 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-50 dark:ring-indigo-900/20' 
        : 'border-slate-200 dark:border-slate-800/60 cursor-pointer'
    }`}>
      <div 
        className="w-full px-4 sm:px-6 md:px-7 py-4 sm:py-5 flex items-center justify-between transition-colors select-none" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/50 dark:border-white/10 shadow-sm ${iconBgClass}`}>
            <div className={iconColorClass}>
              {icon}
            </div>
          </div>
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 truncate">
              <span className="text-slate-400 dark:text-slate-500 font-bold text-xs sm:text-sm shrink-0">Step {stepNum}:</span> 
              <span className="truncate">{title}</span>
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>
          </div>
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          isExpanded ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
        }`}>
          {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 md:p-7 pt-0 animate-in fade-in duration-300">
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function Step8OrderSummary({ dbSteps = [] }: { dbSteps?: any[] }) {
  const { state, resetWizard } = useWizard();
  const router = useRouter();
  const locale = useLocale();
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

  const maxSlaDays = useMemo(() => {
    let max = 0;
    state.cartItems.forEach(item => {
      if (item.sla) {
        const match = item.sla.match(/(\d+)/);
        if (match) {
          const days = parseInt(match[1], 10);
          if (days > max) max = days;
        }
      }
    });
    return max || 7;
  }, [state.cartItems]);

  const handleOrderNow = async () => {
    if (!name || !email) {
      setMessage("Please enter your Name and Work Email before proceeding.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const grandTotal = (state.totalOneTime || 0) + (state.totalMonthly || 0);
      const result = await processCheckout(state.cartItems, { name, email }, grandTotal, state);

      if (result.success) {
        setIsSuccess(true);
        setMessage(result.orderId ? result.orderId : "Order placed successfully!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch(e) {
      console.error(e);
      setMessage("Error processing checkout. Please check the console.");
    }
    
    setLoading(false);
  };

  const handlePayLater = async () => {
    if (!email) {
      setMessage("Please enter your Work Email to save a draft.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await saveOrderDraft({ name, email }, state);
      
      if (result.success) {
        router.push(`/${locale}/dashboard`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch(e) {
      console.error(e);
      setMessage("Error saving draft. Please check the console.");
    }
    setLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500 max-w-2xl mx-auto px-4">
        <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden bg-emerald-50 dark:bg-emerald-900/10 mb-8 border border-emerald-100 dark:border-emerald-500/20 shadow-inner">
          <Image 
            src={getS3Url("/images/wizard/step8/checkout-success.png")} 
            alt="Success" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Deployment Initiated Successfully
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
          Your workspace configuration (Order ID: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md break-all">{message}</span>) has been securely processed. Our infrastructure team is now provisioning your selected services and preparing your dashboard.
        </p>
        <button
          onClick={() => {
            resetWizard();
            router.push(`/${locale}/dashboard`);
          }}
          className="px-8 py-4 flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition-colors shadow-md w-full sm:w-auto justify-center"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Editable Steps */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <SummaryAccordion stepNum={1} title="Sales Strategy" subtitle="Methodology, channels, pricing, competitors" icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />} iconBgClass="bg-blue-100 dark:bg-blue-500/20" iconColorClass="text-blue-600 dark:text-blue-400">
            <Step1SalesStrategy dbSteps={dbSteps} isSummaryMode={true} />
          </SummaryAccordion>
          <SummaryAccordion stepNum={2} title="Team Structure" subtitle="Who builds and runs your pipeline" icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />} iconBgClass="bg-indigo-100 dark:bg-indigo-500/20" iconColorClass="text-indigo-600 dark:text-indigo-400">
            <Step2TeamStructure dbSteps={dbSteps} isSummaryMode={true} />
          </SummaryAccordion>
          <SummaryAccordion stepNum={3} title="Sales Materials" subtitle="Presentations, playbooks, battlecards" icon={<FileText className="w-5 h-5 sm:w-6 sm:h-6" />} iconBgClass="bg-purple-100 dark:bg-purple-500/20" iconColorClass="text-purple-600 dark:text-purple-400">
            <Step3SalesMaterials dbSteps={dbSteps} isSummaryMode={true} />
          </SummaryAccordion>
          <SummaryAccordion stepNum={4} title="Legal Framework" subtitle="Agreements, ToS, GDPR" icon={<Scale className="w-5 h-5 sm:w-6 sm:h-6" />} iconBgClass="bg-pink-100 dark:bg-pink-500/20" iconColorClass="text-pink-600 dark:text-pink-400">
            <Step4LegalFramework dbSteps={dbSteps} isSummaryMode={true} />
          </SummaryAccordion>
          
          {/* Step 5 skipped; Original Step 6 (Data Scraping) is now labeled as Step 5 */}
          <SummaryAccordion stepNum={5} title="Data Scraping" subtitle="Sources and lead generation methods" icon={<Database className="w-5 h-5 sm:w-6 sm:h-6" />} iconBgClass="bg-orange-100 dark:bg-orange-500/20" iconColorClass="text-orange-600 dark:text-orange-400">
            <Step6DataScraping dbSteps={dbSteps} isSummaryMode={true} />
          </SummaryAccordion>

          {/* Original Step 7 (Infrastructure) is now labeled as Step 6 */}
          <SummaryAccordion stepNum={6} title="Infrastructure" subtitle="Cloud tools and automation" icon={<Server className="w-5 h-5 sm:w-6 sm:h-6" />} iconBgClass="bg-emerald-100 dark:bg-emerald-500/20" iconColorClass="text-emerald-600 dark:text-emerald-400">
            <Step7Infrastructure dbSteps={dbSteps} isSummaryMode={true} />
          </SummaryAccordion>
        </div>

        {/* Right Column: Checkout Box */}
        <div className="w-full xl:w-[420px] shrink-0 xl:sticky xl:top-24">
          <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 sm:p-7 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-8">
            
            {/* Trust Indicators */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5 truncate">Time to Value</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">Launch in: <span className="text-emerald-600 dark:text-emerald-400">{maxSlaDays} Days</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5 truncate">Platform Guarantee</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">99.9% Uptime & 24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Time Load Visualizer */}
            <div className="flex flex-row items-center gap-3 sm:gap-4 w-full">
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 truncate w-full">
                  Your Load
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold truncate ${totalFounderHours > 80 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                    {totalFounderHours}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-500">h/mo</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 truncate w-full">
                  Self-managed
                </span>
              </div>

              <div className="flex-1 bg-indigo-600 border border-indigo-500 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg shadow-indigo-600/20 min-w-0">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-1 truncate w-full">
                  Delegated
                </span>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-2xl sm:text-3xl font-extrabold truncate">
                    {totalDelegatedHours}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-200">h/mo</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-indigo-200 font-medium mt-1 truncate w-full">
                  Team & AI
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

            {/* Form & Totals */}
            <div className="flex flex-col items-center justify-center w-full">
              
              <div className="flex flex-col gap-4 w-full mb-8">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-3 sm:p-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-colors text-sm font-bold"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-3 sm:p-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-colors text-sm font-bold"
                    placeholder="john@startup.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full mb-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide truncate">Due Today</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">Setup & Materials</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight shrink-0">
                    ${(state.totalOneTime || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide truncate">Monthly Burn</span>
                    <span className="text-[11px] font-medium text-indigo-500/70 dark:text-indigo-400/70 mt-0.5 truncate">Salaries & Software</span>
                  </div>
                  <div className="text-right shrink-0 flex items-baseline">
                    <span className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">
                      ${(state.totalMonthly || 0).toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-indigo-500 ml-1">/mo</span>
                  </div>
                </div>
              </div>
              
              {message && !isSuccess && (
                <div className="mb-6 w-full p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm font-bold text-center flex items-center gap-2 justify-center">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="break-words">{message}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleOrderNow}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold transition-colors duration-300 flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <CreditCard className="w-5 h-5" />
                  {loading ? "Processing..." : "Deploy & Checkout"}
                </button>
                
                <button
                  onClick={handlePayLater}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base"
                >
                  <Save className="w-5 h-5 text-slate-400" />
                  Save as Draft
                </button>
                
                <button 
                  onClick={() => setShowResetModal(true)}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors uppercase tracking-widest"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Start Over
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
              This action will clear your current configuration worth ${(state.totalOneTime + state.totalMonthly).toLocaleString()} and remove all settings. This cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-3 sm:py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetWizard();
                  router.push(`/${locale}`);
                }}
                className="flex-1 px-4 py-3 sm:py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-md text-sm sm:text-base"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}