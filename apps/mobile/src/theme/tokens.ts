/**
 * Design tokens for the Servvo customer app.
 * Warm, earthy, organic editorial aesthetic — premium lifestyle lawn care brand.
 * Brand config can override primary/accent colors at runtime.
 */

export const defaultTokens = {
  colors: {
    primary: '#2D4A2D', // Dark forest green
    primaryLight: '#3D6B3D', // Lighter forest green
    accent: '#5C8A4D', // Sage/olive green
    accentLight: '#8FB87A', // Light sage
    background: '#FAFAF5', // Warm cream/off-white
    surface: '#FFFFFF', // White cards
    surfaceElevated: '#FFFFFF',
    text: '#1A1A1A', // Near black
    textSecondary: '#5C5C5C', // Dark gray
    textMuted: '#8C8C8C', // Medium gray
    border: '#E8E5E0', // Warm light border
    error: '#C53030', // Muted red
    success: '#2D6A2D', // Forest green (same family as primary)
    warning: '#B7791F', // Warm amber
  },
  gradients: {
    heroOverlay: ['transparent', 'rgba(250, 250, 245, 0.0)', 'rgba(250, 250, 245, 0.85)', '#FAFAF5'],
    buttonPrimary: ['#2D4A2D', '#264026'],
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
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.06,
    },
    md: {
      elevation: 4,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      shadowOpacity: 0.08,
    },
    lg: {
      elevation: 10,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 28,
      shadowOpacity: 0.14,
    },
  },
  typography: {
    display: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44 },
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    subtitle: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20, letterSpacing: 0.5 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodyEmphasis: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
    bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
    button: { fontSize: 17, fontWeight: '600' as const, lineHeight: 20, letterSpacing: 0.3 },
    displayNumber: { fontSize: 32, fontWeight: '300' as const, lineHeight: 40 },
  },
  animation: {
    press: { scale: 0.98, opacity: 0.7, duration: 100 },
    buttonPress: { scaleIn: 0.96, durationIn: 150, durationOut: 200 },
    skeleton: { opacityMin: 0.3, opacityMax: 0.7, duration: 1200 },
    entrance: { initialScale: 0.8, duration: 300 },
    transition: { duration: 300 },
    success: { duration: 400 },
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
export type GradientTokens = typeof defaultTokens.gradients;
export type AnimationTokens = typeof defaultTokens.animation;
