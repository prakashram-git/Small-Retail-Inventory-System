import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Permission, rolePermissions } from './permissions';
import { auditLogger, AuditActions } from './audit-logger';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  department?: string;
  location?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface SessionInfo {
  sessionId: string;
  loginTime: Date;
  lastActivityTime: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  session: SessionInfo | null;

  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUserRole: (role: 'admin' | 'manager' | 'staff') => void;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  updateLastActivity: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      permissions: [],
      session: null,

      login: (user: User) => {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const session: SessionInfo = {
          sessionId,
          loginTime: new Date(),
          lastActivityTime: new Date(),
        };

        const permissions = rolePermissions[user.role] || [];

        auditLogger.log(
          user.id,
          user.name,
          user.email,
          AuditActions.USER_LOGGED_IN,
          'security',
          'User',
          user.id,
          'success'
        );

        set({ user, isAuthenticated: true, permissions, session });
      },

      logout: () => {
        const { user } = get();
        if (user) {
          auditLogger.log(
            user.id,
            user.name,
            user.email,
            AuditActions.USER_LOGGED_OUT,
            'security',
            'User',
            user.id,
            'success'
          );
        }
        set({ user: null, isAuthenticated: false, permissions: [], session: null });
      },

      setUser: (user: User | null) => {
        if (user) {
          const permissions = rolePermissions[user.role] || [];
          set({ user, isAuthenticated: true, permissions });
        } else {
          set({ user: null, isAuthenticated: false, permissions: [] });
        }
      },

      updateUserRole: (role: 'admin' | 'manager' | 'staff') => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, role };
          const permissions = rolePermissions[role] || [];

          auditLogger.log(
            user.id,
            user.name,
            user.email,
            AuditActions.USER_ROLE_CHANGED,
            'user_management',
            'User',
            user.id,
            'success',
            [{ field: 'role', oldValue: user.role, newValue: role }]
          );

          set({ user: updatedUser, permissions });
        }
      },

      hasPermission: (permission: Permission): boolean => {
        const { permissions } = get();
        if (permissions.includes('admin:full_access')) return true;
        return permissions.includes(permission);
      },

      hasAllPermissions: (requiredPermissions: Permission[]): boolean => {
        const { hasPermission } = get();
        return requiredPermissions.every(perm => hasPermission(perm));
      },

      hasAnyPermission: (requiredPermissions: Permission[]): boolean => {
        const { hasPermission } = get();
        return requiredPermissions.some(perm => hasPermission(perm));
      },

      updateLastActivity: () => {
        const { session } = get();
        if (session) {
          set({
            session: {
              ...session,
              lastActivityTime: new Date(),
            },
          });
        }
      },
    }),
    {
      name: 'auth_store',
    }
  )
);
