/**
 * Appointments service — API calls for appointment management.
 * Provides CRUD operations for appointments including reschedule and cancel.
 *
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */

import api from './api';
import type { ServiceStatus } from '@/components/service-status';

export interface Appointment {
  id: string;
  serviceType: string;
  date: string; // ISO date string
  arrivalWindowStart: string; // ISO datetime string
  arrivalWindowEnd: string; // ISO datetime string
  providerName: string;
  status: ServiceStatus;
  propertyAddress?: string;
  providerNotes?: string;
  beforeServiceNotes?: string;
}

export interface AppointmentsResponse {
  data: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export interface RescheduleData {
  date: string; // ISO date string
  arrivalWindowStart: string; // ISO datetime string
  arrivalWindowEnd: string; // ISO datetime string
}

/**
 * Fetches appointments for the authenticated user with filter and pagination.
 */
export async function getAppointments(
  filter: 'upcoming' | 'past',
  page: number = 1,
  limit: number = 10,
): Promise<AppointmentsResponse> {
  const response = await api.get<AppointmentsResponse>('/appointments', {
    params: { filter, page, limit },
  });
  return response.data;
}

/**
 * Fetches a single appointment by ID.
 */
export async function getAppointmentById(id: string): Promise<Appointment> {
  const response = await api.get<Appointment>(`/appointments/${id}`);
  return response.data;
}

/**
 * Submits a reschedule request for an appointment.
 */
export async function rescheduleAppointment(
  id: string,
  data: RescheduleData,
): Promise<Appointment> {
  const response = await api.post<Appointment>(
    `/appointments/${id}/reschedule`,
    data,
  );
  return response.data;
}

/**
 * Fetches the next upcoming appointment for the authenticated user.
 */
export async function getNextAppointment(): Promise<Appointment | null> {
  const response = await api.get<Appointment | null>('/appointments/next');
  return response.data;
}

/**
 * Submits a cancellation request for an appointment.
 */
export async function cancelAppointment(id: string): Promise<void> {
  await api.post(`/appointments/${id}/cancel`);
}
