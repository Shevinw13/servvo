'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/shared/PageTransition';
import { CustomerList } from '@/components/customers/CustomerList';
import { CustomerDetailPanel } from '@/components/customers/CustomerDetailPanel';
import { EngagementSummary } from '@/components/customers/EngagementSummary';
import { MOCK_CUSTOMERS } from '@/data/mockCustomers';

export default function CustomersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedCustomer = MOCK_CUSTOMERS.find((c) => c.id === selectedId) || null;

  const totalCustomers = MOCK_CUSTOMERS.length;
  const activeCustomers = MOCK_CUSTOMERS.filter((c) => c.engagementStatus === 'active').length;
  const dueForRebooking = MOCK_CUSTOMERS.filter((c) => c.engagementStatus === 'due_for_rebooking').length;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your customer base and track engagement
          </p>
        </div>

        <EngagementSummary
          totalCustomers={totalCustomers}
          activeCustomers={activeCustomers}
          dueForRebooking={dueForRebooking}
        />

        <CustomerList
          customers={MOCK_CUSTOMERS}
          onSelectCustomer={setSelectedId}
        />

        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </PageTransition>
  );
}
