// components/Dashboard.tsx
//
// Main dashboard panel. Theme is owned by TabShell (parent)
// and passed in via the isDark prop — no useTheme() here.
'use client';

import { useDashboardData } from '@/lib/hooks/useDashboardData';
import { pct } from '@/lib/utils/analytics';

// Layout
import SectionHeader from '@/components/layout/SectionHeader';

// UI
import FilterBar from '@/components/ui/FilterBar';
import MetricCard from '@/components/ui/MetricCard';
import ScaleChart from '@/components/ui/ScaleChart';

// Charts
import DoughnutChart from '@/components/charts/DoughnutChart';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';

// Tables
import {
  AllRecordsTable,
  DirectionTable,
  ChannelTable,
} from '@/components/tables/CommTables';
import { ContactTable } from '@/components/tables/ContactTables';

interface DashboardProps { isDark: boolean; }

export default function Dashboard({ isDark }: DashboardProps) {

  const {
    loading,
    error,
    dateRange,
    activePreset,
    contacts,
    comms,
    contactSummary,
    commSummary,
    dailyVolume,
    weeklyVolume,
    directionByDate,
    commScaleSegments,
    completenessPie,
    domainCounts,
    contactsByHour,
    topDomains,
    domainScaleSegments,
    applyDateRange,
    applyPreset,
    resetFilter,
  } = useDashboardData();

  // Theme-aware chart colors
  const blueColor = isDark ? '#4895ef' : '#2563eb';
  const violetColor = isDark ? '#9b5de5' : '#7c3aed';
  const tealColor = isDark ? '#06d6a0' : '#0d9e7e';
  const amberColor = isDark ? '#f9c74f' : '#d97706';
  const roseColor = isDark ? '#ef476f' : '#dc2626';

  const blueBg = isDark ? 'rgba(72,149,239,0.08)' : 'rgba(37,99,235,0.07)';
  const violetBg = isDark ? 'rgba(155,93,229,0.08)' : 'rgba(124,58,237,0.07)';

  // Non-zero hour buckets for bar chart labels
  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const nonEmptyHours = hourLabels.filter((_, i) => contactsByHour[i] > 0);
  const nonEmptyValues = contactsByHour.filter((v) => v > 0);
  // Use all 24h for full display
  const hoursWithData = hourLabels.filter((_, i) => contactsByHour[i] > 0);

  return (
    <>
      {/* ─── Error Banner ─── */}
      {error && (
        <div className="error-banner">
          ⚠ Failed to load data: {error}
        </div>
      )}

      {/* ─── Filter Bar ─── */}
      <FilterBar
        dateRange={dateRange}
        activePreset={activePreset}
        onApply={applyDateRange}
        onPreset={applyPreset}
        onReset={resetFilter}
      />

      {loading ? (
        <div className="loading-overlay">⟳ Loading dashboard data…</div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════
              SECTION: COMMUNICATIONS
          ══════════════════════════════════════════════ */}
          <SectionHeader title="📨 Communications Overview" />

          {/* Comms Metric Cards */}
          <div className="row r3">
            <MetricCard
              stripe="teal"
              icon="📊"
              label="Total Messages"
              value={commSummary.total}
              sub={<><span className="up">↑</span><span>{pct(commSummary.total, comms.length || 1)} of dataset</span></>}
            />
            <MetricCard
              stripe="blue"
              icon="📧"
              label="Email"
              value={commSummary.email}
              valueColor="blue"
              sub={<span style={{ color: 'var(--blue)' }}>{commSummary.emailPct} of filtered</span>}
            />
            <MetricCard
              stripe="violet"
              icon="💬"
              label="SMS"
              value={commSummary.sms}
              valueColor="violet"
              sub={<span style={{ color: 'var(--violet)' }}>{commSummary.smsPct} of filtered</span>}
            />
          </div>

          {/* Comms Pie Charts */}
          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Channel Distribution</div>
              <DoughnutChart
                labels={['Email', 'SMS']}
                data={[commSummary.email, commSummary.sms]}
                colors={[blueColor, violetColor]}
                height={240}
              />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Status Breakdown</div>
              <DoughnutChart
                labels={['Sent', 'Received', 'Failed']}
                data={[
                  comms.filter((c) => c.status === 'sent').length,
                  comms.filter((c) => c.status === 'received').length,
                  comms.filter((c) => c.status === 'failed').length,
                ]}
                colors={[tealColor, amberColor, roseColor]}
                height={240}
              />
            </div>
          </div>

          {/* All Records + Line Chart */}
          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />All Message Records</div>
              <AllRecordsTable records={comms} />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Daily Volume Trend</div>
              <LineChart
                dates={dailyVolume.dates}
                datasets={[
                  { label: 'Email', data: dailyVolume.email, borderColor: blueColor, bgColor: blueBg },
                  { label: 'SMS', data: dailyVolume.sms, borderColor: violetColor, bgColor: violetBg },
                ]}
                isDark={isDark}
                height={270}
              />
            </div>
          </div>

          {/* Bar Chart + Direction Table */}
          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Weekly Email vs SMS</div>
              <BarChart
                labels={weeklyVolume.weeks}
                datasets={[
                  { label: 'Email', data: weeklyVolume.email, color: isDark ? 'rgba(72,149,239,0.75)' : 'rgba(37,99,235,0.7)' },
                  { label: 'SMS', data: weeklyVolume.sms, color: isDark ? 'rgba(155,93,229,0.75)' : 'rgba(124,58,237,0.7)' },
                ]}
                isDark={isDark}
                height={270}
              />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Direction Summary by Day</div>
              <DirectionTable rows={directionByDate} />
            </div>
          </div>

          {/* Email + SMS Record Tables */}
          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Email Records</div>
              <ChannelTable records={comms} channel="email" />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />SMS Records</div>
              <ChannelTable records={comms} channel="sms" />
            </div>
          </div>

          {/* Scale Chart */}
          <div className="row r1">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Message Status Rate by Channel &amp; Direction
              </div>
              <ScaleChart segments={commScaleSegments} emptyMessage="No communications data" />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION: CONTACTS
          ══════════════════════════════════════════════ */}
          <SectionHeader title="👥 Contacts Overview" />

          {/* Contact Metric Cards */}
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

          {/* Contact Pie Charts */}
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

          {/* Contact Directory + Hourly Bar */}
          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Contact Directory</div>
              <ContactTable contacts={contacts} />
            </div>
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Contacts Added by Hour</div>
              <BarChart
                labels={hourLabels}
                datasets={[
                  {
                    label: 'Contacts',
                    data: contactsByHour,
                    color: isDark ? 'rgba(6,214,160,0.7)' : 'rgba(13,158,126,0.7)',
                  },
                ]}
                isDark={isDark}
                height={270}
              />
            </div>
          </div>

          {/* Top Domains Bar + Completeness Summary */}
          <div className="row r2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Top Email Domains</div>
              <BarChart
                labels={topDomains.map((d) => d.domain)}
                datasets={[
                  {
                    label: 'Contacts',
                    data: topDomains.map((d) => d.count),
                    color: isDark ? 'rgba(72,149,239,0.75)' : 'rgba(37,99,235,0.7)',
                  },
                ]}
                isDark={isDark}
                height={270}
                horizontal
              />
            </div>

            <div className="card">
              <div className="card-title"><span className="card-title-dot" />Data Completeness Summary</div>

              {/* Mini stats row */}
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

              {/* Domain scale bars */}
              <ScaleChart
                segments={domainScaleSegments}
                emptyMessage="No domain data"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
