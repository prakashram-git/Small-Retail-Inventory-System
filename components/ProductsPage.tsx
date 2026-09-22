'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    currentStock: 0,
    reorderLevel: 0,
    cost: 0,
    unitPrice: 0,
    category: '',
  });

  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const handleAdd = () => {
    if (!formData.sku || !formData.name) {
      alert('SKU and Name are required');
      return;
    }

    addProduct({
      sku: formData.sku,
      name: formData.name,
      currentStock: formData.currentStock,
      reorderLevel: formData.reorderLevel,
      cost: formData.cost,
      unitPrice: formData.unitPrice,
      category: formData.category,
    });

    setFormData({
      sku: '',
      name: '',
      currentStock: 0,
      reorderLevel: 0,
      cost: 0,
      unitPrice: 0,
      category: '',
    });
    setShowForm(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">New Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Current Stock"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Reorder Level"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Cost"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save Product
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Reorder Level</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">{product.currentStock}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">{product.reorderLevel}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(product.cost)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(product.unitPrice)}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">{product.category}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No products yet. Add one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
