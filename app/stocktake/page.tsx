'use client';

import Header from '@/components/Header';
import { useInventoryStore } from '@/lib/store';
import { useState } from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';

export default function StocktakePage() {
  const products = useInventoryStore((state) => state.products);
  const stocktakes = useInventoryStore((state) => state.stocktakes);
  const createStocktake = useInventoryStore((state) => state.createStocktake);
  const completeStocktake = useInventoryStore((state) => state.completeStocktake);
  const addToast = useInventoryStore((state) => state.addToast);

  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [countData, setCountData] = useState<Record<string, number>>({});

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleCountChange = (productId: string, value: string) => {
    setCountData({ ...countData, [productId]: parseInt(value) || 0 });
  };

  const handleCreateStocktake = () => {
    const items = filteredProducts.map((p) => ({
      productId: p.id,
      sku: p.sku,
      productName: p.name,
      systemStock: p.currentStock,
      countedStock: countData[p.id] || p.currentStock,
      variance: (countData[p.id] || p.currentStock) - p.currentStock,
      location: p.location,
      cost: p.cost,
    }));

    createStocktake({
      date: new Date(),
      items,
      status: 'draft',
      totalVariance: items.reduce((sum, i) => sum + i.variance, 0),
      totalVarianceValue: items.reduce((sum, i) => sum + (i.variance * (i.cost || 0)), 0),
    });

    setCountData({});
    setShowForm(false);
    addToast('Stocktake created. Review variances and approve.', 'success');
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const recentStocktakes = stocktakes.slice(0, 5);

  return (
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Stocktake</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Count inventory and reconcile discrepancies</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Start Stocktake'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Stocktakes This Month</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stocktakes.filter((st) => {
                const stDate = new Date(st.date);
                const now = new Date();
                return stDate.getMonth() === now.getMonth() && stDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg. Variance %</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stocktakes.length > 0
                ? (
                    (stocktakes.reduce((sum, st) => sum + Math.abs(st.totalVariance), 0) /
                      (stocktakes.length * products.length)) *
                    100
                  ).toFixed(1)
                : '0'}
              %
            </p>
          </div>
        </div>

        {/* Stocktake Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">New Stocktake</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCountData({});
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Products</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Product</th>
                    <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">System Qty</th>
                    <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">Counted Qty</th>
                    <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const counted = countData[p.id] ?? p.currentStock;
                    const variance = counted - p.currentStock;
                    return (
                      <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{p.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{p.currentStock}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            value={countData[p.id] ?? ''}
                            onChange={(e) => handleCountChange(p.id, e.target.value)}
                            placeholder={p.currentStock.toString()}
                            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                          />
                        </td>
                        <td className={`px-4 py-3 text-center font-bold ${variance === 0 ? 'text-green-600 dark:text-green-400' : variance > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                          {variance > 0 ? '+' : ''}{variance}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateStocktake}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Create Stocktake
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setCountData({});
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Recent Stocktakes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Stocktakes</h2>
            <div className="space-y-3">
              {recentStocktakes.length > 0 ? (
                recentStocktakes.map((st) => (
                  <div key={st.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {st.stocktakeNumber}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(st.date).toLocaleDateString()} • {st.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        st.status === 'verified' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        st.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {st.status === 'verified' && <Check className="w-3 h-3" />}
                        {st.status}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Variance: {st.totalVariance > 0 ? '+' : ''}{st.totalVariance}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No stocktakes yet</p>
              )}
            </div>
          </div>

          {/* Variance Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Variance Analysis</h2>
            {recentStocktakes.length > 0 && recentStocktakes[0] ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentStocktakes[0].items
                  .filter((item) => item.variance !== 0)
                  .map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                      item.variance > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          System: {item.systemStock} → Counted: {item.countedStock}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-bold ${
                        item.variance > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {item.variance > 0 ? '+' : ''}{item.variance}
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No variances recorded</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
