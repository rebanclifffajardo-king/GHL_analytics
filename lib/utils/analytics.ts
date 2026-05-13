// ============================================================
// lib/utils/analytics.ts
//
// Pure utility functions for computing chart data and summaries
// from ContactRecord[] and CommRecord[].
// These mirror the JS logic from the original index.html.
// ============================================================

import type {
  ContactRecord,
  CommRecord,
  DateRange,
  CommSummary,
  ContactSummary,
  ScaleSegment,
  DomainCount,
} from '@/types';

// ─── Formatting helpers ────────────────────────────────────

/** Format ISO date string to "May 13" */
export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Format a number as a percentage of total, e.g. "73.5%" */
export function pct(n: number, total: number): string {
  if (!total) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
}

/** Generate avatar initials color based on name */
export function avatarColor(name: string): string {
  const colors = [
    '#0d9e7e', '#2563eb', '#7c3aed', '#d97706',
    '#dc2626', '#0891b2', '#059669', '#9333ea',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ─── Filtering ────────────────────────────────────────────

/** Filter contacts by date range */
export function filterContacts(
  contacts: ContactRecord[],
  range: DateRange
): ContactRecord[] {
  return contacts.filter((c) => c.date >= range.from && c.date <= range.to);
}

/** Filter communications by date range */
export function filterComms(
  comms: CommRecord[],
  range: DateRange
): CommRecord[] {
  return comms.filter((c) => c.date >= range.from && c.date <= range.to);
}

// ─── Contact analytics ─────────────────────────────────────

/** Compute contact summary metrics */
export function computeContactSummary(contacts: ContactRecord[]): ContactSummary {
  const total = contacts.length;
  const withPhone = contacts.filter((c) => c.has_phone).length;
  const withEmail = contacts.filter((c) => c.has_email).length;
  const withBoth = contacts.filter((c) => c.has_email && c.has_phone).length;
  const missingPhone = contacts.filter((c) => c.has_email && !c.has_phone).length;
  return {
    total,
    withPhone,
    withEmail,
    withBoth,
    missingPhone,
    phonePct: pct(withPhone, total),
    emailPct: pct(withEmail, total),
  };
}

/** Get domain counts sorted descending */
export function getDomainCounts(contacts: ContactRecord[]): DomainCount[] {
  const map: Record<string, number> = {};
  contacts.forEach((c) => {
    if (c.domain) map[c.domain] = (map[c.domain] || 0) + 1;
  });
  return Object.entries(map)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);
}

/** Contacts added by hour (0–23) */
export function getContactsByHour(contacts: ContactRecord[]): number[] {
  const hours = Array(24).fill(0);
  contacts.forEach((c) => hours[c.hour]++);
  return hours;
}

/** Top N domain counts */
export function getTopDomains(contacts: ContactRecord[], n = 8): DomainCount[] {
  return getDomainCounts(contacts).slice(0, n);
}

/** Domain scale segments for progress bar visualization */
export function getDomainScaleSegments(contacts: ContactRecord[]): ScaleSegment[] {
  const top = getTopDomains(contacts, 6);
  const max = top[0]?.count || 1;
  const gradients = [
    'linear-gradient(90deg,#0d9e7e,#2563eb)',
    'linear-gradient(90deg,#2563eb,#7c3aed)',
    'linear-gradient(90deg,#7c3aed,#d97706)',
    'linear-gradient(90deg,#d97706,#0d9e7e)',
    'linear-gradient(90deg,#0d9e7e,#dc2626)',
    'linear-gradient(90deg,#2563eb,#0d9e7e)',
  ];
  return top.map((d, i) => ({
    label: d.domain,
    count: d.count,
    percentage: (d.count / max) * 100,
    gradient: gradients[i % gradients.length],
  }));
}

// ─── Comm analytics ────────────────────────────────────────

/** Compute communications summary metrics */
export function computeCommSummary(comms: CommRecord[]): CommSummary {
  const total = comms.length;
  const email = comms.filter((c) => c.channel === 'email').length;
  const sms = comms.filter((c) => c.channel === 'sms').length;
  return {
    total,
    email,
    sms,
    emailPct: pct(email, total),
    smsPct: pct(sms, total),
  };
}

/** Daily message volume by channel for line chart */
export function getDailyVolume(comms: CommRecord[]): {
  dates: string[];
  email: number[];
  sms: number[];
} {
  const map: Record<string, { email: number; sms: number }> = {};
  comms.forEach((r) => {
    if (!map[r.date]) map[r.date] = { email: 0, sms: 0 };
    map[r.date][r.channel]++;
  });
  const dates = Object.keys(map).sort();
  return {
    dates,
    email: dates.map((d) => map[d].email),
    sms: dates.map((d) => map[d].sms),
  };
}

/** Weekly volume grouped by "W1 May", "W2 May" etc. */
export function getWeeklyVolume(comms: CommRecord[]): {
  weeks: string[];
  email: number[];
  sms: number[];
} {
  const w: Record<string, { email: number; sms: number }> = {};
  comms.forEach((r) => {
    const dt = new Date(r.date + 'T00:00:00');
    const wk = `W${Math.ceil(dt.getDate() / 7)} May`;
    if (!w[wk]) w[wk] = { email: 0, sms: 0 };
    w[wk][r.channel]++;
  });
  const weeks = Object.keys(w).sort();
  return {
    weeks,
    email: weeks.map((k) => w[k].email),
    sms: weeks.map((k) => w[k].sms),
  };
}

/** Direction summary by date for table */
export function getDirectionByDate(comms: CommRecord[]): Array<{
  date: string;
  inbound: number;
  outbound: number;
  total: number;
}> {
  const map: Record<string, { inbound: number; outbound: number }> = {};
  comms.forEach((r) => {
    if (!map[r.date]) map[r.date] = { inbound: 0, outbound: 0 };
    r.direction === 'inbound' ? map[r.date].inbound++ : map[r.date].outbound++;
  });
  return Object.keys(map)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({
      date,
      inbound: map[date].inbound,
      outbound: map[date].outbound,
      total: map[date].inbound + map[date].outbound,
    }));
}

/** Scale chart segments for comms */
export function getCommScaleSegments(comms: CommRecord[]): ScaleSegment[] {
  const max = comms.length || 1;
  const segs = [
    { label: 'Email · Sent', fn: (r: CommRecord) => r.channel === 'email' && r.status === 'sent', gradient: 'linear-gradient(90deg,#0d9e7e,#2563eb)' },
    { label: 'Email · Received', fn: (r: CommRecord) => r.channel === 'email' && r.status === 'received', gradient: 'linear-gradient(90deg,#2563eb,#7c3aed)' },
    { label: 'Email · Failed', fn: (r: CommRecord) => r.channel === 'email' && r.status === 'failed', gradient: 'linear-gradient(90deg,#dc2626,#d97706)' },
    { label: 'SMS · Sent', fn: (r: CommRecord) => r.channel === 'sms' && r.status === 'sent', gradient: 'linear-gradient(90deg,#0d9e7e,#7c3aed)' },
    { label: 'SMS · Received', fn: (r: CommRecord) => r.channel === 'sms' && r.status === 'received', gradient: 'linear-gradient(90deg,#d97706,#0d9e7e)' },
    { label: 'SMS · Failed', fn: (r: CommRecord) => r.channel === 'sms' && r.status === 'failed', gradient: 'linear-gradient(90deg,#dc2626,#7c3aed)' },
    { label: 'Inbound Total', fn: (r: CommRecord) => r.direction === 'inbound', gradient: 'linear-gradient(90deg,#2563eb,#0d9e7e)' },
    { label: 'Outbound Total', fn: (r: CommRecord) => r.direction === 'outbound', gradient: 'linear-gradient(90deg,#7c3aed,#2563eb)' },
  ];
  return segs.map((s) => {
    const count = comms.filter(s.fn).length;
    return {
      label: s.label,
      count,
      percentage: (count / max) * 100,
      gradient: s.gradient,
    };
  });
}

/** Contact completeness pie segments */
export function getCompletenessPie(contacts: ContactRecord[]): {
  labels: string[];
  values: number[];
} {
  const both = contacts.filter((c) => c.has_email && c.has_phone).length;
  const emailOnly = contacts.filter((c) => c.has_email && !c.has_phone).length;
  const phoneOnly = contacts.filter((c) => !c.has_email && c.has_phone).length;
  const neither = contacts.filter((c) => !c.has_email && !c.has_phone).length;
  return {
    labels: ['Email + Phone', 'Email Only', 'Phone Only', 'Incomplete'],
    values: [both, emailOnly, phoneOnly, neither],
  };
}
