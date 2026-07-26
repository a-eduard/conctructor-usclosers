"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { CheckCircle, Circle, ArrowRight, User, Settings, Briefcase, Zap, Calendar, MessageSquare, Video, Phone, Users } from "lucide-react";

const FUNNEL_TEMPLATES = [
  {
    id: "inbound_demo_funnel",
    name: "Inbound Demo Funnel",
    tagline: "Classic B2B / SaaS",
    flow: [
      { label: "Landing Page", icon: <Calendar className="w-4 h-4" /> },
      { label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
      { label: "AI Qualify", icon: <BotIcon className="w-4 h-4" /> },
      { label: "Video Meeting", icon: <Video className="w-4 h-4" /> },
      { label: "CRM", icon: <Users className="w-4 h-4" /> }
    ],
    features: ["Round Robin scheduling & auto-reminders", "Auto-warmup email sequences", "AI pain-point tagging in CRM"],
    service: { id: "inbound_demo_service", name: "Buy Setup as a Service", price: 1200, sla: "5 Days", category: 'service' as const, purpose: 'Setup of Inbound Demo Funnel' },
    hire: { id: "funnel_expert_hire", name: "Hire an Expert to build", price: 2500, sla: "10 Days", category: 'hire' as const, purpose: 'Expert setup of Sales Funnel' }
  },
  {
    id: "micro_consulting",
    name: "Micro-Consulting",
    tagline: "Strategy Session (Experts/Coaches)",
    flow: [
      { label: "Lead Magnet", icon: <Zap className="w-4 h-4" /> },
      { label: "Calendar (15m)", icon: <Calendar className="w-4 h-4" /> },
      { label: "Meeting Room", icon: <Video className="w-4 h-4" /> },
      { label: "Invoice", icon: <Briefcase className="w-4 h-4" /> }
    ],
    features: ["SLA Budget Filter (re-routes to webinar)", "Pre-loaded Meeting Room presentations", "Stripe/PayPal integration for paid discovery"],
    service: { id: "micro_consulting_service", name: "Buy Setup as a Service", price: 1000, sla: "4 Days", category: 'service' as const, purpose: 'Setup of Micro-Consulting Funnel' },
    hire: { id: "funnel_expert_hire", name: "Hire an Expert to build", price: 2500, sla: "10 Days", category: 'hire' as const, purpose: 'Expert setup of Sales Funnel' }
  },
  {
    id: "outbound_cold_meeting",
    name: "Outbound Cold-to-Meeting",
    tagline: "Cold Sales / Agencies",
    flow: [
      { label: "CRM Import", icon: <Users className="w-4 h-4" /> },
      { label: "AI Sequence", icon: <BotIcon className="w-4 h-4" /> },
      { label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
      { label: "Video Meeting", icon: <Video className="w-4 h-4" /> }
    ],
    features: ["Multi-channel sequencing (Email & LinkedIn)", "AI Email Agent (objections & booking)", "Automated CRM stage triggers"],
    service: { id: "outbound_cold_service", name: "Buy Setup as a Service", price: 1500, sla: "7 Days", category: 'service' as const, purpose: 'Setup of Outbound Cold-to-Meeting Funnel' },
    hire: { id: "funnel_expert_hire", name: "Hire an Expert to build", price: 2500, sla: "10 Days", category: 'hire' as const, purpose: 'Expert setup of Sales Funnel' }
  },
  {
    id: "automated_webinar",
    name: "Automated Webinar / VSL",
    tagline: "Mass Sales",
    flow: [
      { label: "Registration", icon: <Users className="w-4 h-4" /> },
      { label: "VSL Video", icon: <Video className="w-4 h-4" /> },
      { label: "Booking", icon: <Calendar className="w-4 h-4" /> },
      { label: "Call", icon: <Phone className="w-4 h-4" /> }
    ],
    features: ["Attention tracking (WhatsApp reminders)", "AI warm-lead routing to Sales", "Dynamic offer reveals during presentation"],
    service: { id: "webinar_vsl_service", name: "Buy Setup as a Service", price: 1800, sla: "8 Days", category: 'service' as const, purpose: 'Setup of Automated Webinar Funnel' },
    hire: { id: "funnel_expert_hire", name: "Hire an Expert to build", price: 2500, sla: "10 Days", category: 'hire' as const, purpose: 'Expert setup of Sales Funnel' }
  },
  {
    id: "quick_callback",
    name: "Quick Qualification & Callback",
    tagline: "High-Speed B2C/B2B",
    flow: [
      { label: "Lead Form/Quiz", icon: <MessageSquare className="w-4 h-4" /> },
      { label: "AI Call or 5m Book", icon: <Phone className="w-4 h-4" /> }
    ],
    features: ["Strict 5-minute SLA timer", "Re-routes to AI voice bot if SLA missed", "Live call transfer to available reps"],
    service: { id: "quick_callback_service", name: "Buy Setup as a Service", price: 1500, sla: "7 Days", category: 'service' as const, purpose: 'Setup of Quick Qualification Funnel' },
    hire: { id: "funnel_expert_hire", name: "Hire an Expert to build", price: 2500, sla: "10 Days", category: 'hire' as const, purpose: 'Expert setup of Sales Funnel' }
  },
  {
    id: "custom_funnel",
    name: "Custom Funnel Architecture",
    tagline: "Enterprise / Bespoke",
    flow: [
      { label: "Describe Flow", icon: <MessageSquare className="w-4 h-4" /> },
      { label: "Scope", icon: <Settings className="w-4 h-4" /> },
      { label: "Call", icon: <Phone className="w-4 h-4" /> }
    ],
    features: ["Tailored architecture for complex cycles", "Dedicated solutions engineer", "Custom API integrations & webhooks"],
    service: { id: "custom_funnel_service", name: "Buy Scoping Session", price: 500, sla: "2 Days", category: 'service' as const, purpose: 'Scoping Session for Custom Funnel' },
    hire: { id: "funnel_expert_hire", name: "Hire an Expert to build", price: 2500, sla: "10 Days", category: 'hire' as const, purpose: 'Expert setup of Sales Funnel' }
  }
];

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

export function Step5PipelineFunnels() {
  const { state, updateStep5Data, markClientProvided, removeClientProvided, addCartItem, removeCartItem } = useWizard();

  const handleSelectTemplate = (templateId: string) => {
    if (state.step5Data.selectedFunnel !== templateId) {
      updateStep5Data({ selectedFunnel: templateId });
    } else {
      updateStep5Data({ selectedFunnel: '' });
    }
  };

  const selectedTemplate = FUNNEL_TEMPLATES.find(t => t.id === state.step5Data.selectedFunnel);

  const handleSelection = (template: typeof FUNNEL_TEMPLATES[0], type: 'diy' | 'service' | 'hire') => {
    // Clear existing choices for all templates to prevent duplicates
    FUNNEL_TEMPLATES.forEach(t => {
      removeClientProvided(t.id);
      removeCartItem(t.service.id);
      removeCartItem(t.hire.id);
    });

    if (type === 'diy') {
      markClientProvided(template.id);
    } else if (type === 'service') {
      addCartItem({ allocatedHours: 0, paymentType: 'one-time', optionId: template.service.id, name: template.service.name + ` (${template.name})`, price: template.service.price, sla: template.service.sla, category: template.service.category, purpose: template.service.purpose });
    } else if (type === 'hire') {
      addCartItem({ allocatedHours: 0, paymentType: 'one-time', optionId: template.hire.id, name: template.hire.name + ` (${template.name})`, price: template.hire.price, sla: template.hire.sla, category: template.hire.category, purpose: template.hire.purpose });
    }
  };

  return (
    <div id="diy-item-funnels" className="animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-m-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {FUNNEL_TEMPLATES.map((template) => {
          const isSelected = state.step5Data.selectedFunnel === template.id;
          
          return (
            <div 
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`cursor-pointer group relative bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
                isSelected 
                  ? 'border-2 border-indigo-600 shadow-lg scale-[1.02] ring-4 ring-indigo-500/10' 
                  : 'border-2 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-bold transition-colors ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>
                    {template.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 mt-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {template.tagline}
                  </span>
                </div>
                {isSelected ? (
                  <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 transition-colors shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-indigo-300 dark:group-hover:text-indigo-500/50 transition-colors shrink-0" />
                )}
              </div>

              {/* Visual Flow */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {template.flow.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${isSelected ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                      <span className={`${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>{step.icon}</span>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-300'}`}>{step.label}</span>
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
                  {template.features.map((feature, idx) => (
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

      {selectedTemplate && (
        <div id="diy-item-funnel-config" className="scroll-m-24 bg-slate-50 dark:bg-slate-900/30 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 shadow-sm animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Configure Implementation</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                How would you like to set up the <strong className="text-indigo-600 dark:text-indigo-400">{selectedTemplate.name}</strong>?
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full md:w-[280px]">
              {/* DIY - Standardized to Indigo */}
              <button
                onClick={() => {
                  if (state.clientProvided.includes(selectedTemplate.id)) {
                    removeClientProvided(selectedTemplate.id);
                  } else {
                    handleSelection(selectedTemplate, 'diy');
                  }
                }}
                className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  state.clientProvided.includes(selectedTemplate.id)
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm'
                    : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 shadow-sm hover:-translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 transition-colors ${state.clientProvided.includes(selectedTemplate.id) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm transition-colors ${state.clientProvided.includes(selectedTemplate.id) ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    Set it up myself
                  </span>
                </div>
                <div className="flex items-center justify-end w-8 h-8 relative shrink-0 group">
                  <span className={`text-xs text-slate-500 font-medium right-0`}>$0</span>
                </div>
              </button>

              {/* Service */}
              <button
                onClick={() => {
                  if (state.cartItems.some(i => i.optionId === selectedTemplate.service.id)) {
                    removeCartItem(selectedTemplate.service.id);
                  } else {
                    handleSelection(selectedTemplate, 'service');
                  }
                }}
                className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  state.cartItems.some(i => i.optionId === selectedTemplate.service.id)
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm'
                    : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 shadow-sm hover:-translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 transition-colors ${state.cartItems.some(i => i.optionId === selectedTemplate.service.id) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm text-left transition-colors ${state.cartItems.some(i => i.optionId === selectedTemplate.service.id) ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {selectedTemplate.service.name}
                  </span>
                </div>
                <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
                  <span className={`text-xs font-mono font-semibold text-slate-500 right-0`}>+${selectedTemplate.service.price.toLocaleString()}</span>
                </div>
              </button>

              {/* Hire */}
              <button
                onClick={() => {
                  if (state.cartItems.some(i => i.optionId === selectedTemplate.hire.id)) {
                    removeCartItem(selectedTemplate.hire.id);
                  } else {
                    handleSelection(selectedTemplate, 'hire');
                  }
                }}
                className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  state.cartItems.some(i => i.optionId === selectedTemplate.hire.id)
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm'
                    : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 shadow-sm hover:-translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-5 h-5 transition-colors ${state.cartItems.some(i => i.optionId === selectedTemplate.hire.id) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm text-left transition-colors ${state.cartItems.some(i => i.optionId === selectedTemplate.hire.id) ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {selectedTemplate.hire.name}
                  </span>
                </div>
                <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
                  <span className={`text-xs font-mono font-semibold text-slate-500 right-0`}>+${selectedTemplate.hire.price.toLocaleString()}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}