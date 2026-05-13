/**
 * StatusBadge — Compact badge showing current service status text.
 * Color-coded by status: scheduled=info, on_the_way=warning, completed=success, etc.
 *
 * Validates: Requirements 4.2
 */

import React from 'react';
import { Badge } from '@/components/ui';
import { ViewStyle } from 'react-native';
import type { ServiceStatus } from './StatusProgressBar';

export interface StatusBadgeProps {
  status: ServiceStatus;
  style?: ViewStyle;
}

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

function getVariant(status: ServiceStatus): BadgeVariant {
  switch (status) {
    case 'scheduled':
      return 'info';
    case 'provider_assigned':
      return 'info';
    case 'on_the_way':
      return 'warning';
    case 'arrived':
      return 'warning';
    case 'in_progress':
      return 'success';
    case 'completed':
      return 'success';
    default:
      return 'neutral';
  }
}

function getLabel(status: ServiceStatus): string {
  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'provider_assigned':
      return 'Provider Assigned';
    case 'on_the_way':
      return 'On The Way';
    case 'arrived':
      return 'Arrived';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  return (
    <Badge
      label={getLabel(status)}
      variant={getVariant(status)}
      style={style}
    />
  );
}
