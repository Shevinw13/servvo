/**
 * Unit tests for the brand config Zustand store.
 */

import { useBrandStore } from '@/stores/brandStore';
import { BrandConfig } from '@/theme/tokens';

const mockBrandConfig: BrandConfig = {
  businessId: 'biz-123',
  logo: 'https://s3.example.com/logo.png',
  colors: {
    primary: '#FF0000',
    accent: '#00FF00',
  },
  terminology: {
    serviceProvider: 'Crew',
  },
  imagery: {
    onboarding: ['https://s3.example.com/onboard1.png'],
    dashboard: 'https://s3.example.com/dashboard.png',
  },
};

describe('brandStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useBrandStore.setState({
      brandConfig: null,
      isLoaded: false,
    });
  });

  it('should start with null brandConfig and isLoaded false', () => {
    const state = useBrandStore.getState();
    expect(state.brandConfig).toBeNull();
    expect(state.isLoaded).toBe(false);
  });

  it('should set brand config and mark as loaded', () => {
    useBrandStore.getState().setBrandConfig(mockBrandConfig);

    const state = useBrandStore.getState();
    expect(state.brandConfig).toEqual(mockBrandConfig);
    expect(state.isLoaded).toBe(true);
  });

  it('should clear brand config and reset isLoaded', () => {
    useBrandStore.getState().setBrandConfig(mockBrandConfig);
    useBrandStore.getState().clearBrandConfig();

    const state = useBrandStore.getState();
    expect(state.brandConfig).toBeNull();
    expect(state.isLoaded).toBe(false);
  });

  it('should allow updating brand config after initial set', () => {
    useBrandStore.getState().setBrandConfig(mockBrandConfig);

    const updatedConfig: BrandConfig = {
      ...mockBrandConfig,
      colors: { primary: '#0000FF', accent: '#FFFF00' },
    };
    useBrandStore.getState().setBrandConfig(updatedConfig);

    const state = useBrandStore.getState();
    expect(state.brandConfig?.colors.primary).toBe('#0000FF');
    expect(state.isLoaded).toBe(true);
  });
});
