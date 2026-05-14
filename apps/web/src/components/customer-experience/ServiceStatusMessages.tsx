'use client';

import { useBrandConfig } from '@/hooks/useBrandConfig';

const SERVICE_STAGES = [
  { id: 'scheduled', label: 'Scheduled', message: 'Your service has been scheduled and confirmed.' },
  { id: 'en-route', label: 'En Route', message: 'Your provider is on the way to your property.' },
  { id: 'in-progress', label: 'In Progress', message: 'Service is currently underway at your property.' },
  { id: 'complete', label: 'Complete', message: 'Your service has been completed successfully.' },
];

export function ServiceStatusMessages() {
  const { config } = useBrandConfig();

  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">Service Status Messages</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        What homeowners see at each stage of their service
      </p>
      <div className="space-y-3">
        {SERVICE_STAGES.map((stage, i) => (
          <div
            key={stage.id}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: config.colors.primary }}
              >
                {i + 1}
              </div>
              {i < SERVICE_STAGES.length - 1 && (
                <div className="mt-1 h-6 w-0.5 bg-border" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{stage.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stage.message.replace('provider', config.terminology.toLowerCase())}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
