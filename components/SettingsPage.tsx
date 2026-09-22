'use client';

import { useState, useMemo } from 'react';
import { useSettingsStore } from '@/lib/settings-store';
import { useInventoryStore } from '@/lib/store';
import { Settings, Moon, Sun, Lock, Trash2, Plus, Edit2, CheckCircle, Circle, LogOut, Download, Calendar } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { Permission, rolePermissions, permissionDescriptions } from '@/lib/permissions';
import { auditLogger } from '@/lib/audit-logger';
import DatabaseViewer from '@/components/DatabaseViewer';

export default function SettingsPage() {
  const { settings, updateBrandName, toggleDarkMode, updateShopLocation, updateLoginBackground, users, addUser, deleteUser, updateUserRole, toggleUserActive } = useSettingsStore();
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Login Screen Background</label>
                <select
                  value={settings.loginBackground || 'gradient'}
                  onChange={(e) => updateLoginBackground(e.target.value as 'gradient' | 'retail' | 'modern' | 'minimal')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gradient">Blue Gradient</option>
                  <option value="retail">Retail Theme</option>
                  <option value="modern">Modern Dark</option>
                  <option value="minimal">Minimal Clean</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose the background style for login screen</p>
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

          {/* User Privileges Info - Enhanced */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Role-Based Access Control (RBAC)
              </h3>
              <button
                onClick={() => setShowPermissionDetails(!showPermissionDetails)}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                {showPermissionDetails ? 'Hide' : 'View'} Details
              </button>
            </div>

            {!showPermissionDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-2">👑 Admin</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-xs">
                    <li>✓ Full system access</li>
                    <li>✓ User management</li>
                    <li>✓ System settings</li>
                    <li>✓ Audit logs</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">📊 Manager</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-xs">
                    <li>✓ Inventory management</li>
                    <li>✓ Analytics & reports</li>
                    <li>✓ Approve orders</li>
                    <li>✗ User management</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-2">👤 Staff</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-xs">
                    <li>✓ Stock updates</li>
                    <li>✓ Transaction logging</li>
                    <li>✓ View dashboards</li>
                    <li>✗ Settings access</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Role Selection */}
                <div className="flex gap-2 mb-4">
                  {(['admin', 'manager', 'staff'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        selectedRole === role
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Permissions List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {selectedRole.toUpperCase()} Permissions ({rolePermissions[selectedRole].length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rolePermissions[selectedRole].map(permission => (
                      <div key={permission} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {permissionDescriptions[permission]?.name || permission}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Audit Logs & Activity
              </h2>
              <div className="flex gap-2">
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
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setShowAuditLogs(!showAuditLogs)}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                >
                  {showAuditLogs ? 'Hide' : 'Show'} Logs
                </button>
              </div>
            </div>

            {showAuditLogs && (
              <div className="space-y-3">
                {/* Filter */}
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'user_management', 'product_management', 'security'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAuditFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        auditFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Logs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Timestamp</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">User</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Action</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Entity</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.slice(0, 50).map(log => (
                        <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-gray-900 dark:text-white">
                            <span className="font-medium">{log.userName}</span>
                            <br />
                            <span className="text-xs text-gray-500">{log.userEmail}</span>
                          </td>
                          <td className="px-3 py-2 text-gray-900 dark:text-white">{log.action}</td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{log.entity}:{log.entityId}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
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
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No audit logs found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Database Manager */}
          <DatabaseViewer />
        </div>
      </main>
    </div>
  );
}
