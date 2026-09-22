'use client';

import { useEffect } from 'react';
import { useInventoryStore } from './store';
import { parseJSON } from './json-handler';

export function useProductsLoader() {
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json');
        const jsonText = await response.text();
        const products = parseJSON(jsonText);

        if (products.length > 0) {
          useInventoryStore.setState({ products });
          useInventoryStore.getState().updateNotificationBadge();
        }
      } catch (error) {
        console.error('Failed to load products.json:', error);
      }
    };

    loadProducts();
  }, []);
}
