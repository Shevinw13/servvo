/**
 * Dashboard service — API calls for the home dashboard screen.
 * Provides data for the next appointment and recent activity feed.
 *
 * Validates: Requirements 4.1, 4.4
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
}

export interface ActivityEvent {
  id: string;
  type: 'status_update' | 'message' | 'invoice' | 'booking' | 'review';
  title: string;
  description?: string;
  timestamp: string; // ISO datetime string
  icon: string;
}

/**
 * Fetches the next upcoming appointment for the authenticated user.
 * Returns null if no upcoming appointment exists.
 */
export async function getNextAppointment(): Promise<Appointment | null> {
  try {
    const response = await api.get<Appointment>('/appointments/next');
    return response.data;
  } catch (error: unknown) {
    // 404 means no upcoming appointment
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetches recent activity events for the authenticated user.
 * Returns the last 5 events in reverse chronological order.
 */
export async function getRecentActivity(): Promise<ActivityEvent[]> {
  try {
    const response = await api.get<ActivityEvent[]>('/activity', {
      params: { limit: 5, sort: 'desc' },
    });
    return response.data;
  } catch {
    return [];
  }
}
