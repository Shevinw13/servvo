/**
 * Bookings service — API calls for booking management.
 */

import api from './api';

export interface AvailableDate {
  date: string;
  dayOfWeek: string;
  available: boolean;
}

export interface TimeWindow {
  id: string;
  start: string;
  end: string;
  label: string;
  available: boolean;
}

export interface CreateBookingData {
  serviceType: string;
  date: string;
  windowStart: string;
  windowEnd: string;
  propertyId?: string;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  userId: string;
  serviceType: string;
  date: string;
  windowStart: string;
  windowEnd: string;
  status: string;
  createdAt: string;
}

/**
 * Fetches available dates for booking.
 */
export async function getAvailableDates(): Promise<AvailableDate[]> {
  const response = await api.get<AvailableDate[]>('/bookings/available-dates');
  return response.data;
}

/**
 * Fetches available time windows for a specific date.
 */
export async function getAvailableWindows(date: string): Promise<TimeWindow[]> {
  const response = await api.get<TimeWindow[]>('/bookings/available-windows', {
    params: { date },
  });
  return response.data;
}

/**
 * Creates a new booking request.
 */
export async function createBooking(
  data: CreateBookingData,
): Promise<BookingResponse> {
  const response = await api.post<BookingResponse>('/bookings', data);
  return response.data;
}
