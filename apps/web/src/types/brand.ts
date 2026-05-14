export type ProviderTerminology = 'Provider' | 'Crew' | 'Team' | 'Service Professional';
export type MessagingTone = 'professional' | 'friendly' | 'luxury' | 'modern';

export interface NotificationTemplate {
  id: string;
  type: 'appointment_confirmation' | 'service_in_progress' | 'service_complete' | 'review_request';
  subject: string;
  body: string;
}

export interface NotificationSettings {
  templates: NotificationTemplate[];
  autoReviewRequest: boolean;
  reviewRequestDelay: number;
  autoRebooking: boolean;
}

export interface BrandConfig {
  businessName: string;
  phone: string;
  email: string;
  logo: string | null;
  colors: { primary: string; accent: string };
  typography: { fontPairingId: string };
  terminology: ProviderTerminology;
  imageryStyle: string;
  messagingTone: MessagingTone;
  notifications: NotificationSettings;
}
