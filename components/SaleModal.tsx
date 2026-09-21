'use client';

import { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaleModal({ isOpen, onClose }: SaleModalProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const products = useInventoryStore((state) => state.products);
  const updateStock = useInventoryStore((state) => state.updateStock);
  const addToast = useInventoryStore((state) => state.addToast);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !quantity || !salePrice) {
      addToast('Please fill all fields', 'warning');
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      addToast('Quantity must be greater than 0', 'error');
      return;
    }

    if (!selectedProduct || selectedProduct.currentStock < qty) {
      addToast('Insufficient stock available', 'error');
      return;
    }

    const totalSaleAmount = (qty * parseFloat(salePrice)).toFixed(2);
    updateStock(
      selectedProductId,
      -qty,
      'sale',
      `Sale: ${qty} units @ $${salePrice}/unit = $${totalSaleAmount}`
    );

    // Reset form
    setSelectedProductId('');
    setQuantity('');
    setSalePrice('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Record Sale</h2>
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Stock: {product.currentStock})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Quantity Sold
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={selectedProduct?.currentStock || undefined}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
            {selectedProduct && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Available: {selectedProduct.currentStock} units
              </p>
            )}
          </div>

          {/* Sale Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Sale Price per Unit ($)
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            {quantity && salePrice && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                Total Sale: ${(parseFloat(quantity) * parseFloat(salePrice)).toFixed(2)}
              </p>
            )}
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
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
