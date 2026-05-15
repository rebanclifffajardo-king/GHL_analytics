// components/TabShell.tsx
//
<<<<<<< HEAD
// Top-level shell that owns:
//   • Theme state (shared across both tabs)
//   • Active tab state
//   • The Topbar (rendered once, above the tabs)
//
// The existing Dashboard component is not modified at all.
// JourneyDashboard is added alongside it as a sibling tab.
=======
// Top-level shell — owns theme state, active tab, and the shared Topbar.
//
// Tab order:
//   1. Main          — Conversations Overview (GHL CSV dataset)
//   2. Contacts      — Contacts Overview (mock contacts data)
//   3. Journey       — Journey visitor analytics (journey_data.csv)
>>>>>>> 5d0e27b (separate contacts tab)
'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/hooks/useTheme';
import Topbar from '@/components/layout/Topbar';
import Dashboard from '@/components/Dashboard';
<<<<<<< HEAD
import JourneyDashboard from '@/components/journey/JourneyDashboard';

type Tab = 'main' | 'journey';
=======
import ContactsOverview from '@/components/contacts/ContactsOverview';
import JourneyDashboard from '@/components/journey/JourneyDashboard';

type Tab = 'main' | 'contacts' | 'journey';
>>>>>>> 5d0e27b (separate contacts tab)

export default function TabShell() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('main');
<<<<<<< HEAD

=======
>>>>>>> 5d0e27b (separate contacts tab)
  const isDark = theme === 'dark';

  return (
    <>
<<<<<<< HEAD
      {/* ── Topbar (shared, always visible) ────────────── */}
      <Topbar theme={theme} onToggleTheme={toggleTheme} />

      {/* ── Tab navigation ─────────────────────────────── */}
=======
      {/* ── Shared Topbar ────────────────────────────────── */}
      <Topbar theme={theme} onToggleTheme={toggleTheme} />

      {/* ── Tab navigation ──────────────────────────────── */}
>>>>>>> 5d0e27b (separate contacts tab)
      <nav className="tab-nav" role="tablist" aria-label="Dashboard sections">
        <button
          role="tab"
          aria-selected={activeTab === 'main'}
          className={`tab-btn${activeTab === 'main' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('main')}
        >
          <span className="tab-dot" />
          Main Dashboard
<<<<<<< HEAD
          <span className="tab-badge">2</span>
=======
          <span className="tab-badge">752</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'contacts'}
          className={`tab-btn${activeTab === 'contacts' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <span className="tab-dot" />
          Contacts
          <span className="tab-badge">100</span>
>>>>>>> 5d0e27b (separate contacts tab)
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

<<<<<<< HEAD
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
=======
      {/* ── Tab panels (all mounted, toggled via display) ── */}
      <div
        role="tabpanel"
        aria-label="Main Dashboard"
        style={{ display: activeTab === 'main' ? undefined : 'none' }}
      >
>>>>>>> 5d0e27b (separate contacts tab)
        <Dashboard isDark={isDark} />
      </div>

      <div
        role="tabpanel"
<<<<<<< HEAD
        aria-label="Journey"
        hidden={activeTab !== 'journey'}
=======
        aria-label="Contacts Overview"
        style={{ display: activeTab === 'contacts' ? undefined : 'none' }}
      >
        <ContactsOverview isDark={isDark} />
      </div>

      <div
        role="tabpanel"
        aria-label="Journey"
>>>>>>> 5d0e27b (separate contacts tab)
        style={{ display: activeTab === 'journey' ? undefined : 'none' }}
      >
        <JourneyDashboard isDark={isDark} />
      </div>
    </>
  );
}
