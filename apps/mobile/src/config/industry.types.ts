/**
 * Industry configuration type system for Servvo multi-vertical support.
 * Defines the complete shape of per-industry configuration objects.
 */

/** Supported industry verticals */
export type IndustryVertical = 'lawn_care' | 'hvac' | 'pest_control';

/** Color palette override per industry */
export interface IndustryColors {
  primary: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  background: string;
  success: string;
  warning: string;
}

/** Gradient overrides per industry */
export interface IndustryGradients {
  heroOverlay: string[];
  buttonPrimary: string[];
}

/** Hero section configuration */
export interface IndustryHero {
  /** Greeting suffix — replaces the evening greeting in buildGreeting */
  greetingLine: string;
  /** Hero background image — URI string or local require() asset */
  imageUri: string | number;
}

/** A single property insight card definition */
export interface InsightCardConfig {
  id: string;
  icon: string; // Feather icon name
  iconColor: string;
  label: string;
  /** Static display value for mock/demo */
  value: string;
  /** Optional background tint */
  backgroundTint?: string;
}

/** Appointment/service type definition */
export interface ServiceTypeConfig {
  id: string;
  name: string;
  /** Default duration in minutes */
  duration: number;
}

/** A single activity event for mock data */
export interface IndustryEvent {
  id: string;
  title: string;
  timestamp: Date;
  status: 'completed' | 'scheduled';
}

/** Seasonal tips mapped by month (1-12) */
export type SeasonalTipsMap = Record<number, string>;

/** The complete industry configuration object */
export interface IndustryConfig {
  vertical: IndustryVertical;
  displayName: string;

  /** Theme overrides */
  colors: IndustryColors;
  gradients: IndustryGradients;

  /** Terminology */
  terminology: {
    serviceProvider: string;
    propertyNoun: string;
    serviceNoun: string;
  };

  /** Hero section */
  hero: IndustryHero;

  /** Property insight cards (exactly 3) */
  insightCards: [InsightCardConfig, InsightCardConfig, InsightCardConfig];

  /** Available service types for this industry */
  serviceTypes: ServiceTypeConfig[];

  /** Mock appointment for demo */
  mockAppointment: {
    serviceType: string;
    providerName: string;
    providerAvatarUri?: string;
    date: string;
    time: string;
  };

  /** Mock activity events */
  mockEvents: IndustryEvent[];

  /** Seasonal tips by month */
  seasonalTips: SeasonalTipsMap;
}
