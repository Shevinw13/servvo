/**
 * Messages service — API calls for two-way messaging.
 * Provides methods to fetch conversation history and send messages.
 *
 * Validates: Requirements 7.1, 7.2
 */

import api from './api';

export type SenderType = 'customer' | 'business' | 'system';

export interface Message {
  id: string;
  user_id: string;
  business_id: string;
  sender_type: SenderType;
  content: string;
  is_automated: boolean;
  is_read: boolean;
  created_at: string; // ISO datetime string
}

export interface MessagesResponse {
  data: Message[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetches paginated messages for the authenticated user's conversation.
 */
export async function getMessages(
  page: number = 1,
  limit: number = 20,
): Promise<MessagesResponse> {
  const response = await api.get<MessagesResponse>('/messages', {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Sends a message from the customer to the business.
 */
export async function sendMessage(content: string): Promise<Message> {
  const response = await api.post<Message>('/messages', { content });
  return response.data;
}
