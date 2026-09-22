// Granular permission system based on enterprise standards (Shopify, Square, Toast)

export type Permission =
  // Dashboard & Analytics
  | 'dashboard:view'
  | 'analytics:view'
  | 'reports:view'
  | 'reports:export'
  | 'reports:create_custom'

  // Product Management
  | 'products:view'
  | 'products:create'
  | 'products:edit'
  | 'products:delete'
  | 'products:bulk_import'

  // Stock Management
  | 'stock:view'
  | 'stock:adjust'
  | 'stock:transfer'
  | 'stocktake:manage'
  | 'stocktake:approve'

  // Sales & Transactions
  | 'sales:create'
  | 'sales:view'
  | 'sales:edit'
  | 'sales:void' // Cancel/refund
  | 'sales:discount_apply'
  | 'sales:approve_override'

  // Purchase Orders
  | 'purchases:view'
  | 'purchases:create'
  | 'purchases:edit'
  | 'purchases:approve'
  | 'purchases:cancel'
  | 'goods_receipt:manage'

  // Supplier Management
  | 'suppliers:view'
  | 'suppliers:create'
  | 'suppliers:edit'
  | 'suppliers:delete'

  // User & Access Control
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'users:manage_roles'
  | 'users:manage_permissions'
  | 'users:export'

  // System Settings
  | 'settings:view'
  | 'settings:edit'
  | 'settings:branding'
  | 'settings:integrations'

  // Audit & Compliance
  | 'audit_logs:view'
  | 'audit_logs:export'
  | 'compliance:view'

  // Admin Functions
  | 'admin:full_access';

// Role-Permission Mapping (Industry Standard Hierarchy)
export const rolePermissions: Record<string, Permission[]> = {
  admin: [
    // Full access to everything
    'admin:full_access',
    'dashboard:view',
    'analytics:view',
    'reports:view',
    'reports:export',
    'reports:create_custom',
    'products:view',
    'products:create',
    'products:edit',
    'products:delete',
    'products:bulk_import',
    'stock:view',
    'stock:adjust',
    'stock:transfer',
    'stocktake:manage',
    'stocktake:approve',
    'sales:create',
    'sales:view',
    'sales:edit',
    'sales:void',
    'sales:discount_apply',
    'sales:approve_override',
    'purchases:view',
    'purchases:create',
    'purchases:edit',
    'purchases:approve',
    'purchases:cancel',
    'goods_receipt:manage',
    'suppliers:view',
    'suppliers:create',
    'suppliers:edit',
    'suppliers:delete',
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'users:manage_roles',
    'users:manage_permissions',
    'users:export',
    'settings:view',
    'settings:edit',
    'settings:branding',
    'settings:integrations',
    'audit_logs:view',
    'audit_logs:export',
    'compliance:view',
  ],

  manager: [
    // Operational management, no user/system admin
    'dashboard:view',
    'analytics:view',
    'reports:view',
    'reports:export',
    'reports:create_custom',
    'products:view',
    'products:create',
    'products:edit',
    'products:bulk_import',
    'stock:view',
    'stock:adjust',
    'stock:transfer',
    'stocktake:manage',
    'stocktake:approve',
    'sales:create',
    'sales:view',
    'sales:edit',
    'sales:void',
    'sales:discount_apply',
    'sales:approve_override',
    'purchases:view',
    'purchases:create',
    'purchases:edit',
    'purchases:approve',
    'purchases:cancel',
    'goods_receipt:manage',
    'suppliers:view',
    'suppliers:create',
    'suppliers:edit',
    'users:view', // Can see user list
    'audit_logs:view',
  ],

  staff: [
    // Operational staff - limited transactional access
    'dashboard:view',
    'reports:view',
    'products:view',
    'stock:view',
    'stock:adjust',
    'stocktake:manage',
    'sales:create',
    'sales:view',
    'sales:discount_apply',
    'purchases:view',
    'goods_receipt:manage',
    'suppliers:view',
    'users:view', // Can see only self profile
  ],
};

// Permission descriptions for UI
export const permissionDescriptions: Record<Permission, { name: string; description: string }> = {
  'dashboard:view': { name: 'View Dashboard', description: 'Access main dashboard and KPIs' },
  'analytics:view': { name: 'View Analytics', description: 'Access detailed analytics and metrics' },
  'reports:view': { name: 'View Reports', description: 'Access and view all reports' },
  'reports:export': { name: 'Export Reports', description: 'Download reports in PDF/Excel' },
  'reports:create_custom': { name: 'Create Custom Reports', description: 'Create and save custom report templates' },

  'products:view': { name: 'View Products', description: 'View product catalog and details' },
  'products:create': { name: 'Create Products', description: 'Add new products to system' },
  'products:edit': { name: 'Edit Products', description: 'Modify product information' },
  'products:delete': { name: 'Delete Products', description: 'Remove products from system' },
  'products:bulk_import': { name: 'Bulk Import', description: 'Import products in bulk from CSV' },

  'stock:view': { name: 'View Stock', description: 'View inventory levels and locations' },
  'stock:adjust': { name: 'Adjust Stock', description: 'Adjust inventory quantities' },
  'stock:transfer': { name: 'Transfer Stock', description: 'Move inventory between locations' },
  'stocktake:manage': { name: 'Manage Stocktake', description: 'Create and manage physical counts' },
  'stocktake:approve': { name: 'Approve Stocktake', description: 'Approve stocktake adjustments' },

  'sales:create': { name: 'Create Sales', description: 'Record customer transactions' },
  'sales:view': { name: 'View Sales', description: 'Access sales records and history' },
  'sales:edit': { name: 'Edit Sales', description: 'Modify sales records' },
  'sales:void': { name: 'Void Sales', description: 'Cancel or refund transactions' },
  'sales:discount_apply': { name: 'Apply Discounts', description: 'Authorize discounts on sales' },
  'sales:approve_override': { name: 'Approve Overrides', description: 'Override pricing/discount limits' },

  'purchases:view': { name: 'View Purchases', description: 'Access purchase orders' },
  'purchases:create': { name: 'Create Purchases', description: 'Create new purchase orders' },
  'purchases:edit': { name: 'Edit Purchases', description: 'Modify purchase orders' },
  'purchases:approve': { name: 'Approve Purchases', description: 'Approve purchase orders' },
  'purchases:cancel': { name: 'Cancel Purchases', description: 'Cancel purchase orders' },
  'goods_receipt:manage': { name: 'Manage Goods Receipt', description: 'Receive and inspect goods' },

  'suppliers:view': { name: 'View Suppliers', description: 'Access supplier information' },
  'suppliers:create': { name: 'Create Suppliers', description: 'Add new suppliers' },
  'suppliers:edit': { name: 'Edit Suppliers', description: 'Modify supplier information' },
  'suppliers:delete': { name: 'Delete Suppliers', description: 'Remove suppliers from system' },

  'users:view': { name: 'View Users', description: 'See user accounts and details' },
  'users:create': { name: 'Create Users', description: 'Add new user accounts' },
  'users:edit': { name: 'Edit Users', description: 'Modify user information' },
  'users:delete': { name: 'Delete Users', description: 'Remove user accounts' },
  'users:manage_roles': { name: 'Manage Roles', description: 'Assign roles to users' },
  'users:manage_permissions': { name: 'Manage Permissions', description: 'Assign specific permissions' },
  'users:export': { name: 'Export Users', description: 'Export user list and data' },

  'settings:view': { name: 'View Settings', description: 'Access system settings' },
  'settings:edit': { name: 'Edit Settings', description: 'Modify system settings' },
  'settings:branding': { name: 'Edit Branding', description: 'Change brand name and logo' },
  'settings:integrations': { name: 'Manage Integrations', description: 'Configure third-party integrations' },

  'audit_logs:view': { name: 'View Audit Logs', description: 'Access activity and audit logs' },
  'audit_logs:export': { name: 'Export Audit Logs', description: 'Download audit logs' },
  'compliance:view': { name: 'View Compliance', description: 'Access compliance reports' },

  'admin:full_access': { name: 'Full Admin Access', description: 'Complete system access' },
};

// Helper function to check if user has permission
export const hasPermission = (userPermissions: Permission[], requiredPermission: Permission): boolean => {
  // If user has full access, grant everything
  if (userPermissions.includes('admin:full_access')) return true;
  return userPermissions.includes(requiredPermission);
};

// Helper function to check multiple permissions (AND logic)
export const hasAllPermissions = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(perm => hasPermission(userPermissions, perm));
};

// Helper function to check multiple permissions (OR logic)
export const hasAnyPermission = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(perm => hasPermission(userPermissions, perm));
};
