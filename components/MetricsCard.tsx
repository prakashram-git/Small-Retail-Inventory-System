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
      className={`p-1.5 rounded-lg border-0 transition-all shadow-sm ${
        alert
          ? 'bg-red-50 dark:bg-red-900/30'
          : highlight
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40'
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex-1 min-w-0">
          <p className={`text-2xs font-medium leading-none ${alert ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}`}>
            {title}
          </p>
          <p className={`text-sm font-bold leading-tight ${alert ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={`p-1 rounded-md flex-shrink-0 ${
              alert ? 'bg-red-100 dark:bg-red-800' : highlight ? 'bg-blue-100 dark:bg-blue-700' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            {alert && <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-300" />}
            {!alert && (
              <div className="w-3 h-3 opacity-80">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
