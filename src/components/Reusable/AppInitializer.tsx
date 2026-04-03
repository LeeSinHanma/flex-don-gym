import React, { useEffect } from 'react';
import { useAppInitialization } from '../../hooks/useAppInitialization';
import { LoadingSpinner } from './LoadingSpinner';

interface AppInitializerProps {
  /** Should it show a loading indicator while syncing? */
  showStatus?: boolean;
  /** Should it sync every time it mounts, or only if not ready? */
  forceSync?: boolean;
  /** Callback when initialization is successful */
  onSuccess?: () => void;
  /** Callback when initialization fails */
  onError?: (error: string) => void;
}

/**
 * AppInitializer Component
 * 
 * Drop this component into any page to ensure that SQLite is initialized
 * and the local database is synchronized with the server.
 */
const AppInitializer: React.FC<AppInitializerProps> = ({
  showStatus = false,
  forceSync = false,
  onSuccess,
  onError
}) => {
  const { 
    isInitializing, 
    isSyncing, 
    isBackgroundSyncing, 
    isReady, 
    error, 
    initApp 
  } = useAppInitialization();

  // 1. Initial Sync on Mount
  useEffect(() => {
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSync]);

  // 2. Periodic Background Sync (Every 10 minutes)
  useEffect(() => {
    const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
    
    const interval = setInterval(() => {
      console.log('🕒 Triggering periodic background sync...');
      initApp(true, true); // forceSync=true, silent=true
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [initApp]);

  // Handle success/error callbacks
  useEffect(() => {
    if (isReady && !isInitializing && !isSyncing && !isBackgroundSyncing) {
      onSuccess?.();
    }
    if (error) {
      onError?.(error);
    }
  }, [isReady, isInitializing, isSyncing, isBackgroundSyncing, error, onSuccess, onError]);

  // Only show status for foreground initialization/syncing
  if (showStatus && (isInitializing || isSyncing)) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        padding: '10px 20px',
        borderRadius: '30px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        pointerEvents: 'none'
      }}>
        <LoadingSpinner />
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {isInitializing ? 'Initializing Database...' : 'Syncing Data...'}
        </span>
      </div>
    );
  }

  // Silent by default
  return null;
};

export default AppInitializer;
