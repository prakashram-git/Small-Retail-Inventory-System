export interface Product {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  category: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  type: 'purchase' | 'sale' | 'adjustment';
  timestamp: Date;
  notes?: string;
}

export interface SalesData {
  productId: string;
  last30Days: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface Stocktake {
  productId: string;
  sku: string;
  countedQuantity: number;
  currentStock: number;
  variance: number;
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
}
