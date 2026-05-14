import { BrandConfig } from '@/types/brand';
import { getTemplatesForTone } from './mockNotificationTemplates';

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  businessName: '',
  phone: '',
  email: '',
  logo: null,
  colors: {
    primary: '#2D4A2D',
    accent: '#5C8A4D',
  },
  typography: {
    fontPairingId: 'classic',
  },
  terminology: 'Provider',
  imageryStyle: 'natural',
  messagingTone: 'professional',
  notifications: {
    templates: getTemplatesForTone('professional'),
    autoReviewRequest: true,
    reviewRequestDelay: 24,
    autoRebooking: true,
  },
};
