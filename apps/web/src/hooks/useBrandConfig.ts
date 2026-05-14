'use client';

import { useCallback } from 'react';
import { useBrandConfigContext, BrandConfigAction } from '@/contexts/BrandConfigContext';
import { BrandConfig, ProviderTerminology, MessagingTone, NotificationSettings } from '@/types/brand';

export function useBrandConfig() {
  const { state, dispatch } = useBrandConfigContext();

  const setBusinessInfo = useCallback(
    (businessName: string, phone: string, email: string) => {
      dispatch({ type: 'SET_BUSINESS_INFO', payload: { businessName, phone, email } });
    },
    [dispatch]
  );

  const setLogo = useCallback(
    (logo: string | null) => {
      dispatch({ type: 'SET_LOGO', payload: logo });
    },
    [dispatch]
  );

  const setColors = useCallback(
    (primary: string, accent: string) => {
      dispatch({ type: 'SET_COLORS', payload: { primary, accent } });
    },
    [dispatch]
  );

  const setTypography = useCallback(
    (fontPairingId: string) => {
      dispatch({ type: 'SET_TYPOGRAPHY', payload: fontPairingId });
    },
    [dispatch]
  );

  const setTerminology = useCallback(
    (terminology: ProviderTerminology) => {
      dispatch({ type: 'SET_TERMINOLOGY', payload: terminology });
    },
    [dispatch]
  );

  const setImageryStyle = useCallback(
    (style: string) => {
      dispatch({ type: 'SET_IMAGERY_STYLE', payload: style });
    },
    [dispatch]
  );

  const setMessagingTone = useCallback(
    (tone: MessagingTone) => {
      dispatch({ type: 'SET_MESSAGING_TONE', payload: tone });
    },
    [dispatch]
  );

  const setNotifications = useCallback(
    (notifications: NotificationSettings) => {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    },
    [dispatch]
  );

  const setOnboarded = useCallback(
    (isOnboarded: boolean) => {
      dispatch({ type: 'SET_ONBOARDED', payload: isOnboarded });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return {
    config: state.config,
    isOnboarded: state.isOnboarded,
    dispatch,
    setBusinessInfo,
    setLogo,
    setColors,
    setTypography,
    setTerminology,
    setImageryStyle,
    setMessagingTone,
    setNotifications,
    setOnboarded,
    reset,
  };
}
