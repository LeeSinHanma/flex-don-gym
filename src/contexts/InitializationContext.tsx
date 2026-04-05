import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';
import { sqliteService } from '../localdb/sqliteService';
import { syncMembersFromServer } from '../logicHandlers/syncMembers';
import { syncMembershipTypesFromServer } from '../logicHandlers/syncMembershipTypes';
import { syncGymPricingFromServer } from '../logicHandlers/syncGymPricing';
import { syncInventoryFromServer } from '../logicHandlers/syncInventory';
import { healthCheck } from '../logicHandlers/healthCheck';

interface InitializationContextType {
  isInitializing: boolean;
  isSyncing: boolean;
  isBackgroundSyncing: boolean;
  isApiConnecting: boolean;
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
  const [isApiConnecting, setIsApiConnecting] = useState(false);
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
  }, []);

  // 3. Periodic Health Check (Every 5 minutes)
  React.useEffect(() => {
    const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const checkHealth = async () => {
      // Don't check health if already initializing/syncing
      if (isRunning || isInitializing || isSyncing) return;

      try {
        setIsApiConnecting(true);
        await healthCheck();
        // If successful, we're good
      } catch (err) {
        console.warn('Backend Health Check failed:', err);
        // If it fails, isApiConnecting remains true until the next successful check
        // or a manual sync attempt succeeds.
      } finally {
         // Keep it true if it failed to show "Connecting"
         // Actually, let's toggle it off only on success for better feedback
         // Wait, if it's always true, the banner stays. Let's toggle it on 
         // call and off on response.
         setIsApiConnecting(false);
      }
    };

    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
    // Initial check on mount
    checkHealth();

    return () => clearInterval(interval);
  }, [isInitializing, isSyncing]);

  return (
    <InitializationContext.Provider value={{
      isInitializing,
      isSyncing,
      isBackgroundSyncing,
      isApiConnecting,
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
