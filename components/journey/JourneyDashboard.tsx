// components/journey/JourneyDashboard.tsx
//
// The full "Journey" tab content. Uses the same design system,
// component primitives, and chart components as the main dashboard.
// No existing files were modified to add this tab.
'use client';

import { useJourneyData } from '@/lib/hooks/useJourneyData';
import { journeyPct, fmtJourneyDate } from '@/lib/utils/journeyAnalytics';

// Reused existing components
import SectionHeader from '@/components/layout/SectionHeader';
import MetricCard from '@/components/ui/MetricCard';
import ScaleChart from '@/components/ui/ScaleChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';

// New Journey-specific components
import JourneyFilterBar from '@/components/journey/JourneyFilterBar';
import VisitorTable from '@/components/journey/VisitorTable';
import TopReturningUsers from '@/components/journey/TopReturningUsers';
import StateBreakdown from '@/components/journey/StateBreakdown';

interface JourneyDashboardProps {
  isDark: boolean;
}

export default function JourneyDashboard({ isDark }: JourneyDashboardProps) {
  const {
    loading,
    filter,
    searchInput,
    uniqueVisitors,
    summary,
    dailyStats,
    bebackSegments,
    bebackDistribution,
    pageCounts,
    stateCounts,
    cityCounts,
    genderSplit,
    topReturning,
    allStates,
    totalRaw,
    updateFilter,
    resetFilter,
    applySearch,
  } = useJourneyData();

  // ── Theme-aware colours (mirrors main Dashboard) ────────
  const tealColor  = isDark ? '#06d6a0' : '#0d9e7e';
  const blueColor  = isDark ? '#4895ef' : '#2563eb';
  const violetColor = isDark ? '#9b5de5' : '#7c3aed';
  const amberColor = isDark ? '#f9c74f' : '#d97706';
  const roseColor  = isDark ? '#ef476f' : '#dc2626';
  const tealBg    = isDark ? 'rgba(6,214,160,0.08)'   : 'rgba(13,158,126,0.07)';
  const blueBg    = isDark ? 'rgba(72,149,239,0.08)'  : 'rgba(37,99,235,0.07)';

  const gridColor  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  // ── Daily chart data ────────────────────────────────────
  const dailyDates  = dailyStats.map((d) => d.date);
  const dailyVisits = dailyStats.map((d) => d.totalVisits);
  const dailyUnique = dailyStats.map((d) => d.uniqueVisitors);

  // ── Beback segments as scale segments ───────────────────
  const bebackScaleSegments = bebackSegments.labels.map((lbl, i) => {
    const gradients = [
      'linear-gradient(90deg,#dc2626,#d97706)',
      'linear-gradient(90deg,#d97706,#2563eb)',
      'linear-gradient(90deg,#2563eb,#7c3aed)',
      'linear-gradient(90deg,#0d9e7e,#2563eb)',
    ];
    const max = Math.max(...bebackSegments.values, 1);
    return {
      label: lbl,
      count: bebackSegments.values[i],
      percentage: (bebackSegments.values[i] / max) * 100,
      gradient: gradients[i % gradients.length],
    };
  });

  // ── Top cities as scale segments ────────────────────────
  const maxCity = cityCounts[0]?.count ?? 1;
  const cityScaleSegments = cityCounts.map((c, i) => {
    const gradients = [
      'linear-gradient(90deg,#0d9e7e,#2563eb)',
      'linear-gradient(90deg,#2563eb,#7c3aed)',
      'linear-gradient(90deg,#7c3aed,#d97706)',
      'linear-gradient(90deg,#d97706,#0d9e7e)',
      'linear-gradient(90deg,#0891b2,#059669)',
      'linear-gradient(90deg,#9333ea,#2563eb)',
    ];
    return {
      label: `${c.city}, ${c.state}`,
      count: c.count,
      percentage: (c.count / maxCity) * 100,
      gradient: gradients[i % gradients.length],
    };
  });

  return (
    <>
      {/* ─── Filter Bar ─── */}
      <JourneyFilterBar
        filter={filter}
        allStates={allStates}
        onUpdate={updateFilter}
        onReset={resetFilter}
        searchInput={searchInput}
        onSearch={applySearch}
      />

      {loading ? (
        <div className="loading-overlay">⟳ Loading journey data…</div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════
              SECTION 1: OVERVIEW KPIs
          ══════════════════════════════════════════════ */}
          <SectionHeader title="🗺️ Journey Overview" />

          <div className="row r3">
            <MetricCard
              stripe="teal"
              icon="👣"
              label="Total Visits"
              value={summary.totalVisits.toLocaleString()}
              sub={
                <><span className="up">↑</span>
                <span>{journeyPct(summary.totalVisits, totalRaw)} of full dataset</span></>
              }
            />
            <MetricCard
              stripe="blue"
              icon="👤"
              label="Unique Visitors"
              value={summary.uniqueVisitors.toLocaleString()}
              valueColor="blue"
              sub={
                <span style={{ color: 'var(--blue)' }}>
                  avg {summary.avgBebacks} bebacks each
                </span>
              }
            />
            <MetricCard
              stripe="violet"
              icon="🔁"
              label="Returning Visitors"
              value={summary.returningVisitors.toLocaleString()}
              valueColor="violet"
              sub={
                <span style={{ color: 'var(--violet)' }}>
                  {journeyPct(summary.returningVisitors, summary.uniqueVisitors)} of unique visitors
                </span>
              }
            />
          </div>

          <div className="row r3">
            <MetricCard
              stripe="amber"
              icon="📍"
              label="Top State"
              value={summary.topState}
              valueColor="amber"
              sub={<span style={{ color: 'var(--amber)' }}>most unique visitors</span>}
            />
            <MetricCard
              stripe="rose"
              icon="🏙️"
              label="Top City"
              value={summary.topCity}
              valueColor="rose"
              sub={<span style={{ color: 'var(--rose)' }}>highest traffic city</span>}
            />
            <MetricCard
              stripe="teal"
              icon="📅"
              label="Date Range"
              value={summary.dateRange}
              sub={<span>{summary.totalVisits} total sessions</span>}
            />
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 2: VISITOR TRENDS
          ══════════════════════════════════════════════ */}
          <SectionHeader title="📈 Visitor Trends" />

          {/* Daily line chart (full width) */}
          <div className="row r1">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Daily Visit Volume vs Unique Visitors
              </div>
              <LineChart
                dates={dailyDates}
                datasets={[
                  {
                    label: 'Total Visits',
                    data: dailyVisits,
                    borderColor: tealColor,
                    bgColor: tealBg,
                  },
                  {
                    label: 'Unique Visitors',
                    data: dailyUnique,
                    borderColor: blueColor,
                    bgColor: blueBg,
                  },
                ]}
                isDark={isDark}
                height={260}
              />
            </div>
          </div>

          {/* Beback distribution bar + beback segments pie */}
          <div className="row r2">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Beback Distribution (Visit Frequency)
              </div>
              <BarChart
                labels={bebackDistribution.labels}
                datasets={[
                  {
                    label: 'Visitors',
                    data: bebackDistribution.values,
                    color: isDark ? 'rgba(6,214,160,0.75)' : 'rgba(13,158,126,0.7)',
                  },
                ]}
                isDark={isDark}
                height={260}
              />
            </div>
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Visitor Engagement Segments
              </div>
              <DoughnutChart
                labels={bebackSegments.labels}
                data={bebackSegments.values}
                colors={[roseColor, amberColor, blueColor, tealColor]}
                height={240}
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 3: WEBSITE PAGES
          ══════════════════════════════════════════════ */}
          <SectionHeader title="🌐 Website Activity" />

          <div className="row r2">
            {/* Page distribution pie */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Pages Visited Distribution
              </div>
              <DoughnutChart
                labels={pageCounts.map((p) => p.page)}
                data={pageCounts.map((p) => p.count)}
                colors={[tealColor, blueColor, violetColor, amberColor, roseColor, '#0891b2', '#9333ea']}
                height={240}
              />
            </div>

            {/* Page visit bar chart */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Page Visit Frequency
              </div>
              <BarChart
                labels={pageCounts.map((p) => p.page)}
                datasets={[
                  {
                    label: 'Visits',
                    data: pageCounts.map((p) => p.count),
                    color: isDark ? 'rgba(72,149,239,0.75)' : 'rgba(37,99,235,0.7)',
                  },
                ]}
                isDark={isDark}
                height={240}
                horizontal
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 4: GEOGRAPHY & DEMOGRAPHICS
          ══════════════════════════════════════════════ */}
          <SectionHeader title="📍 Geographic & Demographic Breakdown" />

          <div className="row r2">
            {/* State breakdown (scale bars) */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Visitors by State
              </div>
              <StateBreakdown states={stateCounts} limit={12} />
            </div>

            {/* Top cities scale bars */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Top Cities by Unique Visitors
              </div>
              <ScaleChart segments={cityScaleSegments} emptyMessage="No city data" />
            </div>
          </div>

          <div className="row r2">
            {/* State bar chart */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Top States — Unique Visitors
              </div>
              <BarChart
                labels={stateCounts.slice(0, 12).map((s) => s.state)}
                datasets={[
                  {
                    label: 'Unique Visitors',
                    data: stateCounts.slice(0, 12).map((s) => s.uniqueVisitors),
                    color: isDark ? 'rgba(155,93,229,0.75)' : 'rgba(124,58,237,0.7)',
                  },
                ]}
                isDark={isDark}
                height={260}
              />
            </div>

            {/* Gender split */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Visitor Gender Split
              </div>
              <DoughnutChart
                labels={genderSplit.labels}
                data={genderSplit.values}
                colors={[violetColor, blueColor, amberColor]}
                height={240}
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 5: TOP RETURNING USERS
          ══════════════════════════════════════════════ */}
          <SectionHeader title="🏆 Top Returning Visitors" />

          <div className="row r2">
            {/* Top returning users list */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Highest Beback Count
              </div>
              <TopReturningUsers visitors={topReturning} />
            </div>

            {/* Engagement segment scale */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Engagement Tier Distribution
              </div>

              {/* Mini stat row */}
              <div style={{ marginBottom: 16 }}>
                <div className="stat-mini-row">
                  <div className="stat-mini">
                    <div className="stat-mini-val">{summary.uniqueVisitors}</div>
                    <div className="stat-mini-lbl">Total</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--teal)' }}>
                      {bebackSegments.values[3] ?? 0}
                    </div>
                    <div className="stat-mini-lbl">Loyal (7+)</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--blue)' }}>
                      {bebackSegments.values[2] ?? 0}
                    </div>
                    <div className="stat-mini-lbl">Engaged (4–6)</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--rose)' }}>
                      {bebackSegments.values[0] ?? 0}
                    </div>
                    <div className="stat-mini-lbl">First Visit</div>
                  </div>
                </div>
              </div>

              <ScaleChart segments={bebackScaleSegments} emptyMessage="No engagement data" />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 6: VISITOR DIRECTORY
          ══════════════════════════════════════════════ */}
          <SectionHeader title="📋 Visitor Directory" />

          <div className="row r1">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                All Visitors
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.65rem',
                    color: 'var(--muted)',
                    fontWeight: 400,
                  }}
                >
                  {uniqueVisitors.length.toLocaleString()} records · click columns to sort
                </span>
              </div>
              <VisitorTable visitors={uniqueVisitors} pageSize={15} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
