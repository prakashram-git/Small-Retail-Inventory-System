'use client';

import { useState, useMemo } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';

interface StocktakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StocktakeModal({ isOpen, onClose }: StocktakeModalProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [countedQuantity, setCountedQuantity] = useState('');
  const products = useInventoryStore((state) => state.products);
  const createStocktakeAdjustment = useInventoryStore((state) => state.createStocktakeAdjustment);
  const addToast = useInventoryStore((state) => state.addToast);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [selectedProductId, products]
  );

  const variance = useMemo(() => {
    if (!selectedProduct || !countedQuantity) return 0;
    return parseInt(countedQuantity) - selectedProduct.currentStock;
  }, [selectedProduct, countedQuantity]);

  const handleSubmit = () => {
    if (!selectedProductId || !countedQuantity) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    const counted = parseInt(countedQuantity);
    if (isNaN(counted) || counted < 0) {
      addToast('Please enter a valid quantity', 'error');
      return;
    }

    createStocktakeAdjustment(selectedProductId, counted);
    setSelectedProductId('');
    setCountedQuantity('');
    addToast('Stocktake adjustment recorded successfully', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Start Stocktake</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            >
              <option value="">-- Choose a product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} - {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock Display */}
          {selectedProduct && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-1">System Records</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">{selectedProduct.currentStock} units</p>
            </div>
          )}

          {/* Counted Quantity Input */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Counted Quantity
            </label>
            <input
              type="number"
              value={countedQuantity}
              onChange={(e) => setCountedQuantity(e.target.value)}
              placeholder="Enter quantity counted"
              min="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>

          {/* Variance Display */}
          {selectedProduct && countedQuantity && (
            <div
              className={`p-4 rounded-lg border-2 ${
                variance === 0
                  ? 'bg-green-50 border-green-200'
                  : variance > 0
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {variance !== 0 && (
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${variance > 0 ? 'text-yellow-600' : 'text-red-600'} mt-1`} />
                )}
                <div>
                  <p className={`text-sm font-semibold ${variance === 0 ? 'text-green-700' : variance > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
                    Variance: {variance > 0 ? '+' : ''}{variance} units
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {variance === 0
                      ? 'Perfect match!'
                      : variance > 0
                      ? `Surplus: ${Math.abs(variance)} more units than recorded`
                      : `Shortage: ${Math.abs(variance)} fewer units than recorded`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              An adjustment entry will be created automatically to reconcile the difference between the counted and system quantity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedProductId || !countedQuantity}
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
