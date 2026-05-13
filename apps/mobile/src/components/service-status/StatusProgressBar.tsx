/**
 * StatusProgressBar — Visual horizontal progress bar showing service status stages.
 * Displays the progression: Scheduled → Provider Assigned → On The Way → Arrived → In Progress → Completed.
 *
 * Validates: Requirements 4.2
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useTerminology } from '@/utils/terminology';

export type ServiceStatus =
  | 'scheduled'
  | 'provider_assigned'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed';

const STAGES: ServiceStatus[] = [
  'scheduled',
  'provider_assigned',
  'on_the_way',
  'arrived',
  'in_progress',
  'completed',
];

export interface StatusProgressBarProps {
  currentStatus: ServiceStatus;
  style?: ViewStyle;
}

export function StatusProgressBar({ currentStatus, style }: StatusProgressBarProps) {
  const { tokens } = useTheme();
  const { resolve } = useTerminology();

  const currentIndex = STAGES.indexOf(currentStatus);

  const getStageLabel = (stage: ServiceStatus): string => {
    switch (stage) {
      case 'scheduled':
        return 'Scheduled';
      case 'provider_assigned':
        return resolve('{{Provider}} Assigned');
      case 'on_the_way':
        return 'On The Way';
      case 'arrived':
        return 'Arrived';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
    }
  };

  return (
    <View style={[styles.container, style]} accessibilityRole="progressbar">
      {/* Progress line */}
      <View style={styles.lineContainer}>
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STAGES.length - 1;

          return (
            <View key={stage} style={styles.stageItem}>
              {/* Dot */}
              <View
                style={[
                  styles.dot,
                  isCompleted && {
                    backgroundColor: tokens.colors.success,
                  },
                  isCurrent && {
                    backgroundColor: tokens.colors.primary,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                  },
                  !isCompleted && !isCurrent && {
                    backgroundColor: tokens.colors.border,
                  },
                ]}
              >
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>

              {/* Connector line (not after last) */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        index < currentIndex
                          ? tokens.colors.success
                          : tokens.colors.border,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Labels */}
      <View style={styles.labelsContainer}>
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <View key={`label-${stage}`} style={styles.labelItem}>
              <Text
                style={[
                  styles.label,
                  {
                    color: isCurrent
                      ? tokens.colors.primary
                      : isCompleted
                        ? tokens.colors.success
                        : tokens.colors.textMuted,
                    fontWeight: isCurrent ? '600' : '400',
                  },
                ]}
                numberOfLines={2}
              >
                {getStageLabel(stage)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '700',
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    marginTop: 6,
    paddingHorizontal: 0,
  },
  labelItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
});
