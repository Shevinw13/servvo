/**
 * BrandThemeProvider — React context provider that resolves the current theme
 * by merging the brand config (if available) into the default theme.
 *
 * Usage:
 *   <BrandThemeProvider>
 *     <App />
 *   </BrandThemeProvider>
 *
 * Consumers access the resolved theme via the useTheme() hook.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useBrandStore } from '../stores/brandStore';
import { applyBrandConfig, defaultTheme, Theme } from './defaultTheme';

const ThemeContext = createContext<Theme>(defaultTheme);

export interface BrandThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provides the resolved Theme to the component tree.
 * If a BrandConfig is present in the store, it merges brand colors/terminology
 * into the theme. Otherwise, the default Servvo theme is used.
 */
export function BrandThemeProvider({ children }: BrandThemeProviderProps) {
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const theme = useMemo<Theme>(() => {
    if (brandConfig) {
      return applyBrandConfig(brandConfig);
    }
    return defaultTheme;
  }, [brandConfig]);

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
