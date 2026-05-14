'use client';

import React, { createContext, useReducer, useContext } from 'react';
import { OnboardingState } from '@/types/onboarding';
import { BrandConfig } from '@/types/brand';

// --- Actions ---

export type OnboardingAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP_DATA'; payload: Partial<BrandConfig> }
  | { type: 'SET_CRM_SELECTION'; payload: string[] }
  | { type: 'COMPLETE' };

// --- Reducer ---

const TOTAL_STEPS = 9;

export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case 'SET_STEP_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'SET_CRM_SELECTION':
      return {
        ...state,
        crmSelections: action.payload,
      };
    case 'COMPLETE':
      return {
        ...state,
        isComplete: true,
      };
    default:
      return state;
  }
}

// --- Context ---

interface OnboardingContextValue {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

// --- Provider ---

const initialState: OnboardingState = {
  isComplete: false,
  currentStep: 0,
  data: {},
  crmSelections: [],
};

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// --- Hook ---

export function useOnboardingContext(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
}
