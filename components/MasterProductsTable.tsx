'use client';

import { useState, useMemo, useEffect } from 'react';
import { useInventoryStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Search, Download, Eye } from 'lucide-react';
import { useProductsLoader } from '@/lib/use-csv-loader';
import { generateJSON, downloadJSON } from '@/lib/json-handler';

type SortField = 'sku' | 'name' | 'category' | 'stock' | 'price';
type SortOrder = 'asc' | 'desc';

export default function MasterProductsTable() {
  useProductsLoader();
  const products = useInventoryStore((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('sku');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch =
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortField) {
        case 'sku':
          aVal = a.sku;
          bVal = b.sku;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        case 'stock':
          aVal = a.currentStock;
          bVal = b.currentStock;
          break;
        case 'price':
          aVal = a.unitPrice;
          bVal = b.unitPrice;
          break;
        default:
          aVal = '';
          bVal = '';
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [products, searchTerm, sortField, sortOrder, selectedCategory]);

  // Calculate totals
  const totals = useMemo(() => {
    return {
      totalProducts: filteredProducts.length,
      totalStock: filteredProducts.reduce((sum, p) => sum + p.currentStock, 0),
      totalValue: filteredProducts.reduce(
        (sum, p) => sum + p.currentStock * p.unitPrice,
        0
      ),
    };
  }, [filteredProducts]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToJSON = () => {
    const jsonContent = generateJSON(filteredProducts);
    downloadJSON(jsonContent, `products-${new Date().toISOString().split('T')[0]}.json`);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return ' ↕️';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Master Products
        </h1>
        <p className="text-2xs sm:text-xs text-gray-600 dark:text-gray-400">
          Complete inventory of all products
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/30">
          <p className="text-2xs text-blue-700 dark:text-blue-400 font-medium">
            Total Products
          </p>
          <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {totals.totalProducts}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-3 border border-green-200/50 dark:border-green-700/30">
          <p className="text-2xs text-green-700 dark:text-green-400 font-medium">
            Total Stock
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {totals.totalStock.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-3 border border-purple-200/50 dark:border-purple-700/30">
          <p className="text-2xs text-purple-700 dark:text-purple-400 font-medium">
            Inventory Value
          </p>
          <p className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {formatCurrency(totals.totalValue)}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-2xs sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-2xs sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-2xs sm:text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-2xs sm:text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100/80 dark:bg-gray-700/80 border-b border-gray-200 dark:border-gray-700">
                <th
                  className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  onClick={() => handleSort('sku')}
                >
                  SKU {getSortIcon('sku')}
                </th>
                <th
                  className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  onClick={() => handleSort('name')}
                >
                  Product Name {getSortIcon('name')}
                </th>
                <th
                  className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  onClick={() => handleSort('category')}
                >
                  Category {getSortIcon('category')}
                </th>
                <th
                  className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  onClick={() => handleSort('stock')}
                >
                  Stock Qty {getSortIcon('stock')}
                </th>
                <th
                  className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  onClick={() => handleSort('price')}
                >
                  Unit Price {getSortIcon('price')}
                </th>
                <th className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">
                  Total Value
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      No products found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                      index % 2 === 0
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-2 sm:px-3 py-2 font-mono font-semibold text-gray-900 dark:text-white">
                      {product.sku}
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-gray-900 dark:text-white font-medium">
                      {product.name}
                    </td>
                    <td className="px-2 sm:px-3 py-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-2xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      {product.currentStock}
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                      {formatCurrency(product.unitPrice)}
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(
                        product.currentStock * product.unitPrice
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        {filteredProducts.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 flex justify-between text-2xs sm:text-xs">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Totals: {filteredProducts.length} products
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              Stock: {totals.totalStock.toLocaleString()} | Value:{' '}
              {formatCurrency(totals.totalValue)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
