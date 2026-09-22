// Enterprise audit logging system for compliance and security

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  category: 'user_management' | 'product_management' | 'stock_management' | 'sales' | 'purchases' | 'settings' | 'security';
  entity: string; // What was affected (e.g., 'Product', 'User', 'Purchase Order')
  entityId: string;
  changes?: {
    field: string;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
  }[];
  status: 'success' | 'failed';
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  details?: string;
}

class AuditLogger {
  private logs: AuditLog[] = this.loadLogs();

  private loadLogs(): AuditLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('audit-logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveLogs(): void {
    if (typeof window === 'undefined') return;
    try {
      // Keep last 10000 logs
      const logsToSave = this.logs.slice(-10000);
      localStorage.setItem('audit-logs', JSON.stringify(logsToSave));
    } catch {
      console.error('Failed to save audit logs');
    }
  }

  log(
    userId: string,
    userName: string,
    userEmail: string,
    action: string,
    category: AuditLog['category'],
    entity: string,
    entityId: string,
    status: 'success' | 'failed' = 'success',
    changes?: AuditLog['changes'],
    details?: string
  ): AuditLog {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      userEmail,
      action,
      category,
      entity,
      entityId,
      changes,
      status,
      ipAddress: this.getClientIP(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      timestamp: new Date(),
      details,
    };

    this.logs.push(log);
    this.saveLogs();

    return log;
  }

  private getClientIP(): string {
    // In a real app, this would come from the server
    if (typeof window === 'undefined') return 'unknown';
    return 'client-ip';
  }

  getLogs(limit: number = 100): AuditLog[] {
    return this.logs.slice(-limit).reverse();
  }

  getLogsByCategory(category: AuditLog['category'], limit: number = 100): AuditLog[] {
    return this.logs
      .filter(log => log.category === category)
      .slice(-limit)
      .reverse();
  }

  getLogsByUser(userId: string, limit: number = 100): AuditLog[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit)
      .reverse();
  }

  getLogsByEntity(entity: string, entityId: string): AuditLog[] {
    return this.logs
      .filter(log => log.entity === entity && log.entityId === entityId)
      .reverse();
  }

  getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
    return this.logs
      .filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      })
      .reverse();
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    } else if (format === 'csv') {
      const headers = ['ID', 'User', 'Email', 'Action', 'Category', 'Entity', 'Status', 'Timestamp'];
      const rows = this.logs.map(log => [
        log.id,
        log.userName,
        log.userEmail,
        log.action,
        log.category,
        `${log.entity}:${log.entityId}`,
        log.status,
        new Date(log.timestamp).toISOString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return csvContent;
    }

    return '';
  }

  clearOldLogs(daysToKeep: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.logs = this.logs.filter(log => new Date(log.timestamp) >= cutoffDate);
    this.saveLogs();
  }
}

export const auditLogger = new AuditLogger();

// Common audit log actions
export const AuditActions = {
  // User Management
  USER_CREATED: 'User Created',
  USER_UPDATED: 'User Updated',
  USER_DELETED: 'User Deleted',
  USER_ROLE_CHANGED: 'User Role Changed',
  USER_ACTIVATED: 'User Activated',
  USER_DEACTIVATED: 'User Deactivated',
  USER_PASSWORD_CHANGED: 'Password Changed',
  USER_LOGGED_IN: 'User Logged In',
  USER_LOGGED_OUT: 'User Logged Out',

  // Product Management
  PRODUCT_CREATED: 'Product Created',
  PRODUCT_UPDATED: 'Product Updated',
  PRODUCT_DELETED: 'Product Deleted',
  PRODUCT_BULK_IMPORTED: 'Products Bulk Imported',

  // Stock Management
  STOCK_ADJUSTED: 'Stock Adjusted',
  STOCK_TRANSFERRED: 'Stock Transferred',
  STOCKTAKE_CREATED: 'Stocktake Created',
  STOCKTAKE_COMPLETED: 'Stocktake Completed',
  STOCKTAKE_APPROVED: 'Stocktake Approved',

  // Sales
  SALE_CREATED: 'Sale Created',
  SALE_VOIDED: 'Sale Voided',
  DISCOUNT_APPLIED: 'Discount Applied',

  // Purchases
  PURCHASE_CREATED: 'Purchase Order Created',
  PURCHASE_APPROVED: 'Purchase Order Approved',
  PURCHASE_CANCELLED: 'Purchase Order Cancelled',
  GOODS_RECEIPT_CREATED: 'Goods Receipt Created',

  // Settings
  SETTINGS_UPDATED: 'Settings Updated',
  BRANDING_CHANGED: 'Branding Changed',

  // Security
  PERMISSION_DENIED: 'Permission Denied',
  UNAUTHORIZED_ACCESS: 'Unauthorized Access Attempt',
};
