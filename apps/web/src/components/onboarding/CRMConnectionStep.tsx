'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useCRMConnections } from '@/hooks/useCRMConnections';
import { MOCK_CRM_INTEGRATIONS } from '@/data/mockCRMIntegrations';
import { cn } from '@/lib/utils';
import { Plug, Check, Loader2 } from 'lucide-react';

interface CRMConnectionStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CRMConnectionStep({ onNext, onBack }: CRMConnectionStepProps) {
  const { setCRMSelection } = useOnboarding();
  const { connect, isConnected } = useCRMConnections();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setConnecting(id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    connect(id);
    setConnecting(null);
  };

  const handleNext = () => {
    const connected = MOCK_CRM_INTEGRATIONS.filter((i) => isConnected(i.id)).map((i) => i.id);
    setCRMSelection(connected);
    onNext();
  };

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Connect your CRM</h2>
      <p className="mb-6 text-muted-foreground">
        Sync your existing customer data. You can skip this and connect later.
      </p>

      <div className="space-y-3">
        {MOCK_CRM_INTEGRATIONS.map((integration) => {
          const connected = isConnected(integration.id);
          const isLoading = connecting === integration.id;

          return (
            <div
              key={integration.id}
              className={cn(
                'flex items-center justify-between rounded-xl border-2 p-4 transition-all',
                connected ? 'border-primary/30 bg-primary/5' : 'border-border'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Plug className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">{integration.description.slice(0, 60)}...</p>
                </div>
              </div>

              {connected ? (
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <Check className="h-4 w-4" />
                  Connected
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={isLoading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
