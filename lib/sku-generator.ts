// SKU Generator - Generates unique Stock Keeping Unit values

export interface SKUConfig {
  prefix?: string; // e.g., 'SKU', 'PRD'
  separator?: string; // e.g., '-', ''
  includeCategory?: boolean;
  includeTimestamp?: boolean;
}

const DEFAULT_CONFIG: SKUConfig = {
  prefix: 'SKU',
  separator: '-',
  includeCategory: true,
  includeTimestamp: false,
};

/**
 * Generate a unique SKU based on configuration
 * Format examples:
 * - SKU-001234 (basic with sequence)
 * - SKU-ELEC-001234 (with category prefix)
 * - SKU-001234-1696454400 (with timestamp)
 */
export function generateSKU(
  sequenceNumber: number,
  category?: string,
  config: SKUConfig = DEFAULT_CONFIG
): string {
  const {
    prefix = DEFAULT_CONFIG.prefix,
    separator = DEFAULT_CONFIG.separator,
    includeCategory = DEFAULT_CONFIG.includeCategory,
    includeTimestamp = DEFAULT_CONFIG.includeTimestamp,
  } = config;

  const parts: string[] = [];

  // Add prefix
  if (prefix) {
    parts.push(prefix);
  }

  // Add category if provided and enabled
  if (includeCategory && category) {
    const categoryCode = category.substring(0, 4).toUpperCase();
    parts.push(categoryCode);
  }

  // Add zero-padded sequence number
  const paddedSequence = String(sequenceNumber).padStart(6, '0');
  parts.push(paddedSequence);

  // Add timestamp if enabled
  if (includeTimestamp) {
    const timestamp = Math.floor(Date.now() / 1000);
    parts.push(String(timestamp));
  }

  return parts.join(separator);
}

/**
 * Generate SKU with random component for uniqueness
 */
export function generateSKUWithRandom(
  category?: string,
  config: SKUConfig = DEFAULT_CONFIG
): string {
  const {
    prefix = DEFAULT_CONFIG.prefix,
    separator = DEFAULT_CONFIG.separator,
    includeCategory = DEFAULT_CONFIG.includeCategory,
  } = config;

  const parts: string[] = [];

  if (prefix) {
    parts.push(prefix);
  }

  if (includeCategory && category) {
    const categoryCode = category.substring(0, 3).toUpperCase();
    parts.push(categoryCode);
  }

  // Generate random alphanumeric code
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  parts.push(`${timestamp}${randomCode}`);

  return parts.join(separator);
}

/**
 * Generate SKU from product name and timestamp
 * Creates consistent, readable SKUs like: SKU-PROD-20260921-A1B2C3
 */
export function generateSKUFromName(
  productName: string,
  category?: string,
  config: SKUConfig = DEFAULT_CONFIG
): string {
  const {
    prefix = DEFAULT_CONFIG.prefix,
    separator = DEFAULT_CONFIG.separator,
    includeCategory = DEFAULT_CONFIG.includeCategory,
  } = config;

  const parts: string[] = [];

  if (prefix) {
    parts.push(prefix);
  }

  if (includeCategory && category) {
    const categoryCode = category.substring(0, 3).toUpperCase();
    parts.push(categoryCode);
  }

  // Create code from product name (first 3 letters + timestamp)
  const nameCode = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  // Date-based component (YYYYMMDD)
  const date = new Date();
  const dateStr = date
    .toISOString()
    .substring(0, 10)
    .replace(/-/g, '');

  // Random suffix for uniqueness
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  parts.push(`${nameCode}${dateStr}${random}`);

  return parts.join(separator);
}

/**
 * Validate SKU format
 */
export function isValidSKU(sku: string): boolean {
  // SKU should not be empty and should be reasonable length
  return !!(sku && sku.trim().length >= 3 && sku.trim().length <= 50);
}

/**
 * Generate default SKU configuration based on product count
 */
export function generateDefaultSKU(
  productCount: number,
  category?: string
): string {
  // Use sequential numbering
  const sequenceNumber = productCount + 1;
  return generateSKU(sequenceNumber, category);
}
