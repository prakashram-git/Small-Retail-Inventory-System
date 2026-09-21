import { create } from 'zustand';
import { User, UserRole, Settings } from './types';

interface SettingsState {
  settings: Settings;
  users: User[];
  currentUser: User | null;

  // Settings Actions
  updateBrandName: (name: string) => void;
  toggleDarkMode: () => void;
  updateShopLocation: (location: string) => void;

  // User Management Actions
  addUser: (name: string, email: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserActive: (userId: string) => void;
  setCurrentUser: (user: User) => void;
  getUserCount: (role?: UserRole) => number;
}

const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Rajesh Kumar',
    email: 'rajesh@redhill.com',
    role: 'admin',
    createdAt: new Date('2026-01-15'),
    lastLogin: new Date('2026-09-21'),
    isActive: true,
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya@redhill.com',
    role: 'manager',
    createdAt: new Date('2026-02-20'),
    lastLogin: new Date('2026-09-20'),
    isActive: true,
  },
  {
    id: 'user-3',
    name: 'Amit Patel',
    email: 'amit@redhill.com',
    role: 'staff',
    createdAt: new Date('2026-03-10'),
    lastLogin: new Date('2026-09-19'),
    isActive: true,
  },
  {
    id: 'user-4',
    name: 'Neha Verma',
    email: 'neha@redhill.com',
    role: 'staff',
    createdAt: new Date('2026-04-05'),
    lastLogin: new Date('2026-09-21'),
    isActive: true,
  },
];

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('redhill-darkMode');
  return saved ? JSON.parse(saved) : false;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    brandName: 'RedHill Inventory',
    shopLocation: 'Singapore Central Mall',
    darkMode: getInitialDarkMode(),
    theme: getInitialDarkMode() ? 'dark' : 'light',
  },
  users: MOCK_USERS,
  currentUser: MOCK_USERS[0],

  updateBrandName: (name) => {
    set((state) => ({
      settings: { ...state.settings, brandName: name },
    }));
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.settings.darkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('redhill-darkMode', JSON.stringify(newDarkMode));
      }
      return {
        settings: {
          ...state.settings,
          darkMode: newDarkMode,
          theme: newDarkMode ? 'dark' : 'light',
        },
      };
    });
  },

  updateShopLocation: (location) => {
    set((state) => ({
      settings: { ...state.settings, shopLocation: location },
    }));
  },

  addUser: (name, email, role) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date(),
      isActive: true,
    };
    set((state) => ({
      users: [...state.users, newUser],
    }));
  },

  deleteUser: (userId) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    }));
  },

  updateUser: (userId, updates) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, ...updates } : u
      ),
    }));
  },

  updateUserRole: (userId, role) => {
    get().updateUser(userId, { role });
  },

  toggleUserActive: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (user) {
      get().updateUser(userId, { isActive: !user.isActive });
    }
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  getUserCount: (role?: UserRole) => {
    const users = get().users.filter((u) => u.isActive);
    return role ? users.filter((u) => u.role === role).length : users.length;
  },
}));
