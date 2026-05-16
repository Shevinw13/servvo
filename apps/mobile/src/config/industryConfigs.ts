/**
 * Industry configuration registry.
 * Central lookup for all supported industry verticals.
 */

import { IndustryVertical, IndustryConfig } from './industry.types';
import { lawnCareConfig } from './verticals/lawnCare';
import { hvacConfig } from './verticals/hvac';
import { pestControlConfig } from './verticals/pestControl';

const INDUSTRY_REGISTRY: Record<IndustryVertical, IndustryConfig> = {
  lawn_care: lawnCareConfig,
  hvac: hvacConfig,
  pest_control: pestControlConfig,
};

/**
 * Returns the complete IndustryConfig for a given vertical.
 * Throws if an unsupported vertical is provided.
 */
export function getIndustryConfig(vertical: IndustryVertical): IndustryConfig {
  const config = INDUSTRY_REGISTRY[vertical];
  if (!config) {
    throw new Error(`Unsupported industry vertical: ${vertical}`);
  }
  return config;
}

/** Returns all available industry verticals for the demo switcher */
export function getAvailableVerticals(): IndustryVertical[] {
  return Object.keys(INDUSTRY_REGISTRY) as IndustryVertical[];
}
