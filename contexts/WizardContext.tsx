"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export type CartItem = {
  optionId: string;
  name: string;
  price: number;
  sla: string;
  category?: 'hire' | 'service';
  purpose?: string;
  paymentType?: 'one-time' | 'monthly';
  allocatedHours?: number; // <--- Добавили знак вопроса
};

export type RuleEvaluationResults = {
  exclude: string[];
  forceRecommend: string[];
  alerts: string[];
};

export const DIY_HOURS_MAP: Record<string, number> = {
  // Step 1
  'sales_methodology': 15,
  'competitor_intel': 25,
  'partner_mou': 20,
  // Step 2
  'lead_gen': 40,
  'qualification': 80,
  'demo': 80,
  'negotiation': 30,
  'closed_won_lost': 20,
  // Step 3
  'sales_deck': 25,
  'one_pager': 8,
  'objections_playbook': 15,
  'sales_playbook': 40,
  'battlecards': 20,
  // Step 4
  'hiring_agreement': 10,
  'service_agreement': 15,
  'terms_of_service': 20,
  'gdpr_compliance': 30,
  // Step 5
  'inbound_demo_funnel': 35,
  'micro_consulting': 35,
  'outbound_cold_meeting': 35,
  'automated_webinar': 35,
  'quick_callback': 35,
  'custom_funnel': 35,
  // Step 6
  'byo_data': 20,
  'inbound_traffic': 40,
  'outbound_parsing': 20,
  'crm_enrichment': 15,
  'intent_data': 25,
  // Step 7
  'sales_meeting_room': 4,
  'sales_team_chat': 5,
  'document_signing': 4,
  'dataroom': 6,
  'email_infra': 10,
  'calendar_booking': 3,
  'preconfigured_crm': 40,
  'power_dialer_voip': 15,
  'call_intelligence_qa': 20,
  'cpq_invoicing': 15,
  'knowledge_base': 20,
};

type Step1Data = {
  methodology: string;
  channels: string[];
  acv: string;
  subscriptionModel: 'recurring' | 'one-time' | '';
};

type Step5Data = {
  selectedFunnel: string;
};

type WizardState = {
  currentStep: number;
  clientProvided: string[];
  cartItems: CartItem[];
  totalOneTime: number;
  totalMonthly: number;
  ruleResults: RuleEvaluationResults;
  step1Data: Step1Data;
  step5Data: Step5Data;
};

type WizardContextType = {
  state: WizardState;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  markClientProvided: (optionId: string) => void;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (optionId: string) => void;
  removeClientProvided: (optionId: string) => void;
  applyTemplateData: (clientProvided: string[], cartItems: CartItem[]) => void;
  applyGlobalTemplate: (templateId: string) => void;
  updateStep1Data: (data: Partial<Step1Data>) => void;
  updateStep5Data: (data: Partial<Step5Data>) => void;
  resetWizard: () => void;
};

const initialState: WizardState = {
  currentStep: 0,
  clientProvided: [],
  cartItems: [],
  totalOneTime: 0,
  totalMonthly: 0,
  ruleResults: {
    exclude: [],
    forceRecommend: [],
    alerts: []
  },
  step1Data: {
    methodology: '',
    channels: [],
    acv: '',
    subscriptionModel: ''
  },
  step5Data: {
    selectedFunnel: ''
  }
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const evaluateRules = async () => {
      try {
        const response = await fetch('/api/wizard/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: state.cartItems,
            clientProvidedItems: state.clientProvided
          })
        });
        if (response.ok) {
          const results = await response.json();
          setState(prev => ({ ...prev, ruleResults: results }));
        }
      } catch (err) {
        console.error("Rule evaluation failed", err);
      }
    };
    // Disabled auto-evaluation until API route is created in Step 4
    // evaluateRules();
  }, [state.cartItems, state.clientProvided]);

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 8),
    }));
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const setStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 8)),
    }));
  };

  const markClientProvided = (optionId: string) => {
    setState((prev) => {
      const newCartItems = prev.cartItems.filter((i) => i.optionId !== optionId);
      const totalOneTime = newCartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = newCartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);

      const isProvided = prev.clientProvided.includes(optionId);
      const newClientProvided = isProvided
        ? prev.clientProvided.filter((id) => id !== optionId)
        : [...prev.clientProvided, optionId];

      return {
        ...prev,
        clientProvided: newClientProvided,
        cartItems: newCartItems,
        totalOneTime,
        totalMonthly,
      };
    });
  };

  const addCartItem = (item: CartItem) => {
    setState((prev) => {
      const newClientProvided = prev.clientProvided.filter(
        (id) => id !== item.optionId,
      );
      
      const existingItem = prev.cartItems.find(
        (i) => i.optionId === item.optionId,
      );
      const newCartItems = existingItem
        ? prev.cartItems.filter((i) => i.optionId !== item.optionId)
        : [...prev.cartItems, item];
        
      const totalOneTime = newCartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = newCartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);

      return {
        ...prev,
        clientProvided: newClientProvided,
        cartItems: newCartItems,
        totalOneTime,
        totalMonthly,
      };
    });
  };
  
  const removeCartItem = (optionId: string) => {
    setState((prev) => {
      const newCartItems = prev.cartItems.filter((i) => i.optionId !== optionId);
      const totalOneTime = newCartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = newCartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);
      return {
        ...prev,
        cartItems: newCartItems,
        totalOneTime,
        totalMonthly,
      };
    });
  };

  const removeClientProvided = (optionId: string) => {
    setState((prev) => ({
      ...prev,
      clientProvided: prev.clientProvided.filter(id => id !== optionId)
    }));
  };

  const applyTemplateData = (clientProvided: string[], cartItems: CartItem[]) => {
    setState((prev) => {
      const step2StageIds = ['lead_gen', 'qualification', 'demo', 'negotiation', 'closed_won_lost'];
      const step2ItemIds = ['scout_hire', 'agency_leadgen', 'sdr', 'ai_sdr', 'closer', 'legal_setup', 'team_lead', 'sales_ops'];
      
      const newClientProvided = [
        ...prev.clientProvided.filter(id => !step2StageIds.includes(id)),
        ...clientProvided
      ];
      
      const newCartItems = [
        ...prev.cartItems.filter(item => !step2ItemIds.includes(item.optionId)),
        ...cartItems
      ];
      
      const totalOneTime = newCartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = newCartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);

      return {
        ...prev,
        clientProvided: Array.from(new Set(newClientProvided)),
        cartItems: newCartItems,
        totalOneTime,
        totalMonthly
      };
    });
  };

  const applyGlobalTemplate = (templateId: string) => {
    setState((prev) => {
      let step1Data: Step1Data = { ...prev.step1Data };
      let step5Data: Step5Data = { ...prev.step5Data };
      let cartItems: CartItem[] = [];
      let clientProvided: string[] = [];

      if (templateId === 'founder_led') {
        step1Data = { methodology: 'SPIN', channels: ['Cold Email', 'LinkedIn'], acv: '5000', subscriptionModel: 'recurring' };
        step5Data = { selectedFunnel: 'outbound_cold_meeting' };
        clientProvided = ['competitor_intel', 'closer', 'sales_ops'];
        cartItems = [
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'ai_sdr', name: 'Buy AI SDR', price: 800, sla: '2 Days', category: 'service', purpose: 'Automated qualification of inbound traffic' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'outbound_parsing', name: 'Outbound Parsing', price: 1200, sla: '5 Days', category: 'service', purpose: 'Scraping targets from LinkedIn and other databases.' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'crm_enrichment', name: 'CRM Enrichment', price: 800, sla: '3 Days', category: 'service', purpose: 'Cleaning and updating old/existing databases.' }
        ];
      } else if (templateId === 'high_ticket') {
        step1Data = { methodology: 'MEDDIC', channels: ['LinkedIn', 'Inbound'], acv: '50000', subscriptionModel: 'recurring' };
        step5Data = { selectedFunnel: 'outbound_cold_meeting' };
        clientProvided = [];
        cartItems = [
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'competitor_intel', name: 'Buy Competitor Intel', price: 800, sla: '7 Days', category: 'service', purpose: 'Deep market and competitor analysis to position your offering.' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'sdr', name: 'Hire Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Vetting inbound and outbound leads for fit' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'closer', name: 'Hire AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Presentations, discovery calls, pricing and terms negotiation' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'sales_ops', name: 'SalesOps', price: 3000, sla: '14 Days', category: 'hire', purpose: 'Analytics and CRM management' }
        ];
      } else if (templateId === 'scale_up') {
        step1Data = { methodology: 'Challenger', channels: ['Cold Email', 'Cold Calling', 'LinkedIn'], acv: '15000', subscriptionModel: 'recurring' };
        step5Data = { selectedFunnel: 'outbound_cold_meeting' };
        clientProvided = [];
        cartItems = [
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'sdr', name: 'Hire Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Vetting inbound and outbound leads for fit' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'closer', name: 'Hire AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Presentations, discovery calls, pricing and terms negotiation' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'team_lead', name: 'Hire Team Lead', price: 4000, sla: '14 Days', category: 'hire', purpose: 'Analytics, contract signing, and management' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'outbound_parsing', name: 'Outbound Parsing', price: 1200, sla: '5 Days', category: 'service', purpose: 'Scraping targets from LinkedIn and other databases.' }
        ];
      } else if (templateId === 'inbound_closer') {
        step1Data = { methodology: 'Other', channels: ['Inbound'], acv: '2000', subscriptionModel: 'one-time' };
        step5Data = { selectedFunnel: 'inbound_demo_funnel' };
        clientProvided = ['competitor_intel'];
        cartItems = [
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'ai_sdr', name: 'Buy AI SDR', price: 800, sla: '2 Days', category: 'service', purpose: 'Automated qualification of inbound traffic' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'closer', name: 'Hire AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Presentations, discovery calls, pricing and terms negotiation' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'inbound_traffic', name: 'Inbound Traffic', price: 2500, sla: '10 Days', category: 'service', purpose: 'Setup of hot lead generation (paid ads, forms).' }
        ];
      } else if (templateId === 'turnkey') {
        step1Data = { methodology: 'MEDDIC', channels: ['Cold Email', 'LinkedIn', 'Inbound'], acv: '25000', subscriptionModel: 'recurring' };
        step5Data = { selectedFunnel: 'hybrid_funnel' };
        clientProvided = [];
        cartItems = [
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'sales_consulting', name: 'Sales Consulting', price: 1500, sla: '7 Days', category: 'service', purpose: 'For expert guidance in building your sales methodology' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'scout_hire', name: 'Hire Human Scout', price: 1500, sla: '14 Days', category: 'hire', purpose: 'Sourcing and initial outreach to build your pipeline' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'sdr', name: 'Hire Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Vetting inbound and outbound leads for fit' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'closer', name: 'Hire AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Presentations, discovery calls, pricing and terms negotiation' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'team_lead', name: 'Hire Team Lead', price: 4000, sla: '14 Days', category: 'hire', purpose: 'Analytics, contract signing, and management' }
        ];
      } else if (templateId === 'fundraising') {
        step1Data = { methodology: 'Other', channels: ['Cold Email', 'LinkedIn'], acv: '1000000', subscriptionModel: 'one-time' };
        step5Data = { selectedFunnel: 'outbound_cold_meeting' };
        clientProvided = ['closer'];
        cartItems = [
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'sales_deck', name: 'Sales Deck / Pitch Deck', price: 2500, sla: '14 Days', category: 'service', purpose: 'Visually stunning and persuasive presentation for meetings.' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'outbound_parsing', name: 'Outbound Parsing', price: 1200, sla: '5 Days', category: 'service', purpose: 'Scraping targets from LinkedIn and other databases.' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'legal_setup', name: 'Buy Legal Setup', price: 1200, sla: '5 Days', category: 'service', purpose: 'Legal and compliance setup for your sales operations' }
        ];
      } else if (templateId === 'cold_calling') {
        step1Data = { methodology: 'SPIN', channels: ['Cold Calling'], acv: '10000', subscriptionModel: 'recurring' };
        step5Data = { selectedFunnel: 'outbound_cold_meeting' };
        clientProvided = ['competitor_intel'];
        cartItems = [
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'sdr', name: 'Hire Human SDR', price: 3500, sla: '21 Days', category: 'hire', purpose: 'Vetting inbound and outbound leads for fit' },
          { allocatedHours: 160, paymentType: 'monthly', optionId: 'closer', name: 'Hire AE', price: 5000, sla: '30 Days', category: 'hire', purpose: 'Presentations, discovery calls, pricing and terms negotiation' },
          { allocatedHours: 0, paymentType: 'one-time', optionId: 'outbound_parsing', name: 'Outbound Parsing', price: 1200, sla: '5 Days', category: 'service', purpose: 'Scraping targets from LinkedIn and other databases.' }
        ];
      }

      const totalOneTime = cartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = cartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);

      return {
        ...prev,
        step1Data,
        step5Data,
        cartItems,
        clientProvided,
        totalOneTime,
        totalMonthly,
        currentStep: 8
      };
    });
  };

  const updateStep1Data = (data: Partial<Step1Data>) => {
    setState((prev) => ({
      ...prev,
      step1Data: { ...prev.step1Data, ...data }
    }));
  };

  const updateStep5Data = (data: Partial<Step5Data>) => {
    setState((prev) => ({
      ...prev,
      step5Data: { ...prev.step5Data, ...data }
    }));
  };

  const resetWizard = () => {
    setState(initialState);
    router.replace('/');
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        nextStep,
        prevStep,
        setStep,
        markClientProvided,
        addCartItem,
        removeCartItem,
        removeClientProvided,
        applyTemplateData,
        applyGlobalTemplate,
        updateStep1Data,
        updateStep5Data,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};