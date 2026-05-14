// app/page.tsx
// Root page — renders the tabbed Genesis dashboard.
// The tab state lives here so both tabs share the same
// Topbar and theme without re-mounting it.
import TabShell from '@/components/TabShell';

export default function Home() {
  return <TabShell />;
}
