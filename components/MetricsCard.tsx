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
      className={`p-1 rounded border transition-all ${
        alert
          ? 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'
          : highlight
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900 dark:to-blue-800 dark:border-blue-700'
          : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium leading-none ${alert ? 'text-red-700 dark:text-red-200' : 'text-gray-600 dark:text-gray-400'}`}>
            {title}
          </p>
          <p className={`text-sm font-bold mt-0.5 leading-none ${alert ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
          {trendValue && (
            <p className={`text-xs mt-0.5 leading-none ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={`p-0.5 rounded flex-shrink-0 ${
              alert ? 'bg-red-100 dark:bg-red-800' : highlight ? 'bg-blue-100 dark:bg-blue-700' : 'bg-gray-100 dark:bg-gray-600'
            }`}
          >
            {alert && <AlertCircle className="w-2.5 h-2.5 text-red-600 dark:text-red-300" />}
            {!alert && (
              <div className="w-2.5 h-2.5">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
