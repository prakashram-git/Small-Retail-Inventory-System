'use client';

import { useState } from 'react';
import { Plus, Search, Download, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Movement {
  id: string;
  date: Date;
  sku: string;
  productName: string;
  type: 'purchase' | 'sale' | 'adjustment';
  quantity: number;
  notes: string;
  amount?: number;
  supplier?: string;
  user: string;
}

const MOCK_MOVEMENTS: Movement[] = [
  {
    id: '1',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sku: 'CHOC-001',
    productName: 'Dark Chocolate Bar',
    type: 'sale',
    quantity: -8,
    notes: 'Customer purchase',
    amount: 36,
    user: 'Alex',
  },
  {
    id: '2',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    sku: 'BEVER-001',
    productName: 'Orange Juice (1L)',
    type: 'purchase',
    quantity: 50,
    notes: 'Supplier: Fresh Beverages Inc.',
    amount: 90,
    supplier: 'Fresh Beverages',
    user: 'Manager',
  },
  {
    id: '3',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    sku: 'SNACK-001',
    productName: 'Potato Chips (200g)',
    type: 'adjustment',
    quantity: -3,
    notes: 'Damaged units removed',
    user: 'Alex',
  },
];

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<Movement[]>(MOCK_MOVEMENTS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'sale' | 'adjustment'>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    type: 'purchase' as 'purchase' | 'sale' | 'adjustment',
    quantity: '',
    notes: '',
    supplier: '',
  });

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      m.productName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    if (!formData.sku || !formData.productName || !formData.quantity) {
      alert('Please fill required fields');
      return;
    }

    const newMovement: Movement = {
      id: `mov-${Date.now()}`,
      date: new Date(),
      sku: formData.sku,
      productName: formData.productName,
      type: formData.type,
      quantity: parseInt(formData.quantity) * (formData.type === 'sale' ? -1 : 1),
      notes: formData.notes,
      supplier: formData.supplier,
      user: 'Current User',
    };

    setMovements([newMovement, ...movements]);
    setFormData({
      sku: '',
      productName: '',
      type: 'purchase',
      quantity: '',
      notes: '',
      supplier: '',
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this movement?')) {
      setMovements(movements.filter((m) => m.id !== id));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-700';
      case 'sale':
        return 'bg-red-100 text-red-700';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTotals = () => {
    const filtered = filterType === 'all' ? movements : movements.filter((m) => m.type === filterType);
    const purchases = filtered.filter((m) => m.type === 'purchase').reduce((sum, m) => sum + m.quantity, 0);
    const sales = filtered.filter((m) => m.type === 'sale').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const adjustments = filtered.filter((m) => m.type === 'adjustment').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    return { purchases, sales, adjustments };
  };

  const totals = getTotals();

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
          <p className="text-xs text-gray-600 dark:text-gray-400">Purchases</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{totals.purchases}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">units</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Sales</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{totals.sales}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">units</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Adjustments</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{totals.adjustments}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">units</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Log Stock Movement</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g., CHOC-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g., Dark Chocolate Bar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="purchase">Purchase (Stock In)</option>
                  <option value="sale">Sale (Stock Out)</option>
                  <option value="adjustment">Adjustment (Damage/Loss)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {formData.type === 'purchase' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Reason for adjustment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Notes</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMovements.map((movement, index) => (
                <tr key={movement.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{formatDate(movement.date)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold text-gray-900">{movement.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{movement.productName}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(movement.type)}`}>
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-bold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600 truncate">{movement.notes}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(movement.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No movements found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
