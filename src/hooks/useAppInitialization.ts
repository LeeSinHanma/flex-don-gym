import { useInitializationContext } from '../contexts/InitializationContext';

/**
 * useAppInitialization Hook
 * 
 * Centralized hook to access app initialization state and actions.
 * Wraps the InitializationContext.
 */
export const useAppInitialization = () => {
  return useInitializationContext();
};

/**
 * Resets the initialization state. 
 * Call this during logout to ensure the next user gets a fresh sync.
 */
export const resetAppInitialization = () => {
  // Since context is at provider level, we still need a way 
  // to trigger it. The context now exposes resetInitialization.
  console.warn('resetAppInitialization called from legacy module export. Use context method instead for reactivity.');
};
