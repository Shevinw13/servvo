/**
 * Hook for accessing the current BrandConfig and its loading state.
 * Components use this to check branding availability or read brand-specific values.
 *
 * Note: Actual API fetching of the brand config is handled elsewhere;
 * this hook provides read access to the store state.
 */

import { BrandConfig } from '../theme/tokens';
import { useBrandStore } from '../stores/brandStore';

export interface UseBrandConfigResult {
  /** The current brand config, or null if not loaded or unavailable */
  brandConfig: BrandConfig | null;
  /** Whether the brand config loading process has completed */
  isLoaded: boolean;
  /** Set a new brand config (e.g., after fetching from API) */
  setBrandConfig: (config: BrandConfig) => void;
  /** Clear the brand config (revert to defaults) */
  clearBrandConfig: () => void;
}

/**
 * Returns the current brand configuration state and actions.
 */
export function useBrandConfig(): UseBrandConfigResult {
  const brandConfig = useBrandStore((state) => state.brandConfig);
  const isLoaded = useBrandStore((state) => state.isLoaded);
  const setBrandConfig = useBrandStore((state) => state.setBrandConfig);
  const clearBrandConfig = useBrandStore((state) => state.clearBrandConfig);

  return {
    brandConfig,
    isLoaded,
    setBrandConfig,
    clearBrandConfig,
  };
}
