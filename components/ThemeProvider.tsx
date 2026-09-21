'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useSettingsStore } from '@/lib/settings-store';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { settings } = useSettingsStore();

  // Apply dark mode to html element
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const htmlElement = document.documentElement;
    if (settings.darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [settings.darkMode, mounted]);

  return <>{children}</>;
}
