/**
 * Interface defining the structure of an individual fractional role available in the wizard.
 */
export interface RoleConfig {
  id: string;
  title: string;
  description: string;
  pricePerUnit: number;
}

/**
 * Master list of all available roles and their base monthly pricing.
 */
export const AVAILABLE_ROLES: RoleConfig[] = [
  {
    id: 'scout',
    title: 'Fractional Scout',
    description: 'Database scraping, CRM hygiene, contact enrichment.',
    pricePerUnit: 1200
  },
  {
    id: 'sdr',
    title: 'Fractional SDR',
    description: 'Sequence scaling, LinkedIn outreach, demo booking.',
    pricePerUnit: 3500
  },
  {
    id: 'closer',
    title: 'Fractional Closer',
    description: 'MEDDIC qualification, high-ticket demo closing.',
    pricePerUnit: 5000
  },
  {
    id: 'team-lead',
    title: 'Fractional Team Lead',
    description: 'RevOps control, daily syncs, call auditing.',
    pricePerUnit: 1500
  }
];