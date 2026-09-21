import Header from '@/components/Header';

export default function ReportsRoute() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Analyze sales, inventory, and profit data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Sales Report', desc: 'Total sales and trends by product', icon: '📊' },
            { title: 'Profit Analysis', desc: 'Profit margins by product & category', icon: '💰' },
            { title: 'Low Stock Report', desc: 'Items below reorder level', icon: '⚠️' },
            { title: 'Supplier Performance', desc: 'Delivery time & quality metrics', icon: '🚚' },
            { title: 'Inventory Aging', desc: 'Slow-moving & dead stock items', icon: '📦' },
            { title: 'Stock Report', desc: 'Current inventory levels', icon: '📈' },
          ].map((report, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md dark:hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-4xl mb-3">{report.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{report.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{report.desc}</p>
              <button className="mt-4 w-full px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition text-sm font-medium">
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
