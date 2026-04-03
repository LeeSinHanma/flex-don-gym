import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';
import { sqliteService } from '../localdb/sqliteService';
import { syncMembersFromServer } from '../logicHandlers/syncMembers';
import { syncMembershipTypesFromServer } from '../logicHandlers/syncMembershipTypes';
import { syncGymPricingFromServer } from '../logicHandlers/syncGymPricing';
import { syncInventoryFromServer } from '../logicHandlers/syncInventory';

interface InitializationContextType {
  isInitializing: boolean;
  isSyncing: boolean;
  isBackgroundSyncing: boolean;
  isReady: boolean;
  error: string | null;
  initApp: (forceSync?: boolean, silent?: boolean) => Promise<void>;
  resetInitialization: () => void;
}

const InitializationContext = createContext<InitializationContextType | undefined>(undefined);

// Module-level shared state across the entire session
let hasSyncedInSession = false;
let lastSyncTimestamp = 0;
let isRunning = false; // Synchronous mutex to prevent concurrent initApp calls

export const InitializationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);
  const [isReady, setIsReady] = useState(hasSyncedInSession);
  const [error, setError] = useState<string | null>(null);

  const resetInitialization = useCallback(() => {
    hasSyncedInSession = false;
    lastSyncTimestamp = 0;
    setIsReady(false);
  }, []);

  const initApp = useCallback(async (forceSync = false, silent = false) => {
    if (hasSyncedInSession && !forceSync) {
      setIsReady(true);
      return;
    }

    // Synchronous mutex — prevents concurrent calls regardless of React state timing
    if (isRunning) return;
    isRunning = true;

    if (silent) {
      setIsBackgroundSyncing(true);
    } else {
      setIsInitializing(true);
    }
    setError(null);

    try {
      // 1. Initialize SQLite
      if (Capacitor.getPlatform() !== 'web') {
        await sqliteService.init();
        console.log('SQLite initialized via provider');
      } else {
        console.log('Skipping SQLite init and sync on web (provider)');
        setIsReady(true);
        hasSyncedInSession = true; // Mark as "synced" on web too
        return;
      }

      // 2. Perform Synchronization
      setIsSyncing(true);
      
      const memberCount = await syncMembersFromServer();
      console.log(`Synced ${memberCount} members`);

      const membershipTypeCount = await syncMembershipTypesFromServer();
      console.log(`Synced ${membershipTypeCount} membership types`);

      const pricing = await syncGymPricingFromServer();
      console.log('Synced gym pricing:', pricing);

      const inventoryCount = await syncInventoryFromServer();
      console.log(`Synced ${inventoryCount} inventory items`);

      hasSyncedInSession = true;
      lastSyncTimestamp = Date.now();
      setIsReady(true);
    } catch (err: any) {
      console.error('App initialization failed:', err);
      setError(err.message || 'Unknown initialization error');
    } finally {
      isRunning = false;
      setIsInitializing(false);
      setIsSyncing(false);
      setIsBackgroundSyncing(false);
    }
  }, []); // Empty deps — stable reference prevents useEffect re-triggers

  return (
    <InitializationContext.Provider value={{
      isInitializing,
      isSyncing,
      isBackgroundSyncing,
      isReady,
      error,
      initApp,
      resetInitialization
    }}>
      {children}
    </InitializationContext.Provider>
  );
};

export const useInitializationContext = () => {
  const context = useContext(InitializationContext);
  if (context === undefined) {
    throw new Error('useInitializationContext must be used within an InitializationProvider');
  }
  return context;
};
