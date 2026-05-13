/**
 * Unit tests for the useBrandConfig hook.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { useBrandStore } from '@/stores/brandStore';
import { BrandConfig } from '@/theme/tokens';

const mockBrandConfig: BrandConfig = {
  businessId: 'biz-456',
  logo: 'https://s3.example.com/logo.png',
  colors: {
    primary: '#123456',
    accent: '#654321',
  },
  terminology: {
    serviceProvider: 'Team',
  },
  imagery: {
    onboarding: ['https://s3.example.com/onboard.png'],
    dashboard: 'https://s3.example.com/dash.png',
  },
};

describe('useBrandConfig', () => {
  beforeEach(() => {
    useBrandStore.setState({
      brandConfig: null,
      isLoaded: false,
    });
  });

  it('should return null brandConfig and isLoaded false initially', () => {
    const { result } = renderHook(() => useBrandConfig());

    expect(result.current.brandConfig).toBeNull();
    expect(result.current.isLoaded).toBe(false);
  });

  it('should reflect store state after setBrandConfig', () => {
    const { result } = renderHook(() => useBrandConfig());

    act(() => {
      result.current.setBrandConfig(mockBrandConfig);
    });

    expect(result.current.brandConfig).toEqual(mockBrandConfig);
    expect(result.current.isLoaded).toBe(true);
  });

  it('should reflect store state after clearBrandConfig', () => {
    const { result } = renderHook(() => useBrandConfig());

    act(() => {
      result.current.setBrandConfig(mockBrandConfig);
    });
    act(() => {
      result.current.clearBrandConfig();
    });

    expect(result.current.brandConfig).toBeNull();
    expect(result.current.isLoaded).toBe(false);
  });
});
