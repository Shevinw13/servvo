/**
 * MainTabNavigator — Clean bottom tab navigator.
 * 4 tabs: Home, Schedule, Messages, Account.
 * Feather icons, forest green active state, minimal styling.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
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

function PlaceholderScreen({ name }: { name: string }) {
  const { tokens } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: tokens.colors.background }]}>
      <Typography variant="h2">{name}</Typography>
      <Typography variant="body" color={tokens.colors.textSecondary} style={styles.subtitle}>
        Coming soon
      </Typography>
    </View>
  );
}

function HomeScreen() {
  return <DashboardScreen />;
}

function ScheduleNavigator() {
  const { tokens } = useTheme();
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.colors.background },
        headerTintColor: tokens.colors.text,
        headerShadowVisible: false,
      }}
    >
      <AppointmentsStack.Screen name="AppointmentsList" component={AppointmentsListScreen} options={{ headerShown: false }} />
      <AppointmentsStack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} options={{ title: 'Appointment' }} />
      <AppointmentsStack.Screen name="Reschedule" component={RescheduleScreen} options={{ title: 'Reschedule' }} />
    </AppointmentsStack.Navigator>
  );
}

function MessagesScreen() {
  return <PlaceholderScreen name="Messages" />;
}

function AccountScreen() {
  return <PlaceholderScreen name="Account" />;
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
          backgroundColor: '#FFFFFF',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: tokens.colors.border,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={22} color={color} />,
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
});
