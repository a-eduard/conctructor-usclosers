"use client";

import React from "react";
import { useWizard } from "../contexts/WizardContext";
import { Settings, Zap, Sparkles } from "lucide-react";

export function Step7Infrastructure() {
  const { state } = useWizard();

  const isLoneWolf = 
    state.clientProvided.includes('lead_gen') &&
    state.clientProvided.includes('qualification') &&
    state.clientProvided.includes('demo');

  const selectedFunnel = state.step5Data?.selectedFunnel;
  
  // Pipeline dependencies
  const inboundFlow = selectedFunnel === "inbound_demo_funnel" || selectedFunnel === "automated_webinar";
  const outboundFlow = selectedFunnel === "outbound_cold_meeting" || state.cartItems.some(i => i.optionId === 'parsing_enrichment');

  const INFRA_TOOLS = [
    {
      id: "sales_meeting_room",
      name: "Sales Meeting Room",
      description: "Video conferencing integrated with AI agents.",
      price: 150,
      sla: "2 Days",
      isRecommended: inboundFlow,
      category: 'service',
      purpose: "Video conferencing integrated with AI agents."
    },
    {
      id: "sales_team_chat",
      name: "Sales Team Chat",
      description: "Corporate messenger with AI integrations.",
      price: 100,
      sla: "1 Day",
      isRecommended: false,
      category: 'service',
      purpose: "Corporate messenger with AI integrations."
    },
    {
      id: "document_signing",
      name: "Document Signing",
      description: "E-signature tool with AI risk analysis.",
      price: 50,
      sla: "1 Day",
      isRecommended: false,
      category: 'service',
      purpose: "E-signature tool with AI risk analysis."
    },
    {
      id: "dataroom",
      name: "Dataroom",
      description: "Secure file storage with viewing analytics.",
      price: 200,
      sla: "2 Days",
      isRecommended: false,
      category: 'service',
      purpose: "Secure file storage with viewing analytics."
    },
    {
      id: "email_infra",
      name: "Email Infrastructure",
      description: "Server setup for 100% deliverability.",
      price: 400,
      sla: "5 Days",
      isRecommended: outboundFlow,
      category: 'service',
      purpose: "Server setup for 100% deliverability."
    },
    {
      id: "calendar_booking",
      name: "Calendar Booking App",
      description: "Smart calendar for scheduling.",
      price: 50,
      sla: "1 Day",
      isRecommended: isLoneWolf || inboundFlow,
      category: 'service',
      purpose: "Smart calendar for scheduling."
    },
    {
      id: "preconfigured_crm",
      name: "Preconfigured CRM",
      description: "Cloud CRM with ready-made pipelines.",
      price: 1000,
      sla: "7 Days",
      isRecommended: isLoneWolf,
      category: 'service',
      purpose: "Cloud CRM with ready-made pipelines."
    },
    {
      id: "power_dialer_voip",
      name: "Power Dialer & VoIP Cloud",
      description: "IP telephony for CRM calling.",
      price: 300,
      sla: "3 Days",
      isRecommended: isLoneWolf || outboundFlow,
      category: 'service',
      purpose: "IP telephony for CRM calling."
    },
    {
      id: "call_intelligence_qa",
      name: "Call Intelligence & QA",
      description: "Call recording and quality assurance dashboard.",
      price: 250,
      sla: "3 Days",
      isRecommended: false,
      category: 'service',
      purpose: "Call recording and quality assurance dashboard."
    },
    {
      id: "cpq_invoicing",
      name: "CPQ & Invoicing",
      description: "Configure, Price, Quote, and PDF invoice generation.",
      price: 400,
      sla: "4 Days",
      isRecommended: false,
      category: 'service',
      purpose: "Configure, Price, Quote, and PDF invoice generation."
    },
    {
      id: "knowledge_base",
      name: "Knowledge Base",
      description: "Interactive wiki for scripts and playbooks.",
      price: 150,
      sla: "2 Days",
      isRecommended: false,
      category: 'service',
      purpose: "Interactive wiki for scripts and playbooks."
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        {INFRA_TOOLS.map((tool) => (
          <Step7InfraSelector
            key={tool.id}
            optionId={tool.id}
            name={tool.name}
            description={tool.description}
            price={tool.price}
            sla={tool.sla}
            isRecommended={tool.isRecommended}
            category={tool.category as 'hire' | 'service'}
            purpose={tool.purpose}
          />
        ))}
      </div>
    </div>
  );
}

function Step7InfraSelector({ 
  optionId, 
  name, 
  description, 
  price, 
  sla,
  isRecommended,
  category,
  purpose
}: { 
  optionId: string; 
  name: string; 
  description: string; 
  price: number;
  sla: string;
  isRecommended: boolean;
  category: 'hire' | 'service';
  purpose: string;
}) {
  const { state, markClientProvided, removeClientProvided, addCartItem, removeCartItem } = useWizard();
  
  const isProvided = state.clientProvided.includes(optionId);
  const isInCart = state.cartItems.some(i => i.optionId === optionId);

  return (
    <div id={`diy-item-${optionId}`} className={`scroll-m-24 relative bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
      isRecommended 
        ? 'border-2 border-indigo-400 dark:border-indigo-600 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-md ring-4 ring-indigo-500/10' 
        : 'border-2 border-slate-200 dark:border-slate-800/60 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {isRecommended && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-[11px] font-bold rounded-full border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3" /> Highly Recommended
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2 md:mt-0">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 shrink-0 w-full md:w-[280px]">
          {/* DIY Button */}
          <button
            onClick={() => {
              if (isProvided) {
                removeClientProvided(optionId);
              } else {
                if (isInCart) removeCartItem(optionId);
                markClientProvided(optionId);
              }
            }}
            className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
              isProvided 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' 
                : 'border-slate-200 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer hover:-translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Settings className={`w-5 h-5 shrink-0 transition-colors ${isProvided ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-sm transition-colors ${isProvided ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                I already use a tool
              </span>
            </div>
            <div className="flex items-center justify-end w-8 h-8 relative shrink-0 group">
              <span className={`text-xs text-slate-500 font-medium transition-opacity absolute right-0`}>$0</span>
            </div>
          </button>

          {/* Service Button */}
          <button
            onClick={() => {
              if (isInCart) {
                removeCartItem(optionId);
              } else {
                if (isProvided) removeClientProvided(optionId);
                addCartItem({ allocatedHours: 0, paymentType: 'monthly', optionId, name, price, sla, category, purpose });
              }
            }}
            className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
              isInCart 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm' 
                : 'border-slate-200 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer hover:-translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Zap className={`w-5 h-5 shrink-0 transition-colors ${isInCart ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-sm transition-colors ${isInCart ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Buy / Subscribe
              </span>
            </div>
            <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
              <span className={`text-xs font-mono font-semibold text-slate-500 transition-opacity absolute right-0`}>+${price.toLocaleString()}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}