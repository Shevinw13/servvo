/**
 * Zustand store for managing messaging state.
 * Holds the conversation messages and provides actions to update them.
 *
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4
 */

import { create } from 'zustand';
import type { Message } from '../services/messages.service';

export interface MessageState {
  /** List of messages in the conversation (newest first) */
  messages: Message[];
  /** Whether messages are being loaded */
  isLoading: boolean;
  /** Add a new message to the beginning of the list */
  addMessage: (message: Message) => void;
  /** Replace the entire messages list */
  setMessages: (messages: Message[]) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [message, ...state.messages],
    })),
  setMessages: (messages: Message[]) => set({ messages }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
