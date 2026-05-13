/**
 * MainTabNavigator — Bottom tab navigator for the main app experience.
 * Provides 5 tabs: Home, Appointments, Messages, Billing, Profile.
 *
 * Applies branded tab bar styling with white background, no top border,
 * primary color for active tabs, and gray for inactive.
 *
 * Validates: Requirements 4.1, 14.1
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from '@/components/ui';
import { DashboardScreen } from '@/screens/home/DashboardScreen';
import {
  AppointmentsScreen as AppointmentsListScreen,
  AppointmentDetailScreen,
  RescheduleScreen,
} from '@/screens/appointments';
import type { MainTabParamList, AppointmentsStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const AppointmentsStack = createNativeStackNavigator<AppointmentsStackParamList>();

/** Placeholder screen component for tabs — replaced by real screens in later tasks. */
function PlaceholderScreen({ name }: { name: string }) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.placeholder, { backgroundColor: tokens.colors.background }]}>
      <Typography variant="h2">{name}</Typography>
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.subtitle}
      >
        Coming soon
      </Typography>
    </View>
  );
}

function HomeScreen() {
  return <DashboardScreen />;
}

function AppointmentsNavigator() {
  const { tokens } = useTheme();

  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.colors.background },
        headerTintColor: tokens.colors.text,
        headerShadowVisible: false,
      }}
    >
      <AppointmentsStack.Screen
        name="AppointmentsList"
        component={AppointmentsListScreen}
        options={{ headerShown: false }}
      />
      <AppointmentsStack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ title: 'Appointment' }}
      />
      <AppointmentsStack.Screen
        name="Reschedule"
        component={RescheduleScreen}
        options={{ title: 'Reschedule' }}
      />
    </AppointmentsStack.Navigator>
  );
}

function MessagesScreen() {
  return <PlaceholderScreen name="Messages" />;
}

function BillingScreen() {
  return <PlaceholderScreen name="Billing" />;
}

function ProfileScreen() {
  return <PlaceholderScreen name="Profile" />;
}

export function MainTabNavigator() {
  const { tokens } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.textMuted,
        tabBarStyle: {
          backgroundColor: tokens.colors.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Text style={styles.icon}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsNavigator}
        options={{
          tabBarIcon: () => <Text style={styles.icon}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: () => <Text style={styles.icon}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingScreen}
        options={{
          tabBarIcon: () => <Text style={styles.icon}>💳</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <Text style={styles.icon}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  icon: {
    fontSize: 22,
  },
});
