/**
 * DashboardScreen — Premium immersive home screen.
 * Hero → Floating Service Card → Property Insights → Activity Feed.
 * No quick actions. Calm, property-centric, emotionally sophisticated.
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
import { Typography } from '@/components/ui';
import { HeroSection } from '@/components/home/HeroSection';
import { NextServiceCard } from '@/components/home/NextServiceCard';
import { PropertySnapshot } from '@/components/home/PropertySnapshot';
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
    const timer = setTimeout(() => {
      setIsLoading(false);
      skeletonOpacity.value = withTiming(0, { duration: 250 });
      contentOpacity.value = withTiming(1, { duration: 300 });
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

  const handleServiceCardPress = useCallback(() => {
    navigation.navigate('Schedule');
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: tokens.colors.background }]}>
      {/* Hero Section - absolute positioned, immersive */}
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
          {/* Spacer for hero */}
          <View style={styles.heroSpacer} />

          {/* Floating Service Card */}
          <View style={styles.cardSection}>
            <NextServiceCard
              appointment={mockAppointment}
              onPress={handleServiceCardPress}
            />
          </View>

          {/* Property Insights */}
          <View style={styles.insightSection}>
            <Typography
              variant="subtitle"
              color={tokens.colors.textSecondary}
              style={styles.sectionLabel}
            >
              YOUR PROPERTY
            </Typography>
            <PropertySnapshot
              healthStatus={mockProperty.healthStatus}
              lastServiceDate={mockProperty.lastServiceDate}
              currentMonth={currentMonth}
            />
          </View>

          {/* Activity Feed */}
          <View style={styles.activitySection}>
            <Typography
              variant="subtitle"
              color={tokens.colors.textSecondary}
              style={styles.sectionLabel}
            >
              RECENT ACTIVITY
            </Typography>
            <ActivityTimeline events={mockEvents.slice(0, 4)} />
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
    paddingBottom: 48,
  },
  heroSpacer: {
    height: 260,
  },
  cardSection: {
    paddingHorizontal: 20,
    marginBottom: 36,
  },
  insightSection: {
    paddingHorizontal: 20,
    marginBottom: 36,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 14,
    letterSpacing: 1,
  },
});
