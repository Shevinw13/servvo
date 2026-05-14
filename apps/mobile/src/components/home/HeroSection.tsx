import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { buildGreeting } from '@/utils/greetingUtils';
import { Typography } from '@/components/ui/Typography';

export interface HeroSectionProps {
  imageUri: string;
  firstName: string;
}

export function HeroSection({ imageUri, firstName }: HeroSectionProps) {
  const currentHour = new Date().getHours();
  const greeting = buildGreeting(firstName, currentHour);

  const containerStyle: ViewStyle = {
    width: '100%',
    height: 260,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  };

  const gradientStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  };

  const greetingContainerStyle: ViewStyle = {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
  };

  const greetingTextStyle: TextStyle = {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  };

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri: imageUri }}
        style={imageStyle}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
        style={gradientStyle}
      />
      <View style={greetingContainerStyle}>
        <Typography variant="display" color="#FFFFFF" style={greetingTextStyle}>
          {greeting}
        </Typography>
      </View>
    </View>
  );
}
