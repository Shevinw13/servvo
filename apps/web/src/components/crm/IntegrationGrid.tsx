'use client';

import { useCRMConnections } from '@/hooks/useCRMConnections';
import { MOCK_CRM_INTEGRATIONS } from '@/data/mockCRMIntegrations';
import { IntegrationCard } from './IntegrationCard';
import { AnimatedCard } from '@/components/shared/AnimatedCard';

export function IntegrationGrid() {
  const { connect, disconnect, getConnection } = useCRMConnections();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {MOCK_CRM_INTEGRATIONS.map((integration, i) => {
        const connection = getConnection(integration.id);
        return (
          <AnimatedCard key={integration.id} delay={0.1 * i}>
            <IntegrationCard
              integration={integration}
              isConnected={connection.isConnected}
              lastSynced={connection.lastSynced}
              onConnect={() => connect(integration.id)}
              onDisconnect={() => disconnect(integration.id)}
            />
          </AnimatedCard>
        );
      })}
    </div>
  );
}
