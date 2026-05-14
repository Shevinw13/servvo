'use client';

import { BrandConfig } from '@/types/brand';

interface HomeDashboardScreenProps {
  config: BrandConfig;
}

export function HomeDashboardScreen({ config }: HomeDashboardScreenProps) {
  const { colors, terminology, businessName } = config;

  return (
    <div className="flex flex-col px-4 pb-4">
      {/* Status bar spacer */}
      <div className="h-2" />

      {/* Greeting */}
      <div className="mb-4">
        <p className="text-xs text-gray-500">Good morning</p>
        <h2 className="text-base font-bold text-gray-900">Sarah M.</h2>
      </div>

      {/* Next Service Card */}
      <div
        className="mb-3 rounded-xl p-4"
        style={{ backgroundColor: colors.primary + '12' }}
      >
        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: colors.primary }}>
          Next Service
        </p>
        <p className="mt-1 text-xs font-semibold text-gray-900">Full Lawn Mowing</p>
        <p className="text-[10px] text-gray-600">Tomorrow, 9:00 AM</p>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <span className="text-[10px] text-gray-700">
            Your {terminology}: Jake T.
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-gray-100 p-3 text-center">
          <p className="text-[10px] font-medium text-gray-700">Book Service</p>
        </div>
        <div className="rounded-lg border border-gray-100 p-3 text-center">
          <p className="text-[10px] font-medium text-gray-700">Messages</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Recent
        </p>
        {[1, 2].map((i) => (
          <div key={i} className="mb-2 flex items-center gap-2 rounded-lg border border-gray-100 p-2">
            <div className="h-8 w-8 rounded-lg bg-gray-100" />
            <div>
              <p className="text-[10px] font-medium text-gray-900">Lawn Mowing</p>
              <p className="text-[9px] text-gray-500">Mar {10 + i} • Completed</p>
            </div>
          </div>
        ))}
      </div>

      {/* Brand footer */}
      {businessName && (
        <div className="mt-4 text-center">
          <p className="text-[8px] text-gray-400">Powered by {businessName}</p>
        </div>
      )}
    </div>
  );
}
