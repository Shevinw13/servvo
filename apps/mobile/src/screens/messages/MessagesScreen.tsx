/**
 * MessagesScreen — Conversation thread with real-time message delivery.
 * Inverted FlatList showing messages in chronological order (newest at bottom).
 * Subscribes to WebSocket `message:new` events for real-time updates.
 * Pull-to-refresh loads older messages.
 *
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4
 */

import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from '@/components/ui';
import { MessageBubble } from '@/components/messages/MessageBubble';
import { MessageInput } from '@/components/messages/MessageInput';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import * as messagesService from '@/services/messages.service';
import type { Message } from '@/services/messages.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export function MessagesScreen() {
  const { tokens } = useTheme();
  const { messages, isLoading, setMessages, addMessage, setLoading } =
    useMessageStore();
  const { accessToken, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await messagesService.getMessages(1, 20);
      setMessages(response.data);
      pageRef.current = 1;
      hasMoreRef.current = response.data.length < response.total;
    } catch {
      // Silently handle error — user can pull to refresh
    } finally {
      setLoading(false);
    }
  }, [setMessages, setLoading]);

  // Load older messages (pull-to-refresh in inverted list loads older)
  const loadOlderMessages = useCallback(async () => {
    if (!hasMoreRef.current || isLoading) return;
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const response = await messagesService.getMessages(nextPage, 20);
      if (response.data.length > 0) {
        setMessages([...messages, ...response.data]);
        pageRef.current = nextPage;
        hasMoreRef.current =
          messages.length + response.data.length < response.total;
      } else {
        hasMoreRef.current = false;
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  }, [messages, isLoading, setMessages, setLoading]);

  // Connect to WebSocket for real-time messages
  useEffect(() => {
    if (!accessToken || !user) return;

    const socket = io(`${API_BASE_URL}/messages`, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      socket.emit('subscribe:messages', { userId: user.id });
    });

    socket.on('message:new', (message: Message) => {
      addMessage(message);
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, user, addMessage]);

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send a message
  const handleSend = useCallback(
    async (content: string) => {
      try {
        const message = await messagesService.sendMessage(content);
        addMessage(message);
      } catch {
        // Could show a toast here in the future
      }
    },
    [addMessage],
  );

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        content={item.content}
        senderType={item.sender_type}
        timestamp={item.created_at}
        isAutomated={item.is_automated}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.emptyText}
        >
          No messages yet. Send a message to your lawn care team.
        </Typography>
      </View>
    );
  }, [isLoading, tokens.colors.textSecondary]);

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: tokens.colors.border }]}>
        <Typography variant="h3">Messages</Typography>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        inverted
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadOlderMessages}
            tintColor={tokens.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {isLoading && messages.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      )}

      <MessageInput onSend={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    // In an inverted list, empty state needs to be flipped
    transform: [{ scaleY: -1 }],
  },
  emptyText: {
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
