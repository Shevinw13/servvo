/**
 * Servvo Customer App
 * Main application entry point.
 *
 * Wraps the app with ErrorBoundary and BrandThemeProvider,
 * then renders the RootNavigator which handles auth state switching.
 */

import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <BrandThemeProvider>
        <RootNavigator />
      </BrandThemeProvider>
    </ErrorBoundary>
  );
}
