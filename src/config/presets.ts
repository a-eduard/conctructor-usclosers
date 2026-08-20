/**
 * Represents a specific role and its required quantity within a preset configuration.
 */
export interface PresetRole {
  roleId: string;
  quantity: number;
  pricePerUnit: number;
}

/**
 * Interface defining a pre-packaged team setup (preset) available in the wizard.
 */
export interface PresetConfig {
  id: string;
  title: string;
  description: string;
  category: 'solution' | 'unit';
  roles: PresetRole[];
}

/**
 * Master list of pre-configured team setups. 
 * 'solution' category is for business outcomes, 'unit' category is for structural blocks.
 */
export const WIZARD_PRESETS: Record<string, PresetConfig> = {
  venture_traction: {
    id: 'venture_traction',
    title: 'Venture Traction Engine',
    description: 'For startups raising a round. Fast validation and meeting generation.',
    category: 'solution',
    roles: [
      { roleId: 'scout', quantity: 1, pricePerUnit: 1200 },
      { roleId: 'sdr', quantity: 2, pricePerUnit: 3500 }
    ]
  },
  agency_lead: {
    id: 'agency_lead',
    title: 'Agency Lead Machine',
    description: 'For agencies. Constant flow of leads.',
    category: 'solution',
    roles: [
      { roleId: 'sdr', quantity: 2, pricePerUnit: 3500 },
      { roleId: 'closer', quantity: 1, pricePerUnit: 5000 }
    ]
  },
  founder_exit: {
    id: 'founder_exit',
    title: 'Founder Exit',
    description: 'Founder exit from sales routine.',
    category: 'solution',
    roles: [
      { roleId: 'team-lead', quantity: 1, pricePerUnit: 1500 },
      { roleId: 'sdr', quantity: 1, pricePerUnit: 3500 },
      { roleId: 'closer', quantity: 1, pricePerUnit: 5000 }
    ]
  },
  starter_unit: {
    id: 'starter_unit',
    title: 'Starter Unit',
    description: 'Basic sales combo.',
    category: 'unit',
    roles: [
      { roleId: 'sdr', quantity: 1, pricePerUnit: 3500 }
    ]
  },
  revenue_factory: {
    id: 'revenue_factory',
    title: 'Revenue Factory',
    description: 'Scaled revenue operations.',
    category: 'unit',
    roles: [
      { roleId: 'team-lead', quantity: 1, pricePerUnit: 1500 },
      { roleId: 'sdr', quantity: 3, pricePerUnit: 3500 },
      { roleId: 'closer', quantity: 2, pricePerUnit: 5000 }
    ]
  }
};