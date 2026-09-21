'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

const CATEGORIES = [
  'Confectionery',
  'Beverages',
  'Snacks',
  'Dairy',
  'Bakery',
  'Electronics',
  'Clothing',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Outdoors',
  'Other'
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Confectionery': ['chocolate', 'candy', 'cookies', 'sweets', 'bar', 'gummy', 'lollipop'],
  'Beverages': ['juice', 'water', 'coffee', 'tea', 'soda', 'drink', 'beverage', 'milk', 'cola', 'beer'],
  'Snacks': ['chips', 'nuts', 'crackers', 'popcorn', 'cereal', 'granola', 'trail mix'],
  'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream'],
  'Bakery': ['bread', 'cake', 'pastry', 'donut', 'muffin', 'cookie'],
  'Electronics': ['phone', 'laptop', 'tablet', 'headphone', 'charger', 'cable'],
  'Clothing': ['shirt', 'pants', 'dress', 'jacket', 'shoe', 'socks'],
  'Health & Beauty': ['shampoo', 'soap', 'lotion', 'cream', 'makeup', 'toothpaste'],
};

export default function ProductsPage() {
  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const editProduct = useInventoryStore((state) => state.editProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    cost: '',
    sellingPrice: '',
    currentStock: '',
    reorderLevel: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate SKU automatically
  const generateSKU = () => {
    const nextNumber = products.length + 1;
    return `PROD-${String(nextNumber).padStart(3, '0')}`;
  };

  // Auto-detect category based on product name
  const detectCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((keyword) => lowerName.includes(keyword))) {
        return category;
      }
    }
    return '';
  };

  const filteredProducts = products.filter((p) =>
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.name || !formData.cost || !formData.sellingPrice) {
      alert('Please fill all required fields: Name, Cost, and Selling Price');
      return;
    }

    try {
      // Use provided SKU or generate one
      const sku = formData.sku || generateSKU();
      const category = formData.category || detectCategory(formData.name);
      const cost = parseFloat(formData.cost);
      const unitPrice = parseFloat(formData.sellingPrice);
      const currentStock = parseInt(formData.currentStock) || 0;
      const reorderLevel = parseInt(formData.reorderLevel) || 0;

      if (isNaN(cost) || isNaN(unitPrice)) {
        alert('Cost and Selling Price must be valid numbers');
        return;
      }

      if (editingId) {
        editProduct(editingId, {
          sku,
          name: formData.name,
          category,
          cost,
          unitPrice,
          currentStock,
          reorderLevel,
        });
        setEditingId(null);
      } else {
        addProduct({
          sku,
          name: formData.name,
          category,
          cost,
          unitPrice,
          currentStock,
          reorderLevel,
        });
      }

      setFormData({
        sku: '',
        name: '',
        category: '',
        cost: '',
        sellingPrice: '',
        currentStock: '',
        reorderLevel: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  // Handle CSV Import
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          alert('CSV must have header row and at least one data row');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        let importCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim());

          if (values.length < 5) continue; // Skip incomplete rows

          const nameIndex = headers.findIndex((h) => h.includes('name'));
          const costIndex = headers.findIndex((h) => h.includes('cost'));
          const priceIndex = headers.findIndex((h) => h.includes('selling') || h.includes('price'));
          const stockIndex = headers.findIndex((h) => h.includes('stock'));
          const reorderIndex = headers.findIndex((h) => h.includes('reorder'));
          const skuIndex = headers.findIndex((h) => h.includes('sku'));
          const categoryIndex = headers.findIndex((h) => h.includes('category'));

          if (nameIndex === -1 || costIndex === -1 || priceIndex === -1) {
            alert('CSV must have: name, cost, selling price columns');
            return;
          }

          const name = values[nameIndex];
          const sku = values[skuIndex] || generateSKU();
          const category = values[categoryIndex] || detectCategory(name);

          addProduct({
            sku: sku,
            name: name,
            category: category,
            cost: parseFloat(values[costIndex]) || 0,
            unitPrice: parseFloat(values[priceIndex]) || 0,
            currentStock: stockIndex !== -1 ? parseInt(values[stockIndex]) || 0 : 0,
            reorderLevel: reorderIndex !== -1 ? parseInt(values[reorderIndex]) || 0 : 0,
          });

          importCount++;
        }

        alert(`Successfully imported ${importCount} products!`);
        setShowImport(false);
      } catch (error) {
        alert('Error parsing CSV file. Please check the format.');
        console.error(error);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      cost: product.cost.toString(),
      sellingPrice: product.unitPrice.toString(),
      currentStock: product.currentStock.toString(),
      reorderLevel: product.reorderLevel.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleCancel = () => {
    setFormData({
      sku: '',
      name: '',
      category: '',
      cost: '',
      sellingPrice: '',
      currentStock: '',
      reorderLevel: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calculateProfit = (cost: number, sellingPrice: number) => {
    return sellingPrice - cost;
  };

  const calculateMargin = (cost: number, sellingPrice: number) => {
    if (cost === 0) return 0;
    return parseFloat(((sellingPrice - cost) / sellingPrice * 100).toFixed(1));
  };

  if (!mounted) return null;

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
      {/* Debug Info - Product Count */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm font-mono text-blue-900 dark:text-blue-300">
          Total Products in Store: <span className="font-bold">{products.length}</span> |
          Search Results: <span className="font-bold">{filteredProducts.length}</span>
        </p>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your product inventory</p>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Upload className="w-4 h-4" />
          Import CSV
        </button>
      </div>

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import Products from CSV</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload a CSV file with columns: Name, Cost, Selling Price (required). Optional: SKU, Category, Stock, Reorder Level
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-900 mb-2">Example CSV Format:</p>
                <p className="text-xs text-blue-700 font-mono">
                  Name,Cost,Selling Price,SKU,Category,Stock,Reorder Level<br />
                  Dark Chocolate,2.50,4.50,CHOC-001,Confectionery,12,50<br />
                  Orange Juice,1.80,3.20,BEVER-001,Beverages,28,60<br />
                  Potato Chips,1.50,2.80,,Snacks,45,80
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  💡 Tip: Leave SKU and Category empty for auto-fill
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-dark"
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowImport(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  SKU (Optional - auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder={`Leave empty for auto: ${generateSKU()}`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.sku ? `Your SKU: ${formData.sku}` : `Auto-generated SKU: ${generateSKU()}`}
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name: name,
                      category: formData.category || detectCategory(name)
                    });
                  }}
                  placeholder="e.g., Dark Chocolate Bar"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Category (Auto-filled based on product name)
                </label>
                <select
                  value={formData.category || detectCategory(formData.name)}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {detectCategory(formData.name) && !formData.category && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    💡 Suggested: {detectCategory(formData.name)}
                  </p>
                )}
              </div>

              {/* Two Column - Cost & Selling Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              {/* Two Column - Current Stock & Reorder Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium"
              >
                {editingId ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Product Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Selling Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Profit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Margin %</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Reorder</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-200">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 dark:text-gray-200">{product.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {formatCurrency(product.cost)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {formatCurrency(product.unitPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +{formatCurrency(calculateProfit(product.cost, product.unitPrice))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {calculateMargin(product.cost, product.unitPrice)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        product.currentStock <= product.reorderLevel
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}
                    >
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.reorderLevel}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No products found. Start by adding a new product!</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Stock Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(
              products.reduce((sum, p) => sum + p.unitPrice * p.currentStock, 0)
            )}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {products.filter((p) => p.currentStock <= p.reorderLevel).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Avg Margin</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {(
              products.reduce((sum, p) => sum + calculateMargin(p.cost, p.sellingPrice), 0) /
              products.length
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>
    </main>
  );
}
