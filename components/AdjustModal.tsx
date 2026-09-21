'use client';

import { useState } from 'react';
import { X, BarChart3 } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';

interface AdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADJUSTMENT_REASONS = [
  'Damage/Defective',
  'Stock Loss/Theft',
  'Expiry/Obsolete',
  'System Correction',
  'Found Items',
  'Return from Customer',
  'Donation/Disposal',
  'Other',
];

export default function AdjustModal({ isOpen, onClose }: AdjustModalProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'reduce'>('reduce');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const products = useInventoryStore((state) => state.products);
  const updateStock = useInventoryStore((state) => state.updateStock);
  const addToast = useInventoryStore((state) => state.addToast);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !quantity || !reason) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      addToast('Quantity must be greater than 0', 'error');
      return;
    }

    const adjustmentQty = adjustmentType === 'reduce' ? -qty : qty;
    const description = `${adjustmentType === 'reduce' ? 'Stock Reduction' : 'Stock Addition'}: ${reason}${notes ? ` - ${notes}` : ''}`;

    updateStock(selectedProductId, adjustmentQty, 'adjustment', description);

    // Reset form
    setSelectedProductId('');
    setQuantity('');
    setAdjustmentType('reduce');
    setReason('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Adjust Stock</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Stock: {product.currentStock})
                </option>
              ))}
            </select>
          </div>

          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Adjustment Type
            </label>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer transition"
                style={{
                  borderColor: adjustmentType === 'reduce' ? '#dc2626' : '#d1d5db',
                  backgroundColor: adjustmentType === 'reduce' ? '#fee2e2' : 'transparent',
                }}>
                <input
                  type="radio"
                  name="adjustmentType"
                  value="reduce"
                  checked={adjustmentType === 'reduce'}
                  onChange={(e) => setAdjustmentType(e.target.value as 'reduce' | 'add')}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Reduce</span>
              </label>
              <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer transition"
                style={{
                  borderColor: adjustmentType === 'add' ? '#16a34a' : '#d1d5db',
                  backgroundColor: adjustmentType === 'add' ? '#dcfce7' : 'transparent',
                }}>
                <input
                  type="radio"
                  name="adjustmentType"
                  value="add"
                  checked={adjustmentType === 'add'}
                  onChange={(e) => setAdjustmentType(e.target.value as 'reduce' | 'add')}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Add</span>
              </label>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter quantity"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select reason...</option>
              {ADJUSTMENT_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g., Items found during inventory check"
              rows={2}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
