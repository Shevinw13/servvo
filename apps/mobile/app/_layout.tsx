/**
 * Root layout for Expo Router.
 * Delegates to the main App component which handles navigation internally.
 */

import { StatusBar } from 'expo-status-bar';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <BrandThemeProvider>
        <RootNavigator />
      </BrandThemeProvider>
    </>
  );
}
