'use client';

import { useEffect, useRef } from 'react';
import { useInventoryStore } from './store';
import { syncInventoryData, startAutoSave } from './persistence';

/**
 * Hook to handle inventory data persistence
 * - Loads data from server on app startup
 * - Auto-saves changes periodically
 * - Falls back to localStorage if server unavailable
 */
export function usePersistence() {
  const autoSaveCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializePersistence = async () => {
      // Load saved data from server or localStorage
      const savedData = await syncInventoryData();

      if (isMounted && savedData) {
        // Update store with saved data
        const { setInventoryData } = useInventoryStore.getState();
        setInventoryData?.(savedData);
      }

      // Start auto-save (every 30 seconds)
      if (isMounted) {
        const cleanup = startAutoSave(() => {
          const state = useInventoryStore.getState();
          return {
            products: state.products,
            movements: state.movements,
            purchaseOrders: state.purchaseOrders || [],
            goodsReceipts: state.goodsReceipts || [],
            invoices: state.invoices || [],
            stocktakes: state.stocktakes || [],
            suppliers: state.suppliers,
            lastSaved: new Date().toISOString(),
          };
        });
        autoSaveCleanupRef.current = cleanup;
      }
    };

    initializePersistence();

    return () => {
      isMounted = false;
      // Cleanup auto-save on unmount
      if (autoSaveCleanupRef.current) {
        autoSaveCleanupRef.current();
      }
    };
  }, []);
}
