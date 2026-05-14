'use client';

import { Customer } from '@/types/customer';
import { cn } from '@/lib/utils';
import { MapPin, Calendar } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600' },
  due_for_rebooking: { label: 'Due for Rebooking', className: 'bg-amber-100 text-amber-700' },
};

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const status = STATUS_STYLES[customer.engagementStatus] || STATUS_STYLES.active;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {customer.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-foreground">{customer.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{customer.propertyAddress}</span>
            </div>
          </div>
        </div>
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', status.className)}>
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Last: {new Date(customer.lastServiceDate).toLocaleDateString()}</span>
        </div>
        <span>•</span>
        <span>{customer.metrics.totalServices} services</span>
        <span>•</span>
        <span>★ {customer.metrics.averageRating}</span>
      </div>
    </button>
  );
}
