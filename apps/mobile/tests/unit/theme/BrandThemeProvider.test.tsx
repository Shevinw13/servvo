/**
 * Unit tests for BrandThemeProvider and useTheme hook.
 */

import React from 'react';
import { Text } from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { BrandThemeProvider, useTheme } from '@/theme/BrandThemeProvider';
import { useBrandStore } from '@/stores/brandStore';
import { defaultTheme } from '@/theme/defaultTheme';
import { BrandConfig } from '@/theme/tokens';

const mockBrandConfig: BrandConfig = {
  businessId: 'biz-789',
  logo: 'https://s3.example.com/logo.png',
  colors: {
    primary: '#AA0000',
    accent: '#00AA00',
  },
  terminology: {
    serviceProvider: 'Provider',
  },
  imagery: {
    onboarding: ['https://s3.example.com/onboard.png'],
    dashboard: 'https://s3.example.com/dash.png',
  },
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <BrandThemeProvider>{children}</BrandThemeProvider>;
}

describe('BrandThemeProvider', () => {
  beforeEach(() => {
    useBrandStore.setState({
      brandConfig: null,
      isLoaded: false,
    });
  });

  it('should provide defaultTheme when no brand config is set', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toEqual(defaultTheme);
  });

  it('should provide branded theme when brand config is set', () => {
    useBrandStore.setState({
      brandConfig: mockBrandConfig,
      isLoaded: true,
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.tokens.colors.primary).toBe('#AA0000');
    expect(result.current.tokens.colors.accent).toBe('#00AA00');
    expect(result.current.terminology.serviceProvider).toBe('Provider');
  });

  it('should preserve non-overridden token values when brand config is applied', () => {
    useBrandStore.setState({
      brandConfig: mockBrandConfig,
      isLoaded: true,
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Non-overridden colors should remain from defaults
    expect(result.current.tokens.colors.background).toBe(defaultTheme.tokens.colors.background);
    expect(result.current.tokens.colors.error).toBe(defaultTheme.tokens.colors.error);
    // Spacing, typography, etc. should be unchanged
    expect(result.current.tokens.spacing).toEqual(defaultTheme.tokens.spacing);
    expect(result.current.tokens.typography).toEqual(defaultTheme.tokens.typography);
  });
});
