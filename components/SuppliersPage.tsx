'use client';

import { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Phone, Mail } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';

export default function SuppliersPage() {
  const suppliers = useInventoryStore((state) => state.suppliers);
  const addSupplier = useInventoryStore((state) => state.addSupplier);
  const updateSupplier = useInventoryStore((state) => state.updateSupplier);
  const addToast = useInventoryStore((state) => state.addToast);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    leadTimeDays: 0,
    paymentTerms: '',
    isActive: true,
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.name || !formData.leadTimeDays) {
      addToast('Please fill required fields (Name, Lead Time)', 'warning');
      return;
    }

    if (editingId) {
      updateSupplier(editingId, formData);
      setEditingId(null);
    } else {
      addSupplier(formData);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (supplier: typeof suppliers[0]) => {
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      city: supplier.city || '',
      country: supplier.country || '',
      leadTimeDays: supplier.leadTimeDays,
      paymentTerms: supplier.paymentTerms || '',
      isActive: supplier.isActive,
    });
    setEditingId(supplier.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: '',
      leadTimeDays: 0,
      paymentTerms: '',
      isActive: true,
    });
    setEditingId(null);
  };

  const getSupplierPerf = (supplierId: string) => {
    return useInventoryStore.getState().getSupplierPerformance(supplierId);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage vendors and supplier performance</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Supplier'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {editingId ? 'Edit Supplier' : 'New Supplier'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Fresh Supplies Inc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Lead Time (days) *</label>
                <input
                  type="number"
                  value={formData.leadTimeDays}
                  onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="contact@supplier.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+65-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Payment Terms</label>
                <input
                  type="text"
                  placeholder="e.g., Net 30"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-600 dark:text-gray-400">Active Supplier</label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
              >
                {editingId ? 'Update Supplier' : 'Add Supplier'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by supplier name or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => {
              const perf = getSupplierPerf(supplier.id);
              return (
                <div key={supplier.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supplier.name}</h3>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.round(perf.rating) ? '⭐' : '☆'} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    {supplier.contactPerson && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Contact:</span> {supplier.contactPerson}
                      </p>
                    )}
                    {supplier.phone && (
                      <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {supplier.phone}
                      </p>
                    )}
                    {supplier.email && (
                      <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {supplier.email}
                      </p>
                    )}
                    {supplier.address && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Address:</span> {supplier.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{supplier.leadTimeDays}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Lead Days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{perf.onTimeDelivery}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">On-Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(perf.qualityScore)}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quality</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <div className={`flex-1 px-2 py-1 rounded text-xs font-medium text-center ${supplier.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}`}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No suppliers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
