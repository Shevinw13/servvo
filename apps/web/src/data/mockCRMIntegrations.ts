import { CRMIntegration } from '@/types/crm';

export const MOCK_CRM_INTEGRATIONS: CRMIntegration[] = [
  {
    id: 'jobber',
    name: 'Jobber',
    description: 'Field service management software for scheduling, invoicing, and client management. Popular with lawn care and landscaping businesses.',
    logoUrl: '/images/crm-logos/jobber.png',
  },
  {
    id: 'housecall-pro',
    name: 'Housecall Pro',
    description: 'All-in-one business solution for home service professionals. Manage dispatching, invoicing, and customer communications.',
    logoUrl: '/images/crm-logos/housecall-pro.png',
  },
  {
    id: 'servicetitan',
    name: 'ServiceTitan',
    description: 'Enterprise-grade platform for managing residential and commercial field service operations at scale.',
    logoUrl: '/images/crm-logos/servicetitan.png',
  },
];
