// Persistence layer for saving/loading data
// Uses localStorage for client-side caching + API for server-side persistence

import { Product, StockMovement, PurchaseOrder, GoodsReceipt, Invoice, Stocktake, Supplier } from './types';

interface InventoryData {
  products: Product[];
  movements: StockMovement[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];
  invoices: Invoice[];
  stocktakes: Stocktake[];
  suppliers: Supplier[];
  lastSaved: string;
}

const STORAGE_KEY = 'redhill_inventory_data';

/**
 * Save inventory data to localStorage (client cache)
 */
export function saveToLocalStorage(data: InventoryData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load inventory data from localStorage
 */
export function loadFromLocalStorage(): InventoryData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clear localStorage cache
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Save inventory data to server database
 */
export async function saveToDatabase(data: InventoryData): Promise<boolean> {
  try {
    const response = await fetch('/api/inventory/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Failed to save to database:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving to database:', error);
    return false;
  }
}

/**
 * Load inventory data from server database
 */
export async function loadFromDatabase(): Promise<InventoryData | null> {
  try {
    const response = await fetch('/api/inventory/load');

    if (!response.ok) {
      console.error('Failed to load from database:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading from database:', error);
    return null;
  }
}

/**
 * Sync data: try server first, fall back to localStorage, then use defaults
 */
export async function syncInventoryData(): Promise<InventoryData | null> {
  // Try loading from server database first
  const dbData = await loadFromDatabase();
  if (dbData) {
    // Also cache in localStorage
    saveToLocalStorage(dbData);
    return dbData;
  }

  // Fall back to localStorage if server fails
  const localData = loadFromLocalStorage();
  if (localData) {
    return localData;
  }

  // Return null if nothing is cached (will use mock data)
  return null;
}

/**
 * Auto-save data periodically
 */
export function startAutoSave(getData: () => InventoryData, interval = 30000): () => void {
  const intervalId = setInterval(() => {
    const data = getData();
    saveToLocalStorage(data);
    saveToDatabase(data); // Fire and forget
  }, interval);

  // Return cleanup function
  return () => clearInterval(intervalId);
}
