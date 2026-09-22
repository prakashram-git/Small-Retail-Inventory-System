'use client';

import { useState, useMemo } from 'react';
import { useSettingsStore } from '@/lib/settings-store';
import { useInventoryStore } from '@/lib/store';
import { Settings, Moon, Sun, Lock, Trash2, Plus, Edit2, CheckCircle, Circle, LogOut, Download, Calendar } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { Permission, rolePermissions, permissionDescriptions } from '@/lib/permissions';
import { auditLogger } from '@/lib/audit-logger';

export default function SettingsPage() {
  const { settings, updateBrandName, toggleDarkMode, updateShopLocation, updateLoginBackground, updateLoginBackgroundImage, clearLoginBackgroundImage, users, addUser, deleteUser, updateUserRole, toggleUserActive } = useSettingsStore();
  const { addToast } = useInventoryStore();

  const [brandName, setBrandName] = useState(settings.brandName);
  const [shopLocation, setShopLocation] = useState(settings.shopLocation);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('staff');
  const [showPermissionDetails, setShowPermissionDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditFilter, setAuditFilter] = useState<'all' | 'user_management' | 'product_management' | 'security'>('all');
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | undefined>(settings.loginBackgroundImage);

  const auditLogs = useMemo(() => {
    const logs = auditLogger.getLogs(100);
    if (auditFilter === 'all') return logs;
    return logs.filter(log => log.category === auditFilter);
  }, [auditFilter]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      updateLoginBackgroundImage(imageData);
      setBackgroundImagePreview(imageData);
      addToast('Background image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    clearLoginBackgroundImage();
    setBackgroundImagePreview(undefined);
    addToast('Background image removed', 'success');
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
      <main className="px-2 sm:px-3 py-2 sm:py-3">
        <div className="grid grid-cols-1 gap-2">
          {/* Page Header */}
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
          </div>

          {/* Display Settings */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl border border-blue-200/50 dark:border-blue-700/30 shadow-sm p-3">
            <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Display Settings</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50/80 dark:bg-blue-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/40">
                <div className="flex items-center gap-2">
                  {settings.darkMode ? (
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-2xs text-blue-900 dark:text-blue-300">Dark Mode</p>
                    <p className="text-2xs text-blue-700 dark:text-blue-400">Currently {settings.darkMode ? 'enabled' : 'disabled'}</p>
                  </div>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`px-2 py-0.5 text-2xs rounded-lg font-medium transition-colors ${
                    settings.darkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                  }`}
                >
                  {settings.darkMode ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div>
                <label className="block text-2xs font-medium text-blue-900 dark:text-blue-300 mb-1">Login Screen Background</label>
                <select
                  value={settings.loginBackground || 'gradient'}
                  onChange={(e) => updateLoginBackground(e.target.value as 'gradient' | 'retail' | 'modern' | 'minimal')}
                  className="w-full px-2 py-1 border border-blue-200/50 dark:border-blue-700/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-2xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gradient">Blue Gradient</option>
                  <option value="retail">Retail Theme</option>
                  <option value="modern">Modern Dark</option>
                  <option value="minimal">Minimal Clean</option>
                </select>
                <p className="text-2xs text-blue-700 dark:text-blue-400 mt-0.5">Choose the background style for login screen</p>
              </div>

              <div>
                <label className="block text-2xs font-medium text-blue-900 dark:text-blue-300 mb-1">Custom Background Image</label>
                <div className="space-y-1.5">
                  {backgroundImagePreview && (
                    <div className="relative w-full h-32 rounded-lg border border-blue-200/50 dark:border-blue-700/40 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={backgroundImagePreview}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleClearImage}
                        className="absolute top-1 right-1 px-2 py-1 text-2xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center w-full px-3 py-2 border-2 border-dashed border-blue-200/50 dark:border-blue-700/40 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-colors">
                    <div className="text-center">
                      <p className="text-2xs font-medium text-blue-900 dark:text-blue-300">Click to upload image</p>
                      <p className="text-2xs text-blue-700 dark:text-blue-400">Max 5MB (JPG, PNG, GIF)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Settings */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl border border-green-200/50 dark:border-green-700/30 shadow-sm p-3">
            <h2 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">Brand Settings</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-2xs font-medium text-green-900 dark:text-green-300 mb-1">Brand Name</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-green-200/50 dark:border-green-700/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-2xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleBrandSave}
                    className="px-2 py-1 text-2xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-medium text-green-900 dark:text-green-300 mb-1">Shop Location</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="flex-1 px-2 py-1 border border-green-200/50 dark:border-green-700/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-2xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleLocationSave}
                    className="px-2 py-1 text-2xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl border border-purple-200/50 dark:border-purple-700/30 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-purple-900 dark:text-purple-300">User Management</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="flex items-center gap-1 px-2 py-0.5 text-2xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="w-3 h-3" />
                Add User
              </button>
            </div>

            {/* Add User Form */}
            {showAddUser && (
              <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30">
                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-2 py-1 border border-green-200/50 dark:border-green-700/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-2xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-2 py-1 border border-green-200/50 dark:border-green-700/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-2xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-2 py-1 border border-green-200/50 dark:border-green-700/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-2xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 px-2 py-1 text-2xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Create User
                    </button>
                    <button
                      onClick={() => setShowAddUser(false)}
                      className="flex-1 px-2 py-1 text-2xs bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Stats */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-2 border border-blue-200/50 dark:border-blue-700/40">
                <p className="text-2xs text-blue-700 dark:text-blue-400 font-medium">Total Users</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{users.filter(u => u.isActive).length}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-2 border border-red-200/50 dark:border-red-700/40">
                <p className="text-2xs text-red-700 dark:text-red-400 font-medium">Admins</p>
                <p className="text-lg font-bold text-red-900 dark:text-red-300">{users.filter(u => u.role === 'admin' && u.isActive).length}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-2 border border-purple-200/50 dark:border-purple-700/40">
                <p className="text-2xs text-purple-700 dark:text-purple-400 font-medium">Staff</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{users.filter(u => u.role === 'staff' && u.isActive).length}</p>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-2xs">
                <thead>
                  <tr className="bg-purple-100/50 dark:bg-purple-900/20 border-b border-purple-200/50 dark:border-purple-700/40">
                    <th className="px-2 py-1 text-left font-semibold text-purple-900 dark:text-purple-300">Name</th>
                    <th className="px-2 py-1 text-left font-semibold text-purple-900 dark:text-purple-300">Email</th>
                    <th className="px-2 py-1 text-left font-semibold text-purple-900 dark:text-purple-300">Role</th>
                    <th className="px-2 py-1 text-left font-semibold text-purple-900 dark:text-purple-300">Status</th>
                    <th className="px-2 py-1 text-left font-semibold text-purple-900 dark:text-purple-300">Last Login</th>
                    <th className="px-2 py-1 text-center font-semibold text-purple-900 dark:text-purple-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-purple-200/30 dark:border-purple-700/20 hover:bg-purple-50/30 dark:hover:bg-purple-900/10">
                      <td className="px-2 py-1 font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-2 py-1 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-2 py-1">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                          className={`px-1.5 py-0.5 rounded text-2xs font-semibold border ${roleColors[user.role]} dark:bg-gray-700`}
                        >
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-2 py-1">
                        <button
                          onClick={() => toggleUserActive(user.id)}
                          className="flex items-center gap-0.5"
                        >
                          {user.isActive ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Circle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={user.isActive ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400 text-2xs'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </td>
                      <td className="px-2 py-1 text-gray-600 dark:text-gray-400">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Privileges Info - Enhanced */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Role-Based Access Control (RBAC)
              </h3>
              <button
                onClick={() => setShowPermissionDetails(!showPermissionDetails)}
                className="text-2xs bg-indigo-600 text-white px-2 py-0.5 rounded-lg hover:bg-indigo-700 transition"
              >
                {showPermissionDetails ? 'Hide' : 'View'} Details
              </button>
            </div>

            {!showPermissionDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 text-2xs">
                <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-xl border border-red-200/50 dark:border-red-700/40">
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-1">👑 Admin</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-0.5">
                    <li>✓ Full system access</li>
                    <li>✓ User management</li>
                    <li>✓ System settings</li>
                    <li>✓ Audit logs</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl border border-blue-200/50 dark:border-blue-700/40">
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">📊 Manager</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-0.5">
                    <li>✓ Inventory management</li>
                    <li>✓ Analytics & reports</li>
                    <li>✓ Approve orders</li>
                    <li>✗ User management</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-xl border border-green-200/50 dark:border-green-700/40">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-1">👤 Staff</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-0.5">
                    <li>✓ Stock updates</li>
                    <li>✓ Transaction logging</li>
                    <li>✓ View dashboards</li>
                    <li>✗ Settings access</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Role Selection */}
                <div className="flex gap-1 mb-2">
                  {(['admin', 'manager', 'staff'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-2 py-0.5 rounded-lg text-2xs font-medium transition ${
                        selectedRole === role
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Permissions List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-2 max-h-48 overflow-y-auto border border-indigo-200/30 dark:border-indigo-700/30">
                  <h4 className="text-2xs font-semibold text-gray-900 dark:text-white mb-1">
                    {selectedRole.toUpperCase()} Permissions ({rolePermissions[selectedRole].length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {rolePermissions[selectedRole].map(permission => (
                      <div key={permission} className="flex items-start gap-1 p-1 bg-gray-50 dark:bg-gray-700 rounded">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-2xs font-medium text-gray-900 dark:text-white">
                            {permissionDescriptions[permission]?.name || permission}
                          </p>
                          <p className="text-2xs text-gray-600 dark:text-gray-400">
                            {permissionDescriptions[permission]?.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl border border-orange-200/50 dark:border-orange-700/30 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-orange-900 dark:text-orange-300 flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" />
                Audit Logs & Activity
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const csv = auditLogger.exportLogs('csv');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    addToast('Audit logs downloaded', 'success');
                  }}
                  className="flex items-center gap-0.5 px-2 py-0.5 text-2xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
                <button
                  onClick={() => setShowAuditLogs(!showAuditLogs)}
                  className="text-2xs bg-orange-600 text-white px-2 py-0.5 rounded-lg hover:bg-orange-700 transition"
                >
                  {showAuditLogs ? 'Hide' : 'Show'} Logs
                </button>
              </div>
            </div>

            {showAuditLogs && (
              <div className="space-y-2">
                {/* Filter */}
                <div className="flex gap-1 flex-wrap">
                  {(['all', 'user_management', 'product_management', 'security'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAuditFilter(filter)}
                      className={`px-2 py-0.5 rounded-lg text-2xs font-medium transition ${
                        auditFilter === filter
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Logs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-2xs">
                    <thead>
                      <tr className="bg-orange-100/50 dark:bg-orange-900/20 border-b border-orange-200/50 dark:border-orange-700/40">
                        <th className="px-2 py-1 text-left font-semibold text-orange-900 dark:text-orange-300">Timestamp</th>
                        <th className="px-2 py-1 text-left font-semibold text-orange-900 dark:text-orange-300">User</th>
                        <th className="px-2 py-1 text-left font-semibold text-orange-900 dark:text-orange-300">Action</th>
                        <th className="px-2 py-1 text-left font-semibold text-orange-900 dark:text-orange-300">Entity</th>
                        <th className="px-2 py-1 text-center font-semibold text-orange-900 dark:text-orange-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.slice(0, 50).map(log => (
                        <tr key={log.id} className="border-b border-orange-200/30 dark:border-orange-700/20 hover:bg-orange-50/30 dark:hover:bg-orange-900/10">
                          <td className="px-2 py-1 text-gray-600 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-2 py-1 text-gray-900 dark:text-white">
                            <span className="font-medium">{log.userName}</span>
                            <br />
                            <span className="text-2xs text-gray-500">{log.userEmail}</span>
                          </td>
                          <td className="px-2 py-1 text-gray-900 dark:text-white">{log.action}</td>
                          <td className="px-2 py-1 text-gray-600 dark:text-gray-400">{log.entity}:{log.entityId}</td>
                          <td className="px-2 py-1 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-2xs font-medium ${
                              log.status === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {auditLogs.length === 0 && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-2xs">
                      No audit logs found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
