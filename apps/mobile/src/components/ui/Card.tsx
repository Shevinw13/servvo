import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const { tokens } = useTheme();

  const shadowTokens =
    variant === 'elevated' ? tokens.shadows.lg : tokens.shadows.md;

  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colors.surfaceElevated,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    shadowColor: '#000',
    shadowOffset: shadowTokens.shadowOffset,
    shadowRadius: shadowTokens.shadowRadius,
    shadowOpacity: shadowTokens.shadowOpacity,
    elevation: shadowTokens.elevation,
  };

  return <View style={[cardStyle, style]}>{children}</View>;
}
