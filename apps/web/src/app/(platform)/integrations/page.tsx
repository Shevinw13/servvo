'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { IntegrationGrid } from '@/components/crm/IntegrationGrid';

export default function IntegrationsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CRM Integrations</h1>
          <p className="mt-1 text-muted-foreground">
            Connect your existing tools to sync customer data
          </p>
        </div>
        <IntegrationGrid />
      </div>
    </PageTransition>
  );
}
