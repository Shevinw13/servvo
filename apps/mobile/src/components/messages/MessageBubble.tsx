/**
 * MessageBubble — Renders a single message with styling based on sender type.
 * Customer messages: right-aligned, forest green background, white text.
 * Business messages: left-aligned, white background, dark text, subtle border.
 * System/automated messages: centered, gray background, smaller text, italic.
 *
 * Validates: Requirements 7.1, 7.4
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui';
import { useTheme } from '@/theme/BrandThemeProvider';
import type { SenderType } from '@/services/messages.service';

export interface MessageBubbleProps {
  content: string;
  senderType: SenderType;
  timestamp: string;
  isAutomated?: boolean;
}

export function MessageBubble({
  content,
  senderType,
  timestamp,
  isAutomated,
}: MessageBubbleProps) {
  const { tokens } = useTheme();

  const formattedTime = formatTimestamp(timestamp);

  // System/automated messages
  if (senderType === 'system' || isAutomated) {
    return (
      <View style={styles.systemContainer}>
        <View style={[styles.systemBubble, { backgroundColor: tokens.colors.border }]}>
          <Typography
            variant="bodySmall"
            color={tokens.colors.textSecondary}
            style={styles.systemText}
          >
            {content}
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={tokens.colors.textMuted}
          style={styles.systemTimestamp}
        >
          {formattedTime}
        </Typography>
      </View>
    );
  }

  // Customer messages (right-aligned)
  if (senderType === 'customer') {
    return (
      <View style={styles.customerContainer}>
        <View
          style={[styles.customerBubble, { backgroundColor: tokens.colors.primary }]}
        >
          <Typography variant="body" color="#FFFFFF">
            {content}
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={tokens.colors.textMuted}
          style={styles.customerTimestamp}
        >
          {formattedTime}
        </Typography>
      </View>
    );
  }

  // Business messages (left-aligned)
  return (
    <View style={styles.businessContainer}>
      <View
        style={[
          styles.businessBubble,
          {
            backgroundColor: tokens.colors.surface,
            borderColor: tokens.colors.border,
          },
        ]}
      >
        <Typography variant="body" color={tokens.colors.text}>
          {content}
        </Typography>
      </View>
      <Typography
        variant="caption"
        color={tokens.colors.textMuted}
        style={styles.businessTimestamp}
      >
        {formattedTime}
      </Typography>
    </View>
  );
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) {
    return time;
  }

  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${dateStr}, ${time}`;
}

const styles = StyleSheet.create({
  // Customer (right-aligned)
  customerContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingLeft: 48,
  },
  customerBubble: {
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  customerTimestamp: {
    marginTop: 4,
    marginRight: 4,
  },

  // Business (left-aligned)
  businessContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 48,
  },
  businessBubble: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  businessTimestamp: {
    marginTop: 4,
    marginLeft: 4,
  },

  // System (centered)
  systemContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 32,
  },
  systemBubble: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  systemText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  systemTimestamp: {
    marginTop: 4,
    textAlign: 'center',
  },
});
