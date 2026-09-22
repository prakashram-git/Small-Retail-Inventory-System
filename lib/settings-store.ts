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
  updateLoginBackground: (background: 'gradient' | 'retail' | 'modern' | 'minimal') => void;

  // User Management Actions
  addUser: (name: string, email: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserActive: (userId: string) => void;
  setCurrentUser: (user: User) => void;
  getUserCount: (role?: UserRole) => number;
}

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('redhill-darkMode');
  return saved ? JSON.parse(saved) : false;
};

const getInitialBrandName = () => {
  if (typeof window === 'undefined') return 'RedHill Inventory';
  const saved = localStorage.getItem('redhill-brandName');
  return saved ? JSON.parse(saved) : 'RedHill Inventory';
};

const getInitialShopLocation = () => {
  if (typeof window === 'undefined') return 'Singapore Central Mall';
  const saved = localStorage.getItem('redhill-shopLocation');
  return saved ? JSON.parse(saved) : 'Singapore Central Mall';
};

const getInitialLoginBackground = () => {
  if (typeof window === 'undefined') return 'gradient';
  const saved = localStorage.getItem('redhill-loginBackground');
  return saved ? JSON.parse(saved) : 'gradient';
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    brandName: getInitialBrandName(),
    shopLocation: getInitialShopLocation(),
    darkMode: getInitialDarkMode(),
    theme: getInitialDarkMode() ? 'dark' : 'light',
    loginBackground: getInitialLoginBackground(),
  },
  users: [],
  currentUser: null,

  updateBrandName: (name) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('redhill-brandName', JSON.stringify(name));
    }
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('redhill-shopLocation', JSON.stringify(location));
    }
    set((state) => ({
      settings: { ...state.settings, shopLocation: location },
    }));
  },

  updateLoginBackground: (background) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('redhill-loginBackground', JSON.stringify(background));
    }
    set((state) => ({
      settings: { ...state.settings, loginBackground: background },
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
