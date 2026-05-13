/**
 * Shared fast-check arbitraries for property-based tests.
 * These generators produce random valid instances of key domain types.
 */
import * as fc from 'fast-check';

// TODO: Import actual entity types once modules are fully implemented
// import { ServiceStatus } from '@/common/enums';

/**
 * Generates a random valid appointment object.
 * Covers: service types, statuses, dates, arrival windows, provider info.
 */
export function arbitraryAppointment() {
  // TODO: Implement with actual Appointment entity shape
  return fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    businessId: fc.uuid(),
    propertyId: fc.uuid(),
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
    arrivalWindowStart: fc.constant('08:00'),
    arrivalWindowEnd: fc.constant('10:00'),
    providerName: fc.string({ minLength: 1, maxLength: 50 }),
    durationMinutes: fc.integer({ min: 15, max: 480 }),
  });
}

/**
 * Generates a random valid message object.
 * Covers: content, sender types, timestamps, read status.
 */
export function arbitraryMessage() {
  // TODO: Implement with actual Message entity shape
  return fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    businessId: fc.uuid(),
    senderType: fc.constantFrom('customer', 'business', 'system'),
    content: fc.string({ minLength: 1, maxLength: 1000 }),
    isAutomated: fc.boolean(),
    isRead: fc.boolean(),
    createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  });
}

/**
 * Generates a random valid invoice object.
 * Covers: statuses, amounts, currency, due dates.
 */
export function arbitraryInvoice() {
  // TODO: Implement with actual Invoice entity shape
  return fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    businessId: fc.uuid(),
    appointmentId: fc.uuid(),
    status: fc.constantFrom('unpaid', 'paid', 'overdue'),
    amountCents: fc.integer({ min: 100, max: 100000 }),
    currency: fc.constant('usd'),
    description: fc.string({ minLength: 1, maxLength: 200 }),
    dueDate: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
    createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  });
}

/**
 * Generates a random valid brand configuration object.
 * Covers: colors, terminology, imagery URLs.
 */
export function arbitraryBrandConfig() {
  // TODO: Implement with actual BrandConfig entity shape
  const hexColor = fc.string({ minLength: 6, maxLength: 6 }).map((s) => `#${s.replace(/[^0-9a-fA-F]/g, '0')}`);

  return fc.record({
    id: fc.uuid(),
    businessId: fc.uuid(),
    logoUrl: fc.webUrl(),
    primaryColor: hexColor,
    accentColor: hexColor,
    serviceProviderTerm: fc.constantFrom('Provider', 'Crew', 'Team', 'Service Professional'),
    imagery: fc.record({
      onboarding: fc.array(fc.webUrl(), { minLength: 1, maxLength: 3 }),
      dashboard: fc.webUrl(),
    }),
  });
}

/**
 * Generates a random valid review object.
 * Covers: ratings (1-5), optional comments.
 */
export function arbitraryReview() {
  // TODO: Implement with actual Review entity shape
  return fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    appointmentId: fc.uuid(),
    rating: fc.integer({ min: 1, max: 5 }),
    comment: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
    createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  });
}

/**
 * Generates a random valid service status event.
 * Covers: status transitions, timestamps, metadata.
 */
export function arbitraryServiceStatusEvent() {
  // TODO: Implement with actual ServiceStatusEvent entity shape
  return fc.record({
    id: fc.uuid(),
    appointmentId: fc.uuid(),
    status: fc.constantFrom(
      'scheduled',
      'provider_assigned',
      'on_the_way',
      'arrived',
      'in_progress',
      'completed',
    ),
    occurredAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
    metadata: fc.record({}),
  });
}

/**
 * Generates a random valid notification object.
 * Covers: notification types, payloads, deep-link targets.
 */
export function arbitraryNotification() {
  // TODO: Implement with actual notification shape
  return fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    type: fc.constantFrom(
      'status_change',
      'message',
      'invoice',
      'review',
      'appointment_confirmation',
    ),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    body: fc.string({ minLength: 1, maxLength: 200 }),
    payload: fc.record({
      appointmentId: fc.option(fc.uuid(), { nil: undefined }),
      invoiceId: fc.option(fc.uuid(), { nil: undefined }),
    }),
    createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  });
}
