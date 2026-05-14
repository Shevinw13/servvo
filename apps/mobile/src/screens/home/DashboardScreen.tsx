/**
 * DashboardScreen — Redesigned premium home screen.
 * Hero section with parallax layering, next service card, property snapshot,
 * quick actions, and activity timeline. Loading skeleton with crossfade.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { HeroSection } from '@/components/home/HeroSection';
import { NextServiceCard } from '@/components/home/NextServiceCard';
import { PropertySnapshot } from '@/components/home/PropertySnapshot';
import { QuickActions, QuickActionItem } from '@/components/home/QuickActions';
import { ActivityTimeline } from '@/components/home/ActivityTimeline';
import { HomeScreenSkeleton } from '@/components/home/HomeScreenSkeleton';
import { mockUser, mockAppointment, mockEvents, mockProperty } from '@/data/mockHomeData';

export function DashboardScreen() {
  const { tokens } = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const contentOpacity = useSharedValue(0);
  const skeletonOpacity = useSharedValue(1);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      skeletonOpacity.value = withTiming(0, { duration: 200 });
      contentOpacity.value = withTiming(1, { duration: 200 });
    }, 800);

    return () => clearTimeout(timer);
  }, [contentOpacity, skeletonOpacity]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const skeletonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skeletonOpacity.value,
  }));

  const firstName = user?.name?.split(' ')[0] ?? mockUser.name.split(' ')[0];
  const propertyImageUri = mockUser.propertyImageUri;
  const currentMonth = new Date().getMonth() + 1;

  const quickActions: QuickActionItem[] = [
    {
      id: 'book',
      icon: 'plus-circle',
      label: 'Book Service',
      onPress: () => navigation.navigate('Schedule'),
    },
    {
      id: 'payments',
      icon: 'credit-card',
      label: 'Payments',
      onPress: () => navigation.navigate('Account'),
    },
    {
      id: 'contact',
      icon: 'phone',
      label: 'Contact Team',
      onPress: () => navigation.navigate('Messages'),
    },
    {
      id: 'quote',
      icon: 'file-text',
      label: 'Request Quote',
      onPress: () => navigation.navigate('Schedule'),
    },
  ];

  const handleServiceCardPress = useCallback(() => {
    navigation.navigate('Schedule');
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: tokens.colors.background }]}>
      {/* Hero Section - absolute positioned */}
      <HeroSection imageUri={propertyImageUri} firstName={firstName} />

      {/* Loading Skeleton */}
      {isLoading && (
        <Animated.View style={[styles.skeletonContainer, skeletonAnimatedStyle]}>
          <HomeScreenSkeleton />
        </Animated.View>
      )}

      {/* Main Content */}
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Spacer for hero overlap */}
          <View style={styles.heroSpacer} />

          {/* Next Service Card */}
          <View style={styles.section}>
            <NextServiceCard
              appointment={mockAppointment}
              onPress={handleServiceCardPress}
            />
          </View>

          {/* Property Snapshot */}
          <View style={styles.section}>
            <PropertySnapshot
              healthStatus={mockProperty.healthStatus}
              lastServiceDate={mockProperty.lastServiceDate}
              currentMonth={currentMonth}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <QuickActions actions={quickActions} />
          </View>

          {/* Activity Timeline */}
          <View style={styles.section}>
            <ActivityTimeline events={mockEvents} />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  skeletonContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSpacer: {
    height: 220,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
});
