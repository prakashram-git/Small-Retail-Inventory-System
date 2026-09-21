'use client';

import { useEffect, ReactNode } from 'react';
import { useSettingsStore } from '@/lib/settings-store';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings } = useSettingsStore();

  // Apply dark mode to html element - runs on mount and when settings change
  useEffect(() => {
    const htmlElement = document.documentElement;
    const isDarkMode = settings.darkMode;

    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return <>{children}</>;
}
