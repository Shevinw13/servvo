'use client';

import { useCallback } from 'react';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { BrandConfig } from '@/types/brand';

export function useOnboarding() {
  const { state, dispatch } = useOnboardingContext();

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, [dispatch]);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, [dispatch]);

  const setStepData = useCallback(
    (data: Partial<BrandConfig>) => {
      dispatch({ type: 'SET_STEP_DATA', payload: data });
    },
    [dispatch]
  );

  const setCRMSelection = useCallback(
    (selections: string[]) => {
      dispatch({ type: 'SET_CRM_SELECTION', payload: selections });
    },
    [dispatch]
  );

  const complete = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
  }, [dispatch]);

  return {
    isComplete: state.isComplete,
    currentStep: state.currentStep,
    data: state.data,
    crmSelections: state.crmSelections,
    nextStep,
    prevStep,
    setStepData,
    setCRMSelection,
    complete,
  };
}
