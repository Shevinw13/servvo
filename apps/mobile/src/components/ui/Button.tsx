import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { tokens } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: tokens.borderRadius.md,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: tokens.colors.primary,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: tokens.colors.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: tokens.typography.button.fontSize,
      fontWeight: tokens.typography.button.fontWeight,
      lineHeight: tokens.typography.button.lineHeight,
    };

    switch (variant) {
      case 'primary':
        return { ...base, color: '#FFFFFF' };
      case 'secondary':
      case 'ghost':
        return { ...base, color: tokens.colors.primary };
    }
  };

  const getIndicatorColor = (): string => {
    return variant === 'primary' ? '#FFFFFF' : tokens.colors.primary;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), disabled && { opacity: 0.5 }, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={getIndicatorColor()} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}
