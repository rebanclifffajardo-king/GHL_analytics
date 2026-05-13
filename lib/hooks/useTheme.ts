// ============================================================
// lib/hooks/useTheme.ts
// Dark/light mode hook with localStorage persistence
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Read saved preference
    const saved = (typeof window !== 'undefined' &&
      localStorage.getItem('genesis-theme')) as Theme | null;
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('genesis-theme', next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
