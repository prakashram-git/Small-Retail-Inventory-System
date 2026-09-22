'use client';

import { useEffect, useState, ReactNode } from 'react';
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import MetricsCard from '@/components/MetricsCard';
import LowStockTable from '@/components/LowStockTable';
import QuickActions from '@/components/QuickActions';
import RecentMovements from '@/components/RecentMovements';
import StocktakeModal from '@/components/StocktakeModal';
import BarcodeScanner from '@/components/BarcodeScanner';
import SaleModal from '@/components/SaleModal';
import PurchaseModal from '@/components/PurchaseModal';
import AdjustModal from '@/components/AdjustModal';
import Toast from '@/components/Toast';
import LoginPage from '@/components/LoginPage';
import { useInventoryStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { useAuthStore } from '@/lib/auth-store';
import { formatCurrency } from '@/lib/utils';
import { usePersistence } from '@/lib/usePersistence';

interface DashboardClientProps {
  children: ReactNode;
}

export default function DashboardClient({ children }: DashboardClientProps) {
  // Initialize persistence (loads saved data on mount)
  usePersistence();

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isStocktakeOpen, setIsStocktakeOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const products = useInventoryStore((state) => state.products);
  const movements = useInventoryStore((state) => state.movements);
  const updateNotificationBadge = useInventoryStore((state) => state.updateNotificationBadge);
  const { settings } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();

  // Calculate total inventory value from products
  const totalInventoryValue = products.reduce((total, product) => total + product.currentStock * product.unitPrice, 0);

  // Calculate total sales from all products (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalSales = products.reduce((total, product) => {
    const last30DaysMovements = movements.filter(
      (m) => m.productId === product.id && m.type === 'sale' && new Date(m.timestamp) >= thirtyDaysAgo
    );
    const last30DaysQty = last30DaysMovements.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    return total + last30DaysQty * product.unitPrice;
  }, 0);

  // Calculate low stock count
  const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel).length;

  useEffect(() => {
    setMounted(true);
    updateNotificationBadge();
  }, [updateNotificationBadge]);

  // Apply dark mode to html element
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (settings.darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  if (!isAuthenticated) {
    return <LoginPage brandName={settings.brandName} shopLocation={settings.shopLocation} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {children}

      <main className="px-2 sm:px-3 py-2 sm:py-3">
        {/* Debug Info - Compact */}
        <div className="mb-2 p-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded">
          <p className="font-mono text-2xs text-green-700 dark:text-green-400">
            Products: {products.length} | Movements: {movements.length}
          </p>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-compact mb-2 overflow-x-auto pb-0">
          <MetricsCard
            title="Total Products"
            value={products.length}
            icon={<Package className="w-6 h-6 text-blue-600" />}
          />
          <MetricsCard
            title="Total Inventory Value"
            value={formatCurrency(totalInventoryValue)}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
          />
          <MetricsCard
            title="Sales (Last 30 Days)"
            value={formatCurrency(totalSales)}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            trend="up"
            trendValue="8.2% vs last month"
          />
          <MetricsCard
            title="Low Stock Alerts"
            value={lowStockCount}
            alert={lowStockCount > 0}
            highlight={lowStockCount === 0}
            icon={<AlertTriangle className={lowStockCount === 0 ? 'w-6 h-6 text-green-600' : 'w-6 h-6 text-red-600'} />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-2">
          {/* Top Row - Low Stock Table & Quick Actions + Recent Movements */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* Left Panel - Low Stock Table */}
            <div className="lg:col-span-3">
              <LowStockTable />
            </div>

            {/* Right Panel - Quick Actions & Recent Movements */}
            <div className="space-y-1.5 lg:h-fit lg:sticky lg:top-20">
              {/* Quick Actions Card */}
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm p-2">
                <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
                <QuickActions
                  onSaleOpen={() => setIsSaleOpen(true)}
                  onPurchaseOpen={() => setIsPurchaseOpen(true)}
                  onAdjustOpen={() => setIsAdjustOpen(true)}
                  onStocktakeOpen={() => setIsStocktakeOpen(true)}
                  onScannerOpen={() => setIsScannerOpen(true)}
                />
              </div>

              {/* Recent Movements Card */}
              <RecentMovements />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SaleModal isOpen={isSaleOpen} onClose={() => setIsSaleOpen(false)} />
      <PurchaseModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
      <AdjustModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} />
      <StocktakeModal isOpen={isStocktakeOpen} onClose={() => setIsStocktakeOpen(false)} />
      <BarcodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
