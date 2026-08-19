"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export type CartItem = {
  optionId: string;
  name: string;
  price: number;
  sla: string;
  category?: 'hire' | 'service';
  purpose?: string;
  paymentType?: 'one-time' | 'monthly';
  allocatedHours?: number;
};

export type SmartAlert = {
  id: string;
  message: string;
  actionText: string;
  targetStep: number;
  targetElementId: string;
};

export type OfferOption = {
  id: string;
  name: string;
  priceDelta: string;
  whyNeedThis: string | null;
  unitName: string | null;
  minQuantity: number;
  maxQuantity: number;
  step: number;
  slaImpact: string;
};

export type OfferComponent = {
  id: string;
  name: string;
  type: string;
  whyNeedThis: string | null;
  options: OfferOption[];
};

export type DatabaseOffer = {
  id: string;
  name: string;
  concept: string;
  pain: string;
  action: string;
  basePrice: string;
  deliverySla: string;
  categoryId: string;
  features: string[];
  rulesEngine: any[];
  presets: any[];
  components?: OfferComponent[];
};

export type RuleEvaluationResults = {
  exclude: string[];
  forceRecommend: string[];
  alerts: SmartAlert[]; 
};

export const DIY_HOURS_MAP: Record<string, number> = {
  'sales_methodology': 15,
  'competitor_intel': 25,
  'partner_mou': 20,
  'lead_gen': 40,
  'qualification': 80,
  'demo': 80,
  'negotiation': 30,
  'closed_won_lost': 20,
  'sales_deck': 25,
  'one_pager': 8,
  'objections_playbook': 15,
  'sales_playbook': 40,
  'battlecards': 20,
  'hiring_agreement': 10,
  'service_agreement': 15,
  'terms_of_service': 20,
  'gdpr_compliance': 30,
  'inbound_demo_funnel': 35,
  'micro_consulting': 35,
  'outbound_cold_meeting': 35,
  'automated_webinar': 35,
  'quick_callback': 35,
  'custom_funnel': 35,
  'byo_data': 20,
  'inbound_traffic': 40,
  'outbound_parsing': 20,
  'crm_enrichment': 15,
  'intent_data': 25,
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
  availableOffers: DatabaseOffer[]; 
  isLoadingOffers: boolean;         
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
  applyDynamicSolution: (solution: any) => void; 
  updateStep1Data: (data: Partial<Step1Data>) => void;
  updateStep5Data: (data: Partial<Step5Data>) => void;
  resetWizard: () => void;
  restoreDraft: (draftData: WizardState) => void;
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
  },
  availableOffers: [],    
  isLoadingOffers: true,  
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const normalizeSharedResource = (name: string, optionId: string = '') => {
  if (!name) return '';
  const lower = name.toLowerCase();
  
  if (lower.includes('account executive') || lower.includes('ae') || lower.includes('closer')) return 'ae';
  if (lower.includes('sdr') || lower.includes('sales development')) return 'sdr';
  if (lower.includes('scout')) return 'scout';
  if (lower.includes('team lead') || lower.includes('manager')) return 'team_lead';
  
  return `${lower}_${optionId}`;
};

export const getBaseId = (id: string) => {
  return id.replace(/^(step\d_|competitor_intel_|partner_mou_)/, '');
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(initialState);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        if (response.ok) {
          const offers: DatabaseOffer[] = await response.json();
          setState(prev => ({
            ...prev,
            availableOffers: offers,
            isLoadingOffers: false
          }));
        }
      } catch (error) {
        console.error("Failed to fetch offers from database", error);
        setState(prev => ({ ...prev, isLoadingOffers: false }));
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const evaluateRules = () => {
      const alerts: SmartAlert[] = [];
      const forceRecommend: string[] = [];
      const exclude: string[] = [];

      const hasData = 
        state.cartItems.some(i => ['outbound_parsing', 'inbound_traffic', 'intent_data', 'crm_enrichment'].includes(i.optionId)) || 
        state.clientProvided.includes('byo_data') || 
        state.clientProvided.includes('lead_gen');

      const hasSalesForce = 
        state.cartItems.some(i => {
          const norm = normalizeSharedResource(i.name, i.optionId);
          return norm === 'sdr' || norm === 'ae' || norm === 'scout';
        }) || 
        state.clientProvided.some(id => id.includes('qualification') || id.includes('demo'));

      const isArchitectureStarted = state.cartItems.length > 0 || state.clientProvided.length > 0 || state.step5Data.selectedFunnel !== '';

      if (isArchitectureStarted) {
        if (hasSalesForce && !hasData) {
          alerts.push({
            id: 'missing_data',
            message: "You have assigned sales roles but haven't selected a lead generation source. Your team won't have anyone to call.",
            actionText: "Select Lead Source \u2192",
            targetStep: 6,
            targetElementId: "diy-item-outbound_parsing"
          });
          forceRecommend.push('outbound_parsing');
        }

        if (hasData && !hasSalesForce) {
          alerts.push({
            id: 'missing_team',
            message: "You are generating leads but have no one assigned to process them. Please hire an SDR/Closer or assign the role to yourself.",
            actionText: "Hire Sales Force \u2192",
            targetStep: 2,
            targetElementId: "diy-item-qualification"
          });
          forceRecommend.push('sdr', 'closer');
        }

        if (state.step1Data.methodology === "I don't know" && !state.cartItems.some(i => i.optionId === 'sales_consulting')) {
          alerts.push({
            id: 'needs_consulting',
            message: "Since you don't have a specific methodology yet, we strongly recommend purchasing Sales Consulting to build a solid foundation.",
            actionText: "Add Consulting \u2192",
            targetStep: 1,
            targetElementId: "diy-item-sales_consulting"
          });
          forceRecommend.push('sales_consulting');
        }
      }

      setState(prev => {
        const newResults = { exclude, forceRecommend, alerts };
        if (JSON.stringify(prev.ruleResults) !== JSON.stringify(newResults)) {
          return { ...prev, ruleResults: newResults };
        }
        return prev;
      });
    };

    evaluateRules();
  }, [state.cartItems, state.clientProvided, state.step1Data.methodology, state.step5Data.selectedFunnel]);

  const nextStep = () => {
    setState((prev) => {
      // Игнорируем шаг 5
      const next = prev.currentStep === 4 ? 6 : prev.currentStep + 1;
      return {
        ...prev,
        currentStep: Math.min(next, 8),
      };
    });
  };

  const prevStep = () => {
    setState((prev) => {
      // Игнорируем шаг 5 при возврате
      const previous = prev.currentStep === 6 ? 4 : prev.currentStep - 1;
      return {
        ...prev,
        currentStep: Math.max(previous, 0),
      };
    });
  };

  const setStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, 8)),
    }));
  };

  const markClientProvided = (optionId: string) => {
    setState((prev) => {
      const baseId = getBaseId(optionId);
      
      const newCartItems = prev.cartItems.filter((i) => getBaseId(i.optionId) !== baseId);
      
      const totalOneTime = newCartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = newCartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);

      const newClientProvided = Array.from(new Set([...prev.clientProvided, optionId]));

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
      const baseItemId = getBaseId(item.optionId);
      
      const newClientProvided = prev.clientProvided.filter(id => getBaseId(id) !== baseItemId);
      
      const itemNorm = normalizeSharedResource(item.name, item.optionId);
      
      const newCartItems = prev.cartItems.filter(existing => {
        if (existing.optionId === item.optionId) return false;
        if (existing.category === item.category && normalizeSharedResource(existing.name, existing.optionId) === itemNorm) {
          return false; 
        }
        return true;
      });

      newCartItems.push(item);
        
      const totalOneTime = newCartItems.filter(i => i.paymentType === 'one-time').reduce((acc, i) => acc + i.price, 0);
      const totalMonthly = newCartItems.filter(i => i.paymentType === 'monthly').reduce((acc, i) => acc + i.price, 0);

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
      let step1Data: Step1Data = { methodology: '', channels: [], acv: '', subscriptionModel: '' }; 
      let step5Data: Step5Data = { ...prev.step5Data };
      let cartItems: CartItem[] = [];
      let clientProvided: string[] = [];

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
        currentStep: 1
      };
    });
  };

  const applyDynamicSolution = (solution: any) => {
    setState((prev) => {
      let step1Data: Step1Data = { methodology: '', channels: [], acv: '', subscriptionModel: '' };
      let step5Data: Step5Data = { selectedFunnel: '' };
      let clientProvided: string[] = [];
      let cartItems: CartItem[] = [];

      try { if (solution.step1Data) step1Data = { ...step1Data, ...JSON.parse(solution.step1Data) }; } catch(e) {}
      try { if (solution.step5Data) step5Data = { ...step5Data, ...JSON.parse(solution.step5Data) }; } catch(e) {}
      try { if (solution.clientProvided) clientProvided = JSON.parse(solution.clientProvided); } catch(e) {}
      try { if (solution.cartItems) cartItems = JSON.parse(solution.cartItems); } catch(e) {}

      const totalOneTime = cartItems.filter(i => i.paymentType === 'one-time').reduce((acc, item) => acc + item.price, 0);
      const totalMonthly = cartItems.filter(i => i.paymentType === 'monthly').reduce((acc, item) => acc + item.price, 0);

      return {
        ...prev,
        step1Data: { ...prev.step1Data, ...step1Data },
        step5Data: { ...prev.step5Data, ...step5Data },
        clientProvided,
        cartItems,
        totalOneTime,
        totalMonthly,
        currentStep: 1
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
    setState({
      ...initialState,
      currentStep: 0 
    });
    
    router.replace(pathname);
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restoreDraft = (draftData: WizardState) => {
    setState(draftData);
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
        applyDynamicSolution,
        updateStep1Data,
        updateStep5Data,
        resetWizard,
        restoreDraft, 
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