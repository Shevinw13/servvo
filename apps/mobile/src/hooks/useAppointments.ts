/**
 * Hook for managing appointment data and operations.
 * Provides fetching, cancellation, and rescheduling functionality
 * backed by the appointment Zustand store and service layer.
 *
 * Validates: Requirements 5.1, 5.2
 */

import { useCallback } from 'react';
import { useAppointmentStore } from '../stores/appointmentStore';
import * as appointmentsService from '../services/appointments.service';
import type {
  Appointment,
  RescheduleData,
} from '../services/appointments.service';

export interface UseAppointmentsResult {
  /** List of upcoming appointments */
  upcomingAppointments: Appointment[];
  /** List of past appointments */
  pastAppointments: Appointment[];
  /** The next upcoming appointment */
  nextAppointment: Appointment | null;
  /** Whether appointment data is being loaded */
  isLoading: boolean;
  /** Fetch upcoming appointments and update store */
  fetchUpcoming: (page?: number, limit?: number) => Promise<void>;
  /** Fetch past appointments and update store */
  fetchPast: (page?: number, limit?: number) => Promise<void>;
  /** Fetch the next upcoming appointment and update store */
  fetchNext: () => Promise<void>;
  /** Cancel an appointment and remove it from the store */
  cancel: (id: string) => Promise<void>;
  /** Reschedule an appointment and update it in the store */
  reschedule: (id: string, data: RescheduleData) => Promise<void>;
}

/**
 * Returns appointment state and actions for fetching, cancelling, and rescheduling.
 */
export function useAppointments(): UseAppointmentsResult {
  const upcomingAppointments = useAppointmentStore(
    (state) => state.upcomingAppointments,
  );
  const pastAppointments = useAppointmentStore(
    (state) => state.pastAppointments,
  );
  const nextAppointment = useAppointmentStore(
    (state) => state.nextAppointment,
  );
  const isLoading = useAppointmentStore((state) => state.isLoading);
  const setUpcoming = useAppointmentStore((state) => state.setUpcoming);
  const setPast = useAppointmentStore((state) => state.setPast);
  const setNext = useAppointmentStore((state) => state.setNext);
  const setLoading = useAppointmentStore((state) => state.setLoading);
  const removeAppointment = useAppointmentStore(
    (state) => state.removeAppointment,
  );
  const updateAppointment = useAppointmentStore(
    (state) => state.updateAppointment,
  );

  const fetchUpcoming = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        const response = await appointmentsService.getAppointments(
          'upcoming',
          page,
          limit,
        );
        setUpcoming(response.data);
      } finally {
        setLoading(false);
      }
    },
    [setUpcoming, setLoading],
  );

  const fetchPast = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        const response = await appointmentsService.getAppointments(
          'past',
          page,
          limit,
        );
        setPast(response.data);
      } finally {
        setLoading(false);
      }
    },
    [setPast, setLoading],
  );

  const fetchNext = useCallback(async () => {
    setLoading(true);
    try {
      const appointment = await appointmentsService.getNextAppointment();
      setNext(appointment);
    } finally {
      setLoading(false);
    }
  }, [setNext, setLoading]);

  const cancel = useCallback(
    async (id: string) => {
      await appointmentsService.cancelAppointment(id);
      removeAppointment(id);
    },
    [removeAppointment],
  );

  const reschedule = useCallback(
    async (id: string, data: RescheduleData) => {
      const updated = await appointmentsService.rescheduleAppointment(id, data);
      updateAppointment(id, updated);
    },
    [updateAppointment],
  );

  return {
    upcomingAppointments,
    pastAppointments,
    nextAppointment,
    isLoading,
    fetchUpcoming,
    fetchPast,
    fetchNext,
    cancel,
    reschedule,
  };
}
