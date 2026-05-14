import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from '@/components/ui/Typography';

export interface ServiceEvent {
  id: string;
  title: string;
  timestamp: Date;
  status: 'completed' | 'scheduled';
}

export interface ActivityTimelineProps {
  events: ServiceEvent[];
}

function getRelativeTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(Math.abs(diffMs) / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const isFuture = diffMs < 0;

  if (diffMins < 60) {
    return isFuture ? `in ${diffMins}m` : `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return isFuture ? `in ${diffHours}h` : `${diffHours}h ago`;
  }
  return isFuture ? `in ${diffDays}d` : `${diffDays}d ago`;
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const { tokens } = useTheme();

  if (events.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: tokens.spacing.xl }}>
        <Feather name="clock" size={28} color={tokens.colors.textMuted} />
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={{ marginTop: 12, textAlign: 'center' }}
        >
          Your lawn journey begins soon
        </Typography>
        <Typography
          variant="bodySmall"
          color={tokens.colors.textMuted}
          style={{ marginTop: 4, textAlign: 'center' }}
        >
          Activity will appear after your first service
        </Typography>
      </View>
    );
  }

  // Sort by timestamp descending and take max 5
  const sortedEvents = [...events]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return (
    <View>
      {sortedEvents.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isLast={index === sortedEvents.length - 1}
          tokens={tokens}
        />
      ))}
    </View>
  );
}

interface TimelineItemProps {
  event: ServiceEvent;
  isLast: boolean;
  tokens: ReturnType<typeof import('@/theme/BrandThemeProvider').useTheme>['tokens'];
}

function TimelineItem({ event, isLast, tokens }: TimelineItemProps) {
  const isCompleted = event.status === 'completed';

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    minHeight: 48,
  };

  const iconColumnStyle: ViewStyle = {
    width: 32,
    alignItems: 'center',
  };

  const iconCircleStyle: ViewStyle = {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: isCompleted ? 'rgba(45, 106, 45, 0.12)' : 'rgba(140, 140, 140, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const lineStyle: ViewStyle = {
    width: 2,
    flex: 1,
    backgroundColor: tokens.colors.border,
    marginTop: 4,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    marginLeft: 12,
    paddingBottom: isLast ? 0 : 20,
  };

  return (
    <View style={rowStyle}>
      <View style={iconColumnStyle}>
        <View style={iconCircleStyle}>
          <Feather
            name={isCompleted ? 'check' : 'clock'}
            size={14}
            color={isCompleted ? tokens.colors.success : tokens.colors.textMuted}
          />
        </View>
        {!isLast && <View style={lineStyle} />}
      </View>
      <View style={contentStyle}>
        <Typography variant="body" style={{ marginBottom: 2 }}>
          {event.title}
        </Typography>
        <Typography variant="caption" color={tokens.colors.textMuted}>
          {getRelativeTime(event.timestamp)}
        </Typography>
      </View>
    </View>
  );
}
