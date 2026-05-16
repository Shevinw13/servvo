import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { buildGreeting, buildIndustryGreeting } from '@/utils/greetingUtils';
import { Typography } from '@/components/ui/Typography';
import { IndustryConfig } from '@/config/industry.types';

export interface HeroSectionProps {
  imageUri: string;
  firstName: string;
  /** Optional industry greeting line — enables industry-aware greeting */
  greetingLine?: string;
  /** Optional full industry config for buildIndustryGreeting */
  config?: IndustryConfig;
}

export function HeroSection({ imageUri, firstName, greetingLine, config }: HeroSectionProps) {
  const currentHour = new Date().getHours();

  // Use industry-aware greeting if config is provided, otherwise fall back to default
  let greeting: string;
  if (config) {
    greeting = buildIndustryGreeting(config, firstName, currentHour);
  } else if (greetingLine) {
    // Build a minimal config-like greeting using the greetingLine
    greeting = buildIndustryGreeting(
      { hero: { greetingLine, imageUri } } as IndustryConfig,
      firstName,
      currentHour
    );
  } else {
    greeting = buildGreeting(firstName, currentHour);
  }

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
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  };

  const greetingContainerStyle: ViewStyle = {
    position: 'absolute',
    bottom: 44,
    left: 20,
    right: 20,
  };

  const greetingTextStyle: TextStyle = {
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  };

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri: imageUri }}
        style={imageStyle}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.03)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.65)']}
        style={gradientStyle}
      />
      <View style={greetingContainerStyle}>
        <Typography variant="h2" color="#FFFFFF" style={greetingTextStyle}>
          {greeting}
        </Typography>
      </View>
    </View>
  );
}
