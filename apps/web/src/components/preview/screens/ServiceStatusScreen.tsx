'use client';

import { BrandConfig } from '@/types/brand';

interface ServiceStatusScreenProps {
  config: BrandConfig;
}

const STEPS = [
  { label: 'Scheduled', complete: true },
  { label: 'En Route', complete: true },
  { label: 'In Progress', complete: false, active: true },
  { label: 'Complete', complete: false },
];

export function ServiceStatusScreen({ config }: ServiceStatusScreenProps) {
  const { colors, terminology } = config;

  return (
    <div className="flex flex-col px-4 pb-4">
      <div className="h-2" />

      <h2 className="mb-1 text-sm font-bold text-gray-900">Service Status</h2>
      <p className="mb-4 text-[10px] text-gray-500">Full Lawn Mowing</p>

      {/* Status Steps */}
      <div className="mb-4 space-y-0">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: step.complete || step.active ? colors.primary : '#e5e7eb',
                  backgroundColor: step.complete ? colors.primary : 'transparent',
                }}
              >
                {step.complete && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {step.active && (
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-6 w-0.5"
                  style={{ backgroundColor: step.complete ? colors.primary : '#e5e7eb' }}
                />
              )}
            </div>
            <div className="pb-4">
              <p
                className="text-[11px] font-medium"
                style={{ color: step.active ? colors.primary : step.complete ? '#111' : '#9ca3af' }}
              >
                {step.label}
              </p>
              {step.active && (
                <p className="text-[9px] text-gray-500">Your {terminology} is working now</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Provider Card */}
      <div className="rounded-xl border border-gray-100 p-3">
        <p className="text-[9px] font-medium uppercase tracking-wide text-gray-500">
          Your {terminology}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <div>
            <p className="text-[11px] font-semibold text-gray-900">Jake Thompson</p>
            <p className="text-[9px] text-gray-500">4.9 ★ • 120 services</p>
          </div>
        </div>
      </div>
    </div>
  );
}
