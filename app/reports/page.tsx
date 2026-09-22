'use client';

import Header from '@/components/Header';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Truck, Package } from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30');
  const metrics = useInventoryStore((state) => state.getInventoryMetrics());
  const products = useInventoryStore((state) => state.products);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const movements = useInventoryStore((state) => state.movements);
  const salesReport = useInventoryStore((state) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));
    return state.getSalesReport(startDate, endDate);
  });

  const lowStockReport = useMemo(() => {
    return products
      .filter((p) => p.currentStock <= p.reorderLevel && p.status === 'active')
      .map((p) => ({
        ...p,
        daysToStockout: p.currentStock > 0 ? Math.ceil(p.currentStock / (p.currentStock > 0 ? 1 : 0)) : 0,
      }));
  }, [products]);

  const profitReport = useMemo(() => {
    return products
      .filter((p) => p.profitMargin !== undefined)
      .sort((a, b) => (b.profitMargin || 0) - (a.profitMargin || 0));
  }, [products]);

  const supplierPerformance = useMemo(() => {
    return suppliers.map((s) => {
      const perf = useInventoryStore.getState().getSupplierPerformance(s.id);
      return { ...s, ...perf };
    });
  }, [suppliers]);

  const inventoryAging = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        daysInStock: p.lastRestockDate
          ? Math.floor((Date.now() - new Date(p.lastRestockDate).getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      }))
      .sort((a, b) => b.daysInStock - a.daysInStock)
      .slice(0, 10);
  }, [products]);

  return (
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comprehensive inventory analysis and performance metrics</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(metrics.totalValue)}</p>
              </div>
              <Package className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales ({dateRange}d)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(salesReport.totalSales)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{salesReport.totalItems} units</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.lowStockCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">need reorder</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Turnover</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.turnoverRatio.toFixed(2)}x</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">per month</p>
              </div>
              <TrendingDown className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Main Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Report */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Sales by Category</h2>
            <div className="space-y-3">
              {Object.entries(salesReport.byCategory).length > 0 ? (
                Object.entries(salesReport.byCategory).map(([category, units]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{category}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{units} units</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(units / salesReport.totalItems) * 100}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No sales in selected period</p>
              )}
            </div>
          </div>

          {/* Low Stock Report */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⚠️ Low Stock Items ({lowStockReport.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {lowStockReport.slice(0, 5).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{p.currentStock} units</p>
                  </div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Below {p.reorderLevel}</span>
                </div>
              ))}
              {lowStockReport.length > 5 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">+{lowStockReport.length - 5} more</p>
              )}
            </div>
          </div>

          {/* Profit Report */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💰 Top Profit Margins</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {profitReport.slice(0, 5).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">${p.cost} → ${p.unitPrice}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{p.profitMargin}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🚚 Supplier Performance</h2>
            <div className="space-y-3">
              {supplierPerformance.slice(0, 3).map((s) => (
                <div key={s.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{s.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.round(s.rating) ? '⭐' : '☆'}`}></span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <p>On-time: {s.onTimeDelivery}% | Quality: {Math.round(s.qualityScore)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Aging */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📦 Oldest Stock (Aging)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-400">Product</th>
                    <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-400">Stock</th>
                    <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-400">Days In Stock</th>
                    <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryAging.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{p.name}</td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{p.currentStock}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold ${p.daysInStock > 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {p.daysInStock} days
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{formatCurrency(p.currentStock * p.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
