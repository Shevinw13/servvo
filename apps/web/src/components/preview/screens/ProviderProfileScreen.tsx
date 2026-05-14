'use client';

import { BrandConfig } from '@/types/brand';

interface ProviderProfileScreenProps {
  config: BrandConfig;
}

export function ProviderProfileScreen({ config }: ProviderProfileScreenProps) {
  const { colors, terminology } = config;

  return (
    <div className="flex flex-col px-4 pb-4">
      <div className="h-2" />

      {/* Header */}
      <div className="mb-4 flex flex-col items-center">
        <div
          className="mb-2 flex h-14 w-14 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-lg font-bold">JT</span>
        </div>
        <h2 className="text-sm font-bold text-gray-900">Jake Thompson</h2>
        <p className="text-[10px] text-gray-500">{terminology}</p>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px] text-yellow-500">★★★★★</span>
          <span className="text-[10px] text-gray-500">4.9 (120 reviews)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Services', value: '120' },
          { label: 'Years', value: '4' },
          { label: 'On Time', value: '99%' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-2 text-center"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <p className="text-xs font-bold" style={{ color: colors.primary }}>
              {stat.value}
            </p>
            <p className="text-[8px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Specialties
        </p>
        <div className="flex flex-wrap gap-1">
          {['Lawn Mowing', 'Edging', 'Fertilization', 'Weed Control'].map((s) => (
            <span
              key={s}
              className="rounded-full px-2 py-0.5 text-[9px] font-medium"
              style={{ backgroundColor: colors.accent + '20', color: colors.accent }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Recent Reviews
        </p>
        <div className="space-y-2">
          {['Great work on my lawn!', 'Always on time and professional.'].map((review, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-2">
              <p className="text-[9px] text-gray-700">&ldquo;{review}&rdquo;</p>
              <p className="mt-1 text-[8px] text-gray-400">— Customer {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
