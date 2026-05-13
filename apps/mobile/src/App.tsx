/**
 * Servvo Customer App
 * Main application entry point.
 *
 * Wraps the app with BrandThemeProvider and renders the RootNavigator
 * which handles auth state switching.
 */

import React from 'react';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <BrandThemeProvider>
      <RootNavigator />
    </BrandThemeProvider>
  );
}
