'use client';

import { ShoppingCart, Package, BarChart3, Scan } from 'lucide-react';

interface QuickActionsProps {
  onSaleOpen: () => void;
  onPurchaseOpen: () => void;
  onAdjustOpen: () => void;
  onStocktakeOpen: () => void;
  onScannerOpen: () => void;
}

export default function QuickActions({
  onSaleOpen,
  onPurchaseOpen,
  onAdjustOpen,
  onStocktakeOpen,
  onScannerOpen,
}: QuickActionsProps) {
  return (
    <div className="space-y-1">
      {/* 2x2 Grid for Sale, Purchase, Adjust, Count */}
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={onSaleOpen}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition dark:bg-blue-900 dark:border-blue-700 dark:hover:bg-blue-800"
        >
          <ShoppingCart className="w-2.5 h-2.5 text-blue-600 dark:text-blue-300" />
          <span className="text-xs font-medium text-blue-900 dark:text-blue-200">Sale</span>
        </button>

        <button
          onClick={onPurchaseOpen}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 bg-green-50 border border-green-200 rounded-2xl hover:bg-green-100 transition dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800"
        >
          <Package className="w-2.5 h-2.5 text-green-600 dark:text-green-300" />
          <span className="text-xs font-medium text-green-900 dark:text-green-200">Purchase</span>
        </button>

        <button
          onClick={onAdjustOpen}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 bg-yellow-50 border border-yellow-200 rounded-2xl hover:bg-yellow-100 transition dark:bg-yellow-900 dark:border-yellow-700 dark:hover:bg-yellow-800"
        >
          <BarChart3 className="w-2.5 h-2.5 text-yellow-600 dark:text-yellow-300" />
          <span className="text-xs font-medium text-yellow-900 dark:text-yellow-200">Adjust</span>
        </button>

        <button
          onClick={onStocktakeOpen}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 bg-purple-50 border border-purple-200 rounded-2xl hover:bg-purple-100 transition dark:bg-purple-900 dark:border-purple-700 dark:hover:bg-purple-800"
        >
          <BarChart3 className="w-2.5 h-2.5 text-purple-600 dark:text-purple-300" />
          <span className="text-xs font-medium text-purple-900 dark:text-purple-200">Count</span>
        </button>
      </div>

      {/* Scan Button - Full Width */}
      <button
        onClick={onScannerOpen}
        className="w-full flex items-center justify-center gap-0.5 px-2 py-1.5 bg-brand-primary text-white rounded-2xl hover:bg-brand-dark transition font-medium text-xs dark:hover:opacity-90"
      >
        <Scan className="w-2.5 h-2.5" />
        Scan
      </button>
    </div>
  );
}
