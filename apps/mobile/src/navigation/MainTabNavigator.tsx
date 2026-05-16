/**
 * MainTabNavigator — Clean bottom tab navigator.
 * 4 tabs: Home, Schedule, Messages, Account.
 * Feather icons, forest green active state, minimal styling.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { DashboardScreen } from '@/screens/home/DashboardScreen';
import {
  AppointmentsScreen as AppointmentsListScreen,
  AppointmentDetailScreen,
  RescheduleScreen,
  ServiceHistoryScreen,
} from '@/screens/appointments';
import { MessagesScreen as MessagesScreenComponent } from '@/screens/messages';
import {
  BillingScreen as BillingScreenComponent,
  InvoiceDetailScreen,
  PaymentScreen,
} from '@/screens/billing';
import { ProfileScreen as ProfileScreenComponent } from '@/screens/profile/ProfileScreen';
import { NotificationPrefsScreen } from '@/screens/profile/NotificationPrefsScreen';
import { ReviewFlowScreen } from '@/screens/reviews/ReviewFlowScreen';
import { RebookingScreen } from '@/screens/bookings/RebookingScreen';
import type { MainTabParamList, AppointmentsStackParamList, AccountStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const AppointmentsStack = createNativeStackNavigator<AppointmentsStackParamList>();
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

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
      <AppointmentsStack.Screen name="ServiceHistory" component={ServiceHistoryScreen} options={{ title: 'Service History' }} />
      <AppointmentsStack.Screen name="ReviewFlow" component={ReviewFlowScreen} options={{ title: 'Leave a Review' }} />
      <AppointmentsStack.Screen name="Rebooking" component={RebookingScreen} options={{ title: 'Book a Service' }} />
    </AppointmentsStack.Navigator>
  );
}

function MessagesScreen() {
  return <MessagesScreenComponent />;
}

function AccountNavigator() {
  const { tokens } = useTheme();
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.colors.background },
        headerTintColor: tokens.colors.text,
        headerShadowVisible: false,
      }}
    >
      <AccountStack.Screen name="Profile" component={ProfileScreenComponent} options={{ headerShown: false }} />
      <AccountStack.Screen name="NotificationPrefs" component={NotificationPrefsScreen} options={{ title: 'Notifications' }} />
      <AccountStack.Screen name="BillingHome" component={BillingScreenComponent} options={{ title: 'Billing' }} />
      <AccountStack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ title: 'Invoice' }} />
      <AccountStack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
    </AccountStack.Navigator>
  );
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
          borderTopWidth: 0,
          borderTopColor: tokens.colors.border,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowRadius: 4,
          shadowOpacity: 0.04,
          paddingTop: 8,
          paddingBottom: 4,
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
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={{
          tabBarIcon: ({ color }) => <Feather name="calendar" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
