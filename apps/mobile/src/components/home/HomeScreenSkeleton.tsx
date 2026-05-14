import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export function HomeScreenSkeleton() {
  const { tokens } = useTheme();

  const containerStyle: ViewStyle = {
    paddingHorizontal: 20,
    paddingTop: 0,
  };

  const sectionGap: ViewStyle = {
    marginBottom: tokens.spacing.lg,
  };

  return (
    <View style={containerStyle}>
      {/* Hero placeholder */}
      <LoadingSkeleton
        width="100%"
        height={260}
        borderRadius={0}
        style={{ marginBottom: tokens.spacing.lg, marginHorizontal: -20 }}
      />

      {/* Next Service Card placeholder */}
      <LoadingSkeleton
        width="100%"
        height={140}
        borderRadius={16}
        style={sectionGap}
      />

      {/* Property Snapshot row placeholder */}
      <View style={{ flexDirection: 'row', gap: 12, ...sectionGap }}>
        <LoadingSkeleton width={0} height={100} borderRadius={12} style={{ flex: 1 }} />
        <LoadingSkeleton width={0} height={100} borderRadius={12} style={{ flex: 1 }} />
        <LoadingSkeleton width={0} height={100} borderRadius={12} style={{ flex: 1 }} />
      </View>

      {/* Quick Actions placeholder */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', ...sectionGap }}>
        <LoadingSkeleton width={64} height={64} borderRadius={32} />
        <LoadingSkeleton width={64} height={64} borderRadius={32} />
        <LoadingSkeleton width={64} height={64} borderRadius={32} />
        <LoadingSkeleton width={64} height={64} borderRadius={32} />
      </View>
    </View>
  );
}
