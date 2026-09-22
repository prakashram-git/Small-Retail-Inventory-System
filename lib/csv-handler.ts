import { Product } from './types';

export function parseCSV(csvText: string): Product[] {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const product: Product = {
      id: values[headers.indexOf('id')] || '',
      sku: values[headers.indexOf('sku')] || '',
      name: values[headers.indexOf('name')] || '',
      category: values[headers.indexOf('category')] || '',
      currentStock: parseInt(values[headers.indexOf('currentStock')] || '0', 10),
      unitPrice: parseFloat(values[headers.indexOf('unitPrice')] || '0'),
      description: values[headers.indexOf('description')] || '',
      barcode: values[headers.indexOf('barcode')] || '',
      minStock: parseInt(values[headers.indexOf('minStock')] || '0', 10),
      maxStock: parseInt(values[headers.indexOf('maxStock')] || '0', 10),
      reorderLevel: parseInt(values[headers.indexOf('reorderLevel')] || '0', 10),
      cost: parseFloat(values[headers.indexOf('cost')] || '0'),
      supplierId: values[headers.indexOf('supplierId')] || '',
      location: values[headers.indexOf('location')] || '',
      status: (values[headers.indexOf('status')] || 'active') as 'active' | 'inactive' | 'discontinued',
      profitMargin: parseFloat(values[headers.indexOf('profitMargin')] || '0'),
      lastRestockDate: values[headers.indexOf('lastRestockDate')] ? new Date(values[headers.indexOf('lastRestockDate')]) : undefined,
      lastSoldDate: values[headers.indexOf('lastSoldDate')] ? new Date(values[headers.indexOf('lastSoldDate')]) : undefined,
      lastCountDate: values[headers.indexOf('lastCountDate')] ? new Date(values[headers.indexOf('lastCountDate')]) : undefined,
      expiryDate: values[headers.indexOf('expiryDate')] ? new Date(values[headers.indexOf('expiryDate')]) : undefined,
    };

    products.push(product);
  }

  return products;
}

export function generateCSV(products: Product[]): string {
  if (products.length === 0) return '';

  const headers = [
    'id',
    'sku',
    'name',
    'category',
    'currentStock',
    'unitPrice',
    'description',
    'barcode',
    'minStock',
    'maxStock',
    'reorderLevel',
    'cost',
    'supplierId',
    'location',
    'status',
    'profitMargin',
    'lastRestockDate',
    'lastSoldDate',
    'lastCountDate',
    'expiryDate',
  ];

  const rows = products.map(p => [
    p.id,
    p.sku,
    escapeCSVField(p.name),
    escapeCSVField(p.category),
    p.currentStock.toString(),
    p.unitPrice.toString(),
    escapeCSVField(p.description || ''),
    escapeCSVField(p.barcode || ''),
    p.minStock.toString(),
    p.maxStock.toString(),
    p.reorderLevel.toString(),
    p.cost.toString(),
    p.supplierId || '',
    escapeCSVField(p.location || ''),
    p.status,
    (p.profitMargin || 0).toString(),
    p.lastRestockDate?.toISOString() || '',
    p.lastSoldDate?.toISOString() || '',
    p.lastCountDate?.toISOString() || '',
    p.expiryDate?.toISOString() || '',
  ]);

  const headerLine = headers.join(',');
  const dataLines = rows.map(row => row.join(','));

  return [headerLine, ...dataLines].join('\n');
}

function escapeCSVField(field: string): string {
  if (!field) return '""';
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function downloadCSV(csvText: string, filename: string = 'products.csv') {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
