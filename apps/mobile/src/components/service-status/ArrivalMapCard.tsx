/**
 * ArrivalMapCard — Shows a static route map with ETA when provider is on the way.
 * Displays a map image showing the route from provider origin to homeowner property,
 * plus an ETA countdown. No live GPS tracking — calculated once on status change.
 *
 * Validates: Requirements 6.6, 6.7, 6.8, 6.9
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card } from '@/components/ui';

export interface ArrivalMapCardProps {
  /** Provider name to display */
  providerName: string;
  /** Estimated minutes until arrival */
  etaMinutes: number;
  /** When the "on the way" status was triggered */
  startedAt?: Date;
  /** Property address (destination) */
  destinationAddress?: string;
}

export function ArrivalMapCard({
  providerName,
  etaMinutes,
  startedAt,
  destinationAddress,
}: ArrivalMapCardProps) {
  const { tokens } = useTheme();
  const [remainingMinutes, setRemainingMinutes] = useState(etaMinutes);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    const start = startedAt ?? new Date();
    
    const updateCountdown = () => {
      const elapsed = (Date.now() - start.getTime()) / 60000; // minutes elapsed
      const remaining = Math.max(0, Math.round(etaMinutes - elapsed));
      setRemainingMinutes(remaining);
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 30000); // update every 30s

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [etaMinutes, startedAt]);

  return (
    <Card style={styles.container}>
      {/* Map placeholder — static route visualization */}
      <View style={[styles.mapContainer, { backgroundColor: '#E8F4E8' }]}>
        {/* Simulated map with route line */}
        <View style={styles.mapContent}>
          {/* Origin dot */}
          <View style={[styles.originDot, { backgroundColor: tokens.colors.primary }]} />
          
          {/* Route line (dashed) */}
          <View style={[styles.routeLine, { borderColor: tokens.colors.primary }]} />
          
          {/* Destination pin */}
          <View style={styles.destinationContainer}>
            <Feather name="home" size={16} color={tokens.colors.primary} />
          </View>

          {/* Provider vehicle icon on route */}
          <View style={[styles.vehicleIcon, { backgroundColor: tokens.colors.primary }]}>
            <Feather name="truck" size={12} color="#FFFFFF" />
          </View>
        </View>

        {/* Map overlay text */}
        <View style={styles.mapOverlay}>
          <Typography variant="caption" color={tokens.colors.textMuted}>
            Route to your property
          </Typography>
        </View>
      </View>

      {/* ETA info bar */}
      <View style={styles.etaBar}>
        <View style={styles.etaLeft}>
          <View style={[styles.etaPulse, { backgroundColor: '#2BA89D' }]} />
          <View>
            <Typography variant="bodyEmphasis" color={tokens.colors.text}>
              On the way
            </Typography>
            <Typography variant="caption" color={tokens.colors.textMuted}>
              {providerName} heading to you
            </Typography>
          </View>
        </View>

        <View style={styles.etaRight}>
          <Typography variant="h2" color={tokens.colors.primary}>
            {remainingMinutes}
          </Typography>
          <Typography variant="caption" color={tokens.colors.textSecondary}>
            min away
          </Typography>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    padding: 0,
  },
  mapContainer: {
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapContent: {
    width: '80%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    flex: 1,
    height: 0,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  destinationContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleIcon: {
    position: 'absolute',
    left: '35%',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  etaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  etaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  etaPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  etaRight: {
    alignItems: 'center',
    paddingLeft: 16,
  },
});
