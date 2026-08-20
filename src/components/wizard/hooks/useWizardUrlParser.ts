"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useWizardStore } from '../context/WizardStore';

const PRESETS_MOCK: Record<string, Record<string, number>> = {
  'founder_exit': { 'team-lead': 1, 'closer': 2 },
  'venture_traction': { 'scout': 1, 'sdr': 2 },
  'agency_lead': { 'sdr': 2, 'closer': 1 }
};

/**
 * Hook to parse URL parameters and initialize the Wizard state accordingly.
 * Supports deep linking (e.g., ?role=sdr&qty=2 or ?solution=venture_traction).
 */
export const useWizardUrlParser = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { resetWizard, setStep, updateCartItemQuantity, setSegment, setPreset } = useWizardStore();
  
  const hasParsed = useRef(false);

  useEffect(() => {
    // Prevent double parsing (e.g., in React Strict Mode) and check for null searchParams
    if (hasParsed.current || !searchParams) return;
    hasParsed.current = true;

    const role = searchParams.get('role');
    const qtyStr = searchParams.get('qty');
    const qty = parseInt(qtyStr || '1', 10);
    const solution = searchParams.get('solution');

    // Handle deep linking for a specific role
    if (typeof role === 'string') {
      resetWizard();
      setSegment('startup');
      setStep(3); // Jump directly to the Squad Builder step
      
      const prices: Record<string, number> = {
        'scout': 1200,
        'team-lead': 1500,
        'sdr': 3500,
        'closer': 5000,
      };
      
      updateCartItemQuantity(role, isNaN(qty) || qty < 1 ? 1 : qty, prices[role] || 0);
      
      // Clean up the URL by replacing it without search params
      router.replace(pathname || '/');
      
    } 
    // Handle deep linking for a specific solution preset
    else if (typeof solution === 'string') {
      resetWizard();
      setSegment('startup');
      setStep(3); // Jump directly to the Squad Builder step
      
      const presetRoles = PRESETS_MOCK[solution];
      if (presetRoles) {
        setPreset(solution, presetRoles);
      }
      
      // Clean up the URL by replacing it without search params
      router.replace(pathname || '/');
    }
  }, [searchParams, router, pathname, resetWizard, setStep, updateCartItemQuantity, setSegment, setPreset]);
};