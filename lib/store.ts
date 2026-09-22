import { create } from 'zustand';
import { Product, StockMovement, Toast, PurchaseOrder, GoodsReceipt, Invoice, Stocktake, Supplier, InventoryMetrics } from './types';
import { MOCK_PRODUCTS, MOCK_STOCK_MOVEMENTS, MOCK_SALES_DATA } from './mock-data';

interface InventoryState {
  // Core Data
  products: Product[];
  movements: StockMovement[];
  toasts: Toast[];
  notificationBadge: number;
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];
  invoices: Invoice[];
  stocktakes: Stocktake[];
  suppliers: Supplier[];

  // Product Actions
  updateStock: (productId: string, quantity: number, type: StockMovement['type'], notes?: string, referenceId?: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (productId: string, updates: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;

  // Purchase Order Actions
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrder: (poId: string, updates: Partial<PurchaseOrder>) => void;
  receivePurchaseOrder: (poId: string, grn: Omit<GoodsReceipt, 'id' | 'grnNumber'>) => void;

  // Goods Receipt Actions
  createGoodsReceipt: (grn: Omit<GoodsReceipt, 'id' | 'grnNumber'>) => void;
  verifyGoodsReceipt: (grnId: string, verifiedBy: string) => void;

  // Invoice/Sales Actions
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  completeInvoice: (invoiceId: string) => void;
  createReturn: (invoiceId: string, items: any[]) => void;

  // Stocktake Actions
  createStocktakeAdjustment: (productId: string, countedQuantity: number) => void;
  createStocktake: (stocktake: Omit<Stocktake, 'id' | 'stocktakeNumber'>) => void;
  completeStocktake: (stocktakeId: string, verifiedBy: string) => void;

  // Supplier Actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplierId: string, updates: Partial<Supplier>) => void;
  getSupplierPerformance: (supplierId: string) => { rating: number; onTimeDelivery: number; qualityScore: number };

  // Analytics & Reports
  getInventoryMetrics: () => InventoryMetrics;
  getLowStockItems: () => Product[];
  getOverstockedItems: () => Product[];
  getTotalInventoryValue: () => number;
  getLast30DaysSales: (productId: string) => number;
  getSuggestedOrderQuantity: (productId: string) => number;
  getMovementsByDateRange: (startDate: Date, endDate: Date) => StockMovement[];
  getTopMovingProducts: (limit?: number) => Product[];
  getSlowMovingProducts: (limit?: number) => Product[];
  getInventoryTurnover: (productId: string) => number;
  getAverageStockAge: () => number;
  getSalesReport: (startDate: Date, endDate: Date) => { totalSales: number; totalItems: number; byCategory: Record<string, number> };

  // UI Actions
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  getRecentMovements: (limit?: number) => StockMovement[];
  updateNotificationBadge: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  // Initial state
  products: MOCK_PRODUCTS,
  movements: MOCK_STOCK_MOVEMENTS,
  toasts: [],
  notificationBadge: 0,
  purchaseOrders: [],
  goodsReceipts: [],
  invoices: [],
  stocktakes: [],
  suppliers: [
    { id: 'sup-1', name: 'Premium Sweets Inc.', leadTimeDays: 5, isActive: true, rating: 4.5, contactPerson: 'John Smith' },
    { id: 'sup-2', name: 'Fresh Beverages Inc.', leadTimeDays: 3, isActive: true, rating: 4.8, contactPerson: 'Sarah Lee' },
    { id: 'sup-3', name: 'Snack Masters Co.', leadTimeDays: 7, isActive: true, rating: 4.2, contactPerson: 'Mike Chen' },
  ],

  // ===== PRODUCT MANAGEMENT =====
  updateStock: (productId, quantity, type, notes, referenceId) => {
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;

      const updatedProducts = state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              currentStock: Math.max(0, p.currentStock + quantity),
              lastSoldDate: type === 'sale' ? new Date() : p.lastSoldDate,
              lastRestockDate: type === 'purchase' ? new Date() : p.lastRestockDate,
            }
          : p
      );

      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productId,
        sku: product.sku,
        productName: product.name,
        quantity,
        type,
        timestamp: new Date(),
        notes,
        referenceId,
      };

      return {
        products: updatedProducts,
        movements: [newMovement, ...state.movements],
      };
    });

    get().updateNotificationBadge();
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    get().addToast(`Stock updated: ${typeLabel}`, 'success');
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

  // ===== PURCHASE ORDER MANAGEMENT =====
  createPurchaseOrder: (po) => {
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
    };
    set((state) => ({
      purchaseOrders: [...state.purchaseOrders, newPO],
    }));
    get().addToast(`Purchase Order created: ${po.poNumber}`, 'success');
  },

  updatePurchaseOrder: (poId, updates) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === poId ? { ...po, ...updates } : po
      ),
    }));
    get().addToast('Purchase order updated', 'success');
  },

  receivePurchaseOrder: (poId, grnData) => {
    const po = get().purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    const grn: GoodsReceipt = {
      ...grnData,
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-${Date.now().toString().slice(-6)}`,
    };

    set((state) => ({
      goodsReceipts: [...state.goodsReceipts, grn],
      purchaseOrders: state.purchaseOrders.map((p) =>
        p.id === poId ? { ...p, status: 'received', actualDeliveryDate: new Date() } : p
      ),
    }));

    // Update inventory for received items
    grn.items.forEach((item) => {
      get().updateStock(item.productId, item.receivedQty, 'purchase', `Received from GRN ${grn.grnNumber}`, grn.id);
    });

    get().addToast(`Goods Receipt created: ${grn.grnNumber}`, 'success');
  },

  // ===== GOODS RECEIPT MANAGEMENT =====
  createGoodsReceipt: (grn) => {
    const newGRN: GoodsReceipt = {
      ...grn,
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-${Date.now().toString().slice(-6)}`,
    };

    set((state) => ({
      goodsReceipts: [...state.goodsReceipts, newGRN],
    }));

    grn.items.forEach((item) => {
      get().updateStock(item.productId, item.receivedQty, 'purchase', `Received from GRN ${newGRN.grnNumber}`, newGRN.id);
    });

    get().addToast(`Goods Receipt created: ${newGRN.grnNumber}`, 'success');
  },

  verifyGoodsReceipt: (grnId, verifiedBy) => {
    set((state) => ({
      goodsReceipts: state.goodsReceipts.map((grn) =>
        grn.id === grnId ? { ...grn, status: 'verified', verifiedBy } : grn
      ),
    }));
    get().addToast('Goods receipt verified', 'success');
  },

  // ===== INVOICE/SALES MANAGEMENT =====
  createInvoice: (invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    };

    set((state) => ({
      invoices: [...state.invoices, newInvoice],
    }));

    // Deduct stock for each item
    invoice.items.forEach((item) => {
      get().updateStock(item.productId, -item.quantity, 'sale', `Sold via invoice ${newInvoice.invoiceNumber}`, newInvoice.id);
    });

    get().addToast(`Invoice created: ${newInvoice.invoiceNumber}`, 'success');
  },

  completeInvoice: (invoiceId) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'completed' } : inv
      ),
    }));
    get().addToast('Invoice completed', 'success');
  },

  createReturn: (invoiceId, items) => {
    const invoice = get().invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    // Add inventory back
    items.forEach((item) => {
      get().updateStock(item.productId, item.quantity, 'return', `Returned from invoice ${invoice.invoiceNumber}`, invoiceId);
    });

    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'returned' } : inv
      ),
    }));

    get().addToast('Return processed', 'success');
  },

  // ===== STOCKTAKE MANAGEMENT =====
  createStocktakeAdjustment: (productId, countedQuantity) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;

    const variance = countedQuantity - product.currentStock;
    get().updateStock(productId, variance, 'adjustment', `Stocktake adjustment: counted ${countedQuantity}, system had ${product.currentStock}`, productId);
  },

  createStocktake: (stocktake) => {
    const newStocktake: Stocktake = {
      ...stocktake,
      id: `st-${Date.now()}`,
      stocktakeNumber: `ST-${Date.now().toString().slice(-6)}`,
    };

    set((state) => ({
      stocktakes: [...state.stocktakes, newStocktake],
    }));

    get().addToast(`Stocktake created: ${newStocktake.stocktakeNumber}`, 'success');
  },

  completeStocktake: (stocktakeId, verifiedBy) => {
    const stocktake = get().stocktakes.find((st) => st.id === stocktakeId);
    if (!stocktake) return;

    set((state) => ({
      stocktakes: state.stocktakes.map((st) =>
        st.id === stocktakeId ? { ...st, status: 'verified', verifiedBy } : st
      ),
    }));

    // Apply adjustments
    stocktake.items.forEach((item) => {
      if (item.variance !== 0) {
        get().updateStock(item.productId, item.variance, 'adjustment', `Stocktake adjustment: ${item.varianceReason || 'Discrepancy found'}`, stocktakeId);
      }
    });

    get().addToast('Stocktake completed and adjustments applied', 'success');
  },

  // ===== SUPPLIER MANAGEMENT =====
  addSupplier: (supplier) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
    };
    set((state) => ({
      suppliers: [...state.suppliers, newSupplier],
    }));
    get().addToast(`Supplier added: ${supplier.name}`, 'success');
  },

  updateSupplier: (supplierId, updates) => {
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === supplierId ? { ...s, ...updates } : s
      ),
    }));
    get().addToast('Supplier updated', 'success');
  },

  getSupplierPerformance: (supplierId) => {
    const supplier = get().suppliers.find((s) => s.id === supplierId);
    if (!supplier) return { rating: 0, onTimeDelivery: 0, qualityScore: 0 };

    const pos = get().purchaseOrders.filter((po) => po.supplierId === supplierId);
    const onTimeCount = pos.filter((po) => po.actualDeliveryDate && po.expectedDeliveryDate && po.actualDeliveryDate <= po.expectedDeliveryDate).length;
    const onTimeDelivery = pos.length > 0 ? (onTimeCount / pos.length) * 100 : 0;

    return {
      rating: supplier.rating || 0,
      onTimeDelivery: Math.round(onTimeDelivery),
      qualityScore: supplier.rating ? supplier.rating * 20 : 0,
    };
  },

  // ===== ANALYTICS & REPORTING =====
  getInventoryMetrics: (): InventoryMetrics => {
    const products = get().products;
    const totalValue = get().getTotalInventoryValue();
    const lowStockCount = get().getLowStockItems().length;
    const overstockedCount = get().getOverstockedItems().length;
    const avgStockAge = get().getAverageStockAge();
    const topMoving = get().getTopMovingProducts(5);
    const slowMoving = get().getSlowMovingProducts(5);

    const sales30Days = get().movements
      .filter((m) => {
        const daysDiff = (Date.now() - new Date(m.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return m.type === 'sale' && daysDiff <= 30;
      })
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    const purchases30Days = get().movements
      .filter((m) => {
        const daysDiff = (Date.now() - new Date(m.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return m.type === 'purchase' && daysDiff <= 30;
      })
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    return {
      totalProducts: products.length,
      totalValue,
      lowStockCount,
      overstockedCount,
      turnoverRatio: products.length > 0 ? sales30Days / products.length : 0,
      avgStockAge,
      totalSales30Days: sales30Days,
      totalPurchases30Days: purchases30Days,
      topMovingProducts: topMoving,
      slowMovingProducts: slowMoving,
    };
  },

  getLowStockItems: () => {
    return get().products
      .filter((p) => p.currentStock <= p.reorderLevel && p.status === 'active')
      .sort((a, b) => a.currentStock - b.currentStock);
  },

  getOverstockedItems: () => {
    return get().products
      .filter((p) => p.currentStock >= p.maxStock && p.status === 'active')
      .sort((a, b) => b.currentStock - a.currentStock);
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

  getMovementsByDateRange: (startDate: Date, endDate: Date) => {
    return get().movements.filter((m) => {
      const movDate = new Date(m.timestamp);
      return movDate >= startDate && movDate <= endDate;
    });
  },

  getTopMovingProducts: (limit = 10) => {
    const movements = get().movements.filter((m) => m.type === 'sale');
    const salesByProduct: Record<string, number> = {};

    movements.forEach((m) => {
      salesByProduct[m.productId] = (salesByProduct[m.productId] || 0) + Math.abs(m.quantity);
    });

    return get()
      .products.sort((a, b) => (salesByProduct[b.id] || 0) - (salesByProduct[a.id] || 0))
      .slice(0, limit);
  },

  getSlowMovingProducts: (limit = 10) => {
    return get()
      .getTopMovingProducts(get().products.length)
      .reverse()
      .slice(0, limit);
  },

  getInventoryTurnover: (productId: string) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product || product.currentStock === 0) return 0;

    const sales = get()
      .movements.filter((m) => m.productId === productId && m.type === 'sale')
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    return product.currentStock > 0 ? sales / product.currentStock : 0;
  },

  getAverageStockAge: () => {
    const products = get().products;
    if (products.length === 0) return 0;

    const totalDays = products.reduce((sum, p) => {
      if (p.lastRestockDate) {
        const days = (Date.now() - new Date(p.lastRestockDate).getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }
      return sum;
    }, 0);

    return Math.round(totalDays / products.length);
  },

  getSalesReport: (startDate: Date, endDate: Date) => {
    const movements = get().getMovementsByDateRange(startDate, endDate).filter((m) => m.type === 'sale');
    const byCategory: Record<string, number> = {};
    let totalSales = 0;
    let totalItems = 0;

    movements.forEach((m) => {
      const product = get().products.find((p) => p.id === m.productId);
      if (product) {
        byCategory[product.category] = (byCategory[product.category] || 0) + Math.abs(m.quantity);
        totalSales += Math.abs(m.quantity) * product.unitPrice;
        totalItems += Math.abs(m.quantity);
      }
    });

    return { totalSales, totalItems, byCategory };
  },

  // ===== UI ACTIONS =====
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

  updateNotificationBadge: () => {
    const lowStockCount = get().getLowStockItems().length;
    set({ notificationBadge: lowStockCount });
  },
}));
