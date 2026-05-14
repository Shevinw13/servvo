import { ProviderTerminology } from '@/types/brand';

/**
 * Replaces {{provider}} placeholders in a template string with the
 * configured terminology value.
 */
export function resolveTerminology(template: string, terminology: ProviderTerminology): string {
  return template
    .replace(/\{\{provider\}\}/gi, terminology)
    .replace(/\{\{Provider\}\}/g, terminology)
    .replace(/\{\{PROVIDER\}\}/g, terminology.toUpperCase());
}

/**
 * Returns the plural form of the terminology.
 */
export function pluralizeTerminology(terminology: ProviderTerminology): string {
  switch (terminology) {
    case 'Provider':
      return 'Providers';
    case 'Crew':
      return 'Crews';
    case 'Team':
      return 'Teams';
    case 'Service Professional':
      return 'Service Professionals';
  }
}

/**
 * Returns a possessive form of the terminology.
 */
export function possessiveTerminology(terminology: ProviderTerminology): string {
  if (terminology === 'Service Professional') {
    return "Service Professional's";
  }
  return `${terminology}'s`;
}
