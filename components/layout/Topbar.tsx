// components/layout/Topbar.tsx
'use client';

import type { Theme } from '@/types';

interface TopbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

/**
 * Top navigation bar with logo, live badge, and dark/light toggle.
 */
export default function Topbar({ theme, onToggleTheme }: TopbarProps) {
  const isDark = theme === 'dark';

  return (
    <div className="topbar">
      {/* Brand / Logo */}
      <div className="brand">
        <div className="brand-logo">G</div>
        <div className="brand-text">
          <h1>GENESIS</h1>
          <p>Contacts &amp; Communications · May 2026</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="topbar-right">
        <div className="live-badge">
          <span className="dot" />
          Live Dataset
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <span className="icon">{isDark ? '🌙' : '☀️'}</span>
          <span>{isDark ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </div>
  );
}
