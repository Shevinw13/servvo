/**
 * Shared fast-check arbitraries for mobile property-based tests.
 * Re-exports backend generators where applicable and adds mobile-specific ones.
 */
import * as fc from 'fast-check';

/**
 * Generates a random valid brand configuration for theming tests.
 */
export function arbitraryBrandConfig() {
  const hexColor = fc.string({ minLength: 6, maxLength: 6 }).map((s) => `#${s.replace(/[^0-9a-fA-F]/g, '0')}`);

  return fc.record({
    businessId: fc.uuid(),
    logo: fc.webUrl(),
    colors: fc.record({
      primary: hexColor,
      accent: hexColor,
    }),
    terminology: fc.record({
      serviceProvider: fc.constantFrom('Provider', 'Crew', 'Team', 'Service Professional'),
    }),
    imagery: fc.record({
      onboarding: fc.array(fc.webUrl(), { minLength: 1, maxLength: 3 }),
      dashboard: fc.webUrl(),
    }),
  });
}

/**
 * Generates a random valid appointment for UI rendering tests.
 */
export function arbitraryAppointment() {
  return fc.record({
    id: fc.uuid(),
    serviceType: fc.constantFrom('mowing', 'fertilization', 'aeration', 'leaf_removal', 'landscaping'),
    status: fc.constantFrom(
      'scheduled',
      'provider_assigned',
      'on_the_way',
      'arrived',
      'in_progress',
      'completed',
      'cancelled',
    ),
    scheduledDate: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
    providerName: fc.string({ minLength: 1, maxLength: 50 }),
    durationMinutes: fc.integer({ min: 15, max: 480 }),
  });
}

/**
 * Generates a random valid message for rendering tests.
 */
export function arbitraryMessage() {
  return fc.record({
    id: fc.uuid(),
    senderType: fc.constantFrom('customer', 'business', 'system'),
    content: fc.string({ minLength: 1, maxLength: 1000 }),
    createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  });
}

/**
 * Generates a random valid notification for deep-link routing tests.
 */
export function arbitraryNotification() {
  return fc.record({
    id: fc.uuid(),
    type: fc.constantFrom(
      'status_change',
      'message',
      'invoice',
      'review',
      'appointment_confirmation',
    ),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    body: fc.string({ minLength: 1, maxLength: 200 }),
  });
}
