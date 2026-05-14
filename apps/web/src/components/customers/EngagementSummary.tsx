'use client';

import { Users, UserCheck, Clock } from 'lucide-react';
import { AnimatedCard } from '@/components/shared/AnimatedCard';

interface EngagementSummaryProps {
  totalCustomers: number;
  activeCustomers: number;
  dueForRebooking: number;
}

export function EngagementSummary({
  totalCustomers,
  activeCustomers,
  dueForRebooking,
}: EngagementSummaryProps) {
  const metrics = [
    {
      label: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Active',
      value: activeCustomers,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Due for Rebooking',
      value: dueForRebooking,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric, i) => (
        <AnimatedCard key={metric.label} delay={0.1 * i}>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.bg}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}
