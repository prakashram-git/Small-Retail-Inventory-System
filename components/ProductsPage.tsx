'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const products = useInventoryStore((state) => state.products) || [];
  const addProduct = useInventoryStore((state) => state.addProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (!name || !cost || !price) {
      alert('Fill all fields');
      return;
    }

    addProduct({
      sku: `SKU-${Date.now()}`,
      name,
      category: 'Other',
      cost: parseFloat(cost),
      unitPrice: parseFloat(price),
      currentStock: 0,
      reorderLevel: 10,
    });

    setName('');
    setCost('');
    setPrice('');
    setShowForm(false);
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <p className="text-gray-600 dark:text-gray-400">Total: {products.length}</p>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Add Product
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
            />
            <input
              type="number"
              placeholder="Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-4 py-2 text-left text-gray-900 dark:text-white">SKU</th>
            <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Name</th>
            <th className="px-4 py-2 text-right text-gray-900 dark:text-white">Cost</th>
            <th className="px-4 py-2 text-right text-gray-900 dark:text-white">Price</th>
            <th className="px-4 py-2 text-center text-gray-900 dark:text-white">Stock</th>
            <th className="px-4 py-2 text-center text-gray-900 dark:text-white">Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-2 text-gray-900 dark:text-white">{p.sku}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{p.name}</td>
              <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(p.cost)}</td>
              <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(p.unitPrice)}</td>
              <td className="px-4 py-2 text-center text-gray-900 dark:text-white">{p.currentStock}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
