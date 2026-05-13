/**
 * Billing service — API calls for invoices, payments, and payment methods.
 * Provides operations for viewing invoices, processing payments, and managing saved methods.
 *
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

import api from './api';

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export interface Invoice {
  id: string;
  status: InvoiceStatus;
  amountCents: number;
  currency: string;
  description: string;
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  appointmentId?: string;
}

export interface InvoicesResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amountCents: number;
  status: string;
  paymentMethodType: string;
  paymentMethodLast4: string;
  createdAt: string; // ISO date string
}

export interface PaymentsResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amountCents: number;
  currency: string;
}

/**
 * Fetches invoices for the authenticated user with optional status filter and pagination.
 */
export async function getInvoices(
  status?: InvoiceStatus,
  page: number = 1,
  limit: number = 10,
): Promise<InvoicesResponse> {
  const response = await api.get<InvoicesResponse>('/invoices', {
    params: { status, page, limit },
  });
  return response.data;
}

/**
 * Fetches a single invoice by ID.
 */
export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await api.get<Invoice>(`/invoices/${id}`);
  return response.data;
}

/**
 * Creates a Stripe PaymentIntent for an invoice.
 */
export async function createPaymentIntent(invoiceId: string): Promise<PaymentIntent> {
  const response = await api.post<PaymentIntent>('/payments/intent', { invoiceId });
  return response.data;
}

/**
 * Confirms a payment after Stripe processing.
 */
export async function confirmPayment(
  paymentIntentId: string,
  invoiceId: string,
): Promise<Payment> {
  const response = await api.post<Payment>('/payments/confirm', {
    paymentIntentId,
    invoiceId,
  });
  return response.data;
}

/**
 * Fetches saved payment methods for the authenticated user.
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const response = await api.get<PaymentMethod[]>('/payments/methods');
  return response.data;
}

/**
 * Saves a new payment method.
 */
export async function savePaymentMethod(data: {
  stripePaymentMethodId: string;
  isDefault?: boolean;
}): Promise<PaymentMethod> {
  const response = await api.post<PaymentMethod>('/payments/methods', data);
  return response.data;
}

/**
 * Deletes a saved payment method.
 */
export async function deletePaymentMethod(id: string): Promise<void> {
  await api.delete(`/payments/methods/${id}`);
}

/**
 * Fetches payment history for the authenticated user.
 */
export async function getPaymentHistory(
  page: number = 1,
  limit: number = 10,
): Promise<PaymentsResponse> {
  const response = await api.get<PaymentsResponse>('/payments/history', {
    params: { page, limit },
  });
  return response.data;
}
