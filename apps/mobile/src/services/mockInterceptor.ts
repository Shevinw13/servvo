/**
 * Mock API Interceptor — Returns realistic mock data for all API endpoints.
 * Used during development when no backend is running.
 * Intercepts axios requests and returns mock responses.
 */

import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const MOCK_APPOINTMENTS_UPCOMING = [
  {
    id: '1',
    serviceType: 'Weekly Lawn Mowing',
    date: '2025-06-11',
    arrivalWindowStart: '2025-06-11T09:00:00',
    arrivalWindowEnd: '2025-06-11T11:00:00',
    providerName: 'Joe L.',
    status: 'on_the_way',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
    providerNotes: 'Will also edge along the driveway.',
  },
  {
    id: '2',
    serviceType: 'Fertilization Treatment',
    date: '2025-06-18',
    arrivalWindowStart: '2025-06-18T10:00:00',
    arrivalWindowEnd: '2025-06-18T12:00:00',
    providerName: 'Joe L.',
    status: 'scheduled',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
  },
  {
    id: '3',
    serviceType: 'Shrub Trimming',
    date: '2025-06-25',
    arrivalWindowStart: '2025-06-25T08:00:00',
    arrivalWindowEnd: '2025-06-25T10:00:00',
    providerName: 'Marcus T.',
    status: 'scheduled',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
  },
  {
    id: '4',
    serviceType: 'Weekly Lawn Mowing',
    date: '2025-07-02',
    arrivalWindowStart: '2025-07-02T09:00:00',
    arrivalWindowEnd: '2025-07-02T11:00:00',
    providerName: 'Joe L.',
    status: 'scheduled',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
  },
  {
    id: '5',
    serviceType: 'Weed Control Application',
    date: '2025-07-09',
    arrivalWindowStart: '2025-07-09T07:00:00',
    arrivalWindowEnd: '2025-07-09T09:00:00',
    providerName: 'Marcus T.',
    status: 'scheduled',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
    beforeServiceNotes: 'Please keep pets indoors for 2 hours after application.',
  },
];

const MOCK_APPOINTMENTS_PAST = [
  {
    id: '10',
    serviceType: 'Weekly Lawn Mowing',
    date: '2025-06-04',
    arrivalWindowStart: '2025-06-04T09:00:00',
    arrivalWindowEnd: '2025-06-04T11:00:00',
    providerName: 'Joe L.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
    providerNotes: 'Lawn looking great. Raised height for summer.',
  },
  {
    id: '11',
    serviceType: 'Weekly Lawn Mowing',
    date: '2025-05-28',
    arrivalWindowStart: '2025-05-28T09:00:00',
    arrivalWindowEnd: '2025-05-28T11:00:00',
    providerName: 'Joe L.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
  },
  {
    id: '12',
    serviceType: 'Spring Aeration',
    date: '2025-05-14',
    arrivalWindowStart: '2025-05-14T08:00:00',
    arrivalWindowEnd: '2025-05-14T10:00:00',
    providerName: 'Marcus T.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
    providerNotes: 'Core aeration completed. Water deeply this week.',
  },
  {
    id: '13',
    serviceType: 'Weekly Lawn Mowing',
    date: '2025-05-07',
    arrivalWindowStart: '2025-05-07T09:00:00',
    arrivalWindowEnd: '2025-05-07T11:00:00',
    providerName: 'Joe L.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
  },
  {
    id: '14',
    serviceType: 'Overseeding & Top Dress',
    date: '2025-04-22',
    arrivalWindowStart: '2025-04-22T08:00:00',
    arrivalWindowEnd: '2025-04-22T10:00:00',
    providerName: 'Marcus T.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
    providerNotes: 'Overseeded thin patches near the front walkway. Keep watered.',
  },
  {
    id: '15',
    serviceType: 'Weekly Lawn Mowing',
    date: '2025-04-16',
    arrivalWindowStart: '2025-04-16T09:00:00',
    arrivalWindowEnd: '2025-04-16T11:00:00',
    providerName: 'Joe L.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
  },
  {
    id: '16',
    serviceType: 'Pre-Emergent Application',
    date: '2025-03-20',
    arrivalWindowStart: '2025-03-20T07:00:00',
    arrivalWindowEnd: '2025-03-20T09:00:00',
    providerName: 'Marcus T.',
    status: 'completed',
    propertyAddress: '1847 Oak Valley Dr, Austin TX',
    providerNotes: 'Applied pre-emergent to prevent crabgrass. Water lightly tomorrow.',
  },
];

const MOCK_INVOICES = [
  {
    id: 'inv-1',
    status: 'unpaid',
    amount: 7500,
    currency: 'usd',
    description: 'Weekly Lawn Mowing \u2014 June 11',
    dueDate: '2025-06-18',
    createdAt: '2025-06-11',
    appointmentId: '1',
  },
  {
    id: 'inv-2',
    status: 'paid',
    amount: 7500,
    currency: 'usd',
    description: 'Weekly Lawn Mowing \u2014 June 4',
    dueDate: '2025-06-11',
    createdAt: '2025-06-04',
    paidAt: '2025-06-05',
    appointmentId: '10',
  },
  {
    id: 'inv-3',
    status: 'paid',
    amount: 7500,
    currency: 'usd',
    description: 'Weekly Lawn Mowing \u2014 May 28',
    dueDate: '2025-06-04',
    createdAt: '2025-05-28',
    paidAt: '2025-05-29',
    appointmentId: '11',
  },
  {
    id: 'inv-4',
    status: 'paid',
    amount: 15000,
    currency: 'usd',
    description: 'Spring Aeration Treatment',
    dueDate: '2025-05-21',
    createdAt: '2025-05-14',
    paidAt: '2025-05-15',
    appointmentId: '12',
  },
  {
    id: 'inv-5',
    status: 'paid',
    amount: 7500,
    currency: 'usd',
    description: 'Weekly Lawn Mowing \u2014 May 7',
    dueDate: '2025-05-14',
    createdAt: '2025-05-07',
    paidAt: '2025-05-08',
    appointmentId: '13',
  },
  {
    id: 'inv-6',
    status: 'paid',
    amount: 22500,
    currency: 'usd',
    description: 'Overseeding & Top Dress',
    dueDate: '2025-04-29',
    createdAt: '2025-04-22',
    paidAt: '2025-04-23',
    appointmentId: '14',
  },
  {
    id: 'inv-7',
    status: 'paid',
    amount: 7500,
    currency: 'usd',
    description: 'Weekly Lawn Mowing \u2014 April 16',
    dueDate: '2025-04-23',
    createdAt: '2025-04-16',
    paidAt: '2025-04-17',
    appointmentId: '15',
  },
  {
    id: 'inv-8',
    status: 'paid',
    amount: 12000,
    currency: 'usd',
    description: 'Pre-Emergent Application',
    dueDate: '2025-03-27',
    createdAt: '2025-03-20',
    paidAt: '2025-03-21',
    appointmentId: '16',
  },
];

const MOCK_PAYMENTS = [
  { id: 'pay-1', invoiceId: 'inv-2', amount: 7500, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-06-05' },
  { id: 'pay-2', invoiceId: 'inv-3', amount: 7500, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-05-29' },
  { id: 'pay-3', invoiceId: 'inv-4', amount: 15000, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-05-15' },
  { id: 'pay-4', invoiceId: 'inv-5', amount: 7500, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-05-08' },
  { id: 'pay-5', invoiceId: 'inv-6', amount: 22500, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-04-23' },
  { id: 'pay-6', invoiceId: 'inv-7', amount: 7500, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-04-17' },
  { id: 'pay-7', invoiceId: 'inv-8', amount: 12000, status: 'succeeded', paymentMethodLast4: '4242', createdAt: '2025-03-21' },
];

const MOCK_MESSAGES = [
  { id: 'm1', content: 'Hi! Just confirming your Wednesday mowing. We\u2019ll be there between 9-11am.', sender: 'business', isAutomated: false, isRead: true, createdAt: '2025-06-09T14:30:00' },
  { id: 'm2', content: 'Sounds good, thanks Joe!', sender: 'customer', isAutomated: false, isRead: true, createdAt: '2025-06-09T14:45:00' },
  { id: 'm3', content: 'Quick question \u2014 could you also trim the hedges by the front walkway this week?', sender: 'customer', isAutomated: false, isRead: true, createdAt: '2025-06-09T14:46:00' },
  { id: 'm4', content: 'Absolutely! I\u2019ll add hedge trimming to Wednesday\u2019s visit. No extra charge since they\u2019re small.', sender: 'business', isAutomated: false, isRead: true, createdAt: '2025-06-09T15:02:00' },
  { id: 'm5', content: 'You\u2019re the best. Thanks!', sender: 'customer', isAutomated: false, isRead: true, createdAt: '2025-06-09T15:05:00' },
  { id: 'm6', content: 'Appointment confirmed: Weekly Lawn Mowing on Wed, Jun 11 (9:00 AM \u2013 11:00 AM)', sender: 'system', isAutomated: true, isRead: true, createdAt: '2025-06-10T08:00:00' },
  { id: 'm7', content: 'Joe L. is on the way. Estimated arrival: ~12 minutes.', sender: 'system', isAutomated: true, isRead: true, createdAt: '2025-06-11T09:15:00' },
];

const MOCK_PAYMENT_METHODS = [
  { id: 'pm-1', stripePaymentMethodId: 'pm_xxx', type: 'card', last4: '4242', brand: 'visa', expMonth: 12, expYear: 2027, isDefault: true },
];

function mockResponse(data: any, status = 200): AxiosResponse {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };
}

/**
 * Intercepts API requests and returns mock data.
 * Returns null if the request shouldn't be mocked.
 */
export function getMockResponse(config: InternalAxiosRequestConfig): AxiosResponse | null {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const params = config.params || {};

  // Appointments
  if (url === '/appointments' && method === 'get') {
    const filter = params.filter || 'upcoming';
    const data = filter === 'upcoming' ? MOCK_APPOINTMENTS_UPCOMING : MOCK_APPOINTMENTS_PAST;
    return mockResponse({ data, total: data.length, page: 1, limit: 10 });
  }

  if (url.match(/^\/appointments\/[\w-]+$/) && method === 'get') {
    const id = url.split('/').pop();
    const all = [...MOCK_APPOINTMENTS_UPCOMING, ...MOCK_APPOINTMENTS_PAST];
    const appointment = all.find(a => a.id === id) || all[0];
    return mockResponse(appointment);
  }

  if (url === '/appointments/next' && method === 'get') {
    return mockResponse(MOCK_APPOINTMENTS_UPCOMING[0]);
  }

  // Invoices
  if (url === '/invoices' && method === 'get') {
    return mockResponse({ data: MOCK_INVOICES, total: MOCK_INVOICES.length });
  }

  if (url.match(/^\/invoices\/[\w-]+$/) && method === 'get') {
    const id = url.split('/').pop();
    const invoice = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
    return mockResponse(invoice);
  }

  // Payments
  if (url === '/payments/history' && method === 'get') {
    return mockResponse({ data: MOCK_PAYMENTS });
  }

  if (url === '/payments/methods' && method === 'get') {
    return mockResponse({ data: MOCK_PAYMENT_METHODS });
  }

  // Messages
  if (url === '/messages' && method === 'get') {
    return mockResponse({ data: MOCK_MESSAGES, total: MOCK_MESSAGES.length });
  }

  // User profile
  if (url === '/users/me' && method === 'get') {
    return mockResponse({ id: '1', name: 'Alex Thompson', email: 'alex@example.com', phone: '+15551234567', onboardingComplete: true });
  }

  // Notifications preferences
  if (url === '/notifications/preferences' && method === 'get') {
    return mockResponse({ statusChanges: true, newMessages: true, invoiceReminders: true, reviewRequests: true, appointmentConfirmations: true });
  }

  return null;
}
