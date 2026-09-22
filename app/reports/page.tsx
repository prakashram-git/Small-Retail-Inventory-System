'use client';

import Header from '@/components/Header';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Truck, Package, Calendar, Filter } from 'lucide-react';
import { useSettingsStore } from '@/lib/settings-store';
import { generateReportPDF } from '@/lib/pdf-generator';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const { settings } = useSettingsStore();
  const metrics = useInventoryStore((state) => state.getInventoryMetrics());
  const products = useInventoryStore((state) => state.products);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const movements = useInventoryStore((state) => state.movements);
  const salesReport = useMemo(() => {
    let startDate: Date;
    let endDate: Date;

    if (useCustomRange && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
    }

    const baseReport = useInventoryStore.getState().getSalesReport(startDate, endDate);

    // Apply product and supplier filters
    if (!selectedProduct && !selectedSupplier) {
      return baseReport;
    }

    const filteredByCategory: Record<string, number> = {};
    Object.entries(baseReport.byCategory).forEach(([category, units]) => {
      const categoryProducts = products.filter((p) => {
        if (p.category !== category) return false;
        if (selectedProduct && p.id !== selectedProduct) return false;
        if (selectedSupplier && p.supplierId !== selectedSupplier) return false;
        return true;
      });
      if (categoryProducts.length > 0) {
        filteredByCategory[category] = units;
      }
    });

    const filteredTotal = Object.values(filteredByCategory).reduce((a, b) => a + b, 0);

    return {
      ...baseReport,
      byCategory: filteredByCategory,
      totalItems: filteredTotal,
      totalSales: (filteredTotal / (baseReport.totalItems || 1)) * baseReport.totalSales,
    };
  }, [useCustomRange, customStartDate, customEndDate, dateRange, selectedProduct, selectedSupplier, products]);

  const lowStockReport = useMemo(() => {
    return products
      .filter((p) => {
        if (p.currentStock > p.reorderLevel || p.status !== 'active') return false;
        if (selectedProduct && p.id !== selectedProduct) return false;
        if (selectedSupplier && p.supplierId !== selectedSupplier) return false;
        return true;
      })
      .map((p) => ({
        ...p,
        daysToStockout: p.currentStock > 0 ? Math.ceil(p.currentStock / (p.currentStock > 0 ? 1 : 0)) : 0,
      }));
  }, [products, selectedProduct, selectedSupplier]);

  const profitReport = useMemo(() => {
    return products
      .filter((p) => {
        if (p.profitMargin === undefined) return false;
        if (selectedProduct && p.id !== selectedProduct) return false;
        if (selectedSupplier && p.supplierId !== selectedSupplier) return false;
        return true;
      })
      .sort((a, b) => (b.profitMargin || 0) - (a.profitMargin || 0));
  }, [products, selectedProduct, selectedSupplier]);

  const supplierPerformance = useMemo(() => {
    const filtered = selectedSupplier
      ? suppliers.filter((s) => s.id === selectedSupplier)
      : suppliers;

    return filtered.map((s) => {
      const perf = useInventoryStore.getState().getSupplierPerformance(s.id);
      return { ...s, ...perf };
    });
  }, [suppliers, selectedSupplier]);

  const inventoryAging = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedProduct && p.id !== selectedProduct) return false;
        if (selectedSupplier && p.supplierId !== selectedSupplier) return false;
        return true;
      })
      .map((p) => ({
        ...p,
        daysInStock: p.lastRestockDate
          ? Math.floor((Date.now() - new Date(p.lastRestockDate).getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      }))
      .sort((a, b) => b.daysInStock - a.daysInStock)
      .slice(0, 10);
  }, [products, selectedProduct, selectedSupplier]);

  const handleGenerateReport = () => {
    setReportGenerated(true);

    // Compile report data
    const dateRangeLabel = useCustomRange
      ? `${customStartDate} to ${customEndDate}`
      : `Last ${dateRange} days`;

    const reportData = {
      title: '📊 Inventory Report',
      dateRange: dateRangeLabel,
      generatedDate: new Date().toLocaleString(),
      brandName: settings.brandName,
      shopLocation: settings.shopLocation,
      metrics: {
        totalInventoryValue: formatCurrency(metrics.totalValue),
        totalSales: formatCurrency(salesReport.totalSales),
        totalSalesUnits: salesReport.totalItems,
        lowStockCount: lowStockReport.length,
        turnoverRatio: metrics.turnoverRatio,
      },
      sections: [
        {
          name: 'Sales by Category',
          data: Object.entries(salesReport.byCategory).map(([category, units]) => ({
            label: category,
            value: `${units} units`,
          })),
        },
        {
          name: 'Low Stock Items',
          data: lowStockReport.slice(0, 10).map((p) => ({
            label: p.name,
            value: `${p.currentStock}/${p.reorderLevel} units`,
          })),
        },
        {
          name: 'Top Profit Margins',
          data: profitReport.slice(0, 10).map((p) => ({
            label: p.name,
            value: `${p.profitMargin}% (Cost: $${p.cost}, Price: $${p.unitPrice})`,
          })),
        },
        {
          name: 'Supplier Performance',
          data: supplierPerformance.slice(0, 5).map((s) => ({
            label: s.name,
            value: `On-time: ${s.onTimeDelivery}% | Quality: ${Math.round(s.qualityScore)}%`,
          })),
        },
        {
          name: 'Inventory Aging (Top 10)',
          data: inventoryAging.map((p) => ({
            label: p.name,
            value: `${p.daysInStock} days | Stock: ${p.currentStock} | Value: ${formatCurrency(p.currentStock * p.unitPrice)}`,
          })),
        },
      ],
    };

    // Generate PDF with a slight delay to ensure state updates
    setTimeout(() => {
      generateReportPDF(reportData);
    }, 100);
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-2 sm:px-3 py-2 sm:py-3 transition-colors duration-200">
        <div className="mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div>
              <h1 className="heading-page">Reports & Analytics</h1>
              <p className="text-caption mt-0.5">Comprehensive inventory analysis and performance metrics</p>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="card card-compact bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-2 py-2 flex items-center grid-compact flex-wrap">
            {/* Quick Range Buttons */}
            <div className="flex gap-1">
              {[
                { label: '7 Days', value: '7' },
                { label: '30 Days', value: '30' },
                { label: '90 Days', value: '90' },
                { label: '1 Year', value: '365' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setDateRange(opt.value);
                    setUseCustomRange(false);
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded transition ${
                    !useCustomRange && dateRange === opt.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>

            {/* Custom Date Range */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  setUseCustomRange(true);
                }}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500 dark:text-gray-400 text-xs">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  setUseCustomRange(true);
                }}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {useCustomRange && (
                <button
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                    setUseCustomRange(false);
                  }}
                  className="px-1 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition font-medium"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Generate & Filter Buttons */}
            <div className="flex gap-1 ml-auto">
              <button
                onClick={handleGenerateReport}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition shadow-sm"
              >
                📊 Generate Report
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-2 py-1 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded text-xs font-medium transition"
              >
                {showAdvanced ? '▼' : '▶'} Filters
              </button>
            </div>
          </div>

          {/* Advanced Options Panel */}
          {showAdvanced && (
            <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Supplier Filter */}
                <div>
                  <label className="block text-2xs font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Suppliers</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Filter */}
                <div>
                  <label className="block text-2xs font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Products</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-2xs font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Locations</option>
                    <option>Central Mall</option>
                    <option>East Branch</option>
                    <option>West Branch</option>
                  </select>
                </div>
              </div>

              <div className="mt-2 flex gap-1">
                <button
                  onClick={handleGenerateReport}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition"
                >
                  ✓ Apply & Generate
                </button>
                <button
                  onClick={() => {
                    setSelectedSupplier('');
                    setSelectedProduct('');
                    setShowAdvanced(false);
                  }}
                  className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded text-xs font-medium transition hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Filter Summary */}
          {reportGenerated && (selectedSupplier || selectedProduct) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 mt-2">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>📋 Report filtered by:</strong>
                {selectedSupplier && ` Supplier: ${suppliers.find(s => s.id === selectedSupplier)?.name}`}
                {selectedSupplier && selectedProduct && ' • '}
                {selectedProduct && `Product: ${products.find(p => p.id === selectedProduct)?.name}`}
              </p>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
          <div className="card card-compact bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-700/30">
            <p className="text-label text-blue-700 dark:text-blue-300">Inventory Value</p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-0.5">{formatCurrency(metrics.totalValue)}</p>
          </div>

          <div className="card card-compact bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 border-green-200/50 dark:border-green-700/30">
            <p className="text-label text-green-700 dark:text-green-300">Sales ({dateRange}d)</p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100 mt-0.5">{formatCurrency(salesReport.totalSales)}</p>
            <p className="text-caption text-green-600 dark:text-green-400 mt-0.5">{salesReport.totalItems} units</p>
          </div>

          <div className="card card-compact bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-700/30">
            <p className="text-label text-orange-700 dark:text-orange-300">Low Stock</p>
            <p className="text-lg font-bold text-orange-900 dark:text-orange-100 mt-0.5">{metrics.lowStockCount}</p>
            <p className="text-caption text-orange-600 dark:text-orange-400 mt-0.5">items to reorder</p>
          </div>

          <div className="card card-compact bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-700/30">
            <p className="text-label text-purple-700 dark:text-purple-300">Turnover Ratio</p>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100 mt-0.5">{metrics.turnoverRatio.toFixed(2)}x</p>
            <p className="text-caption text-purple-600 dark:text-purple-400 mt-0.5">per month</p>
          </div>
        </div>

        {/* Main Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Sales Report */}
          <div className="card card-compact">
            <h2 className="heading-section mb-2">📊 Sales by Category</h2>
            <div className="space-y-2">
              {Object.entries(salesReport.byCategory).length > 0 ? (
                Object.entries(salesReport.byCategory).map(([category, units]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-200">{category}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{units} units</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(units / salesReport.totalItems) * 100}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No sales in selected period</p>
              )}
            </div>
          </div>

          {/* Low Stock Report */}
          <div className="card card-compact">
            <h2 className="heading-section mb-2">⚠️ Low Stock ({lowStockReport.length})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {lowStockReport.slice(0, 5).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-2xs text-gray-600 dark:text-gray-400">{p.currentStock} units in stock</p>
                  </div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Below {p.reorderLevel}</span>
                </div>
              ))}
              {lowStockReport.length > 5 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">+{lowStockReport.length - 5} more items</p>
              )}
            </div>
          </div>

          {/* Profit Report */}
          <div className="card card-compact">
            <h2 className="heading-section mb-2">💰 Top Margins</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {profitReport.slice(0, 5).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-2xs text-gray-600 dark:text-gray-400">Cost: ${p.cost} → Price: ${p.unitPrice}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{p.profitMargin}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Performance */}
          <div className="card card-compact">
            <h2 className="heading-section mb-2">🚚 Suppliers</h2>
            <div className="space-y-2">
              {supplierPerformance.slice(0, 3).map((s) => (
                <div key={s.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{s.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.round(s.rating) ? '⭐' : '☆'}`}></span>
                      ))}
                    </div>
                  </div>
                  <div className="text-2xs text-gray-600 dark:text-gray-400 space-y-0.5">
                    <p>On-time Delivery: <span className="font-medium">{s.onTimeDelivery}%</span></p>
                    <p>Quality Score: <span className="font-medium">{Math.round(s.qualityScore)}%</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Aging */}
          <div className="lg:col-span-2 card card-compact">
            <h2 className="heading-section mb-2">📦 Stock Aging</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-2xs">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                    <th className="px-2 py-1.5 text-left text-gray-700 dark:text-gray-300 font-semibold">Product Name</th>
                    <th className="px-2 py-1.5 text-center text-gray-700 dark:text-gray-300 font-semibold">Current Stock</th>
                    <th className="px-2 py-1.5 text-center text-gray-700 dark:text-gray-300 font-semibold">Days in Stock</th>
                    <th className="px-2 py-1.5 text-right text-gray-700 dark:text-gray-300 font-semibold">Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryAging.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-2 py-1 text-gray-900 dark:text-white font-medium">{p.name}</td>
                      <td className="px-2 py-1 text-center text-gray-600 dark:text-gray-400">{p.currentStock}</td>
                      <td className="px-2 py-1 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-2xs font-bold ${
                          p.daysInStock > 30
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {p.daysInStock}d
                        </span>
                      </td>
                      <td className="px-2 py-1 text-right text-gray-900 dark:text-white font-medium text-2xs">{formatCurrency(p.currentStock * p.unitPrice)}</td>
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
