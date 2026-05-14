import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { withOpacity } from '@/utils/colorUtils';

export interface ImageWithFallbackProps {
  uri: string;
  fallbackIcon?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
  borderRadius?: number;
}

export function ImageWithFallback({
  uri,
  fallbackIcon = 'image',
  style,
  borderRadius = 0,
}: ImageWithFallbackProps) {
  const { tokens } = useTheme();
  const [hasError, setHasError] = useState(false);

  if (hasError || !uri) {
    const placeholderStyle: ViewStyle = {
      overflow: 'hidden',
      borderRadius,
      ...style,
      backgroundColor: withOpacity(tokens.colors.primary, 0.05),
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <View style={placeholderStyle}>
        <Feather name={fallbackIcon} size={32} color={tokens.colors.textMuted} />
      </View>
    );
  }

  const imageStyle: ImageStyle = {
    overflow: 'hidden',
    borderRadius,
    ...(style as ImageStyle),
  };

  return (
    <Image
      source={{ uri }}
      style={imageStyle}
      contentFit="cover"
      onError={() => setHasError(true)}
    />
  );
}
