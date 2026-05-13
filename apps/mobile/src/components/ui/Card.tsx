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

  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colors.surfaceElevated,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  };

  // Only add subtle shadow for elevated variant
  if (variant === 'elevated') {
    const shadowTokens = tokens.shadows.sm;
    cardStyle.shadowColor = '#000';
    cardStyle.shadowOffset = shadowTokens.shadowOffset;
    cardStyle.shadowRadius = shadowTokens.shadowRadius;
    cardStyle.shadowOpacity = shadowTokens.shadowOpacity;
    cardStyle.elevation = shadowTokens.elevation;
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
