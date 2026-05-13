/**
 * useWebSocket hook — Manages WebSocket lifecycle and provides subscription helpers.
 * Connects on mount, disconnects on unmount.
 * Provides methods to subscribe/unsubscribe to appointment status updates.
 *
 * Validates: Requirements 6.2, 6.4
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import {
  websocketService,
  type StatusUpdatePayload,
} from '@/services/websocket.service';

export interface UseWebSocketReturn {
  /** Whether the WebSocket is currently connected */
  isConnected: boolean;
  /** Subscribe to real-time status updates for an appointment */
  subscribeToAppointment: (appointmentId: string) => void;
  /** Unsubscribe from real-time status updates for an appointment */
  unsubscribeFromAppointment: (appointmentId: string) => void;
  /** Register a callback for status update events */
  onStatusUpdate: (callback: (payload: StatusUpdatePayload) => void) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const callbackRef = useRef<((payload: StatusUpdatePayload) => void) | null>(null);

  useEffect(() => {
    websocketService.connect();
    setIsConnected(websocketService.isConnected);

    // Poll connection state briefly after connect attempt
    const timer = setTimeout(() => {
      setIsConnected(websocketService.isConnected);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (callbackRef.current) {
        websocketService.offStatusUpdate(callbackRef.current);
        callbackRef.current = null;
      }
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const subscribeToAppointment = useCallback((appointmentId: string) => {
    websocketService.subscribeToAppointment(appointmentId);
  }, []);

  const unsubscribeFromAppointment = useCallback((appointmentId: string) => {
    websocketService.unsubscribeFromAppointment(appointmentId);
  }, []);

  const onStatusUpdate = useCallback(
    (callback: (payload: StatusUpdatePayload) => void) => {
      // Remove previous listener if any
      if (callbackRef.current) {
        websocketService.offStatusUpdate(callbackRef.current);
      }
      callbackRef.current = callback;
      websocketService.onStatusUpdate(callback);
    },
    [],
  );

  return {
    isConnected,
    subscribeToAppointment,
    unsubscribeFromAppointment,
    onStatusUpdate,
  };
}
