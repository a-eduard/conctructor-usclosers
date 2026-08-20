/**
 * Defines the size or type of the client's business.
 * Used to tailor the presets and recommendations in the wizard.
 */
export type ClientSegment = 'startup' | 'smb' | 'enterprise';

/**
 * Represents a single role added to the wizard cart.
 */
export interface CartItem {
  roleId: string;
  quantity: number;
  pricePerUnit: number;
}

/**
 * Global state interface for the Setup Wizard (Zustand Store).
 */
export interface WizardState {
  // State
  currentStep: number;
  maxSteps: number;
  segment: ClientSegment | null;
  chosenPresetId: string | null;
  cart: Record<string, CartItem>;
  infrastructure: {
    salesOpsCloudIncluded: boolean;
    basePrice: number;
    perSeatPrice: number;
  };

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSegment: (segment: ClientSegment | null) => void;
  setPreset: (presetId: string | null, items: Record<string, number>) => void;
  updateCartItemQuantity: (roleId: string, quantity: number, pricePerUnit: number) => void;
  resetWizard: () => void;
}

/**
 * Global mapping of role IDs to their readable display names.
 */
export const ROLE_NAMES: Record<string, string> = {
  'scout': 'Fractional Scout',
  'team-lead': 'Sales Team Lead',
  'sdr': 'Fractional SDR',
  'closer': 'Fractional Closer'
};