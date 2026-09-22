'use client';

import { useInventoryStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { StockMovement } from '@/lib/types';

export default function RecentMovements() {
  const movements = useInventoryStore((state) => state.movements.slice(0, 4));

  const getTypeIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'sale':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'adjustment':
        return <Minus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'return':
        return <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'damage':
        return <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'theft':
        return <Trash2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeBadgeStyle = (type: StockMovement['type']) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200';
      case 'sale':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200';
      case 'adjustment':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200';
      case 'return':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200';
      case 'damage':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200';
      case 'theft':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type: StockMovement['type']) => {
    const labels: Record<StockMovement['type'], string> = {
      purchase: 'Purchase',
      sale: 'Sale',
      adjustment: 'Adjustment',
      return: 'Return',
      damage: 'Damage',
      theft: 'Theft',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
      <div className="px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white">Recent Movements</h2>
      </div>

      <div className="flex-1 overflow-y-auto max-h-24">
        {movements.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {movements.map((movement) => (
              <div key={movement.id} className="px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="flex-shrink-0 text-xs">{getTypeIcon(movement.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">{movement.productName}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-1">
                    <p className={`text-xs font-bold ${movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-2 py-2 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">No movements</p>
          </div>
        )}
      </div>
    </div>
  );
}
