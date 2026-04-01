import { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { sqliteService } from '../localdb/sqliteService';
import { syncMembersFromServer } from '../logicHandlers/syncMembers';
import { syncMembershipTypesFromServer } from '../logicHandlers/syncMembershipTypes';
import { syncGymPricingFromServer } from '../logicHandlers/syncGymPricing';
import { syncInventoryFromServer } from '../logicHandlers/syncInventory';

export const useAppInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initApp = useCallback(async (forceSync = false) => {
    // If already initializing, don't start again
    if (isInitializing || isSyncing) return;

    setIsInitializing(true);
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

      setIsReady(true);
    } catch (err: any) {
      console.error('App initialization failed:', err);
      setError(err.message || 'Unknown initialization error');
    } finally {
      setIsInitializing(false);
      setIsSyncing(false);
    }
  }, [isInitializing, isSyncing]);

  return {
    isInitializing,
    isSyncing,
    isReady,
    error,
    initApp
  };
};
