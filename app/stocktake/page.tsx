import Header from '@/components/Header';

export default function StocktakeRoute() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Stocktake</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Count inventory and reconcile discrepancies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Start New Stocktake</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">Select Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary">
                  <option>All Products</option>
                  <option>Confectionery</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium">
                Begin Stocktake
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Stocktakes</h2>
            <div className="space-y-3">
              {[
                { date: '15 Sept 2026', items: 25, accuracy: '98%' },
                { date: '08 Sept 2026', items: 32, accuracy: '96%' },
                { date: '01 Sept 2026', items: 28, accuracy: '99%' },
              ].map((st, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{st.date}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{st.items} items counted</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{st.accuracy} Accurate</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Variance Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Product</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">System Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Counted</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Variance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sku: 'CHOC-001', name: 'Dark Chocolate', system: 12, counted: 15, variance: '+3' },
                  { sku: 'BEVER-001', name: 'Orange Juice', system: 28, counted: 25, variance: '-3' },
                  { sku: 'SNACK-001', name: 'Potato Chips', system: 45, counted: 45, variance: '✓' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-200">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{item.name}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-200">{item.system}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-200">{item.counted}</td>
                    <td className={`px-4 py-3 text-center text-sm font-bold ${item.variance === '✓' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.variance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
