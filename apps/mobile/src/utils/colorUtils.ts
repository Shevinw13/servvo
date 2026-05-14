/**
 * Color utility functions for the Servvo design system.
 * Handles hex-to-rgba conversion, darkening, and WCAG contrast ratio computation.
 */

/**
 * Converts a hex color (#RRGGBB) to an rgba string with the given opacity.
 * If the hex is invalid, returns it unchanged.
 */
export function withOpacity(hexColor: string, opacity: number): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Darkens a hex color by a percentage (0-1).
 * amount=0.1 means 10% darker.
 * If the hex is invalid, returns it unchanged.
 */
export function darken(hexColor: string, amount: number): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const r = Math.max(0, Math.round(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)));

  return rgbToHex(r, g, b);
}

/**
 * Computes the WCAG contrast ratio between two hex colors.
 * Returns a value between 1 and 21.
 */
export function contrastRatio(foreground: string, background: string): number {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 1;

  const fgLuminance = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

// --- Internal helpers ---

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#([0-9A-Fa-f]{6})$/);
  if (!match) return null;

  const value = match[1];
  return {
    r: parseInt(value.substring(0, 2), 16),
    g: parseInt(value.substring(2, 4), 16),
    b: parseInt(value.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
