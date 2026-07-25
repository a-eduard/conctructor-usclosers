"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWizard, DIY_HOURS_MAP } from "../contexts/WizardContext";
import { processCheckout } from "../app/actions/orderActions";
import { CheckCircle, Edit2, Clock, ShieldCheck, Shield, Target, ArrowRight, Save, CreditCard, ChevronDown, ChevronUp, User, Settings, RefreshCw } from "lucide-react";

const ID_NAME_MAP: Record<string, string> = {
  'lead_gen': 'Lead Generation',
  'qualification': 'Qualification & Discovery',
  'demo': 'Demo & Presentation',
  'negotiation': 'Negotiation & Legal',
  'closed_won_lost': 'Closed Won/Lost Management',
  'sales_deck': 'Pitch Deck',
  'one_pager': 'One-Pager',
  'objections_playbook': 'Objections Playbook',
  'sales_playbook': 'Sales Playbook',
  'battlecards': 'Battlecards',
  'hiring_agreement': 'Hiring Agreement',
  'service_agreement': 'Service Agreement',
  'terms_of_service': 'Terms of Service',
  'gdpr_compliance': 'GDPR Compliance',
  'inbound_demo_funnel': 'Inbound Demo Funnel',
  'micro_consulting': 'Micro-Consulting Funnel',
  'outbound_cold_meeting': 'Outbound Cold-to-Meeting Funnel',
  'automated_webinar': 'Automated Webinar / VSL',
  'quick_callback': 'Quick Qualification & Callback',
  'custom_funnel': 'Custom Funnel Architecture',
  'byo_data': 'Bring Your Own Data (CSV)',
  'inbound_traffic': 'Inbound Traffic',
  'outbound_parsing': 'Outbound Parsing',
  'crm_enrichment': 'CRM Enrichment',
  'intent_data': 'Intent Data',
  'sales_meeting_room': 'Sales Meeting Room',
  'sales_team_chat': 'Sales Team Chat',
  'document_signing': 'Document Signing',
  'dataroom': 'Dataroom',
  'email_infra': 'Email Infrastructure',
  'calendar_booking': 'Calendar Booking App',
  'preconfigured_crm': 'Preconfigured CRM',
  'power_dialer_voip': 'Power Dialer & VoIP Cloud',
  'call_intelligence_qa': 'Call Intelligence & QA',
  'cpq_invoicing': 'CPQ & Invoicing',
  'knowledge_base': 'Knowledge Base',
};

const DIY_DETAILS_MAP: Record<string, { desc: string; estCost: string; estTime: string; step: number }> = {
  'sales_methodology': { desc: 'Developing the core sales strategy and messaging.', estCost: '$1,500', estTime: '15 hrs', step: 1 },
  'competitor_intel': { desc: 'Gathering and analyzing competitor intelligence.', estCost: '$2,000', estTime: '25 hrs', step: 1 },
  'partner_mou': { desc: 'Drafting partner MoUs.', estCost: '$1,500', estTime: '20 hrs', step: 1 },
  'lead_gen': { desc: 'Sourcing and initial outreach to build your pipeline.', estCost: '$1,500/mo', estTime: '40 hrs/mo', step: 2 },
  'qualification': { desc: 'Vetting inbound and outbound leads for fit.', estCost: '$3,500/mo', estTime: '80 hrs/mo', step: 2 },
  'demo': { desc: 'Presenting solutions and managing discovery calls.', estCost: '$5,000/mo', estTime: '80 hrs/mo', step: 2 },
  'negotiation': { desc: 'Pricing negotiations and contract structuring.', estCost: '$2,500/mo', estTime: '30 hrs/mo', step: 2 },
  'closed_won_lost': { desc: 'Post-sale onboarding and pipeline analysis.', estCost: '$2,000/mo', estTime: '20 hrs/mo', step: 2 },
  'sales_deck': { desc: 'Designing and writing the sales presentation.', estCost: '$2,000', estTime: '25 hrs', step: 3 },
  'one_pager': { desc: 'Creating a concise summary document.', estCost: '$500', estTime: '8 hrs', step: 3 },
  'objections_playbook': { desc: 'Documenting responses to common objections.', estCost: '$1,200', estTime: '15 hrs', step: 3 },
  'sales_playbook': { desc: 'Building a comprehensive sales guide.', estCost: '$3,000', estTime: '40 hrs', step: 3 },
  'battlecards': { desc: 'Researching and formatting competitive intel.', estCost: '$1,500', estTime: '20 hrs', step: 3 },
  'hiring_agreement': { desc: 'Drafting contractor and employment agreements.', estCost: '$800', estTime: '10 hrs', step: 4 },
  'service_agreement': { desc: 'Drafting client-facing service contracts.', estCost: '$1,500', estTime: '15 hrs', step: 4 },
  'terms_of_service': { desc: 'Drafting standard ToS and privacy policies.', estCost: '$2,000', estTime: '20 hrs', step: 4 },
  'gdpr_compliance': { desc: 'Setting up GDPR and privacy compliance.', estCost: '$3,000', estTime: '30 hrs', step: 4 },
  'inbound_demo_funnel': { desc: 'Building the inbound demo funnel.', estCost: '$2,500', estTime: '35 hrs', step: 5 },
  'micro_consulting': { desc: 'Building the micro-consulting funnel.', estCost: '$2,500', estTime: '35 hrs', step: 5 },
  'outbound_cold_meeting': { desc: 'Building the outbound cold-to-meeting funnel.', estCost: '$2,500', estTime: '35 hrs', step: 5 },
  'automated_webinar': { desc: 'Building the automated webinar funnel.', estCost: '$2,500', estTime: '35 hrs', step: 5 },
  'quick_callback': { desc: 'Building the quick qualification funnel.', estCost: '$2,500', estTime: '35 hrs', step: 5 },
  'custom_funnel': { desc: 'Designing and building a custom funnel.', estCost: '$2,500', estTime: '35 hrs', step: 5 },
  'byo_data': { desc: 'Sourcing, cleaning, and verifying leads.', estCost: '$1,000/mo', estTime: '20 hrs/mo', step: 6 },
  'inbound_traffic': { desc: 'Managing ads and content for inbound.', estCost: '$2,000/mo', estTime: '40 hrs/mo', step: 6 },
  'outbound_parsing': { desc: 'Scraping and preparing outbound lists.', estCost: '$1,000/mo', estTime: '20 hrs/mo', step: 6 },
  'crm_enrichment': { desc: 'Finding missing data for CRM records.', estCost: '$800/mo', estTime: '15 hrs/mo', step: 6 },
  'intent_data': { desc: 'Analyzing buying intent signals.', estCost: '$1,500/mo', estTime: '25 hrs/mo', step: 6 },
  'sales_meeting_room': { desc: 'Setting up video conferencing software.', estCost: '$200', estTime: '4 hrs', step: 7 },
  'sales_team_chat': { desc: 'Configuring team communication tools.', estCost: '$300', estTime: '5 hrs', step: 7 },
  'document_signing': { desc: 'Setting up e-signature software.', estCost: '$250', estTime: '4 hrs', step: 7 },
  'dataroom': { desc: 'Organizing document storage and sharing.', estCost: '$400', estTime: '6 hrs', step: 7 },
  'email_infra': { desc: 'Configuring email sending infrastructure.', estCost: '$800', estTime: '10 hrs', step: 7 },
  'calendar_booking': { desc: 'Setting up meeting booking links.', estCost: '$200', estTime: '3 hrs', step: 7 },
  'preconfigured_crm': { desc: 'Customizing and setting up a CRM.', estCost: '$3,000', estTime: '40 hrs', step: 7 },
  'power_dialer_voip': { desc: 'Configuring VoIP and dialing systems.', estCost: '$1,000', estTime: '15 hrs', step: 7 },
  'call_intelligence_qa': { desc: 'Setting up call recording and QA.', estCost: '$1,500', estTime: '20 hrs', step: 7 },
  'cpq_invoicing': { desc: 'Configuring quoting and invoicing.', estCost: '$1,200', estTime: '15 hrs', step: 7 },
  'knowledge_base': { desc: 'Building an internal knowledge base.', estCost: '$1,500', estTime: '20 hrs', step: 7 },
};

const DEFAULT_PURPOSE_MAP: Record<string, string> = {
  'sales_deck': 'A high-converting presentation for discovery and demo calls.',
  'one_pager': 'Concise document for quick sending and follow-ups.',
  'objections_playbook': 'Scripted answers to overcome common and edge-case objections.',
  'sales_playbook': 'Comprehensive sales process guide for the team.',
  'battlecards': 'Competitive battlecards for sales reps to win deals.',
  'hiring_agreement': 'Standard hiring and contractor agreements for your team.',
  'service_agreement': 'Client-facing service agreements to protect your agency.',
  'terms_of_service': 'Standard ToS and Privacy Policy for your platform or service.',
  'gdpr_compliance': 'Full GDPR and privacy compliance for European clients.',
  'inbound_demo_funnel': 'Setup of Inbound Demo Funnel',
  'micro_consulting': 'Setup of Micro-Consulting Funnel',
  'outbound_cold_meeting': 'Setup of Outbound Cold-to-Meeting Funnel',
  'automated_webinar': 'Setup of Automated Webinar Funnel',
  'quick_callback': 'Setup of Quick Qualification Funnel',
  'custom_funnel': 'Scoping Session for Custom Funnel',
  'byo_data': 'Bring your own dataset',
  'inbound_traffic': 'Setup of hot lead generation (paid ads, forms).',
  'outbound_parsing': 'Scraping targets from LinkedIn and other databases.',
  'crm_enrichment': 'Cleaning and updating old/existing databases.',
  'intent_data': 'Purchasing signals about companies actively looking for solutions.',
  'sales_meeting_room': 'Video conferencing integrated with AI agents.',
  'sales_team_chat': 'Corporate messenger with AI integrations.',
  'document_signing': 'E-signature tool with AI risk analysis.',
  'dataroom': 'Secure file storage with viewing analytics.',
  'email_infra': 'Server setup for 100% deliverability.',
  'calendar_booking': 'Smart calendar for scheduling.',
  'preconfigured_crm': 'Cloud CRM with ready-made pipelines.',
  'power_dialer_voip': 'IP telephony for CRM calling.',
  'call_intelligence_qa': 'Call recording and quality assurance dashboard.',
  'cpq_invoicing': 'Configure, Price, Quote, and PDF invoice generation.',
  'knowledge_base': 'Interactive wiki for scripts and playbooks.',
  'lead_gen': 'Sourcing and initial outreach to build your pipeline.',
  'qualification': 'Vetting inbound and outbound leads for fit.',
  'demo': 'Presentations, discovery calls, pricing and terms negotiation.',
  'negotiation': 'Legal and compliance setup for your sales operations.',
  'closed_won_lost': 'Analytics, contract signing, and management.',
};

function SummaryAccordion({ 
  title, 
  subtitle, 
  icon, 
  iconBgClass, 
  iconColorClass, 
  items, 
  emptyText, 
  renderItem,
  onEdit
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  items: any[];
  emptyText: string;
  renderItem: (item: any, index: number) => React.ReactNode;
  onEdit: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md ${isExpanded ? 'pb-2' : ''}`}>
      <div className={`w-full px-6 md:px-8 py-5 border-b flex items-center justify-between transition-colors ${isExpanded ? 'border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/30' : 'border-transparent bg-transparent'}`}>
        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setIsExpanded(!isExpanded)}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${iconBgClass}`}>
            <div className={iconColorClass}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Settings className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 dark:text-slate-500 p-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 md:p-8 flex-1 animate-in slide-in-from-top-2 fade-in duration-300">
          {items.length === 0 ? (
            <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic font-medium py-4">
              {emptyText}
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item, index) => renderItem(item, index))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function Step8OrderSummary() {
  const { state, setStep, resetWizard } = useWizard();
  const router = useRouter();
  
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

  const handleOrderNow = async () => {
    if (!name || !email) {
      setMessage("Please enter your Name and Work Email before proceeding.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const grandTotal = (state.totalOneTime || 0) + (state.totalMonthly || 0);
      
      // Send data to our MySQL Server Action
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

  const hiredTeam = state.cartItems.filter(i => i.category === 'hire');
  const salesEngine = state.cartItems.filter(i => i.category !== 'hire');

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
        {/* Left Column: Architectures */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            
            {/* Block 1: Self-Managed */}
            <SummaryAccordion 
          title="Do It Yourself"
          subtitle="Investment of time, not money"
          icon={<User className="w-6 h-6" />}
          iconBgClass="bg-emerald-100 dark:bg-emerald-500/20"
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          items={state.clientProvided}
          emptyText="Fully delegated."
          onEdit={() => setStep(1)}
          renderItem={(id, index) => (
            <li key={index} className="group/item flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-6 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover/item:to-emerald-500/5 dark:group-hover/item:to-emerald-400/5 transition-colors pointer-events-none" />
              
              <div className="flex-1 flex gap-4 relative z-10 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/30 group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-300 shadow-sm mt-1">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                
                <div className="flex flex-col">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-400 transition-colors tracking-tight">
                    {ID_NAME_MAP[id] || id.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                    {DIY_DETAILS_MAP[id]?.desc || "You manage this process independently."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 relative z-10 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const step = DIY_DETAILS_MAP[id]?.step;
                    if (step !== undefined) {
                      setStep(step);
                      setTimeout(() => {
                        const el = document.getElementById(`diy-item-${id}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          el.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-2', 'transition-all', 'duration-500');
                          setTimeout(() => el.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-2'), 2000);
                        }
                      }, 100);
                    }
                  }}
                  className="opacity-0 group-hover/item:opacity-100 focus:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm justify-between min-w-[150px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Effort
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-mono text-xs font-bold">{DIY_DETAILS_MAP[id]?.estTime || "-- hrs"}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm justify-between min-w-[150px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Cost
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-mono text-xs font-bold">{DIY_DETAILS_MAP[id]?.estCost || "$--"}</span>
                  </div>
                </div>
              </div>
            </li>
          )}
        />

        {/* Block 2: Hired Team */}
        <SummaryAccordion 
          title="The Sales Force"
          subtitle="Specialists and leaders"
          icon={<Target className="w-6 h-6" />}
          iconBgClass="bg-indigo-100 dark:bg-indigo-500/20"
          iconColorClass="text-indigo-600 dark:text-indigo-400"
          items={hiredTeam}
          emptyText="No team selected."
          onEdit={() => setStep(2)}
          renderItem={(item, index) => (
            <li key={index} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-900 dark:text-white font-bold">
                  {item.name}
                </span>
                <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  ${(item.price || 0).toLocaleString()}{item.paymentType === 'monthly' ? ' / mo' : ''}
                </span>
              </div>
              <div className="bg-indigo-50/50 dark:bg-indigo-500/10 rounded-lg p-3 border border-indigo-100 dark:border-indigo-500/20">
                <span className="text-xs text-indigo-800 dark:text-indigo-300 font-semibold block mb-1">Purpose:</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.purpose || DEFAULT_PURPOSE_MAP[item.optionId] || "Sales process closure."}</span>
              </div>
            </li>
          )}
        />

        {/* Block 3: SalesOps Infrastructure */}
        <SummaryAccordion 
          title="The Sales Engine"
          subtitle="Infrastructure and services"
          icon={<Settings className="w-6 h-6" />}
          iconBgClass="bg-amber-100 dark:bg-amber-500/20"
          iconColorClass="text-amber-600 dark:text-amber-400"
          items={salesEngine}
          emptyText="No infrastructure selected."
          onEdit={() => setStep(7)}
          renderItem={(item, index) => (
            <li key={index} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-900 dark:text-white font-bold">
                  {item.name}
                </span>
                <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                  ${(item.price || 0).toLocaleString()}{item.paymentType === 'monthly' ? ' / mo' : ''}
                </span>
              </div>
              <div className="bg-amber-50/50 dark:bg-amber-500/10 rounded-lg p-3 border border-amber-100 dark:border-amber-500/20">
                <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block mb-1">Purpose:</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.purpose || DEFAULT_PURPOSE_MAP[item.optionId] || "Sales automation and support."}</span>
              </div>
            </li>
          )}
          />
        
          <div className="mt-4 px-2 py-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> <strong>One-time SLA:</strong> Time to Delivery</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> <strong>Monthly SLA:</strong> Uptime / Response Time</span>
          </div>
        </div>
      </div>

      {/* Right Column: The Peace of Mind & Checkout */}
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
            
            {/* Customer Details Form */}
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
                  setShowResetModal(false);
                  resetWizard();
                }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
              >
                Yes, start over
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}