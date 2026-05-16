/**
 * BrandThemeProvider — React context provider that resolves the current theme
 * by merging industry config and brand config into the default theme.
 *
 * Resolution order:
 * 1. buildIndustryTheme(industryConfig) — base industry theme
 * 2. BrandConfig overrides (if present) — portal brand colors on top
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useBrandStore } from '../stores/brandStore';
import { useIndustryStore } from '../stores/industryStore';
import { defaultTheme, Theme } from './defaultTheme';
import { buildIndustryTheme } from '../config/buildIndustryTheme';

const ThemeContext = createContext<Theme>(defaultTheme);

export interface BrandThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provides the resolved Theme to the component tree.
 * Industry config is applied first, then BrandConfig overrides layer on top.
 */
export function BrandThemeProvider({ children }: BrandThemeProviderProps) {
  const brandConfig = useBrandStore((state) => state.brandConfig);
  const industryConfig = useIndustryStore((state) => state.config);

  const theme = useMemo<Theme>(() => {
    // Industry config takes precedence as the primary theming mechanism
    let resolved = buildIndustryTheme(industryConfig);

    if (brandConfig) {
      // Portal brand overrides layer on top of industry defaults
      resolved = {
        ...resolved,
        tokens: {
          ...resolved.tokens,
          colors: {
            ...resolved.tokens.colors,
            primary: brandConfig.colors.primary,
            accent: brandConfig.colors.accent,
          },
        },
        terminology: {
          serviceProvider: brandConfig.terminology.serviceProvider,
        },
      };
    }

    return resolved;
  }, [brandConfig, industryConfig]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to consume the current resolved theme from the nearest BrandThemeProvider.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
