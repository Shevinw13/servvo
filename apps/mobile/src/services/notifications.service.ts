/**
 * Notifications service — API calls for notification preferences and device registration.
 */

import api from './api';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  status_changes: boolean;
  new_messages: boolean;
  invoice_reminders: boolean;
  review_requests: boolean;
  appointment_confirmations: boolean;
  updated_at: string;
}

/**
 * Registers a device FCM token.
 */
export async function registerDevice(
  token: string,
  platform: string,
): Promise<void> {
  await api.post('/notifications/register-device', { token, platform });
}

/**
 * Fetches the user's notification preferences.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await api.get<NotificationPreferences>(
    '/notifications/preferences',
  );
  return response.data;
}

/**
 * Updates the user's notification preferences.
 */
export async function updateNotificationPreferences(
  prefs: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'updated_at'>>,
): Promise<NotificationPreferences> {
  const response = await api.put<NotificationPreferences>(
    '/notifications/preferences',
    prefs,
  );
  return response.data;
}
