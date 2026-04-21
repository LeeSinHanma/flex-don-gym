import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { sqliteService } from "../localdb/sqliteService";
import { syncMembersFromServer } from "../logicHandlers/syncMembers";
import { syncMembershipTypesFromServer } from "../logicHandlers/syncMembershipTypes";
import { syncGymPricingFromServer } from "../logicHandlers/syncGymPricing";
import { syncInventoryFromServer } from "../logicHandlers/syncInventory";
import { healthCheck } from "../logicHandlers/healthCheck";
import { syncOfflineSales } from "../logicHandlers/syncSales";
import { syncPendingQueue } from "../logicHandlers/syncPending";

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

const InitializationContext = createContext<
  InitializationContextType | undefined
>(undefined);

// Module-level shared state across the entire session
let hasSyncedInSession = false;
let lastSyncTimestamp = 0;
let isRunning = false; // Synchronous mutex to prevent concurrent initApp calls

export const InitializationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

    // Debounce to prevent multiple immediate syncs triggering back-to-back (e.g. from network glitches)
    if (forceSync && Date.now() - lastSyncTimestamp < 10000) {
      console.log(
        "Skipping sync: a synchronization just happened recently (debounce)",
      );
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
      if (Capacitor.getPlatform() !== "web") {
        await sqliteService.init();
        console.log("SQLite initialized via provider");
      } else {
        console.log("Skipping SQLite init and sync on web (provider)");
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
      console.log("Synced gym pricing:", pricing);

      const inventoryCount = await syncInventoryFromServer();
      console.log(`Synced ${inventoryCount} inventory items`);

      // 3. Sync local sales TO server (Offline first upload)
      const syncedSalesCount = await syncOfflineSales();
      console.log(
        `Completed sync of ${syncedSalesCount} offline sales to server`,
      );

      // 4. Sync queued offline visit actions (scan/manual_admit/walk_in)
      await syncPendingQueue();
      console.log("Completed sync of pending offline visit actions");

      hasSyncedInSession = true;
      lastSyncTimestamp = Date.now();
      setIsReady(true);
    } catch (err: any) {
      console.error("App initialization failed:", err);
      setError(err.message || "Unknown initialization error");
    } finally {
      isRunning = false;
      setIsInitializing(false);
      setIsSyncing(false);
      setIsBackgroundSyncing(false);
    }
  }, []);

  // 3. Periodic Health Check (Adaptive Interval)
  React.useEffect(() => {
    let timeoutId: any;
    let isMounted = true;

    const scheduleNextCheck = (delay: number) => {
      if (!isMounted) return;
      timeoutId = setTimeout(checkHealth, delay);
    };

    const checkHealth = async () => {
      // Don't check health if already initializing/syncing
      if (isRunning || isInitializing || isSyncing) {
        scheduleNextCheck(5000); // Check again shortly if busy
        return;
      }

      let checkFailed = false;

      try {
        setIsApiConnecting(true);
        await healthCheck();
        setError(null);
      } catch (err: any) {
        console.warn("Backend Health Check failed:", err);
        setError("Backend health check failed");
        checkFailed = true;
      } finally {
        if (isMounted) {
          setIsApiConnecting(false);
          scheduleNextCheck(checkFailed ? 5000 : 5 * 60 * 1000); // Retry in 5s if failed, else 5m
        }
      }
    };

    checkHealth();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitializing, isSyncing, initApp]);

  // 4. Real-time Network Listener (Sync on Reconnection)
  React.useEffect(() => {
    let listenerHandle: any = null;
    let wasOffline = false;

    const setupListener = async () => {
      const initialStatus = await Network.getStatus();
      wasOffline = !initialStatus.connected;

      listenerHandle = await Network.addListener(
        "networkStatusChange",
        (status) => {
          console.log("📡 Network status changed:", status);

          if (status.connected && wasOffline) {
            console.log(
              "🌐 Connection restored! Triggering real-time synchronization...",
            );

            // Prevent multiple immediate syncs if the network flickers
            const now = Date.now();
            if (now - lastSyncTimestamp > 10000) {
              // Only sync if at least 10s have passed
              initApp(true, true).catch((err) => {
                console.warn("Real-time sync on reconnection failed:", err);
              });
            }
          }

          wasOffline = !status.connected;
        },
      );
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [initApp]);

  return (
    <InitializationContext.Provider
      value={{
        isInitializing,
        isSyncing,
        isBackgroundSyncing,
        isApiConnecting,
        isReady,
        error,
        initApp,
        resetInitialization,
      }}
    >
      {children}
    </InitializationContext.Provider>
  );
};

export const useInitializationContext = () => {
  const context = useContext(InitializationContext);
  if (context === undefined) {
    throw new Error(
      "useInitializationContext must be used within an InitializationProvider",
    );
  }
  return context;
};
