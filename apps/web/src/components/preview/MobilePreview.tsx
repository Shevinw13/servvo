'use client';

import { useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { PreviewNavigation } from './PreviewNavigation';
import { HomeDashboardScreen } from './screens/HomeDashboardScreen';
import { ServiceStatusScreen } from './screens/ServiceStatusScreen';
import { ProviderProfileScreen } from './screens/ProviderProfileScreen';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { cn } from '@/lib/utils';

interface MobilePreviewProps {
  mode?: 'panel' | 'overlay';
  className?: string;
}

const SCREENS = ['Home', 'Service Status', 'Provider Profile'];

export function MobilePreview({ mode = 'panel', className }: MobilePreviewProps) {
  const { config } = useBrandConfig();
  const [activeScreen, setActiveScreen] = useState(0);

  const renderScreen = () => {
    switch (activeScreen) {
      case 0:
        return <HomeDashboardScreen config={config} />;
      case 1:
        return <ServiceStatusScreen config={config} />;
      case 2:
        return <ProviderProfileScreen config={config} />;
      default:
        return <HomeDashboardScreen config={config} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <PhoneFrame>{renderScreen()}</PhoneFrame>
      <PreviewNavigation
        screens={SCREENS}
        activeIndex={activeScreen}
        onChange={setActiveScreen}
      />
    </div>
  );
}
