'use client';

import { useInventoryStore } from '@/lib/store';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toast() {
  const toasts = useInventoryStore((state) => state.toasts);
  const removeToast = useInventoryStore((state) => state.removeToast);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 space-y-2 sm:space-y-3 z-40 max-w-xs sm:max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border rounded-lg shadow-lg animate-fade-in text-sm ${getStyles(toast.type)}`}
        >
          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5">
            {getIcon(toast.type)}
          </div>
          <p className="text-xs sm:text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-0.5 hover:opacity-70 transition"
          >
            <X className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
