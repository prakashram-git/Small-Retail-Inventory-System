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
import { useInventoryStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { formatCurrency } from '@/lib/utils';

interface DashboardClientProps {
  children: ReactNode;
}

export default function DashboardClient({ children }: DashboardClientProps) {
  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isStocktakeOpen, setIsStocktakeOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const products = useInventoryStore((state) => state.products);
  const getLast30DaysSales = useInventoryStore((state) => state.getLast30DaysSales);
  const updateNotificationBadge = useInventoryStore((state) => state.updateNotificationBadge);
  const { settings } = useSettingsStore();

  // Calculate total inventory value from products
  const totalInventoryValue = products.reduce((total, product) => total + product.currentStock * product.unitPrice, 0);

  // Calculate total sales from all products
  const totalSales = products.reduce((total, product) => {
    const last30Days = getLast30DaysSales(product.id);
    return total + last30Days * product.unitPrice;
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {children}

      <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Top Metrics Grid */}
        <div className="grid grid-cols-4 gap-1 mb-3 overflow-x-auto pb-1">
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
        <div className="grid grid-cols-1 gap-6">
          {/* Top Row - Low Stock Table & Quick Actions + Recent Movements */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Low Stock Table */}
            <div className="lg:col-span-3">
              <LowStockTable />
            </div>

            {/* Right Panel - Quick Actions & Recent Movements */}
            <div className="space-y-3 lg:h-fit lg:sticky lg:top-24">
              {/* Quick Actions Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
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
