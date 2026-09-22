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
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-2 sm:px-3 py-2 sm:py-3 transition-colors duration-200">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Stock Movements</h1>
        <p className="text-2xs text-gray-600 dark:text-gray-400 mt-0.5">Track purchases, sales, and adjustments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm p-2">
          <p className="text-2xs text-gray-600 dark:text-gray-400">Total Purchases</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">{totals.purchases}</p>
          <p className="text-2xs text-gray-500 dark:text-gray-500 mt-0.5">units added</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm p-2">
          <p className="text-2xs text-gray-600 dark:text-gray-400">Total Sales</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">{totals.sales}</p>
          <p className="text-2xs text-gray-500 dark:text-gray-500 mt-0.5">units sold</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm p-2">
          <p className="text-2xs text-gray-600 dark:text-gray-400">Total Adjustments</p>
          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mt-1">{totals.adjustments}</p>
          <p className="text-2xs text-gray-500 dark:text-gray-500 mt-0.5">units adjusted</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="all">All Types</option>
          <option value="purchase">Purchases</option>
          <option value="sale">Sales</option>
          <option value="adjustment">Adjustments</option>
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-2 py-1 bg-brand-primary text-white rounded hover:bg-brand-dark transition font-medium text-xs"
        >
          <Plus className="w-3 h-3" />
          Log
        </button>
      </div>

      {/* Current Inventory Section */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-3 h-3 text-gray-900 dark:text-white" />
          <h2 className="text-xs font-semibold text-gray-900 dark:text-white">Current Inventory</h2>
          <span className="text-2xs text-gray-600 dark:text-gray-400">({products.length})</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-1">
              <p className="font-mono text-2xs font-bold text-gray-600 dark:text-gray-400 truncate">{product.sku}</p>
              <p className="text-2xs font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
              <div className="grid grid-cols-2 gap-0.5 text-2xs mt-0.5">
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-2xs">Stock:</span>
                  <p className="font-bold text-gray-900 dark:text-white text-2xs">{product.currentStock}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-2xs">Price:</span>
                  <p className="font-bold text-green-600 dark:text-green-400 text-2xs">{formatCurrency(product.unitPrice)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">No products in inventory</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded shadow-xl max-w-sm w-full my-4">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Log Stock Movement</h2>
            </div>

            <div className="p-3 space-y-2">
              <div>
                <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Product *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
                <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="purchase">Purchase (Stock In)</option>
                  <option value="sale">Sale (Stock Out)</option>
                  <option value="adjustment">Adjustment (Damage/Loss)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Reason for movement"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-2 py-1 bg-brand-primary text-white rounded hover:bg-brand-dark transition font-medium text-xs"
              >
                Log Movement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movements Table */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Product</th>
                <th className="px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="px-2 py-1.5 text-right font-semibold text-gray-700 dark:text-gray-300">Quantity</th>
                <th className="px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMovements.map((movement, index) => {
                const product = products.find((p) => p.id === movement.productId);
                return (
                  <tr key={movement.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                    <td className="px-2 py-1">
                      <span className="text-gray-900 dark:text-gray-200">{formatDate(movement.timestamp)}</span>
                    </td>
                    <td className="px-2 py-1">
                      <span className="font-mono font-semibold text-gray-900 dark:text-gray-200">{product?.sku || 'N/A'}</span>
                    </td>
                    <td className="px-2 py-1">
                      <p className="text-gray-900 dark:text-gray-200 truncate">{product?.name || 'Unknown'}</p>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <span className={`font-semibold px-1.5 py-0.5 rounded ${getTypeColor(movement.type)}`}>
                        {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-right">
                      <span className={`font-bold ${movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <p className="text-gray-600 dark:text-gray-400 truncate">{movement.notes}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="px-2 py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">No movements found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
