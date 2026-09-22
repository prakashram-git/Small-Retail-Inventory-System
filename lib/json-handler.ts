import { Product } from './types';

export function parseJSON(jsonText: string): Product[] {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
}

export function generateJSON(products: Product[]): string {
  return JSON.stringify(products, null, 2);
}

export function downloadJSON(jsonText: string, filename: string = 'products.json') {
  const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
