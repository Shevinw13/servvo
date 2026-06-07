import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation';

export interface StatusPillProps {
  status: 'confirmed' | 'scheduled' | 'en_route' | 'on_the_way' | 'completed' | 'in_progress' | 'provider_assigned' | 'arrived';
  animated?: boolean;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: 'rgba(45, 106, 45, 0.12)', text: '#2D6A2D' },
  completed: { bg: 'rgba(45, 106, 45, 0.12)', text: '#2D6A2D' },
  scheduled: { bg: 'rgba(37, 99, 235, 0.12)', text: '#2563EB' },
  en_route: { bg: 'rgba(183, 121, 31, 0.12)', text: '#B7791F' },
  on_the_way: { bg: 'rgba(183, 121, 31, 0.12)', text: '#B7791F' },
  in_progress: { bg: 'rgba(37, 99, 235, 0.12)', text: '#2563EB' },
  provider_assigned: { bg: 'rgba(37, 99, 235, 0.12)', text: '#2563EB' },
  arrived: { bg: 'rgba(45, 106, 45, 0.12)', text: '#2D6A2D' },
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  completed: 'Completed',
  scheduled: 'Scheduled',
  en_route: 'En Route',
  on_the_way: 'On The Way',
  in_progress: 'In Progress',
  provider_assigned: 'Assigned',
  arrived: 'Arrived',
};

export function StatusPill({ status, animated = false }: StatusPillProps) {
  const { animatedStyle } = useEntranceAnimation({
    initialScale: animated ? 0.8 : 1,
    duration: 300,
  });

  const colors = STATUS_COLORS[status] || { bg: 'rgba(107, 114, 128, 0.12)', text: '#6B7280' };

  const pillStyle: ViewStyle = {
    backgroundColor: colors.bg,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  };

  const textStyle: TextStyle = {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  };

  const content = (
    <View style={pillStyle}>
      <Text style={textStyle}>{STATUS_LABELS[status] || status}</Text>
    </View>
  );

  if (animated) {
    return <Animated.View style={animatedStyle}>{content}</Animated.View>;
  }

  return content;
}
