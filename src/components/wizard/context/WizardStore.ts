"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WizardState, ClientSegment, CartItem } from '../types/wizard.types';

const initialState = {
  currentStep: 1,
  maxSteps: 5,
  segment: null as ClientSegment | null,
  chosenPresetId: null as string | null,
  cart: {} as Record<string, CartItem>,
  infrastructure: {
    salesOpsCloudIncluded: false,
    basePrice: 999,
    perSeatPrice: 10,
  }
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Set the wizard to a specific step
       */
      setStep: (step: number) => set({ currentStep: Math.max(1, Math.min(step, get().maxSteps)) }),
      
      /**
       * Move to the next step
       */
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, state.maxSteps) 
      })),
      
      /**
       * Move to the previous step
       */
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),

      /**
       * Set the selected client segment (e.g., 'startup', 'enterprise')
       */
      setSegment: (segment: ClientSegment | null) => set({ segment }),
      
      /**
       * Apply a pre-configured team setup (Preset)
       */
      setPreset: (presetId: string | null, items: Record<string, number>) => set(() => {
        const newCart: Record<string, CartItem> = {};
        
        // Default base prices for roles (can be overridden by UI/config)
        const basePrices: Record<string, number> = {
          'scout': 1200,
          'team-lead': 1500,
          'sdr': 3500,
          'closer': 5000,
        };

        for (const [roleId, quantity] of Object.entries(items)) {
          newCart[roleId] = {
            roleId,
            quantity: Number(quantity),
            pricePerUnit: basePrices[roleId] || 0
          };
        }

        return {
          chosenPresetId: presetId,
          cart: newCart,
        };
      }),

      /**
       * Update the quantity of a specific role in the cart
       */
      updateCartItemQuantity: (roleId: string, quantity: number, pricePerUnit: number) => set((state) => {
        const newCart = { ...state.cart };
        
        if (quantity <= 0) {
          delete newCart[roleId];
        } else {
          newCart[roleId] = {
            roleId,
            quantity,
            pricePerUnit,
          };
        }
        
        return { cart: newCart, chosenPresetId: null }; // Customizing invalidates the preset
      }),

      /**
       * Reset the entire wizard state to default
       */
      resetWizard: () => set(initialState),
    }),
    {
      name: 'app_wizard_session', // Key for localStorage
    }
  )
);