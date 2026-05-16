/**
 * Builds a Theme object from an IndustryConfig by merging industry-specific
 * colors and gradients over the default design tokens.
 */

import { defaultTokens, DesignTokens } from '@/theme/tokens';
import { Theme } from '@/theme/defaultTheme';
import { IndustryConfig } from './industry.types';

export function buildIndustryTheme(config: IndustryConfig): Theme {
  const tokens: DesignTokens = {
    ...defaultTokens,
    colors: {
      ...defaultTokens.colors,
      primary: config.colors.primary,
      primaryLight: config.colors.primaryLight,
      accent: config.colors.accent,
      accentLight: config.colors.accentLight,
      background: config.colors.background,
      success: config.colors.success,
      warning: config.colors.warning,
    },
    gradients: {
      heroOverlay: config.gradients.heroOverlay,
      buttonPrimary: config.gradients.buttonPrimary,
    },
  };

  return {
    tokens,
    terminology: {
      serviceProvider: config.terminology.serviceProvider,
    },
  };
}
