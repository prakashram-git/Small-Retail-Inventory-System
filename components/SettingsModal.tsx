'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/settings-store';
import { useInventoryStore } from '@/lib/store';
import { X, Moon, Sun, Lock, Trash2, Plus, CheckCircle, Circle } from 'lucide-react';
import { UserRole } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateBrandName, toggleDarkMode, updateShopLocation, users, addUser, deleteUser, updateUserRole, toggleUserActive } = useSettingsStore();
  const { addToast } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'brand' | 'users'>('brand');
  const [brandName, setBrandName] = useState(settings.brandName);
  const [shopLocation, setShopLocation] = useState(settings.shopLocation);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('staff');

  const handleBrandSave = () => {
    updateBrandName(brandName);
    addToast('Brand name updated', 'success');
  };

  const handleLocationSave = () => {
    updateShopLocation(shopLocation);
    addToast('Location updated', 'success');
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    addToast(`${settings.darkMode ? 'Light' : 'Dark'} mode enabled`, 'info');
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      addToast('Fill all fields', 'error');
      return;
    }
    addUser(newUserName, newUserEmail, newUserRole);
    addToast('User added', 'success');
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('staff');
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Delete this user?')) {
      deleteUser(userId);
      addToast('User deleted', 'success');
    }
  };

  const roleColors = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    manager: 'bg-blue-50 text-blue-700 border-blue-200',
    staff: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Admin Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === 'brand'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Brand
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users ({users.filter(u => u.isActive).length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Brand Tab */}
          {activeTab === 'brand' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleBrandSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleLocationSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Add User Button */}
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>

              {/* Add User Form */}
              {showAddUser && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowAddUser(false)}
                      className="flex-1 px-3 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Users List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className={`flex-1 px-2 py-1 rounded text-xs font-semibold border ${roleColors[user.role]}`}
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => toggleUserActive(user.id)}
                        className="p-1"
                      >
                        {user.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
