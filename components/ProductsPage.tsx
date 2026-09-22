'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Search, ChevronDown, Filter, X } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

type SortField = 'name' | 'sku' | 'stock' | 'price' | 'margin';
type SortOrder = 'asc' | 'desc';

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'low-stock'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    reorderLevel: 0,
    cost: 0,
    unitPrice: 0,
    category: '',
    supplier: '',
    location: '',
    status: 'active' as 'active' | 'inactive' | 'discontinued',
  });

  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const editProduct = useInventoryStore((state) => state.editProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterStatus === 'active') return matchesSearch && p.status === 'active';
      if (filterStatus === 'low-stock') return matchesSearch && p.currentStock <= p.reorderLevel;
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'sku':
          aVal = a.sku;
          bVal = b.sku;
          break;
        case 'stock':
          aVal = a.currentStock;
          bVal = b.currentStock;
          break;
        case 'price':
          aVal = a.unitPrice;
          bVal = b.unitPrice;
          break;
        case 'margin':
          aVal = a.profitMargin || 0;
          bVal = b.profitMargin || 0;
          break;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [products, searchTerm, sortField, sortOrder, filterStatus]);

  const handleAdd = () => {
    if (!formData.sku || !formData.name) {
      alert('SKU and Name are required');
      return;
    }

    if (editingId) {
      editProduct(editingId, formData);
      setEditingId(null);
    } else {
      addProduct(formData);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      reorderLevel: 0,
      cost: 0,
      unitPrice: 0,
      category: '',
      supplier: '',
      location: '',
      status: 'active',
    });
  };

  const handleEdit = (product: typeof products[0]) => {
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      currentStock: product.currentStock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      reorderLevel: product.reorderLevel,
      cost: product.cost,
      unitPrice: product.unitPrice,
      category: product.category,
      supplier: product.supplier || '',
      location: product.location || '',
      status: product.status,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const getStockStatus = (current: number, min: number, max: number, reorder: number) => {
    if (current <= reorder) return 'critical';
    if (current <= min) return 'low';
    if (current >= max) return 'overstocked';
    return 'healthy';
  };

  const getStockBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      critical: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', label: 'Critical' },
      low: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', label: 'Low' },
      overstocked: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', label: 'Overstocked' },
      healthy: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', label: 'Healthy' },
    };
    const badge = badges[status];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>{badge.label}</span>;
  };

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredAndSorted.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredAndSorted.map((p) => p.id)));
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col">
      {/* Sticky Header with Search & Filters */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Title */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
              <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                {filteredAndSorted.length}
              </span>
            </div>

            {/* Search Bar - Compact */}
            <div className="flex-1 sm:flex-none flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Filter & Add Buttons */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full transition ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Toggle filters"
              >
                <Filter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                  setShowForm(!showForm);
                }}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
                title="Add product"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Options - Collapsible */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Filters:</span>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'low-stock')}
                className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="low-stock">Low Stock</option>
              </select>

              <div className="flex gap-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Sort:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="sku">SKU</option>
                  <option value="stock">Stock</option>
                  <option value="price">Price</option>
                  <option value="margin">Margin</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition font-medium"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {(filterStatus !== 'all' || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus('all');
                    setSearchTerm('');
                  }}
                  className="ml-auto px-2.5 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 py-4"
>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 mb-6 max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {editingId ? 'Edit Product' : 'New Product'}
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">SKU *</label>
                    <input
                      type="text"
                      placeholder="e.g., CHOC-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Product Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Dark Chocolate"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Optional product description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Cost */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Pricing & Cost</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cost Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Selling Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                {formData.cost > 0 && formData.unitPrice > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Profit Margin: {(((formData.unitPrice - formData.cost) / formData.cost) * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              {/* Stock Management */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Stock Management</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Min Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Reorder Level</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Max Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.maxStock}
                      onChange={(e) => setFormData({ ...formData, maxStock: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Organization & Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Organization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g., Beverages"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Supplier</label>
                    <input
                      type="text"
                      placeholder="e.g., ABC Supplies"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Location/Bin</label>
                    <input
                      type="text"
                      placeholder="e.g., Shelf A-1"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'discontinued' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
              >
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table with Alternate Row Colors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 border-b border-gray-700">
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === filteredAndSorted.length && filteredAndSorted.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                      title="Select all"
                    />
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-50 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 transition" onClick={() => setSortField('sku')}>
                    SKU
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-50 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 transition" onClick={() => setSortField('name')}>
                    Product
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-50">Status</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-50 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 transition" onClick={() => setSortField('stock')}>
                    Qty
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold text-gray-50 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 transition" onClick={() => setSortField('price')}>
                    Price
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold text-gray-50 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600 transition" onClick={() => setSortField('margin')}>
                    Margin
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-50">Supplier</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((product, index) => {
                  const stockStatus = getStockStatus(product.currentStock, product.minStock, product.maxStock, product.reorderLevel);
                  const isEvenRow = index % 2 === 0;

                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-blue-100 dark:border-gray-600 text-xs transition hover:opacity-75 ${
                        isEvenRow
                          ? 'bg-blue-50 dark:bg-blue-900/10'
                          : 'bg-gray-100 dark:bg-gray-700/30'
                      } ${selectedProducts.has(product.id) ? 'bg-blue-200 dark:bg-blue-800/40 ring-1 ring-blue-300 dark:ring-blue-600' : ''}`}
                    >
                      <td className="px-2 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                        />
                      </td>
                      <td className="px-2 py-1.5 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">{product.sku}</td>
                      <td className="px-2 py-1.5 max-w-xs">
                        <div className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis" title={product.name}>
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis" title={product.description}>
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-center">{getStockBadge(stockStatus)}</td>
                      <td className="px-2 py-1.5 text-center font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{product.currentStock}</td>
                      <td className="px-2 py-1.5 text-right font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{formatCurrency(product.unitPrice)}</td>
                      <td className="px-2 py-1.5 text-right whitespace-nowrap">
                        {product.profitMargin !== undefined ? (
                          <span className="font-medium text-green-600 dark:text-green-400">{product.profitMargin}%</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 truncate">{product.supplier || '-'}</td>
                      <td className="px-2 py-1.5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSorted.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {products.length === 0 ? 'No products yet. Add one to get started.' : 'No products match your search.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  deleteProduct(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
