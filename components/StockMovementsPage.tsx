'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Package } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StockMovementsPage() {
  const products = useInventoryStore((state) => state.products);
  const movements = useInventoryStore((state) => state.movements);
  const updateStock = useInventoryStore((state) => state.updateStock);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'sale' | 'adjustment'>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'purchase' as 'purchase' | 'sale' | 'adjustment',
    quantity: '',
    notes: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredMovements = movements.filter((m) => {
    const product = products.find((p) => p.id === m.productId);
    const matchesSearch =
      (product?.sku.toLowerCase().includes(search.toLowerCase())) ||
      (product?.name.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    if (!formData.productId || !formData.quantity) {
      alert('Please fill required fields');
      return;
    }

    const quantity = parseInt(formData.quantity);
    updateStock(formData.productId, quantity, formData.type, formData.notes);

    setFormData({
      productId: '',
      type: 'purchase',
      quantity: '',
      notes: '',
    });
    setShowForm(false);
  };

  const getTotals = () => {
    const filtered = filterType === 'all' ? movements : movements.filter((m) => m.type === filterType);
    const purchases = filtered.filter((m) => m.type === 'purchase').reduce((sum, m) => sum + m.quantity, 0);
    const sales = filtered.filter((m) => m.type === 'sale').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const adjustments = filtered.filter((m) => m.type === 'adjustment').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    return { purchases, sales, adjustments };
  };

  const totals = getTotals();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'sale':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'adjustment':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (!mounted) return null;

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Stock Movements</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track purchases, sales, and adjustments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Purchases</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{totals.purchases}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">units added</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Sales</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{totals.sales}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">units sold</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Adjustments</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{totals.adjustments}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">units adjusted</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="all">All Types</option>
          <option value="purchase">Purchases</option>
          <option value="sale">Sales</option>
          <option value="adjustment">Adjustments</option>
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Log Movement
        </button>
      </div>

      {/* Current Inventory Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-gray-900 dark:text-white" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Inventory</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">({products.length} items)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-xs font-bold text-gray-600 dark:text-gray-400">{product.sku}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <p className="font-bold text-gray-900 dark:text-white">{product.currentStock}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Reorder:</span>
                  <p className="font-bold text-gray-900 dark:text-white">{product.reorderLevel}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Unit Price:</span>
                  <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(product.unitPrice)}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Value:</span>
                  <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(product.currentStock * product.unitPrice)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No products in inventory</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Log Stock Movement</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Product *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name} (Stock: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="purchase">Purchase (Stock In)</option>
                  <option value="sale">Sale (Stock Out)</option>
                  <option value="adjustment">Adjustment (Damage/Loss)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Reason for movement"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium"
              >
                Log Movement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movements Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Product</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMovements.map((movement, index) => {
                const product = products.find((p) => p.id === movement.productId);
                return (
                  <tr key={movement.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900 dark:text-gray-200">{formatDate(movement.timestamp)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-200">{product?.sku || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-gray-200">{product?.name || 'Unknown'}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(movement.type)}`}>
                        {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{movement.notes}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No movements found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
