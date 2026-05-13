/**
 * Zustand store for managing the current business's BrandConfig.
 * Holds the brand configuration fetched from the backend and provides
 * actions to set/clear it.
 */

import { create } from 'zustand';
import { BrandConfig } from '../theme/tokens';

export interface BrandStoreState {
  /** The current brand configuration, or null if not yet loaded */
  brandConfig: BrandConfig | null;
  /** Whether the brand config has been loaded (even if it resolved to null/default) */
  isLoaded: boolean;
  /** Set the brand configuration */
  setBrandConfig: (config: BrandConfig) => void;
  /** Clear the brand configuration (revert to defaults) */
  clearBrandConfig: () => void;
}

export const useBrandStore = create<BrandStoreState>((set) => ({
  brandConfig: null,
  isLoaded: false,
  setBrandConfig: (config: BrandConfig) =>
    set({ brandConfig: config, isLoaded: true }),
  clearBrandConfig: () =>
    set({ brandConfig: null, isLoaded: false }),
}));
