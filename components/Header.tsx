'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Settings, ChevronDown, ShoppingCart, BarChart3, Moon, Sun } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import SettingsModal from './SettingsModal';

export default function Header() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { settings, toggleDarkMode } = useSettingsStore();
  const notificationBadge = useInventoryStore((state) => state.notificationBadge);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Navigation Tabs with Logo - TOP HEADER */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 overflow-x-auto transition-colors duration-200">
        <div className="px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 border-b-2 border-brand-primary py-3">
          {/* Logo Section */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="bg-gradient-to-br from-brand-primary to-brand-dark rounded-lg p-2 sm:p-3">
              <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            <div>
              {mounted ? (
                <>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{settings.brandName.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{settings.brandName.split(' ').slice(1).join(' ')}</p>
                </>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">RedHill</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Inventory</p>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
            <a href="/" className={isActive('/') ? 'px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-300 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900 dark:text-blue-200' : 'px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}>Dashboard</a>
            <a href="/products" className={isActive('/products') ? 'px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-300 bg-green-50 text-green-700 shadow-sm dark:bg-green-900 dark:text-green-200' : 'px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}>Products</a>
            <a href="/stock-movements" className={isActive('/stock-movements') ? 'px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-300 bg-purple-50 text-purple-700 shadow-sm dark:bg-purple-900 dark:text-purple-200' : 'px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}>Stock Movements</a>
            <a href="/suppliers" className={isActive('/suppliers') ? 'px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-300 bg-orange-50 text-orange-700 shadow-sm dark:bg-orange-900 dark:text-orange-200' : 'px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}>Suppliers</a>
            <a href="/reports" className={isActive('/reports') ? 'px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-300 bg-amber-50 text-amber-700 shadow-sm dark:bg-amber-900 dark:text-amber-200' : 'px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}>Reports</a>
            <a href="/stocktake" className={isActive('/stocktake') ? 'px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all duration-300 bg-rose-50 text-rose-700 shadow-sm dark:bg-rose-900 dark:text-rose-200' : 'px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}>Stocktake</a>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button className="relative p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <Bell className="w-5 sm:w-6 h-5 sm:h-6" />
                {notificationBadge > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                    {Math.min(notificationBadge, 9)}
                  </span>
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => toggleDarkMode()}
                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title={settings.darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {settings.darkMode ? (
                  <Sun className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500" />
                ) : (
                  <Moon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-600" />
                )}
              </button>
            )}

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <Settings className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">Alex</p>
                  <p className="text-xs text-gray-500">Mall Admin</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-50 text-sm">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-50 text-sm">
                    Settings
                  </a>
                  <hr className="my-2" />
                  <a href="#" className="block px-4 py-2 hover:bg-gray-50 text-sm text-red-600">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sub Header Banner */}
      <div className="bg-brand-light border-b border-brand-primary">
        <div className="px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center gap-2">
          <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-brand-primary flex-shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-brand-primary truncate">
            Inventory Dashboard - {mounted ? settings.shopLocation : 'Singapore Central Mall'}
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
