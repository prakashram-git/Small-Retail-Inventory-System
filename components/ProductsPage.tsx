'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formName, setFormName] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formReorder, setFormReorder] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddProduct = () => {
    if (!formName || !formCost || !formPrice) {
      alert('Fill Name, Cost, and Price');
      return;
    }

    addProduct({
      sku: `SKU-${Date.now()}`,
      name: formName,
      category: 'Other',
      cost: parseFloat(formCost),
      unitPrice: parseFloat(formPrice),
      currentStock: parseInt(formStock) || 0,
      reorderLevel: parseInt(formReorder) || 10,
    });

    // Reset form
    setFormName('');
    setFormCost('');
    setFormPrice('');
    setFormStock('');
    setFormReorder('');
    setShowForm(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Total: {products.length} products
        </p>
      </div>

      {/* Search & Add */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
        />
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Product</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Product Name *"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Cost *"
                value={formCost}
                onChange={(e) => setFormCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Selling Price *"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Reorder Level"
                value={formReorder}
                onChange={(e) => setFormReorder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Product</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Price</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{product.sku}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{product.name}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-200">{formatCurrency(product.cost)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-200">{formatCurrency(product.unitPrice)}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-200">{product.currentStock}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No products found
          </div>
        )}
      </div>
    </main>
  );
}
