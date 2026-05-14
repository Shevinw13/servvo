import React from 'react';
import { View, ViewStyle, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { withOpacity } from '@/utils/colorUtils';
import { Typography } from '@/components/ui/Typography';
import { StatusPill } from '@/components/ui/StatusPill';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  providerName: string;
  providerAvatarUri?: string;
  status: 'confirmed' | 'scheduled' | 'en_route' | 'completed';
}

export interface NextServiceCardProps {
  appointment: Appointment | null;
  onPress?: () => void;
}

export function NextServiceCard({ appointment, onPress }: NextServiceCardProps) {
  const { tokens } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    scalePressed: 0.97,
    disabled: !onPress || !appointment,
  });

  if (!appointment) {
    return <EmptyState screenType="appointments" />;
  }

  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colors.surfaceElevated,
    borderRadius: 16,
    padding: tokens.spacing.lg,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    shadowOpacity: 0.14,
    elevation: 10,
  };

  const avatarBorderStyle: ViewStyle = {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: withOpacity(tokens.colors.primary, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const headerRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  };

  const infoStyle: ViewStyle = {
    flex: 1,
    marginLeft: 12,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={cardStyle}
        accessibilityRole="button"
      >
        <View style={headerRowStyle}>
          <View style={avatarBorderStyle}>
            <Avatar
              uri={appointment.providerAvatarUri}
              initials={appointment.providerName.charAt(0)}
              size="md"
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
          <View style={infoStyle}>
            <Typography variant="bodyEmphasis">{appointment.providerName}</Typography>
            <StatusPill status={appointment.status} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Feather name="calendar" size={14} color={tokens.colors.textSecondary} />
          <Typography variant="body" style={{ marginLeft: 6 }}>
            {appointment.date} · {appointment.time}
          </Typography>
        </View>

        <Typography variant="h3" style={{ marginBottom: 8 }}>
          {appointment.serviceType}
        </Typography>

        <Typography variant="bodySmall" color={tokens.colors.primary}>
          View Details →
        </Typography>
      </Pressable>
    </Animated.View>
  );
}
