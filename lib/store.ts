import { create } from 'zustand';
import { Product, StockMovement, Toast } from './types';
import { MOCK_PRODUCTS, MOCK_STOCK_MOVEMENTS, MOCK_SALES_DATA } from './mock-data';

interface InventoryState {
  products: Product[];
  movements: StockMovement[];
  toasts: Toast[];
  notificationBadge: number;

  // Actions
  updateStock: (productId: string, quantity: number, type: 'purchase' | 'sale' | 'adjustment', notes?: string) => void;
  getLowStockItems: () => Product[];
  getTotalInventoryValue: () => number;
  getLast30DaysSales: (productId: string) => number;
  getSuggestedOrderQuantity: (productId: string) => number;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  getRecentMovements: (limit?: number) => StockMovement[];
  createStocktakeAdjustment: (productId: string, countedQuantity: number) => void;
  updateNotificationBadge: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (productId: string, updates: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: MOCK_PRODUCTS,
  movements: MOCK_STOCK_MOVEMENTS,
  toasts: [],
  notificationBadge: 0,

  updateStock: (productId, quantity, type, notes) => {
    set((state) => {
      const updatedProducts = state.products.map((product) =>
        product.id === productId
          ? { ...product, currentStock: Math.max(0, product.currentStock + quantity) }
          : product
      );

      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productId,
        sku: state.products.find((p) => p.id === productId)?.sku || '',
        productName: state.products.find((p) => p.id === productId)?.name || '',
        quantity,
        type,
        timestamp: new Date(),
        notes,
      };

      return {
        products: updatedProducts,
        movements: [newMovement, ...state.movements],
      };
    });

    get().updateNotificationBadge();
    get().addToast(
      `Stock updated: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      'success'
    );
  },

  getLowStockItems: () => {
    return get().products.filter((p) => p.currentStock <= p.reorderLevel).sort((a, b) => a.currentStock - b.currentStock);
  },

  getTotalInventoryValue: () => {
    return get().products.reduce((total, product) => total + product.currentStock * product.unitPrice, 0);
  },

  getLast30DaysSales: (productId: string) => {
    const salesData = MOCK_SALES_DATA.find((s) => s.productId === productId);
    return salesData ? salesData.last30Days : 0;
  },

  getSuggestedOrderQuantity: (productId: string) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return 0;

    const last30Days = get().getLast30DaysSales(productId);
    const suggestedQty = last30Days * 1.2 - product.currentStock;

    return Math.max(0, Math.ceil(suggestedQty));
  },

  addToast: (message, type) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  getRecentMovements: (limit = 10) => {
    return get().movements.slice(0, limit);
  },

  createStocktakeAdjustment: (productId, countedQuantity) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;

    const variance = countedQuantity - product.currentStock;
    get().updateStock(productId, variance, 'adjustment', `Stocktake adjustment: counted ${countedQuantity}, system had ${product.currentStock}`);
  },

  updateNotificationBadge: () => {
    const lowStockCount = get().getLowStockItems().length;
    set({ notificationBadge: lowStockCount });
  },

  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    set((state) => ({
      products: [...state.products, newProduct],
    }));
    get().addToast(`Product added: ${product.name}`, 'success');
  },

  editProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      ),
    }));
    get().addToast('Product updated successfully', 'success');
  },

  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
    get().addToast('Product deleted successfully', 'success');
  },
}));
