/**
 * Navigation type definitions for the Servvo customer app.
 * Provides type-safe navigation params for all stacks.
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Auth stack param list — screens shown before the user is authenticated.
 */
export type AuthStackParamList = {
  Welcome: undefined;
  PhoneInput: undefined;
  OTP: { phoneNumber: string };
};

/**
 * Onboarding stack param list — screens shown after auth but before main app.
 */
export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  PropertySetup: { name: string; email?: string };
  Confirmation: undefined;
};

/**
 * Appointments stack param list — screens within the Schedule tab.
 */
export type AppointmentsStackParamList = {
  AppointmentsList: undefined;
  AppointmentDetail: { appointmentId: string };
  Reschedule: { appointmentId: string };
};

/**
 * Main tab param list — bottom tab navigator screens.
 * 4 tabs: Home, Schedule, Messages, Account
 */
export type MainTabParamList = {
  Home: undefined;
  Schedule: undefined;
  Messages: undefined;
  Account: undefined;
};

/**
 * Root stack param list — top-level navigation structure.
 */
export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

// Screen prop types for auth screens
export type WelcomeScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'Welcome'
>;

export type PhoneInputScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'PhoneInput'
>;

export type OTPScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'OTP'
>;

// Screen prop types for onboarding screens
export type ProfileSetupScreenNavigationProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'ProfileSetup'
>;

export type PropertySetupScreenNavigationProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'PropertySetup'
>;

export type ConfirmationScreenNavigationProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'Confirmation'
>;

// Screen prop types for appointments screens
export type AppointmentsListScreenNavigationProps = NativeStackScreenProps<
  AppointmentsStackParamList,
  'AppointmentsList'
>;

export type AppointmentDetailScreenNavigationProps = NativeStackScreenProps<
  AppointmentsStackParamList,
  'AppointmentDetail'
>;

export type RescheduleScreenNavigationProps = NativeStackScreenProps<
  AppointmentsStackParamList,
  'Reschedule'
>;
