'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useSettingsStore } from '@/lib/settings-store';
import { ShoppingCart, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  brandName: string;
  shopLocation: string;
}

const backgroundPatterns = {
  gradient: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
  retail: 'bg-gradient-to-br from-amber-50 via-blue-50 to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
  modern: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black',
  minimal: 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900',
};

export default function LoginPage({ brandName, shopLocation }: LoginPageProps) {
  const [email, setEmail] = useState('admin@redhill.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { settings } = useSettingsStore();
  const bgPattern = backgroundPatterns[settings.loginBackground as keyof typeof backgroundPatterns] || backgroundPatterns.gradient;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = {
        id: '1',
        name: 'Alex Admin',
        email,
        role: 'admin' as const,
      };
      login(user);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={`min-h-screen ${bgPattern} flex items-center justify-center px-4 py-12 relative overflow-hidden`}>
      {/* Retail Pattern Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-5 dark:opacity-3" viewBox="0 0 1200 1200" fill="none">
        {/* Warehouse shelves pattern */}
        <defs>
          <pattern id="shelves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Shelf structure */}
            <rect x="10" y="20" width="180" height="8" fill="currentColor" />
            <rect x="10" y="60" width="180" height="8" fill="currentColor" />
            <rect x="10" y="100" width="180" height="8" fill="currentColor" />
            <rect x="10" y="140" width="180" height="8" fill="currentColor" />
            {/* Support columns */}
            <rect x="15" y="20" width="4" height="140" fill="currentColor" opacity="0.6" />
            <rect x="180" y="20" width="4" height="140" fill="currentColor" opacity="0.6" />
            {/* Products on shelves */}
            <rect x="25" y="30" width="12" height="15" fill="currentColor" opacity="0.5" />
            <rect x="45" y="30" width="12" height="15" fill="currentColor" opacity="0.5" />
            <rect x="65" y="30" width="12" height="15" fill="currentColor" opacity="0.5" />
            <rect x="85" y="30" width="12" height="15" fill="currentColor" opacity="0.5" />
            <rect x="25" y="70" width="12" height="15" fill="currentColor" opacity="0.5" />
            <rect x="45" y="70" width="12" height="15" fill="currentColor" opacity="0.5" />
            <rect x="65" y="70" width="12" height="15" fill="currentColor" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="1200" height="1200" fill="url(#shelves)" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </svg>

      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20"></div>
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-3">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {brandName.split(' ')[0]}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8">
            {brandName.split(' ').slice(1).join(' ')} • {shopLocation}
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@redhill.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials</p>
            <p className="text-xs text-blue-800 dark:text-blue-400 font-mono">
              Email: admin@redhill.com
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-400 font-mono">
              Password: password
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6">
          RedHill Inventory Management System
        </p>
      </div>
    </div>
  );
}
