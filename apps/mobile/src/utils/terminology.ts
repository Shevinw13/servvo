/**
 * Terminology resolver utility.
 * Resolves Service_Professional references from brand config terminology,
 * replacing template placeholders with the configured term.
 *
 * Validates: Requirements 3.4
 */

import { useTheme } from '../theme/BrandThemeProvider';

export interface Terminology {
  serviceProvider: string;
}

/**
 * Replaces {{provider}} / {{serviceProvider}} placeholders in a template string
 * with the configured terminology value.
 *
 * Handles case variations:
 * - {{provider}} / {{serviceProvider}} → as-is (e.g. "Crew")
 * - {{Provider}} / {{ServiceProvider}} → capitalized first letter (e.g. "Crew")
 * - {{PROVIDER}} / {{SERVICEPROVIDER}} → uppercase (e.g. "CREW")
 */
export function resolveTerminology(
  template: string,
  terminology: Terminology,
): string {
  const term = terminology.serviceProvider;

  return template
    // Uppercase variants: {{PROVIDER}} or {{SERVICEPROVIDER}}
    .replace(/\{\{PROVIDER\}\}/g, term.toUpperCase())
    .replace(/\{\{SERVICEPROVIDER\}\}/g, term.toUpperCase())
    // Capitalized variants: {{Provider}} or {{ServiceProvider}}
    .replace(/\{\{Provider\}\}/g, capitalize(term))
    .replace(/\{\{ServiceProvider\}\}/g, capitalize(term))
    // Lowercase variants: {{provider}} or {{serviceProvider}}
    .replace(/\{\{provider\}\}/g, term)
    .replace(/\{\{serviceProvider\}\}/g, term);
}

/**
 * Hook that returns a `resolve` function pre-bound to the current theme terminology.
 *
 * Usage:
 *   const { resolve } = useTerminology();
 *   resolve("Your {{provider}} is on the way"); // "Your Crew is on the way"
 */
export function useTerminology(): { resolve: (template: string) => string } {
  const theme = useTheme();

  const resolve = (template: string): string =>
    resolveTerminology(template, theme.terminology);

  return { resolve };
}

/**
 * Pre-defined message templates using terminology placeholders.
 */
export const MESSAGES = {
  PROVIDER_ON_WAY: 'Your {{provider}} is on the way',
  PROVIDER_ARRIVED: 'Your {{provider}} has arrived',
  SERVICE_COMPLETED: 'Your {{provider}} has completed your service',
  PROVIDER_ASSIGNED: 'A {{provider}} has been assigned to your service',
};

/** Capitalize the first letter of a string */
function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
