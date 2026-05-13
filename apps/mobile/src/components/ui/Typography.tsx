import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption';
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export function Typography({
  variant = 'body',
  color,
  children,
  style,
  numberOfLines,
}: TypographyProps) {
  const { tokens } = useTheme();

  const typographyToken = tokens.typography[variant];

  const textStyle: TextStyle = {
    fontSize: typographyToken.fontSize,
    fontWeight: typographyToken.fontWeight,
    lineHeight: typographyToken.lineHeight,
    color: color ?? tokens.colors.text,
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}
