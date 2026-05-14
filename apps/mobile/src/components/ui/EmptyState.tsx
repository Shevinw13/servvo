import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from './Typography';
import { Button } from './Button';

export interface EmptyStateProps {
  screenType: 'appointments' | 'messages' | 'payments' | 'activity' | 'properties';
  onAction?: () => void;
  actionLabel?: string;
}

interface EmptyStateContent {
  icon: keyof typeof Feather.glyphMap;
  headline: string;
  body: string;
}

const CONTENT_MAP: Record<EmptyStateProps['screenType'], EmptyStateContent> = {
  appointments: {
    icon: 'calendar',
    headline: 'Your service story starts here',
    body: 'Upcoming services will appear as they\'re scheduled',
  },
  messages: {
    icon: 'message-circle',
    headline: 'Need something? Message your provider anytime.',
    body: 'Start a conversation with your lawn care team',
  },
  payments: {
    icon: 'credit-card',
    headline: 'You\'re all set',
    body: 'Your billing history will appear here',
  },
  activity: {
    icon: 'activity',
    headline: 'Your lawn journey begins soon',
    body: 'Activity will appear after your first service',
  },
  properties: {
    icon: 'home',
    headline: 'Your property details',
    body: 'Add your property to get started',
  },
};

export function EmptyState({ screenType, onAction, actionLabel }: EmptyStateProps) {
  const { tokens } = useTheme();
  const content = CONTENT_MAP[screenType];

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xxl,
    paddingHorizontal: tokens.spacing.lg,
  };

  const iconContainerStyle: ViewStyle = {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `rgba(45, 74, 45, 0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  };

  const headlineStyle: TextStyle = {
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  };

  const bodyStyle: TextStyle = {
    textAlign: 'center',
    marginBottom: onAction ? tokens.spacing.lg : 0,
  };

  return (
    <View style={containerStyle}>
      <View style={iconContainerStyle}>
        <Feather name={content.icon} size={28} color={tokens.colors.primary} />
      </View>
      <Typography variant="h3" style={headlineStyle}>
        {content.headline}
      </Typography>
      <Typography variant="body" color={tokens.colors.textSecondary} style={bodyStyle}>
        {content.body}
      </Typography>
      {onAction && (
        <Button
          title={actionLabel ?? 'Get Started'}
          onPress={onAction}
          variant="primary"
        />
      )}
    </View>
  );
}
