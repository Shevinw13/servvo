'use client';

import { useState } from 'react';
import { Customer } from '@/types/customer';
import { CustomerCard } from './CustomerCard';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Search } from 'lucide-react';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (id: string) => void;
}

export function CustomerList({ customers, onSelectCustomer }: CustomerListProps) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.propertyAddress.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or address..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No customers found matching &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((customer, i) => (
            <AnimatedCard key={customer.id} delay={0.05 * Math.min(i, 8)}>
              <CustomerCard
                customer={customer}
                onClick={() => onSelectCustomer(customer.id)}
              />
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
