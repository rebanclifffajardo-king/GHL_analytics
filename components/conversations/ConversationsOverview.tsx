// components/conversations/ConversationsOverview.tsx
//
// Self-contained Conversations Overview section.
// Sourced 100% from CONV_RECORDS (GHL_Conversation_SMS_EMAIL CSV).
// Plugs into Dashboard.tsx in place of the original inline section.
// Does NOT touch the Contacts Overview.
'use client';

import { useConvData } from '@/lib/hooks/useConvData';

// Existing reusable components — unchanged
import SectionHeader from '@/components/layout/SectionHeader';
import MetricCard from '@/components/ui/MetricCard';
import ScaleChart from '@/components/ui/ScaleChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';

// New conversations-specific components
import ConvFilterBar from '@/components/conversations/ConvFilterBar';
import SmsTemplateBreakdown from '@/components/conversations/SmsTemplateBreakdown';
import SourceChannelTable from '@/components/conversations/SourceChannelTable';
import ConvRecordsTable from '@/components/conversations/ConvRecordsTable';

interface ConversationsOverviewProps {
  isDark: boolean;
}

export default function ConversationsOverview({ isDark }: ConversationsOverviewProps) {
  const {
    loading,
    filter,
    searchInput,
    records,
    summary,
    dailyStats,
    smsTemplates,
    sourceChannel,
    scaleSegments,
    tableRows,
    updateFilter,
    resetFilter,
    applySearch,
  } = useConvData();

  // ── Theme-aware chart colours ────────────────────────────
  const teal   = isDark ? '#06d6a0' : '#0d9e7e';
  const blue   = isDark ? '#4895ef' : '#2563eb';
  const violet = isDark ? '#9b5de5' : '#7c3aed';
  const amber  = isDark ? '#f9c74f' : '#d97706';
  const rose   = isDark ? '#ef476f' : '#dc2626';
  const cyan   = isDark ? '#22d3ee' : '#0891b2';

  const tealBg   = isDark ? 'rgba(6,214,160,0.08)'   : 'rgba(13,158,126,0.07)';
  const blueBg   = isDark ? 'rgba(72,149,239,0.08)'  : 'rgba(37,99,235,0.07)';
  const violetBg = isDark ? 'rgba(155,93,229,0.08)'  : 'rgba(124,58,237,0.07)';

  // ── Daily chart arrays ───────────────────────────────────
  const dates       = dailyStats.map((d) => d.date);
  const smsDaily    = dailyStats.map((d) => d.sms);
  const emailDaily  = dailyStats.map((d) => d.email);
  const inbDaily    = dailyStats.map((d) => d.inbound);
  const outbDaily   = dailyStats.map((d) => d.outbound);
  const agentDaily  = dailyStats.map((d) => d.agentManual);
  const autoDaily   = dailyStats.map((d) => d.automation);
  const replyDaily  = dailyStats.map((d) => d.customerReply);

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          FILTER BAR — drives all charts below
      ═══════════════════════════════════════════════════ */}
      <ConvFilterBar
        filter={filter}
        onUpdate={updateFilter}
        onReset={resetFilter}
        searchInput={searchInput}
        onSearch={applySearch}
      />

      {loading ? (
        <div className="loading-overlay">⟳ Loading conversations data…</div>
      ) : (
        <>
          {/* ═══════════════════════════════════════════════
              SECTION 1: TOP-LINE KPIs
          ═══════════════════════════════════════════════ */}
          <SectionHeader title="📨 Conversations Overview" />

          {/* Row 1 — Volume KPIs */}
          <div className="row r3">
            <MetricCard
              stripe="teal"
              icon="💬"
              label="Total Conversations"
              value={summary.total.toLocaleString()}
              sub={<><span className="up">↑</span><span>{summary.dateRange}</span></>}
            />
            <MetricCard
              stripe="blue"
              icon="👤"
              label="Unique Contacts"
              value={summary.uniqueContacts.toLocaleString()}
              valueColor="blue"
              sub={<span style={{ color: 'var(--blue)' }}>{summary.total} total messages</span>}
            />
            <MetricCard
              stripe="violet"
              icon="📤"
              label="Outbound Sent"
              value={summary.outbound.toLocaleString()}
              valueColor="violet"
              sub={<span style={{ color: 'var(--violet)' }}>{summary.outboundPct} of total</span>}
            />
          </div>

          {/* Row 2 — Channel + Direction KPIs */}
          <div className="row r3">
            <MetricCard
              stripe="violet"
              icon="📱"
              label="SMS Messages"
              value={summary.sms.toLocaleString()}
              valueColor="violet"
              sub={<span style={{ color: 'var(--violet)' }}>{summary.smsPct} of total</span>}
            />
            <MetricCard
              stripe="blue"
              icon="📧"
              label="Email Messages"
              value={summary.email.toLocaleString()}
              valueColor="blue"
              sub={<span style={{ color: 'var(--blue)' }}>{summary.emailPct} of total</span>}
            />
            <MetricCard
              stripe="teal"
              icon="📥"
              label="Inbound (Replies)"
              value={summary.inbound.toLocaleString()}
              valueColor="teal"
              sub={<span style={{ color: 'var(--teal)' }}>{summary.inboundPct} reply rate</span>}
            />
          </div>

          {/* Row 3 — Engagement KPIs */}
          <div className="row r3">
            <MetricCard
              stripe="amber"
              icon="🤖"
              label="Automation Sends"
              value={summary.automation.toLocaleString()}
              valueColor="amber"
              sub={<span style={{ color: 'var(--amber)' }}>All Email · automated</span>}
            />
            <MetricCard
              stripe="teal"
              icon="🧑‍💼"
              label="Agent / Manual"
              value={summary.agentManual.toLocaleString()}
              valueColor="teal"
              sub={<span style={{ color: 'var(--teal)' }}>SMS · agent-sent</span>}
            />
            <MetricCard
              stripe="rose"
              icon="🚫"
              label="Opt-Outs (STOP)"
              value={summary.optOuts.toLocaleString()}
              valueColor="rose"
              sub={<span style={{ color: 'var(--rose)' }}>{summary.optOutRate} opt-out rate</span>}
            />
          </div>

          {/* ═══════════════════════════════════════════════
              SECTION 2: CHANNEL & DIRECTION DISTRIBUTION
          ═══════════════════════════════════════════════ */}
          <SectionHeader title="📊 Channel & Direction Distribution" />

          <div className="row r2">
            {/* Channel split doughnut */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Channel Split — SMS vs Email
              </div>
              <DoughnutChart
                labels={['SMS', 'Email']}
                data={[summary.sms, summary.email]}
                colors={[violet, blue]}
                height={240}
              />
            </div>

            {/* Direction doughnut */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Message Direction
              </div>
              <DoughnutChart
                labels={['Outbound', 'Inbound (Replies)']}
                data={[summary.outbound, summary.inbound]}
                colors={[teal, amber]}
                height={240}
              />
            </div>
          </div>

          {/* Source type doughnut + source × channel cross table */}
          <div className="row r2">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Source Type Breakdown
              </div>
              <DoughnutChart
                labels={['Agent / Manual', 'Automation', 'Customer Reply']}
                data={[summary.agentManual, summary.automation, summary.customerReply]}
                colors={[violet, blue, teal]}
                height={240}
              />
            </div>

            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Source × Channel Cross-Tab
              </div>
              <SourceChannelTable rows={sourceChannel} total={summary.total} />

              {/* Mini inbox stat */}
              <div style={{ marginTop: 16, display: 'flex', gap: 0 }}>
                <div className="stat-mini-row" style={{ flex: 1 }}>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--amber)' }}>
                      {summary.inboxUnread}
                    </div>
                    <div className="stat-mini-lbl">Unread / Inbox</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--rose)' }}>
                      {summary.optOuts}
                    </div>
                    <div className="stat-mini-lbl">Opt-Outs</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val" style={{ color: 'var(--teal)' }}>
                      {summary.customerReply}
                    </div>
                    <div className="stat-mini-lbl">Replies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              SECTION 3: DAILY TRENDS
          ═══════════════════════════════════════════════ */}
          <SectionHeader title="📈 Daily Volume Trends" />

          {/* SMS vs Email daily line — full width */}
          <div className="row r1">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Daily Volume — SMS vs Email
              </div>
              <LineChart
                dates={dates}
                datasets={[
                  { label: 'SMS', data: smsDaily, borderColor: violet, bgColor: violetBg },
                  { label: 'Email', data: emailDaily, borderColor: blue, bgColor: blueBg },
                ]}
                isDark={isDark}
                height={260}
              />
            </div>
          </div>

          {/* Inbound vs Outbound daily + Source daily */}
          <div className="row r2">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Daily Inbound vs Outbound
              </div>
              <BarChart
                labels={dates}
                datasets={[
                  { label: 'Outbound', data: outbDaily, color: isDark ? 'rgba(6,214,160,0.75)' : 'rgba(13,158,126,0.7)' },
                  { label: 'Inbound (Replies)', data: inbDaily, color: isDark ? 'rgba(249,199,79,0.75)' : 'rgba(217,119,6,0.7)' },
                ]}
                isDark={isDark}
                height={260}
                stacked
              />
            </div>

            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Daily by Source Type
              </div>
              <BarChart
                labels={dates}
                datasets={[
                  { label: 'Agent / Manual', data: agentDaily, color: isDark ? 'rgba(155,93,229,0.75)' : 'rgba(124,58,237,0.7)' },
                  { label: 'Automation', data: autoDaily, color: isDark ? 'rgba(72,149,239,0.75)' : 'rgba(37,99,235,0.7)' },
                  { label: 'Customer Reply', data: replyDaily, color: isDark ? 'rgba(6,214,160,0.75)' : 'rgba(13,158,126,0.7)' },
                ]}
                isDark={isDark}
                height={260}
                stacked
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              SECTION 4: SMS CAMPAIGNS
          ═══════════════════════════════════════════════ */}
          <SectionHeader title="📱 SMS Campaign Analysis" />

          <div className="row r2">
            {/* Template usage breakdown */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                SMS Template Usage
              </div>
              <SmsTemplateBreakdown templates={smsTemplates} />
            </div>

            {/* SMS template bar chart */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Template Frequency Comparison
              </div>
              <BarChart
                labels={smsTemplates.map((t) => t.label)}
                datasets={[
                  {
                    label: 'Messages Sent',
                    data: smsTemplates.map((t) => t.count),
                    color: isDark
                      ? ['rgba(6,214,160,0.75)', 'rgba(72,149,239,0.75)', 'rgba(155,93,229,0.75)', 'rgba(239,71,111,0.75)'][0]
                      : 'rgba(13,158,126,0.7)',
                  },
                ]}
                isDark={isDark}
                height={260}
                horizontal
              />
            </div>
          </div>

          {/* Opt-out analysis */}
          <div className="row r2">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Opt-Out Analysis — STOP Replies by Date
              </div>
              <BarChart
                labels={
                  // Group opt-outs by date from records
                  (() => {
                    const map: Record<string, number> = {};
                    records
                      .filter((r) => r.lastMessageBody.toUpperCase().trim() === 'STOP')
                      .forEach((r) => { map[r.dateOnly] = (map[r.dateOnly] || 0) + 1; });
                    return Object.keys(map).sort();
                  })()
                }
                datasets={[
                  {
                    label: 'Opt-Outs',
                    data: (() => {
                      const map: Record<string, number> = {};
                      records
                        .filter((r) => r.lastMessageBody.toUpperCase().trim() === 'STOP')
                        .forEach((r) => { map[r.dateOnly] = (map[r.dateOnly] || 0) + 1; });
                      return Object.keys(map).sort().map((k) => map[k]);
                    })(),
                    color: isDark ? 'rgba(239,71,111,0.75)' : 'rgba(220,38,38,0.7)',
                  },
                ]}
                isDark={isDark}
                height={220}
              />
            </div>

            {/* Engagement rate KPI card */}
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Engagement Metrics Summary
              </div>

              <div className="stat-mini-row" style={{ marginBottom: 16 }}>
                <div className="stat-mini">
                  <div className="stat-mini-val" style={{ color: 'var(--teal)' }}>
                    {summary.customerReply}
                  </div>
                  <div className="stat-mini-lbl">Replies</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-val" style={{ color: 'var(--rose)' }}>
                    {summary.optOuts}
                  </div>
                  <div className="stat-mini-lbl">Opt-Outs</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-val" style={{ color: 'var(--amber)' }}>
                    {summary.inboxUnread}
                  </div>
                  <div className="stat-mini-lbl">Unread</div>
                </div>
              </div>

              {/* Engagement rate doughnut */}
              <DoughnutChart
                labels={['Replied', 'Opted Out', 'No Response']}
                data={[
                  summary.customerReply,
                  summary.optOuts,
                  Math.max(0, summary.outbound - summary.customerReply - summary.optOuts),
                ]}
                colors={[teal, rose, isDark ? '#2d3748' : '#e2e8f0']}
                height={220}
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              SECTION 5: RATE BREAKDOWN SCALE
          ═══════════════════════════════════════════════ */}
          <SectionHeader title="📉 Message Rate Breakdown" />

          <div className="row r1">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                Volume by Category — Proportional Scale
              </div>
              <ScaleChart segments={scaleSegments} emptyMessage="No data for this filter" />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              SECTION 6: CONVERSATION RECORDS TABLE
          ═══════════════════════════════════════════════ */}
          <SectionHeader title="📋 Conversation Records" />

          <div className="row r1">
            <div className="card">
              <div className="card-title">
                <span className="card-title-dot" />
                All Conversations
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 400 }}>
                  {tableRows.length.toLocaleString()} records · click columns to sort
                </span>
              </div>
              <ConvRecordsTable rows={tableRows} pageSize={15} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
