import { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { sqliteService } from '../localdb/sqliteService';
import { syncMembersFromServer } from '../logicHandlers/syncMembers';
import { syncMembershipTypesFromServer } from '../logicHandlers/syncMembershipTypes';
import { syncGymPricingFromServer } from '../logicHandlers/syncGymPricing';
import { syncInventoryFromServer } from '../logicHandlers/syncInventory';

// 🟢 Shared state across the entire session to prevent redundant API calls
let hasSyncedInSession = false;
let lastSyncTimestamp = 0;

/**
 * Resets the initialization state. 
 * Call this during logout to ensure the next user gets a fresh sync.
 */
export const resetAppInitialization = () => {
  hasSyncedInSession = false;
  lastSyncTimestamp = 0;
};

export const useAppInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);
  const [isReady, setIsReady] = useState(hasSyncedInSession);
  const [error, setError] = useState<string | null>(null);

  const initApp = useCallback(async (forceSync = false, silent = false) => {
    // 🛑 Optimization: If already synced this session, don't hit the API again
    if (hasSyncedInSession && !forceSync) {
      setIsReady(true);
      return;
    }

    // If already in middle of init/sync, don't start again
    if (isInitializing || isSyncing || isBackgroundSyncing) return;

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
        console.log('SQLite initialized via hook');
      } else {
        console.log('Skipping SQLite init and sync on web (hook)');
        setIsReady(true);
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
      setIsInitializing(false);
      setIsSyncing(false);
      setIsBackgroundSyncing(false);
    }
  }, [isInitializing, isSyncing, isBackgroundSyncing]);

  return {
    isInitializing,
    isSyncing,
    isBackgroundSyncing,
    isReady,
    error,
    initApp
  };
};
