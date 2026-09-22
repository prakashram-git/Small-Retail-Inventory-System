'use client';

import { useEffect } from 'react';
import { useInventoryStore } from './store';
import { parseCSV } from './csv-handler';

export function useCSVLoader() {
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/products.csv');
        const csvText = await response.text();
        const products = parseCSV(csvText);

        if (products.length > 0) {
          useInventoryStore.setState({ products });
          useInventoryStore.getState().updateNotificationBadge();
        }
      } catch (error) {
        console.error('Failed to load products.csv:', error);
      }
    };

    loadCSV();
  }, []);
}
