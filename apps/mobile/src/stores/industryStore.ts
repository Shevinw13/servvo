/**
 * Zustand store for managing the active industry vertical.
 * Holds the current vertical identifier and its resolved IndustryConfig.
 */

import { create } from 'zustand';
import { IndustryVertical, IndustryConfig } from '@/config/industry.types';
import { getIndustryConfig } from '@/config/industryConfigs';

export interface IndustryStoreState {
  /** The currently active industry vertical */
  currentVertical: IndustryVertical;
  /** The resolved config for the current vertical */
  config: IndustryConfig;
  /** Switch to a different industry vertical */
  setIndustry: (vertical: IndustryVertical) => void;
}

export const useIndustryStore = create<IndustryStoreState>((set) => ({
  currentVertical: 'lawn_care',
  config: getIndustryConfig('lawn_care'),
  setIndustry: (vertical: IndustryVertical) =>
    set({
      currentVertical: vertical,
      config: getIndustryConfig(vertical),
    }),
}));
