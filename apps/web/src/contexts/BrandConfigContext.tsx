'use client';

import React, { createContext, useReducer, useContext } from 'react';
import { BrandConfig, ProviderTerminology, MessagingTone, NotificationSettings } from '@/types/brand';
import { DEFAULT_BRAND_CONFIG } from '@/data/defaults';
import { isValidHex } from '@/lib/colorUtils';

// --- State ---

export interface BrandConfigState {
  config: BrandConfig;
  isOnboarded: boolean;
}

// --- Actions ---

export type BrandConfigAction =
  | { type: 'SET_BUSINESS_INFO'; payload: { businessName: string; phone: string; email: string } }
  | { type: 'SET_LOGO'; payload: string | null }
  | { type: 'SET_COLORS'; payload: { primary: string; accent: string } }
  | { type: 'SET_TYPOGRAPHY'; payload: string }
  | { type: 'SET_TERMINOLOGY'; payload: ProviderTerminology }
  | { type: 'SET_IMAGERY_STYLE'; payload: string }
  | { type: 'SET_MESSAGING_TONE'; payload: MessagingTone }
  | { type: 'SET_NOTIFICATIONS'; payload: NotificationSettings }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'RESET' };

// --- Validation ---

const VALID_TERMINOLOGIES: ProviderTerminology[] = ['Provider', 'Crew', 'Team', 'Service Professional'];
const VALID_TONES: MessagingTone[] = ['professional', 'friendly', 'luxury', 'modern'];

export function isValidBrandConfig(config: unknown): config is BrandConfig {
  if (!config || typeof config !== 'object') return false;
  const c = config as Record<string, unknown>;

  if (typeof c.businessName !== 'string') return false;
  if (typeof c.phone !== 'string') return false;
  if (typeof c.email !== 'string') return false;
  if (c.logo !== null && typeof c.logo !== 'string') return false;

  const colors = c.colors as Record<string, unknown> | undefined;
  if (!colors || typeof colors !== 'object') return false;
  if (typeof colors.primary !== 'string' || !isValidHex(colors.primary)) return false;
  if (typeof colors.accent !== 'string' || !isValidHex(colors.accent)) return false;

  const typography = c.typography as Record<string, unknown> | undefined;
  if (!typography || typeof typography !== 'object') return false;
  if (typeof typography.fontPairingId !== 'string') return false;

  if (!VALID_TERMINOLOGIES.includes(c.terminology as ProviderTerminology)) return false;
  if (typeof c.imageryStyle !== 'string') return false;
  if (!VALID_TONES.includes(c.messagingTone as MessagingTone)) return false;

  const notifications = c.notifications as Record<string, unknown> | undefined;
  if (!notifications || typeof notifications !== 'object') return false;
  if (!Array.isArray(notifications.templates)) return false;
  if (typeof notifications.autoReviewRequest !== 'boolean') return false;
  if (typeof notifications.reviewRequestDelay !== 'number') return false;
  if (typeof notifications.autoRebooking !== 'boolean') return false;

  return true;
}

// --- Reducer ---

export function brandConfigReducer(state: BrandConfigState, action: BrandConfigAction): BrandConfigState {
  switch (action.type) {
    case 'SET_BUSINESS_INFO':
      return {
        ...state,
        config: {
          ...state.config,
          businessName: action.payload.businessName,
          phone: action.payload.phone,
          email: action.payload.email,
        },
      };
    case 'SET_LOGO':
      return {
        ...state,
        config: { ...state.config, logo: action.payload },
      };
    case 'SET_COLORS':
      return {
        ...state,
        config: {
          ...state.config,
          colors: { primary: action.payload.primary, accent: action.payload.accent },
        },
      };
    case 'SET_TYPOGRAPHY':
      return {
        ...state,
        config: {
          ...state.config,
          typography: { fontPairingId: action.payload },
        },
      };
    case 'SET_TERMINOLOGY':
      return {
        ...state,
        config: { ...state.config, terminology: action.payload },
      };
    case 'SET_IMAGERY_STYLE':
      return {
        ...state,
        config: { ...state.config, imageryStyle: action.payload },
      };
    case 'SET_MESSAGING_TONE':
      return {
        ...state,
        config: { ...state.config, messagingTone: action.payload },
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        config: { ...state.config, notifications: action.payload },
      };
    case 'SET_ONBOARDED':
      return { ...state, isOnboarded: action.payload };
    case 'RESET':
      return { config: DEFAULT_BRAND_CONFIG, isOnboarded: false };
    default:
      return state;
  }
}

// --- Context ---

interface BrandConfigContextValue {
  state: BrandConfigState;
  dispatch: React.Dispatch<BrandConfigAction>;
}

const BrandConfigContext = createContext<BrandConfigContextValue | undefined>(undefined);

// --- Provider ---

function initializeState(): BrandConfigState {
  return { config: DEFAULT_BRAND_CONFIG, isOnboarded: false };
}

export function BrandConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(brandConfigReducer, undefined, initializeState);

  return (
    <BrandConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </BrandConfigContext.Provider>
  );
}

// --- Hook ---

export function useBrandConfigContext(): BrandConfigContextValue {
  const context = useContext(BrandConfigContext);
  if (!context) {
    throw new Error('useBrandConfigContext must be used within a BrandConfigProvider');
  }
  return context;
}
