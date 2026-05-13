/**
 * Verifies that all property-based test generators produce valid data.
 */
import * as fc from 'fast-check';
import {
  arbitraryAppointment,
  arbitraryMessage,
  arbitraryInvoice,
  arbitraryBrandConfig,
  arbitraryReview,
  arbitraryServiceStatusEvent,
  arbitraryNotification,
} from './generators';

describe('Property Test Generators', () => {
  it('arbitraryAppointment generates valid data', () => {
    fc.assert(
      fc.property(arbitraryAppointment(), (appointment) => {
        expect(appointment.id).toBeDefined();
        expect(appointment.status).toBeDefined();
        expect(appointment.scheduledDate).toBeInstanceOf(Date);
        return true;
      }),
      { numRuns: 10 },
    );
  });

  it('arbitraryMessage generates valid data', () => {
    fc.assert(
      fc.property(arbitraryMessage(), (message) => {
        expect(message.id).toBeDefined();
        expect(message.content.length).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 10 },
    );
  });

  it('arbitraryInvoice generates valid data', () => {
    fc.assert(
      fc.property(arbitraryInvoice(), (invoice) => {
        expect(invoice.amountCents).toBeGreaterThanOrEqual(100);
        expect(['unpaid', 'paid', 'overdue']).toContain(invoice.status);
        return true;
      }),
      { numRuns: 10 },
    );
  });

  it('arbitraryBrandConfig generates valid data', () => {
    fc.assert(
      fc.property(arbitraryBrandConfig(), (config) => {
        expect(config.primaryColor).toMatch(/^#/);
        expect(config.serviceProviderTerm).toBeDefined();
        return true;
      }),
      { numRuns: 10 },
    );
  });

  it('arbitraryReview generates valid data', () => {
    fc.assert(
      fc.property(arbitraryReview(), (review) => {
        expect(review.rating).toBeGreaterThanOrEqual(1);
        expect(review.rating).toBeLessThanOrEqual(5);
        return true;
      }),
      { numRuns: 10 },
    );
  });

  it('arbitraryServiceStatusEvent generates valid data', () => {
    fc.assert(
      fc.property(arbitraryServiceStatusEvent(), (event) => {
        expect(event.occurredAt).toBeInstanceOf(Date);
        expect(event.status).toBeDefined();
        return true;
      }),
      { numRuns: 10 },
    );
  });

  it('arbitraryNotification generates valid data', () => {
    fc.assert(
      fc.property(arbitraryNotification(), (notification) => {
        expect(notification.type).toBeDefined();
        expect(notification.title.length).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 10 },
    );
  });
});
