/**
 * Default theme for the Servvo customer app.
 * Provides a complete theme object using default tokens that can be
 * overridden by a business's BrandConfig at runtime.
 */

import { BrandConfig, defaultTokens, DesignTokens } from './tokens';

/** The complete theme shape used throughout the app */
export interface Theme {
  tokens: DesignTokens;
  terminology: {
    serviceProvider: string;
  };
}

/** Default terminology when no brand config is available */
const DEFAULT_TERMINOLOGY = {
  serviceProvider: 'Service Professional',
};

/** The default theme using Servvo's base design tokens */
export const defaultTheme: Theme = {
  tokens: defaultTokens,
  terminology: DEFAULT_TERMINOLOGY,
};

/**
 * Merges a BrandConfig into the default theme, overriding primary/accent colors
 * and terminology while preserving all other token values.
 */
export function applyBrandConfig(brandConfig: BrandConfig): Theme {
  return {
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: brandConfig.colors.primary,
        accent: brandConfig.colors.accent,
      },
    },
    terminology: {
      serviceProvider: brandConfig.terminology.serviceProvider,
    },
  };
}
