'use client';

import { CountUpNumber } from './CountUpNumber';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  format?: 'number' | 'percentage' | 'rating';
  trend?: { direction: 'up' | 'down'; percentage: number };
  animateOnMount?: boolean;
}

export function MetricCard({
  label,
  value,
  format = 'number',
  trend,
  animateOnMount = true,
}: MetricCardProps) {
  const formatValue = (v: number) => {
    switch (format) {
      case 'percentage':
        return `${v}%`;
      case 'rating':
        return (v / 10).toFixed(1);
      default:
        return v.toLocaleString();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-3xl font-bold text-foreground">
          {animateOnMount ? (
            <CountUpNumber
              end={format === 'rating' ? Math.round(value * 10) : value}
              format={formatValue}
            />
          ) : (
            formatValue(value)
          )}
        </p>
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              trend.direction === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.percentage}%
          </div>
        )}
      </div>
    </div>
  );
}
