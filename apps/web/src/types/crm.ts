export interface CRMIntegration {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export interface CRMConnectionState {
  integrationId: string;
  isConnected: boolean;
  connectedAt?: Date;
  lastSynced?: Date;
}
