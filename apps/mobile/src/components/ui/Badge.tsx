import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  const { tokens } = useTheme();

  const getColors = (): { background: string; text: string } => {
    switch (variant) {
      case 'success':
        return { background: '#D1FAE5', text: tokens.colors.success };
      case 'warning':
        return { background: '#FEF3C7', text: tokens.colors.warning };
      case 'error':
        return { background: '#FEE2E2', text: tokens.colors.error };
      case 'info':
        return { background: '#DBEAFE', text: tokens.colors.primary };
      case 'neutral':
        return { background: '#F3F4F6', text: tokens.colors.textSecondary };
    }
  };

  const colors = getColors();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderRadius: tokens.borderRadius.full,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    alignSelf: 'flex-start',
  };

  const textStyle: TextStyle = {
    fontSize: tokens.typography.caption.fontSize,
    fontWeight: '600',
    lineHeight: tokens.typography.caption.lineHeight,
    color: colors.text,
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}
