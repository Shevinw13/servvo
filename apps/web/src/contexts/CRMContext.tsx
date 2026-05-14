'use client';

import React, { createContext, useReducer, useContext } from 'react';
import { CRMConnectionState } from '@/types/crm';

// --- State ---

export interface CRMState {
  connections: Record<string, CRMConnectionState>;
}

// --- Actions ---

export type CRMAction =
  | { type: 'CONNECT'; payload: { integrationId: string } }
  | { type: 'DISCONNECT'; payload: { integrationId: string } };

// --- Reducer ---

export function crmReducer(state: CRMState, action: CRMAction): CRMState {
  switch (action.type) {
    case 'CONNECT': {
      const now = new Date();
      return {
        ...state,
        connections: {
          ...state.connections,
          [action.payload.integrationId]: {
            integrationId: action.payload.integrationId,
            isConnected: true,
            connectedAt: now,
            lastSynced: now,
          },
        },
      };
    }
    case 'DISCONNECT': {
      return {
        ...state,
        connections: {
          ...state.connections,
          [action.payload.integrationId]: {
            integrationId: action.payload.integrationId,
            isConnected: false,
            connectedAt: undefined,
            lastSynced: undefined,
          },
        },
      };
    }
    default:
      return state;
  }
}

// --- Context ---

interface CRMContextValue {
  state: CRMState;
  dispatch: React.Dispatch<CRMAction>;
}

const CRMContext = createContext<CRMContextValue | undefined>(undefined);

// --- Provider ---

const initialState: CRMState = {
  connections: {},
};

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

// --- Hook ---

export function useCRMContext(): CRMContextValue {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRMContext must be used within a CRMProvider');
  }
  return context;
}
