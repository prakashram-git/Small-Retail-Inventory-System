'use client';

import { useState } from 'react';
import { Plus, Search, Trash2, Star } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  leadTime: number;
  rating: number;
  isPreferred: boolean;
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Beverages Inc.',
    contactPerson: 'John Smith',
    phone: '+65-6123-4567',
    email: 'john@freshbeverages.com',
    address: '123 Supplier Street, Singapore 123456',
    paymentTerms: '30 days',
    leadTime: 3,
    rating: 5,
    isPreferred: true,
  },
  {
    id: '2',
    name: 'Snacks & Treats Ltd',
    contactPerson: 'Sarah Johnson',
    phone: '+65-6234-5678',
    email: 'sarah@snackstreats.com',
    address: '456 Trade Lane, Singapore 234567',
    paymentTerms: 'COD',
    leadTime: 2,
    rating: 4,
    isPreferred: true,
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: '',
    leadTime: '',
    rating: '5',
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.name || !formData.contactPerson) {
      alert('Please fill required fields');
      return;
    }

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: formData.name,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      paymentTerms: formData.paymentTerms,
      leadTime: parseInt(formData.leadTime) || 0,
      rating: parseInt(formData.rating) || 5,
      isPreferred: false,
    };

    setSuppliers([...suppliers, newSupplier]);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      paymentTerms: '',
      leadTime: '',
      rating: '5',
    });
    setShowForm(false);
  };

  const togglePreferred = (id: string) => {
    setSuppliers(
      suppliers.map((s) => (s.id === id ? { ...s, isPreferred: !s.isPreferred } : s))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this supplier?')) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
    }
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your supplier contacts and terms</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search supplier..."
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
          Add Supplier
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 sticky top-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Supplier</h2>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Contact Person *</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    placeholder="e.g., 30 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Lead Time (days)</label>
                  <input
                    type="number"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Rating (1-5 stars)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="1">⭐ 1 Star</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 sticky bottom-0">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition font-medium"
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                  <button
                    onClick={() => togglePreferred(supplier.id)}
                    className={`p-1 rounded transition ${supplier.isPreferred ? 'bg-yellow-100' : 'bg-gray-100'}`}
                  >
                    <Star className={`w-4 h-4 ${supplier.isPreferred ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600">Contact: {supplier.contactPerson}</p>
              </div>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-700">Phone:</span> {supplier.phone}</p>
              <p><span className="font-semibold text-gray-700">Email:</span> {supplier.email}</p>
              <p><span className="font-semibold text-gray-700">Address:</span> {supplier.address}</p>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Payment Terms</p>
                  <p className="font-semibold text-gray-900">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Lead Time</p>
                  <p className="font-semibold text-gray-900">{supplier.leadTime} days</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-600">Rating</p>
                <p className="text-lg">{'⭐'.repeat(supplier.rating)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No suppliers found. Add one to get started!</p>
        </div>
      )}
    </main>
  );
}
