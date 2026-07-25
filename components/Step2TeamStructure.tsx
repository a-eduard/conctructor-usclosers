"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWizard, DIY_HOURS_MAP, CartItem } from "../contexts/WizardContext";
import { ArrowDown, Bot, User, UserCheck, AlertTriangle, ChevronDown, Briefcase, TrendingUp, Magnet, Settings, DollarSign, Phone, CheckCircle2, Check, X, Clock } from "lucide-react";

const FUNNEL_STAGES = [
  {
    id: 'lead_gen',
    name: 'Lead Generation',
    desc: 'Sourcing and initial outreach to build your pipeline.',
    tasks: [
      'Sourcing target contacts and finding decision-makers (Scouting)',
      'Data enrichment (email and phone validation)',
      'Technical infrastructure setup (domain warmup)',
      'Launching initial outreach (Cold Email / LinkedIn)'
    ],
    hire: { hours: 160, 
      id: 'scout_hire', 
      baseName: 'Human Scout',
      name: 'Hire Human Scout', 
      price: 1500, 
      sla: '14 Days', 
      category: 'hire', 
      purpose: 'Sourcing and initial outreach to build your pipeline',
      defaultGrade: 'expert',
      grades: [
        { level: 'intern', label: 'Intern', price: 500, sla: '21 Days' },
        { level: 'junior', label: 'Junior', price: 1000, sla: '14 Days' },
        { level: 'expert', label: 'Expert', price: 1500, sla: '14 Days' },
        { level: 'pro', label: 'Pro', price: 3000, sla: '7 Days' }
      ]
    },
    hireIds: ['scout_hire'],
    service: { hours: 160, id: 'agency_leadgen', name: 'Buy Agency LeadGen', price: 1000, sla: '7 Days', category: 'service', purpose: 'Sourcing and initial outreach to build your pipeline' },
    serviceIds: ['agency_leadgen', 'parsing', 'agency_leadgen_parsing', 'parsing_enrichment']
  },
  {
    id: 'qualification',
    name: 'Qualification',
    desc: 'Vetting inbound and outbound leads for fit.',
    tasks: [
      'Instant processing of inbound leads (Inbound SLA < 5 min)',
      'Cold calling and gatekeeper navigation',
      'Lead qualification by business criteria (BANT / MEDDIC)',
      'Schedule synchronization and calendar meeting booking'
    ],
    hire: { hours: 160, 
      id: 'sdr', 
      baseName: 'Human SDR',
      name: 'Hire Human SDR', 
      price: 3500, 
      sla: '21 Days', 
      category: 'hire', 
      purpose: 'Vetting inbound and outbound leads for fit',
      defaultGrade: 'expert',
      grades: [
        { level: 'intern', label: 'Intern', price: 1500, sla: '28 Days' },
        { level: 'junior', label: 'Junior', price: 2500, sla: '21 Days' },
        { level: 'expert', label: 'Expert', price: 3500, sla: '21 Days' },
        { level: 'pro', label: 'Pro', price: 6000, sla: '14 Days' }
      ]
    },
    hireIds: ['sdr'],
    service: { hours: 160, id: 'ai_sdr', name: 'Buy AI SDR', price: 800, sla: '2 Days', category: 'service', purpose: 'Vetting inbound and outbound leads for fit' },
    serviceIds: ['ai_sdr']
  },
  {
    id: 'demo',
    name: 'Discovery / Demo',
    desc: 'Presentations and discovery calls.',
    tasks: [
      'Conducting in-depth interviews (Discovery) to identify pain points',
      'Personalized product presentation (Demo) tailored to the client\'s case',
      'Objection handling ("Too expensive", "Too complex", "Already have a vendor")',
      'Sending follow-up materials (Pitch deck, case studies) after the call'
    ],
    hire: { hours: 160, 
      id: 'closer', 
      baseName: 'AE',
      name: 'Hire AE', 
      price: 5000, 
      sla: '30 Days', 
      category: 'hire', 
      purpose: 'Presentations, discovery calls, pricing and terms negotiation',
      defaultGrade: 'expert',
      grades: [
        { level: 'intern', label: 'Intern', price: 2500, sla: '45 Days' },
        { level: 'junior', label: 'Junior', price: 3500, sla: '30 Days' },
        { level: 'expert', label: 'Expert', price: 5000, sla: '30 Days' },
        { level: 'pro', label: 'Pro', price: 8000, sla: '14 Days' }
      ]
    },
    hireIds: ['closer'],
    service: null,
    serviceIds: []
  },
  {
    id: 'negotiation',
    name: 'Negotiation & Proposal',
    desc: 'Pricing and terms negotiation.',
    tasks: [
      'Preparation and issuing of commercial proposals (CPQ)',
      'Defending product value and negotiating possible discounts',
      'Aligning on legal aspects (NDA, Terms of Service)',
      'Systematic client follow-ups until the final decision'
    ],
    hire: { hours: 160, 
      id: 'closer', 
      baseName: 'AE',
      name: 'Hire AE', 
      price: 5000, 
      sla: '30 Days', 
      category: 'hire', 
      purpose: 'Presentations, discovery calls, pricing and terms negotiation',
      defaultGrade: 'expert',
      grades: [
        { level: 'intern', label: 'Intern', price: 2500, sla: '45 Days' },
        { level: 'junior', label: 'Junior', price: 3500, sla: '30 Days' },
        { level: 'expert', label: 'Expert', price: 5000, sla: '30 Days' },
        { level: 'pro', label: 'Pro', price: 8000, sla: '14 Days' }
      ]
    }, // shared ID deduplication
    hireIds: ['closer'],
    service: { hours: 160, id: 'legal_setup', name: 'Buy Legal Setup', price: 1200, sla: '5 Days', category: 'service', purpose: 'Legal and compliance setup for your sales operations' },
    serviceIds: ['legal_setup']
  },
  {
    id: 'closed_won_lost',
    name: 'Closed Won / Lost',
    desc: 'Analytics, contract signing, and management.',
    tasks: [
      'Contract signing and invoicing',
      'Seamless handoff of the client to the fulfillment team (Onboarding)',
      'Loss analysis for lost deals',
      'Digitizing sales metrics (Conversions, CAC, activity) in CRM'
    ],
    hire: { hours: 160, 
      id: 'team_lead', 
      baseName: 'Team Lead',
      name: 'Hire Team Lead', 
      price: 4000, 
      sla: '14 Days', 
      category: 'hire', 
      purpose: 'Analytics, contract signing, and management',
      defaultGrade: 'expert',
      grades: [
        { level: 'intern', label: 'Intern', price: 2000, sla: '28 Days' },
        { level: 'junior', label: 'Junior', price: 3000, sla: '21 Days' },
        { level: 'expert', label: 'Expert', price: 4000, sla: '14 Days' },
        { level: 'pro', label: 'Pro', price: 7000, sla: '7 Days' }
      ]
    },
    hireIds: ['team_lead', 'sales_ops'],
    service: null,
    serviceIds: []
  }
];

const TEMPLATES = [
  {
    id: 'founder_led',
    name: 'Founder-Led Automation',
    desc: 'Parsing -> AI SDR -> Founder -> Founder -> Founder.',
    icon: User,
    clientProvided: ['demo', 'negotiation', 'closed_won_lost'],
    cartItems: [
      { optionId: 'parsing', name: 'Parsing Service', price: 800, sla: '3 Days', category: 'service', purpose: 'Data parsing and organization' },
      { optionId: 'ai_sdr', name: 'AI SDR', price: 800, sla: '2 Days', category: 'service', purpose: 'Automated lead qualification' }
    ]
  },
  {
    id: 'high_ticket',
    name: 'High-Ticket Enterprise',
    desc: 'Scout -> Scout -> Senior Closer -> Senior Closer -> Founder.',
    icon: Briefcase,
    clientProvided: ['closed_won_lost'],
    cartItems: [
      { optionId: 'scout_hire', name: 'Human Scout', price: 1500, sla: '14 Days', category: 'hire', purpose: 'Lead generation and initial outreach' },
      { optionId: 'sdr', name: 'Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Qualifying enterprise leads' },
      { optionId: 'closer', name: 'AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Enterprise deal closing' }
    ]
  },
  {
    id: 'scale_up',
    name: 'The Scale-Up Machine',
    desc: 'LeadGen -> SDR -> Closer -> Closer -> Team Lead.',
    icon: TrendingUp,
    clientProvided: [],
    cartItems: [
      { optionId: 'agency_leadgen', name: 'Agency LeadGen', price: 1000, sla: '7 Days', category: 'service', purpose: 'Outsourced lead generation' },
      { optionId: 'sdr', name: 'Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Lead qualification and setting appointments' },
      { optionId: 'closer', name: 'AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Running demos and closing deals' },
      { optionId: 'team_lead', name: 'Team Lead', price: 4000, sla: '14 Days', category: 'hire', purpose: 'Managing the sales team and operations' }
    ]
  },
  {
    id: 'inbound_closer',
    name: 'Inbound Closer',
    desc: 'Founder (Traffic) -> AI SDR -> Closer -> Closer -> SalesOps.',
    icon: Magnet,
    clientProvided: ['lead_gen'],
    cartItems: [
      { optionId: 'ai_sdr', name: 'AI SDR', price: 800, sla: '2 Days', category: 'service', purpose: 'Automated qualification of inbound traffic' },
      { optionId: 'closer', name: 'AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Running demos and closing inbound deals' },
      { optionId: 'sales_ops', name: 'SalesOps', price: 3000, sla: '14 Days', category: 'hire', purpose: 'Analytics and CRM management' }
    ]
  },
  {
    id: 'turnkey',
    name: 'Turnkey Department',
    desc: 'LeadGen + Parsing -> SDR -> Closer -> Closer -> Team Lead.',
    icon: Settings,
    clientProvided: [],
    cartItems: [
      { optionId: 'agency_leadgen_parsing', name: 'LeadGen + Parsing', price: 1500, sla: '7 Days', category: 'service', purpose: 'End-to-end lead generation and data processing' },
      { optionId: 'sdr', name: 'Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Qualifying provided leads' },
      { optionId: 'closer', name: 'AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Closing qualified opportunities' },
      { optionId: 'team_lead', name: 'Team Lead', price: 4000, sla: '14 Days', category: 'hire', purpose: 'Overseeing the entire sales cycle' }
    ]
  },
  {
    id: 'fundraising',
    name: 'Fundraising Pipeline',
    desc: 'Parsing -> Scout -> Founder -> Founder -> Founder.',
    icon: DollarSign,
    clientProvided: ['demo', 'negotiation', 'closed_won_lost'],
    cartItems: [
      { optionId: 'parsing', name: 'Parsing Service', price: 800, sla: '3 Days', category: 'service', purpose: 'Investor data parsing and organization' },
      { optionId: 'sdr', name: 'Human SDR (Scout)', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Initial outreach and meeting booking' }
    ]
  },
  {
    id: 'cold_calling',
    name: 'Cold Calling Machine',
    desc: 'Parsing + Enrichment -> SDR -> Closer -> Closer -> Team Lead.',
    icon: Phone,
    clientProvided: [],
    cartItems: [
      { optionId: 'parsing_enrichment', name: 'Parsing + Enrichment', price: 1200, sla: '5 Days', category: 'service', purpose: 'Data enrichment and parsing for cold campaigns' },
      { optionId: 'sdr', name: 'Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'High-volume cold calling and qualification' },
      { optionId: 'closer', name: 'AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Running demos and closing deals' },
      { optionId: 'team_lead', name: 'Team Lead', price: 4000, sla: '14 Days', category: 'hire', purpose: 'Managing operations and performance' }
    ]
  }
];

export function Step2TeamStructure() {
  const { state, markClientProvided, addCartItem, removeCartItem, removeClientProvided, applyTemplateData } = useWizard();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>({});
  const [openHireDropdown, setOpenHireDropdown] = useState<string | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [errorStageId, setErrorStageId] = useState<string | null>(null);

  useEffect(() => {
    const handleTriggerError = (e: any) => {
      const elementId = e.detail;
      const element = document.getElementById(elementId);
      if (element) {
        const stageId = elementId.replace('diy-item-', '');
        setExpandedStageId(stageId);
        
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
        
        setErrorStageId(stageId);
        setTimeout(() => setErrorStageId(null), 2500);
      }
    };
    window.addEventListener('trigger-error-highlight', handleTriggerError as EventListener);
    return () => window.removeEventListener('trigger-error-highlight', handleTriggerError as EventListener);
  }, []);

  useEffect(() => {
    // If no template selected and no step 2 data, set default
    const step2StageIds = ['lead_gen', 'qualification', 'demo', 'negotiation', 'closed_won_lost'];
    const step2ItemIds = ['scout_hire', 'agency_leadgen', 'sdr', 'ai_sdr', 'closer', 'legal_setup', 'team_lead', 'sales_ops', 'parsing', 'agency_leadgen_parsing', 'parsing_enrichment'];
    
    const hasStep2Data = state.clientProvided.some(id => step2StageIds.includes(id)) || 
                         state.cartItems.some(i => step2ItemIds.includes(i.optionId));
                         
    if (!hasStep2Data && selectedTemplateId === null) {
      const defaultTemplate = TEMPLATES.find(t => t.id === 'founder_led');
      if (defaultTemplate) {
        applyTemplateData(defaultTemplate.clientProvided, defaultTemplate.cartItems as CartItem[]);
        setSelectedTemplateId('founder_led');
      }
    }
  }, [state.clientProvided, state.cartItems, selectedTemplateId, applyTemplateData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (!(event.target as Element).closest('.hire-dropdown-container')) {
        setOpenHireDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getSelection = (stageId: string) => {
    if (state.clientProvided.includes(stageId)) return 'myself';
    const stage = FUNNEL_STAGES.find(s => s.id === stageId);
    if (stage?.serviceIds?.some(id => state.cartItems.some(i => i.optionId === id))) return 'service';
    if (stage?.hireIds?.some(id => state.cartItems.some(i => i.optionId === id))) {
      // Special deduplication case for closer
      if (stage.hireIds.includes('closer')) {
         return 'hire';
      }
      return 'hire';
    }
    return null;
  };

  const handleDeselect = (stageId: string) => {
    const stage = FUNNEL_STAGES.find(s => s.id === stageId);
    if (!stage) return;
    
    if (stage.hireIds?.includes('closer')) {
      const otherStageId = stageId === 'demo' ? 'negotiation' : 'demo';
      const otherSelection = getSelection(otherStageId);
      if (otherSelection !== 'hire') {
        removeCartItem('closer');
      }
    } else {
      if (stage.hireIds) stage.hireIds.forEach(id => removeCartItem(id));
    }
    if (stage.serviceIds) stage.serviceIds.forEach(id => removeCartItem(id));
    removeClientProvided(stageId);
  };

  const handleSelect = (stageId: string, type: 'myself' | 'hire' | 'service') => {
    const stage = FUNNEL_STAGES.find(s => s.id === stageId);
    if (!stage) return;
    
    const current = getSelection(stageId);
    
    if (type === 'hire') {
      setOpenHireDropdown(openHireDropdown === stageId ? null : stageId);
      return;
    }
    
    if (current === type) return;

    handleDeselect(stageId);
    
    if (type === 'myself') {
      markClientProvided(stageId);
      setExpandedStageId(null);
    } else if (type === 'service' && stage.service) {
      addCartItem({ ...stage.service, optionId: stage.service.id, allocatedHours: stage.service.hours, paymentType: 'monthly' } as any);
      setExpandedStageId(null);
    }
  };

  const handleGradeSelect = (stageId: string, hireId: string, level: string) => {
    setSelectedGrades(prev => ({ ...prev, [hireId]: level }));
    const stage = FUNNEL_STAGES.find(s => s.id === stageId);
    if (stage?.hire) {
      const gradeInfo = stage.hire.grades.find(g => g.level === level) || stage.hire.grades[2];
      
      if (stage.hireIds) stage.hireIds.forEach(id => removeCartItem(id));
      if (stage.serviceIds) stage.serviceIds.forEach(id => removeCartItem(id));
      removeClientProvided(stageId);
      
      addCartItem({ 
        ...stage.hire, 
        optionId: stage.hire.id,
        name: `${stage.hire.baseName} ${gradeInfo.label}`,
        price: gradeInfo.price,
        sla: gradeInfo.sla,
        allocatedHours: stage.hire.hours, 
        paymentType: 'monthly' 
      } as any);
    }
    setOpenHireDropdown(null);
    setExpandedStageId(null);
  };

  // Smart Rule: Lost Boss Trigger
  const hasSdr = state.cartItems.some(i => i.optionId === 'sdr');
  const hasCloser = state.cartItems.some(i => i.optionId === 'closer');
  const isLostBoss = hasSdr && hasCloser && state.clientProvided.includes('closed_won_lost');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isLostBoss && (
        <div className="mb-10 p-5 bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl flex items-start gap-4 shadow-sm animate-in fade-in zoom-in-95 duration-300">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
            Warning: Managing 2+ people takes up to 20h/week. Consider adding a Team Lead in the Closed Won / Lost stage.
          </p>
        </div>
      )}

      <div className="space-y-8 relative">
        <div className="absolute left-[38px] xl:left-[42px] top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block" />
        
        {FUNNEL_STAGES.map((stage, idx) => {
          const selection = getSelection(stage.id);
          const isExpanded = expandedStageId === stage.id;
          
          return (
            <div key={stage.id} id={`diy-item-${stage.id}`} className={`relative group scroll-m-24 transition-all duration-300 ${openHireDropdown === stage.id ? 'z-50' : 'z-10'}`}>
              {idx !== 0 && (
                <div className="absolute -top-6 left-[28px] xl:left-[32px] bottom-auto flex items-center justify-center hidden md:flex">
                  <ArrowDown className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-indigo-300 dark:group-hover:text-indigo-700 transition-colors" />
                </div>
              )}
              
              <div 
                onClick={() => !isExpanded && setExpandedStageId(stage.id)}
                className={`bg-white dark:bg-slate-900/80 backdrop-blur-md border rounded-2xl shadow-sm transition-all duration-300 ${
                  errorStageId === stage.id
                    ? 'border-red-400 ring-4 ring-red-400/30 bg-red-50/20 dark:bg-red-500/10 animate-[pulse_1s_ease-in-out_2] p-6'
                    : isExpanded 
                      ? 'border-indigo-200 dark:border-indigo-500/30 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-900/20 p-6' 
                      : 'border-slate-200 dark:border-slate-800/60 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-md cursor-pointer p-4 md:p-6'
                }`}
              >
                {isExpanded ? (
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-extrabold shrink-0 shadow-inner">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{stage.name}</h3>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm pl-12 font-medium">{stage.desc}</p>
                      {stage.tasks && stage.tasks.length > 0 && (
                        <ul className="mt-4 space-y-2 pl-12">
                          {stage.tasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              <Check className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-[2px]" />
                              <span className="leading-snug">{task}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-[280px] shrink-0 pl-12 md:pl-0">
                    {/* Myself Option */}
                    <button
                      onClick={() => handleSelect(stage.id, 'myself')}
                      className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 hover:-translate-x-1 ${
                        selection === 'myself'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserCheck className={`w-5 h-5 transition-colors ${selection === 'myself' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                        <span className={`font-bold text-sm transition-colors ${selection === 'myself' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          Do it myself
                        </span>
                      </div>
                      <div className="flex items-center justify-end w-8 h-8 relative shrink-0 group">
                        <span className={`text-xs text-slate-500 font-medium transition-opacity absolute right-0 ${selection === 'myself' ? 'opacity-0 md:opacity-100 md:group-hover:opacity-0' : ''}`}>
                          $0
                        </span>
                        {selection === 'myself' && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeselect(stage.id);
                            }}
                            className="absolute opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-all cursor-pointer right-0"
                          >
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Hire Option */}
                    {stage.hire ? (
                      <div className="relative hire-dropdown-container">
                        <button
                          onClick={() => handleSelect(stage.id, 'hire')}
                          className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 hover:-translate-x-1 ${
                            selection === 'hire'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-500/50 shadow-sm' 
                              : 'border-slate-200 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <User className={`w-5 h-5 transition-colors ${selection === 'hire' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                            <span className={`font-bold text-sm transition-colors text-left ${selection === 'hire' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {selection === 'hire' 
                                ? `${stage.hire.baseName} ${stage.hire.grades.find(g => g.level === (selectedGrades[stage.hire!.id] || stage.hire!.defaultGrade))?.label}`
                                : `Hire ${stage.hire.baseName}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 group">
                            {selection === 'hire' && (
                              <span className="text-xs font-mono font-semibold text-slate-500">
                                +${stage.hire.grades.find(g => g.level === (selectedGrades[stage.hire!.id] || stage.hire!.defaultGrade))?.price.toLocaleString()}/m
                              </span>
                            )}
                            <div className="relative w-6 h-6 flex items-center justify-center">
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${openHireDropdown === stage.id ? 'rotate-180' : ''} ${selection === 'hire' ? 'md:group-hover:opacity-0 absolute' : ''}`} />
                              {selection === 'hire' && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeselect(stage.id);
                                    setOpenHireDropdown(null);
                                  }}
                                  className="absolute opacity-0 md:group-hover:opacity-100 hidden md:flex items-center justify-center w-full h-full text-red-500 bg-red-50 dark:bg-red-500/10 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        </button>

                        {openHireDropdown === stage.id && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 origin-top animate-in fade-in zoom-in-95 duration-200">
                            {stage.hire.grades.map(grade => {
                              const isSelected = (selectedGrades[stage.hire!.id] || stage.hire!.defaultGrade) === grade.level;
                              return (
                                <button
                                  key={grade.level}
                                  onClick={() => handleGradeSelect(stage.id, stage.hire!.id, grade.level)}
                                  className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                                    isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {grade.label}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-slate-500">${grade.price.toLocaleString()}/m</span>
                                    {isSelected ? (
                                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    ) : (
                                      <div className="w-4 h-4" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                            {selection === 'hire' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeselect(stage.id);
                                  setOpenHireDropdown(null);
                                }}
                                className="w-full flex items-center justify-between p-3 text-left transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 md:hidden border-t border-slate-100 dark:border-slate-800"
                              >
                                <span className="text-sm font-semibold">Remove Selection</span>
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between p-3 opacity-50">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-slate-400" />
                          <span className="font-bold text-sm text-slate-400 dark:text-slate-600">N/A</span>
                        </div>
                      </div>
                    )}

                    {/* AI / Service Option */}
                    {stage.service ? (
                      <button
                        onClick={() => handleSelect(stage.id, 'service')}
                        className={`w-full relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 hover:-translate-x-1 ${
                          selection === 'service'
                            ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-500/10 dark:border-purple-500/50 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-800/50 hover:border-purple-200 dark:hover:border-purple-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Bot className={`w-5 h-5 transition-colors ${selection === 'service' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                          <span className={`font-bold text-sm text-left leading-tight transition-colors ${selection === 'service' ? 'text-purple-700 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {stage.service.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-end w-16 h-8 relative shrink-0 group">
                          <span className={`text-xs font-mono font-semibold text-slate-500 transition-opacity absolute right-0 ${selection === 'service' ? 'opacity-0 md:opacity-100 md:group-hover:opacity-0' : ''}`}>
                            +${stage.service.price.toLocaleString()}
                          </span>
                          {selection === 'service' && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeselect(stage.id);
                              }}
                              className="absolute opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-all cursor-pointer right-0"
                            >
                              <X className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    ) : (
                      <div className="w-full bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between p-3 opacity-50">
                        <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-slate-400" />
                          <span className="font-bold text-sm text-slate-400 dark:text-slate-600">N/A</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-extrabold shrink-0 shadow-inner">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{stage.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate hidden sm:block">{stage.desc}</p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-end min-w-0 max-w-[240px] md:max-w-[400px]">
                      {!selection ? (
                        <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 animate-pulse text-sm font-bold">
                          Please choose
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                          {/* 1. Action Chevron */}
                          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold shrink-0 ${
                            selection === 'myself' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400' :
                            selection === 'hire' ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400' :
                            'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400'
                          }`}>
                            {selection === 'myself' && <UserCheck className="w-3.5 h-3.5" />}
                            {selection === 'hire' && <User className="w-3.5 h-3.5" />}
                            {selection === 'service' && <Bot className="w-3.5 h-3.5" />}
                            
                            <span className="truncate max-w-[100px] md:max-w-[150px]">
                              {selection === 'myself' ? 'Do it myself' :
                               selection === 'hire' ? `${stage.hire?.baseName} (${selectedGrades[stage.hire!.id] || stage.hire!.defaultGrade})` :
                               stage.service?.name}
                            </span>
                          </div>

                          {/* 2. Cost Chevron */}
                          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold shrink-0">
                            {selection === 'myself' ? '$0/m' :
                             selection === 'hire' ? `+$${stage.hire?.grades.find(g => g.level === (selectedGrades[stage.hire!.id] || stage.hire!.defaultGrade))?.price.toLocaleString()}/m` :
                             `+$${stage.service?.price.toLocaleString()}/m`}
                          </div>

                          {/* 3. Time Chevron */}
                          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold shrink-0 ${
                            selection === 'myself' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400' : 
                            selection === 'hire' ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400' :
                            'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {selection === 'myself' ? `${DIY_HOURS_MAP[stage.id]}hr/m (You)` : 
                               selection === 'hire' ? `${stage.hire?.hours}hr/m (Team)` : 
                               `${stage.service?.hours}hr/m (AI)`}
                            </span>
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