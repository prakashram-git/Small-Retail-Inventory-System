'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/settings-store';
import { useInventoryStore } from '@/lib/store';
import { Settings, Moon, Sun, Lock, Trash2, Plus, Edit2, CheckCircle, Circle } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function SettingsPage() {
  const { settings, updateBrandName, toggleDarkMode, updateShopLocation, users, addUser, deleteUser, updateUserRole, toggleUserActive } = useSettingsStore();
  const { addToast } = useInventoryStore();

  const [brandName, setBrandName] = useState(settings.brandName);
  const [shopLocation, setShopLocation] = useState(settings.shopLocation);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('staff');

  const handleBrandSave = () => {
    updateBrandName(brandName);
    addToast('Brand name updated successfully', 'success');
  };

  const handleLocationSave = () => {
    updateShopLocation(shopLocation);
    addToast('Shop location updated successfully', 'success');
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    addToast(`${settings.darkMode ? 'Light' : 'Dark'} mode enabled`, 'info');
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      addToast('Please fill all fields', 'error');
      return;
    }
    addUser(newUserName, newUserEmail, newUserRole);
    addToast('User added successfully', 'success');
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('staff');
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      addToast('User deleted successfully', 'success');
    }
  };

  const roleColors = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    manager: 'bg-blue-50 text-blue-700 border-blue-200',
    staff: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Page Header */}
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
          </div>

          {/* Display Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  {settings.darkMode ? (
                    <Moon className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Currently {settings.darkMode ? 'enabled' : 'disabled'}</p>
                  </div>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    settings.darkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {settings.darkMode ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>

          {/* Brand Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Brand Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleBrandSave}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shop Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleLocationSave}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            {/* Add User Form */}
            {showAddUser && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Create User
                    </button>
                    <button
                      onClick={() => setShowAddUser(false)}
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{users.filter(u => u.isActive).length}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">Admins</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-300">{users.filter(u => u.role === 'admin' && u.isActive).length}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Staff</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{users.filter(u => u.role === 'staff' && u.isActive).length}</p>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Last Login</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleColors[user.role]} dark:bg-gray-700`}
                        >
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserActive(user.id)}
                          className="flex items-center gap-1"
                        >
                          {user.isActive ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className={user.isActive ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Privileges Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              User Roles & Privileges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">Admin</p>
                <ul className="text-blue-800 dark:text-blue-400 mt-2 space-y-1">
                  <li>✓ Full system access</li>
                  <li>✓ Manage users</li>
                  <li>✓ Edit settings</li>
                  <li>✓ View reports</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">Manager</p>
                <ul className="text-blue-800 dark:text-blue-400 mt-2 space-y-1">
                  <li>✓ Manage inventory</li>
                  <li>✓ View analytics</li>
                  <li>✓ Create reports</li>
                  <li>✗ Cannot manage users</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">Staff</p>
                <ul className="text-blue-800 dark:text-blue-400 mt-2 space-y-1">
                  <li>✓ Update stock</li>
                  <li>✓ Log movements</li>
                  <li>✗ Cannot edit settings</li>
                  <li>✗ Limited reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
