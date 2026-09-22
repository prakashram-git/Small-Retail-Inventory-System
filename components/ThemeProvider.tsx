'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useSettingsStore } from '@/lib/settings-store';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage immediately to prevent flashing
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Try to get saved dark mode preference from localStorage
    try {
      const savedDarkMode = localStorage.getItem('redhill-darkMode');
      const isDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;

      if (isDarkMode) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    } catch (e) {
      // Fallback if localStorage fails
      htmlElement.classList.remove('dark');
    }

    setMounted(true);
  }, []); // Run once on mount

  // Apply dark mode when settings change (after initial mount)
  useEffect(() => {
    if (!mounted) return;

    const htmlElement = document.documentElement;
    const isDarkMode = settings.darkMode;

    // Add a small delay to prevent race conditions during navigation
    const timer = requestAnimationFrame(() => {
      if (isDarkMode) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    });

    return () => cancelAnimationFrame(timer);
  }, [settings.darkMode, mounted]);

  return <>{children}</>;
}
