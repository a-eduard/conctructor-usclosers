"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWizard, DIY_HOURS_MAP } from "../contexts/WizardContext";
import { processCheckout } from "../app/actions/orderActions";
import { 
  CheckCircle, Clock, ShieldCheck, Shield, Target, 
  Save, CreditCard, ChevronDown, ChevronUp, Users, 
  FileText, Scale, Filter, Database, Server, RefreshCw 
} from "lucide-react";

import { Step1SalesStrategy } from "./Step1SalesStrategy";
import { Step2TeamStructure } from "./Step2TeamStructure";
import { Step3SalesMaterials } from "./Step3SalesMaterials";
import { Step4LegalFramework } from "./Step4LegalFramework";
import { Step5PipelineFunnels } from "./Step5PipelineFunnels";
import { Step6DataScraping } from "./Step6DataScraping";
import { Step7Infrastructure } from "./Step7Infrastructure";
import { useLocale } from "next-intl";

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

  return (
    <div className={`bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md ${isExpanded ? 'pb-2' : ''}`}>
      <div 
        className={`w-full px-6 md:px-8 py-5 border-b flex items-center justify-between transition-colors cursor-pointer select-none ${isExpanded ? 'border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/30' : 'border-transparent bg-transparent'}`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${iconBgClass}`}>
            <div className={iconColorClass}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Step {stepNum}: {title}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-400 dark:text-slate-500 p-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 md:p-8 flex-1 animate-in slide-in-from-top-2 fade-in duration-300 bg-slate-50/30 dark:bg-slate-900/20">
          <div className="opacity-90 hover:opacity-100 transition-opacity">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function Step8OrderSummary() {
  const { state, resetWizard } = useWizard();
  const router = useRouter();
  const locale = useLocale();
  
  // Checkout States
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
      
      const result = await processCheckout(state.cartItems, { name, email }, grandTotal);

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
    try {
      await fetch('/api/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: name || 'Draft User', email: email || 'draft@example.com' },
          cartItems: state.cartItems,
          clientProvidedItems: state.clientProvided,
          currentStep: state.currentStep,
          totalOneTime: state.totalOneTime,
          totalMonthly: state.totalMonthly,
          step1Data: state.step1Data
        })
      });
      router.push('/dashboard');
    } catch(e) {
      console.error(e);
      setMessage("Error saving draft. Please check the console.");
    }
  };

  // Render Success State
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Infrastructure Provisioned!
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
          Your order (ID: <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{message}</span>) has been saved securely to our MySQL database. 
          Our provisioning engine is now generating your setup JSON.
        </p>
        <button
          onClick={() => window.location.href = "/en"}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Editable Steps */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            
            <SummaryAccordion 
              stepNum={1} 
              title="Sales Strategy" 
              subtitle="Methodology, channels, pricing, competitors" 
              icon={<Target className="w-6 h-6" />} 
              iconBgClass="bg-blue-100 dark:bg-blue-500/20" 
              iconColorClass="text-blue-600 dark:text-blue-400"
            >
              <Step1SalesStrategy />
            </SummaryAccordion>

            <SummaryAccordion 
              stepNum={2} 
              title="Team Structure" 
              subtitle="Who builds and runs your pipeline" 
              icon={<Users className="w-6 h-6" />} 
              iconBgClass="bg-indigo-100 dark:bg-indigo-500/20" 
              iconColorClass="text-indigo-600 dark:text-indigo-400"
            >
              <Step2TeamStructure />
            </SummaryAccordion>

            <SummaryAccordion 
              stepNum={3} 
              title="Sales Materials" 
              subtitle="Presentations, playbooks, battlecards" 
              icon={<FileText className="w-6 h-6" />} 
              iconBgClass="bg-purple-100 dark:bg-purple-500/20" 
              iconColorClass="text-purple-600 dark:text-purple-400"
            >
              <Step3SalesMaterials />
            </SummaryAccordion>

            <SummaryAccordion 
              stepNum={4} 
              title="Legal Framework" 
              subtitle="Agreements, ToS, GDPR" 
              icon={<Scale className="w-6 h-6" />} 
              iconBgClass="bg-pink-100 dark:bg-pink-500/20" 
              iconColorClass="text-pink-600 dark:text-pink-400"
            >
              <Step4LegalFramework />
            </SummaryAccordion>

            <SummaryAccordion 
              stepNum={5} 
              title="Pipeline Funnels" 
              subtitle="The architectural flow of your sales" 
              icon={<Filter className="w-6 h-6" />} 
              iconBgClass="bg-rose-100 dark:bg-rose-500/20" 
              iconColorClass="text-rose-600 dark:text-rose-400"
            >
              <Step5PipelineFunnels />
            </SummaryAccordion>

            <SummaryAccordion 
              stepNum={6} 
              title="Data Scraping" 
              subtitle="Sources and lead generation methods" 
              icon={<Database className="w-6 h-6" />} 
              iconBgClass="bg-orange-100 dark:bg-orange-500/20" 
              iconColorClass="text-orange-600 dark:text-orange-400"
            >
              <Step6DataScraping />
            </SummaryAccordion>

            <SummaryAccordion 
              stepNum={7} 
              title="Infrastructure" 
              subtitle="Cloud tools and automation" 
              icon={<Server className="w-6 h-6" />} 
              iconBgClass="bg-emerald-100 dark:bg-emerald-500/20" 
              iconColorClass="text-emerald-600 dark:text-emerald-400"
            >
              <Step7Infrastructure />
            </SummaryAccordion>

          </div>
        </div>

        {/* Right Column: Checkout Box */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Time to Value</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Department will launch in: {maxSlaDays} Days</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Platform Guarantee</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">99.9% Uptime & &lt;15m Tech Support</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Service Commitment</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">We guarantee process execution, or your money back.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4 w-full">
              <div className="flex-1 bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all hover:bg-emerald-100/50 dark:hover:bg-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-600/80 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                  Your Load
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-extrabold ${totalFounderHours > 80 ? 'text-amber-500' : 'text-emerald-700 dark:text-emerald-300'}`}>
                    {totalFounderHours}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">h/mo</span>
                </div>
                <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium mt-1">
                  Self-managed tasks
                </span>
              </div>

              <div className="flex-1 bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20">
                <span className="text-[10px] font-bold text-indigo-600/80 dark:text-indigo-400 uppercase tracking-widest block mb-1">
                  Delegated
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
                    {totalDelegatedHours}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">h/mo</span>
                </div>
                <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium mt-1">
                  Team & AI Tasks
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

            {/* Checkout Total & CTA */}
            <div className="flex flex-col items-center justify-center">
              
              <div className="flex flex-col gap-4 w-full mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Work Email *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6 w-full">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Due Today</span>
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">${(state.totalOneTime || 0).toLocaleString()}</span>
                  <span className="text-xs font-medium text-slate-500 mt-1 block">Setup, Consulting & Materials</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4 text-center border border-indigo-100 dark:border-indigo-500/20">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Monthly Burn</span>
                  <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">${(state.totalMonthly || 0).toLocaleString()}<span className="text-lg text-indigo-400 dark:text-indigo-500 font-bold">/mo</span></span>
                  <span className="text-xs font-medium text-indigo-500 mt-1 block">Team Salaries, AI Agents & Cloud Tools</span>
                </div>
              </div>
              
              {message && !isSuccess && (
                <div className="mb-4 w-full p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-medium text-center">
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={handleOrderNow}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:shadow-indigo-600/20 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-5 h-5 opacity-90" />
                    {loading ? "Processing..." : "Deploy & Checkout"}
                  </button>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center px-4">
                    Secure payment. No hidden fees.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={handlePayLater}
                    className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <Save className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                    Save as Draft
                  </button>
                </div>
                
                <div className="mt-4 flex justify-center w-full">
                  <button 
                    onClick={() => setShowResetModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Over
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              This action will clear your current configuration worth ${(state.totalOneTime + state.totalMonthly).toLocaleString()} and remove all settings. This cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
          onClick={() => {
            resetWizard(); // Очищаем стейт!
            router.push(`/${locale}`); // Возвращаемся на главную с правильным языком
          }}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          Return to Marketplace
        </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}