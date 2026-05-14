// components/TabShell.tsx
//
// Top-level shell that owns:
//   • Theme state (shared across both tabs)
//   • Active tab state
//   • The Topbar (rendered once, above the tabs)
//
// The existing Dashboard component is not modified at all.
// JourneyDashboard is added alongside it as a sibling tab.
'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/hooks/useTheme';
import Topbar from '@/components/layout/Topbar';
import Dashboard from '@/components/Dashboard';
import JourneyDashboard from '@/components/journey/JourneyDashboard';

type Tab = 'main' | 'journey';

export default function TabShell() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('main');

  const isDark = theme === 'dark';

  return (
    <>
      {/* ── Topbar (shared, always visible) ────────────── */}
      <Topbar theme={theme} onToggleTheme={toggleTheme} />

      {/* ── Tab navigation ─────────────────────────────── */}
      <nav className="tab-nav" role="tablist" aria-label="Dashboard sections">
        <button
          role="tab"
          aria-selected={activeTab === 'main'}
          className={`tab-btn${activeTab === 'main' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('main')}
        >
          <span className="tab-dot" />
          Main Dashboard
          <span className="tab-badge">2</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'journey'}
          className={`tab-btn${activeTab === 'journey' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('journey')}
        >
          <span className="tab-dot" />
          Journey
          <span className="tab-badge">1.9K</span>
        </button>
      </nav>

      {/* ── Tab panels ─────────────────────────────────── */}
      {/* 
        Both panels are kept mounted to avoid re-fetching data on tab
        switch. Visibility is toggled via display:none so charts don't
        need to re-initialize. The `aria-hidden` attribute keeps
        hidden content out of the accessibility tree.
      */}
      <div
        role="tabpanel"
        aria-label="Main Dashboard"
        hidden={activeTab !== 'main'}
        style={{ display: activeTab === 'main' ? undefined : 'none' }}
      >
        {/* 
          Dashboard owns its own data hooks and theme-aware colours.
          We pass isDark so it can theme charts correctly without
          needing to call useTheme() again (avoids duplicate listeners).
        */}
        <Dashboard isDark={isDark} />
      </div>

      <div
        role="tabpanel"
        aria-label="Journey"
        hidden={activeTab !== 'journey'}
        style={{ display: activeTab === 'journey' ? undefined : 'none' }}
      >
        <JourneyDashboard isDark={isDark} />
      </div>
    </>
  );
}
