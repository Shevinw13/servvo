/**
 * Design tokens for the Servvo customer app.
 * These define the visual language: colors, spacing, border radii, shadows, and typography.
 * Brand config can override primary/accent colors at runtime.
 */

export const defaultTokens = {
  colors: {
    primary: '#1B365D', // Deep blue
    primaryLight: '#2A4A7F',
    accent: '#4CAF50', // Green
    accentLight: '#81C784',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      elevation: 2,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      shadowOpacity: 0.08,
    },
    md: {
      elevation: 4,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.12,
    },
    lg: {
      elevation: 8,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      shadowOpacity: 0.15,
    },
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
    h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
    bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
  },
};

/**
 * Brand configuration interface.
 * Each business can override colors, terminology, and imagery.
 */
export interface BrandConfig {
  businessId: string;
  logo: string; // S3 URL
  colors: {
    primary: string;
    accent: string;
  };
  terminology: {
    serviceProvider: string; // "Provider" | "Crew" | "Team" | "Service Professional"
  };
  imagery: {
    onboarding: string[]; // S3 URLs
    dashboard: string; // S3 URL
  };
}

/** Type derived from the default tokens structure */
export type DesignTokens = typeof defaultTokens;
export type ColorTokens = typeof defaultTokens.colors;
export type SpacingTokens = typeof defaultTokens.spacing;
export type BorderRadiusTokens = typeof defaultTokens.borderRadius;
export type ShadowTokens = typeof defaultTokens.shadows;
export type TypographyTokens = typeof defaultTokens.typography;
