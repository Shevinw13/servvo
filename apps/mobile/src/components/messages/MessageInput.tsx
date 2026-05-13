/**
 * MessageInput — Text input with send button for composing messages.
 * Send button uses Feather "send" icon, forest green when active, disabled when empty.
 * Clean bottom bar with subtle top border.
 *
 * Validates: Requirements 7.1, 7.2
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const { tokens } = useTheme();
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={[styles.container, { borderTopColor: tokens.colors.border }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: tokens.colors.background,
            color: tokens.colors.text,
            borderColor: tokens.colors.border,
          },
        ]}
        placeholder="Type a message..."
        placeholderTextColor={tokens.colors.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={2000}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: canSend ? tokens.colors.primary : tokens.colors.border,
          },
        ]}
        onPress={handleSend}
        disabled={!canSend}
        accessibilityLabel="Send message"
        accessibilityRole="button"
      >
        <Feather name="send" size={18} color={canSend ? '#FFFFFF' : tokens.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
});
