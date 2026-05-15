// ============================================================
// lib/utils/convAnalytics.ts
//
// Pure analytics functions for the Conversations Overview.
// All derived entirely from ConvRecord[] — no assumptions.
// ============================================================

import type {
  ConvRecord,
  ConvSummary,
  ConvDailyStats,
  TemplateCount,
  SourceChannelRow,
  ConvTableRow,
  ConvFilter,
} from '@/types/conversations';

// ─── Formatting helpers ────────────────────────────────────

export function fmtConvDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function pct(n: number, total: number): string {
  if (!total) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
}

// ─── Filtering ────────────────────────────────────────────

export function applyConvFilters(
  records: ConvRecord[],
  filter: ConvFilter
): ConvRecord[] {
  return records.filter((r) => {
    if (filter.dateFrom && r.dateOnly < filter.dateFrom) return false;
    if (filter.dateTo && r.dateOnly > filter.dateTo) return false;
    if (filter.messageType && r.messageType !== filter.messageType) return false;
    if (filter.direction && r.direction !== filter.direction) return false;
    if (filter.sourceType && r.sourceType !== filter.sourceType) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (
        !r.fullName.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q) &&
        !r.phone.includes(q)
      )
        return false;
    }
    return true;
  });
}

// ─── Summary KPIs ─────────────────────────────────────────

export function computeConvSummary(records: ConvRecord[]): ConvSummary {
  const total = records.length;
  const uniqueContacts = new Set(records.map((r) => r.contactId)).size;
  const sms = records.filter((r) => r.messageType === 'SMS').length;
  const email = records.filter((r) => r.messageType === 'Email').length;
  const outbound = records.filter((r) => r.direction === 'outbound').length;
  const inbound = records.filter((r) => r.direction === 'inbound').length;
  const agentManual = records.filter((r) => r.sourceType === 'AGENT / MANUAL').length;
  const automation = records.filter((r) => r.sourceType === 'AUTOMATION').length;
  const customerReply = records.filter((r) => r.sourceType === 'CUSTOMER REPLY').length;
  const optOuts = records.filter(
    (r) => r.lastMessageBody.toUpperCase().trim() === 'STOP'
  ).length;
  const inboxUnread = records.filter((r) => r.unreadCount > 0).length;

  // Reply rate = customer replies / total outbound sent
  const outboundSent = records.filter((r) => r.direction === 'outbound').length;

  const dates = records.map((r) => r.dateOnly).sort();
  const dateRange =
    dates.length
      ? `${fmtConvDate(dates[0])} – ${fmtConvDate(dates[dates.length - 1])}`
      : '—';

  return {
    total,
    uniqueContacts,
    sms,
    email,
    outbound,
    inbound,
    agentManual,
    automation,
    customerReply,
    optOuts,
    inboxUnread,
    smsPct: pct(sms, total),
    emailPct: pct(email, total),
    outboundPct: pct(outbound, total),
    inboundPct: pct(inbound, total),
    optOutRate: pct(optOuts, outboundSent),
    replyRate: pct(customerReply, outboundSent),
    dateRange,
  };
}

// ─── Daily stats ───────────────────────────────────────────

export function getConvDailyStats(records: ConvRecord[]): ConvDailyStats[] {
  const map: Record<string, ConvDailyStats> = {};

  const zero = (): ConvDailyStats => ({
    date: '',
    total: 0,
    sms: 0,
    email: 0,
    inbound: 0,
    outbound: 0,
    agentManual: 0,
    automation: 0,
    customerReply: 0,
  });

  for (const r of records) {
    if (!map[r.dateOnly]) {
      map[r.dateOnly] = { ...zero(), date: r.dateOnly };
    }
    const d = map[r.dateOnly];
    d.total++;
    if (r.messageType === 'SMS') d.sms++;
    else d.email++;
    if (r.direction === 'inbound') d.inbound++;
    else d.outbound++;
    if (r.sourceType === 'AGENT / MANUAL') d.agentManual++;
    else if (r.sourceType === 'AUTOMATION') d.automation++;
    else d.customerReply++;
  }

  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

// ─── SMS template breakdown ────────────────────────────────

/** Short label for a long SMS body */
function smsLabel(body: string): string {
  if (body.includes("fits your budget")) return "Budget";
  if (body.includes("payments or pricing")) return "Payments";
  if (body.includes("straightforward car")) return "Car Buying";
  if (body.toUpperCase().trim() === 'STOP') return "STOP Reply";
  return body.slice(0, 40) + '…';
}

export function getSmsTemplates(records: ConvRecord[]): TemplateCount[] {
  const smsRecords = records.filter((r) => r.messageType === 'SMS');
  const map: Record<string, { label: string; count: number; fullBody: string }> = {};

  for (const r of smsRecords) {
    const key = smsLabel(r.lastMessageBody);
    if (!map[key]) map[key] = { label: key, count: 0, fullBody: r.lastMessageBody };
    map[key].count++;
  }

  return Object.values(map).sort((a, b) => b.count - a.count);
}

// ─── Source × Channel cross-tab ───────────────────────────

export function getSourceChannelRows(records: ConvRecord[]): SourceChannelRow[] {
  const sources = ['AGENT / MANUAL', 'AUTOMATION', 'CUSTOMER REPLY'] as const;
  return sources.map((src) => {
    const subset = records.filter((r) => r.sourceType === src);
    const sms = subset.filter((r) => r.messageType === 'SMS').length;
    const email = subset.filter((r) => r.messageType === 'Email').length;
    return { source: src, sms, email, total: subset.length };
  });
}

// ─── Scale segments ────────────────────────────────────────

interface ScaleSeg {
  label: string;
  count: number;
  percentage: number;
  gradient: string;
}

export function getConvScaleSegments(records: ConvRecord[]): ScaleSeg[] {
  if (!records.length) return [];
  const total = records.length;

  const segments = [
    { label: 'SMS · Outbound', fn: (r: ConvRecord) => r.messageType === 'SMS' && r.direction === 'outbound', gradient: 'linear-gradient(90deg,#0d9e7e,#2563eb)' },
    { label: 'SMS · Inbound (Replies)', fn: (r: ConvRecord) => r.messageType === 'SMS' && r.direction === 'inbound', gradient: 'linear-gradient(90deg,#2563eb,#7c3aed)' },
    { label: 'Email · Automation', fn: (r: ConvRecord) => r.messageType === 'Email' && r.sourceType === 'AUTOMATION', gradient: 'linear-gradient(90deg,#7c3aed,#d97706)' },
    { label: 'Agent / Manual (SMS)', fn: (r: ConvRecord) => r.sourceType === 'AGENT / MANUAL', gradient: 'linear-gradient(90deg,#d97706,#0d9e7e)' },
    { label: 'Opt-Outs (STOP)', fn: (r: ConvRecord) => r.lastMessageBody.toUpperCase().trim() === 'STOP', gradient: 'linear-gradient(90deg,#dc2626,#d97706)' },
    { label: 'Unread / In Inbox', fn: (r: ConvRecord) => r.unreadCount > 0, gradient: 'linear-gradient(90deg,#0891b2,#059669)' },
  ];

  return segments.map((s) => {
    const count = records.filter(s.fn).length;
    return {
      label: s.label,
      count,
      percentage: (count / total) * 100,
      gradient: s.gradient,
    };
  });
}

// ─── Table rows ────────────────────────────────────────────

export function getConvTableRows(records: ConvRecord[]): ConvTableRow[] {
  return [...records]
    .sort((a, b) => b.dateOnly.localeCompare(a.dateOnly))
    .map((r) => ({
      id: r.id,
      dateOnly: r.dateOnly,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      messageType: r.messageType,
      direction: r.direction,
      sourceType: r.sourceType,
      bodyPreview:
        r.lastMessageBody.length > 60
          ? r.lastMessageBody.slice(0, 60) + '…'
          : r.lastMessageBody,
      unreadCount: r.unreadCount,
    }));
}
