// components/contacts/ContactsOverview.tsx
//
// Self-contained Contacts Overview tab.
// Lifted directly from Dashboard.tsx — zero logic changes,
// just extracted into its own component so it can live in
// its own tab between "Main" and "Journey".
'use client';

import { useDashboardData } from '@/lib/hooks/useDashboardData';

import SectionHeader from '@/components/layout/SectionHeader';
import FilterBar from '@/components/ui/FilterBar';
import MetricCard from '@/components/ui/MetricCard';
import ScaleChart from '@/components/ui/ScaleChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import BarChart from '@/components/charts/BarChart';
import { ContactTable } from '@/components/tables/ContactTables';

interface ContactsOverviewProps {
  isDark: boolean;
}

export default function ContactsOverview({ isDark }: ContactsOverviewProps) {
  const {
    loading,
    error,
    dateRange,
    activePreset,
    contacts,
    contactSummary,
    completenessPie,
    contactsByHour,
    topDomains,
    domainScaleSegments,
    applyDateRange,
    applyPreset,
    resetFilter,
  } = useDashboardData();

  const blueColor   = isDark ? '#4895ef' : '#2563eb';
  const violetColor = isDark ? '#9b5de5' : '#7c3aed';
  const tealColor   = isDark ? '#06d6a0' : '#0d9e7e';
  const amberColor  = isDark ? '#f9c74f' : '#d97706';
  const roseColor   = isDark ? '#ef476f' : '#dc2626';

  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <>
      {error && (
        <div className="error-banner">⚠ Failed to load data: {error}</div>
      )}

      <FilterBar
        dateRange={dateRange}
        activePreset={activePreset}
        onApply={applyDateRange}
        onPreset={applyPreset}
        onReset={resetFilter}
      />

      {loading ? (
        <div className="loading-overlay">⟳ Loading contacts data…</div>
      ) : (
        <>
          <SectionHeader title="👥 Contacts Overview" />

          <div className="row r3">
            <MetricCard
              stripe="teal"
              icon="👥"
              label="Total Contacts"
              value={contactSummary.total}
              sub={<><span className="up">↑</span><span>in selected period</span></>}
            />
            <MetricCard
              stripe="blue"
              icon="📱"
              label="With Phone"
              value={contactSummary.withPhone}
              valueColor="blue"
              sub={<span style={{ color: 'var(--blue)' }}>{contactSummary.phonePct} coverage</span>}
            />
            <MetricCard
              stripe="violet"
              icon="✉️"
              label="With Email"
              value={contactSummary.withEmail}
              valueColor="violet"
              sub={<span style={{ color: 'var(--violet)' }}>{contactSummary.emailPct} coverage</span>}
            />
          </div>

          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Contact Profile Completeness</div>
              <DoughnutChart
                labels={completenessPie.labels}
                data={completenessPie.values}
                colors={[tealColor, blueColor, amberColor, roseColor]}
                height={240}
              />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Email Domain Distribution</div>
              <DoughnutChart
                labels={topDomains.map((d) => d.domain)}
                data={topDomains.map((d) => d.count)}
                colors={[tealColor, blueColor, violetColor, amberColor, roseColor, '#0891b2', '#059669', '#9333ea']}
                height={240}
              />
            </div>
          </div>

          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Contact Directory</div>
              <ContactTable contacts={contacts} />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Contacts Added by Hour</div>
              <BarChart
                labels={hourLabels}
                datasets={[{
                  label: 'Contacts',
                  data: contactsByHour,
                  color: isDark ? 'rgba(6,214,160,0.7)' : 'rgba(13,158,126,0.7)',
                }]}
                isDark={isDark}
                height={270}
              />
            </div>
          </div>

          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Top Email Domains</div>
              <BarChart
                labels={topDomains.map((d) => d.domain)}
                datasets={[{
                  label: 'Contacts',
                  data: topDomains.map((d) => d.count),
                  color: isDark ? 'rgba(72,149,239,0.75)' : 'rgba(37,99,235,0.7)',
                }]}
                isDark={isDark}
                height={270}
                horizontal
              />
            </div>

            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Data Completeness Summary</div>
              <div style={{ marginBottom: 16 }}>
                <div className="stat-mini-row">
                  <div className="stat-mini">
                    <div className="stat-mini-val">{contactSummary.total}</div>
                    <div className="stat-mini-lbl">Total</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--teal)' }}>
                      {contactSummary.withBoth}
                    </div>
                    <div className="stat-mini-lbl">Email+Phone</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--rose)' }}>
                      {contactSummary.missingPhone}
                    </div>
                    <div className="stat-mini-lbl">Missing Phone</div>
                  </div>
                </div>
              </div>
              <ScaleChart segments={domainScaleSegments} emptyMessage="No domain data" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
