/**
 * Zustand store for managing appointment state.
 * Holds upcoming, past, and next appointment data with actions to update them.
 *
 * Validates: Requirements 5.1, 5.2
 */

import { create } from 'zustand';
import type { Appointment } from '../services/appointments.service';

export interface AppointmentState {
  /** List of upcoming appointments */
  upcomingAppointments: Appointment[];
  /** List of past appointments */
  pastAppointments: Appointment[];
  /** The next upcoming appointment (for dashboard display) */
  nextAppointment: Appointment | null;
  /** Whether appointment data is being loaded */
  isLoading: boolean;
  /** Set the list of upcoming appointments */
  setUpcoming: (appointments: Appointment[]) => void;
  /** Set the list of past appointments */
  setPast: (appointments: Appointment[]) => void;
  /** Set the next upcoming appointment */
  setNext: (appointment: Appointment | null) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Remove an appointment by ID from both upcoming and past lists */
  removeAppointment: (id: string) => void;
  /** Update an appointment by ID with partial data */
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  upcomingAppointments: [],
  pastAppointments: [],
  nextAppointment: null,
  isLoading: false,
  setUpcoming: (appointments: Appointment[]) =>
    set({ upcomingAppointments: appointments }),
  setPast: (appointments: Appointment[]) =>
    set({ pastAppointments: appointments }),
  setNext: (appointment: Appointment | null) =>
    set({ nextAppointment: appointment }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  removeAppointment: (id: string) =>
    set((state) => ({
      upcomingAppointments: state.upcomingAppointments.filter(
        (a) => a.id !== id,
      ),
      pastAppointments: state.pastAppointments.filter((a) => a.id !== id),
      nextAppointment:
        state.nextAppointment?.id === id ? null : state.nextAppointment,
    })),
  updateAppointment: (id: string, updates: Partial<Appointment>) =>
    set((state) => ({
      upcomingAppointments: state.upcomingAppointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
      pastAppointments: state.pastAppointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
      nextAppointment:
        state.nextAppointment?.id === id
          ? { ...state.nextAppointment, ...updates }
          : state.nextAppointment,
    })),
}));
