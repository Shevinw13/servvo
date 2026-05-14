'use client';

import { useCallback } from 'react';
import { useCRMContext } from '@/contexts/CRMContext';
import { CRMConnectionState } from '@/types/crm';

export function useCRMConnections() {
  const { state, dispatch } = useCRMContext();

  const connect = useCallback(
    (integrationId: string) => {
      dispatch({ type: 'CONNECT', payload: { integrationId } });
    },
    [dispatch]
  );

  const disconnect = useCallback(
    (integrationId: string) => {
      dispatch({ type: 'DISCONNECT', payload: { integrationId } });
    },
    [dispatch]
  );

  const getConnection = useCallback(
    (integrationId: string): CRMConnectionState => {
      return (
        state.connections[integrationId] ?? {
          integrationId,
          isConnected: false,
        }
      );
    },
    [state.connections]
  );

  const isConnected = useCallback(
    (integrationId: string): boolean => {
      return state.connections[integrationId]?.isConnected ?? false;
    },
    [state.connections]
  );

  return {
    connections: state.connections,
    connect,
    disconnect,
    getConnection,
    isConnected,
  };
}
