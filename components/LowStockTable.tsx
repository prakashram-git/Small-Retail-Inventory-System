'use client';

import { useInventoryStore } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function LowStockTable() {
  const products = useInventoryStore((state) => state.products);
  const getLast30DaysSales = useInventoryStore((state) => state.getLast30DaysSales);
  const getSuggestedOrderQuantity = useInventoryStore((state) => state.getSuggestedOrderQuantity);
  const updateStock = useInventoryStore((state) => state.updateStock);
  const addToast = useInventoryStore((state) => state.addToast);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  // Compute low stock items based on current products
  const lowStockItems = products
    .filter((p) => p.currentStock <= p.reorderLevel)
    .sort((a, b) => a.currentStock - b.currentStock);

  const handleSelectAll = () => {
    if (selectedItems.length === lowStockItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(lowStockItems.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSelectedProductsForPO = () => {
    return products
      .filter((p) => selectedItems.includes(p.id))
      .map((p) => ({
        ...p,
        suggestedQty: getSuggestedOrderQuantity(p.id),
        totalCost: getSuggestedOrderQuantity(p.id) * p.unitPrice,
      }));
  };

  const handleGeneratePO = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    setIsPOModalOpen(true);
  };

  return (
    <div className="bg-transparent flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-3 h-3 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white">Low Stock</h2>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Frozen Header */}
        <div className="sticky top-0 z-10 flex items-center px-1 sm:px-2 py-1 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
          <input type="checkbox" disabled className="w-4 h-4 flex-shrink-0" />
          <div className="w-12 sm:w-24 flex-shrink-0 ml-1 sm:ml-4 text-center">
            <p className="font-mono text-2xs font-bold text-gray-700 dark:text-gray-300 truncate" style={{ fontSize: '80%' }}>SKU</p>
          </div>
          <div className="flex-1 ml-1 sm:ml-2 text-left">
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300 truncate" style={{ fontSize: '80%' }}>Product</p>
          </div>
          <div className="w-10 sm:w-16 flex-shrink-0 ml-1 sm:ml-2 text-center">
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300" style={{ fontSize: '80%' }}>Qty</p>
          </div>
          <div className="hidden sm:block w-16 flex-shrink-0 ml-2 text-center">
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300" style={{ fontSize: '80%' }}>L30D</p>
          </div>
          <div className="hidden md:block w-12 flex-shrink-0 ml-2 text-center">
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300" style={{ fontSize: '80%' }}>Order</p>
          </div>
          <div className="hidden lg:block w-14 flex-shrink-0 ml-2 text-center">
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300" style={{ fontSize: '80%' }}>Sugg.</p>
          </div>
          <div className="w-10 sm:w-14 flex-shrink-0 ml-1 sm:ml-2 text-center">
            <p className="text-2xs font-bold text-gray-700 dark:text-gray-300" style={{ fontSize: '80%' }}>Price</p>
          </div>
        </div>

        {/* Scrollable Items */}
        <div className="flex flex-col gap-0 max-h-96 overflow-y-auto">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center px-1 sm:px-2 py-1 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
                />
                <div className="w-12 sm:w-24 flex-shrink-0 ml-1 sm:ml-4 text-center">
                  <p className="font-mono text-2xs font-bold text-gray-900 dark:text-gray-200 truncate" style={{ fontSize: '80%' }}>{item.sku}</p>
                </div>
                <div className="flex-1 ml-1 sm:ml-2 text-left">
                  <p className="text-2xs text-gray-700 dark:text-gray-300 font-medium truncate" style={{ fontSize: '80%' }}>{item.name}</p>
                </div>
                <div className="w-10 sm:w-16 flex-shrink-0 ml-1 sm:ml-2 text-center">
                  <span className="text-2xs font-bold text-red-600 dark:text-red-400" style={{ fontSize: '80%' }}>{item.currentStock}</span>
                </div>
                <div className="hidden sm:block w-16 flex-shrink-0 ml-2 text-center">
                  <span className="text-2xs font-bold text-blue-600 dark:text-blue-400" style={{ fontSize: '80%' }}>{getLast30DaysSales(item.id)}</span>
                </div>
                <div className="hidden md:block w-12 flex-shrink-0 ml-2 text-center">
                  <span className="text-2xs font-bold text-purple-600 dark:text-purple-400" style={{ fontSize: '80%' }}>{item.reorderLevel}</span>
                </div>
                <div className="hidden lg:block w-14 flex-shrink-0 ml-2 text-center">
                  <span className="text-2xs font-bold text-orange-600 dark:text-orange-400" style={{ fontSize: '80%' }}>{getSuggestedOrderQuantity(item.id)}</span>
                </div>
                <div className="w-10 sm:w-14 flex-shrink-0 ml-1 sm:ml-2 text-center">
                  <span className="text-2xs font-bold text-green-600 dark:text-green-400" style={{ fontSize: '80%' }}>${item.unitPrice.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-gray-500 dark:text-gray-400">✓ All items in stock</p>
            </div>
          )}
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <button
          onClick={handleGeneratePO}
          disabled={selectedItems.length === 0}
          className="w-full px-2 py-1.5 bg-brand-primary text-white rounded-lg text-xs hover:bg-brand-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate PO ({selectedItems.length} selected)
        </button>
      )}

      {/* PO Modal */}
      {isPOModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase Order</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">PO Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">PO ID: PO-{Date.now()}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">SKU</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Product</th>
                      <th className="text-center py-2 px-2 font-semibold text-gray-900 dark:text-white">Qty</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">Unit Price</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSelectedProductsForPO().map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-2 font-mono text-gray-900 dark:text-gray-200">{product.sku}</td>
                        <td className="py-3 px-2 text-gray-900 dark:text-gray-200">{product.name}</td>
                        <td className="py-3 px-2 text-center text-gray-900 dark:text-gray-200">{product.suggestedQty}</td>
                        <td className="py-3 px-2 text-right text-gray-900 dark:text-gray-200">{formatCurrency(product.unitPrice)}</td>
                        <td className="py-3 px-2 text-right font-semibold text-gray-900 dark:text-gray-200">{formatCurrency(product.totalCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Subtotal:</span>
                  <span className="text-gray-900 dark:text-gray-200">
                    {formatCurrency(getSelectedProductsForPO().reduce((sum, p) => sum + p.totalCost, 0))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(getSelectedProductsForPO().reduce((sum, p) => sum + p.totalCost, 0))}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex gap-3">
              <button
                onClick={() => setIsPOModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const poId = 'PO-' + Date.now();
                  const selectedProducts = getSelectedProductsForPO();

                  // Update stock for each selected product
                  selectedProducts.forEach((product) => {
                    updateStock(product.id, product.suggestedQty, 'purchase', `Purchase Order ${poId}`);
                  });

                  addToast(`Purchase Order ${poId} created successfully! Stock updated for ${selectedProducts.length} item(s).`, 'success');
                  setIsPOModalOpen(false);
                  setSelectedItems([]);
                }}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium"
              >
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
