/**
 * WebSocket service — Socket.IO client for real-time status updates.
 * Connects to the backend /status namespace with auto-reconnect (exponential backoff).
 * Passes auth token in handshake for authenticated connections.
 *
 * Validates: Requirements 6.2, 6.4
 */

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
import type { ServiceStatus } from '@/components/service-status';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface StatusUpdatePayload {
  appointmentId: string;
  status: ServiceStatus;
  timestamp: string;
  arrivalWindow?: { start: string; end: string };
}

type StatusUpdateCallback = (payload: StatusUpdatePayload) => void;

class WebSocketService {
  private socket: Socket | null = null;

  /**
   * Establishes a Socket.IO connection to the /status namespace.
   * Uses exponential backoff: 1s, 2s, 4s, ... max 30s, up to 10 retries.
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const { accessToken } = useAuthStore.getState();

    this.socket = io(`${API_BASE_URL}/status`, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: 10,
      // Socket.IO uses factor of 2 by default for exponential backoff
    });
  }

  /**
   * Closes the WebSocket connection.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Subscribes to status updates for a specific appointment.
   * Emits 'subscribe:appointment' to join the appointment's room.
   */
  subscribeToAppointment(appointmentId: string): void {
    if (!this.socket) {
      return;
    }
    this.socket.emit('subscribe:appointment', { appointmentId });
  }

  /**
   * Unsubscribes from status updates for a specific appointment.
   * Emits 'unsubscribe:appointment' to leave the appointment's room.
   */
  unsubscribeFromAppointment(appointmentId: string): void {
    if (!this.socket) {
      return;
    }
    this.socket.emit('unsubscribe:appointment', { appointmentId });
  }

  /**
   * Registers a callback for 'status:update' events.
   */
  onStatusUpdate(callback: StatusUpdateCallback): void {
    if (!this.socket) {
      return;
    }
    this.socket.on('status:update', callback);
  }

  /**
   * Removes a previously registered 'status:update' listener.
   */
  offStatusUpdate(callback: StatusUpdateCallback): void {
    if (!this.socket) {
      return;
    }
    this.socket.off('status:update', callback);
  }

  /**
   * Returns whether the socket is currently connected.
   */
  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const websocketService = new WebSocketService();
