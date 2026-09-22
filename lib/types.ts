export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  barcode?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  cost: number;
  unitPrice: number;
  category: string;
  supplier?: string;
  supplierId?: string;
  location?: string;
  status: 'active' | 'inactive' | 'discontinued';
  lastRestockDate?: Date;
  lastSoldDate?: Date;
  lastCountDate?: Date;
  profitMargin?: number;
  expiryDate?: Date;
  batchNumber?: string;
  turnoverRatio?: number;
  daysInStock?: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage' | 'theft';
  timestamp: Date;
  notes?: string;
  referenceId?: string; // Links to PO, Invoice, Stocktake
  userId?: string;
  batchNumber?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  items: PurchaseOrderItem[];
  status: 'draft' | 'pending' | 'partially_received' | 'received' | 'cancelled';
  totalAmount: number;
  totalReceived: number;
  notes?: string;
  createdBy?: string;
}

export interface PurchaseOrderItem {
  productId: string;
  sku: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;
  lineTotal: number;
}

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  receiptDate: Date;
  items: GoodsReceiptItem[];
  status: 'draft' | 'received' | 'verified';
  receivedBy?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface GoodsReceiptItem {
  productId: string;
  sku: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  damageQty: number;
  unitCost: number;
  batchNumber?: string;
  expiryDate?: Date;
  location?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  customerName?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: 'draft' | 'completed' | 'returned';
  notes?: string;
  createdBy?: string;
}

export interface InvoiceItem {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discount?: number;
}

export interface Stocktake {
  id: string;
  stocktakeNumber: string;
  date: Date;
  items: StocktakeItem[];
  status: 'draft' | 'in_progress' | 'completed' | 'verified';
  createdBy?: string;
  verifiedBy?: string;
  totalVariance: number;
  totalVarianceValue: number;
}

export interface StocktakeItem {
  productId: string;
  sku: string;
  productName: string;
  systemStock: number;
  countedStock: number;
  variance: number;
  varianceReason?: string;
  location?: string;
  cost?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  leadTimeDays: number;
  rating?: number;
  isActive: boolean;
  paymentTerms?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface SalesData {
  productId: string;
  last7Days: number;
  last30Days: number;
  last90Days: number;
  last365Days: number;
  averageDailySales: number;
  totalRevenue: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Settings {
  brandName: string;
  shopLocation: string;
  darkMode: boolean;
  theme: 'light' | 'dark';
  currency?: string;
  taxRate?: number;
  autoReorderEnabled?: boolean;
}

export interface InventoryMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  overstockedCount: number;
  turnoverRatio: number;
  avgStockAge: number;
  totalSales30Days: number;
  totalPurchases30Days: number;
  topMovingProducts: Product[];
  slowMovingProducts: Product[];
}
