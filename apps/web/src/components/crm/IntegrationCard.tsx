'use client';

import { useState } from 'react';
import { CRMIntegration } from '@/types/crm';
import { Plug, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCardProps {
  integration: CRMIntegration;
  isConnected: boolean;
  lastSynced?: Date;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function IntegrationCard({
  integration,
  isConnected,
  lastSynced,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConnect();
    setLoading(false);
  };

  return (
    <div
      className={cn(
        'rounded-xl border-2 bg-card p-6 shadow-sm transition-all',
        isConnected ? 'border-primary/30' : 'border-border'
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Plug className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{integration.name}</h3>
          {isConnected && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-600">Connected</span>
            </div>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{integration.description}</p>

      {isConnected && lastSynced && (
        <p className="mb-4 text-xs text-muted-foreground">
          Last synced: {lastSynced.toLocaleString()}
        </p>
      )}

      {isConnected ? (
        <button
          onClick={onDisconnect}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </button>
      )}
    </div>
  );
}
