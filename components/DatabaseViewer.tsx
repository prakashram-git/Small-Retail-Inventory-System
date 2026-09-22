'use client';

import { useState } from 'react';
import { Download, RefreshCw, Trash2, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';

export default function DatabaseViewer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const products = useInventoryStore((state) => state.products);
  const movements = useInventoryStore((state) => state.movements);
  const purchaseOrders = useInventoryStore((state) => state.purchaseOrders);
  const goodsReceipts = useInventoryStore((state) => state.goodsReceipts);
  const invoices = useInventoryStore((state) => state.invoices);
  const stocktakes = useInventoryStore((state) => state.stocktakes);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const addToast = useInventoryStore((state) => state.addToast);

  const databaseData = {
    products,
    movements,
    purchaseOrders,
    goodsReceipts,
    invoices,
    stocktakes,
    suppliers,
    lastSaved: new Date().toISOString(),
    stats: {
      totalProducts: products.length,
      totalMovements: movements.length,
      totalPOs: purchaseOrders.length,
      totalGRNs: goodsReceipts.length,
      totalInvoices: invoices.length,
      totalStocktakes: stocktakes.length,
      totalSuppliers: suppliers.length,
    },
  };

  const fetchFromServer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/load');
      if (response.ok) {
        const data = await response.json();
        addToast('Database loaded from server', 'success');
        console.log('Server Database:', data);
      } else {
        addToast('No database found on server yet', 'info');
      }
    } catch (error) {
      addToast('Failed to load from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDatabase = () => {
    const dataStr = JSON.stringify(databaseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Database downloaded', 'success');
  };

  const copyToClipboard = () => {
    const dataStr = JSON.stringify(databaseData, null, 2);
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Database copied to clipboard', 'success');
  };

  const clearDatabase = () => {
    if (confirm('Are you sure you want to clear the database? This cannot be undone.')) {
      const response = fetch('/api/inventory/clear', { method: 'POST' });
      addToast('Database cleared', 'info');
    }
  };

  const getTotalValue = () => {
    return products.reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Database Manager</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {!isExpanded ? (
        // Collapsed View - Stats Only
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">Products</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{products.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">Movements</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{movements.length}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">Suppliers</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{suppliers.length}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Value</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              ${(getTotalValue() / 1000).toFixed(1)}k
            </p>
          </div>
        </div>
      ) : (
        // Expanded View - Full Data
        <div className="space-y-4">
          {/* Statistics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Movements</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{movements.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Purchase Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{purchaseOrders.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Invoices</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Stocktakes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stocktakes.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Suppliers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{suppliers.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded col-span-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">Inventory Value</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${getTotalValue().toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Database Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Database Content</h3>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title={showRawJson ? 'Hide JSON' : 'Show JSON'}
              >
                {showRawJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {showRawJson ? (
              <div className="bg-gray-900 dark:bg-black p-4 rounded overflow-x-auto max-h-96">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(databaseData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm space-y-2 max-h-96 overflow-y-auto">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Products:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{products.length} items</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Stock Movements:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{movements.length} entries</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Purchase Orders:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{purchaseOrders.length} POs</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Goods Receipts:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{goodsReceipts.length} GRNs</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Invoices:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{invoices.length} invoices</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Stocktakes:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{stocktakes.length} counts</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Suppliers:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{suppliers.length} vendors</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Inventory Value:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">${getTotalValue().toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Last Saved:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {new Date(databaseData.lastSaved).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchFromServer}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm font-medium transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Fetch from Server'}
            </button>

            <button
              onClick={downloadDatabase}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>

            <button
              onClick={clearDatabase}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear Database
            </button>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded p-3 text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">Database Information</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Data stored at: <span className="font-mono">/data/inventory.json</span></li>
              <li>Auto-saved every 30 seconds</li>
              <li>Cached in browser localStorage</li>
              <li>Download for backup or transfer</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
