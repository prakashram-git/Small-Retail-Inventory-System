'use client';

import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  highlight?: boolean;
  alert?: boolean;
}

export default function MetricsCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  highlight = false,
  alert = false,
}: MetricsCardProps) {
  return (
    <div
      className={`p-2 rounded-lg border transition-all shadow-sm ${
        alert
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : highlight
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-2xs font-medium leading-tight ${alert ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}`}>
            {title}
          </p>
          <p className={`text-lg font-bold leading-tight ${alert ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={`p-1.5 rounded flex-shrink-0 ${
              alert ? 'bg-red-100 dark:bg-red-800/30' : highlight ? 'bg-blue-100 dark:bg-blue-700/30' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            {alert && <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-300" />}
            {!alert && (
              <div className="w-4 h-4 opacity-70 text-gray-600 dark:text-gray-400">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
