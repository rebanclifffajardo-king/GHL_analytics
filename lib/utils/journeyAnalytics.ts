// ============================================================
// lib/utils/journeyAnalytics.ts
//
// Pure analytics functions for the Journey dashboard tab.
// All functions are side-effect-free and fully typed.
// ============================================================

import type {
  JourneyRecord,
  UniqueVisitor,
  DailyStats,
  PageCount,
  StateCount,
  CityCount,
  JourneySummary,
  JourneyFilter,
  BebackSegment,
} from '@/types/journey';

// ─── Filtering ────────────────────────────────────────────

/** Apply all active filters to the raw records array */
export function applyJourneyFilters(
  records: JourneyRecord[],
  filter: JourneyFilter
): JourneyRecord[] {
  return records.filter((r) => {
    if (filter.dateFrom && r.dateOnly < filter.dateFrom) return false;
    if (filter.dateTo && r.dateOnly > filter.dateTo) return false;
    if (filter.state && r.state !== filter.state) return false;
    if (filter.bebackMin > 0 && r.bebacks < filter.bebackMin) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const match =
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

// ─── Unique visitors ───────────────────────────────────────

/** Deduplicate records by personId, keeping richest data per visitor */
export function getUniqueVisitors(records: JourneyRecord[]): UniqueVisitor[] {
  const map = new Map<string, UniqueVisitor>();

  for (const r of records) {
    const existing = map.get(r.personId);
    if (!existing) {
      map.set(r.personId, {
        personId: r.personId,
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        bebacks: r.bebacks,
        phone: r.phone,
        gender: r.gender,
        city: r.city,
        state: r.state,
        address: r.address,
        zip: r.zip,
        visitCount: 1,
        lastSeen: r.dateOnly,
      });
    } else {
      // Keep max bebacks and latest date
      existing.visitCount++;
      if (r.bebacks > existing.bebacks) existing.bebacks = r.bebacks;
      if (r.dateOnly > existing.lastSeen) existing.lastSeen = r.dateOnly;
    }
  }

  return Array.from(map.values());
}

// ─── Summary KPIs ─────────────────────────────────────────

export function computeJourneySummary(records: JourneyRecord[]): JourneySummary {
  const unique = getUniqueVisitors(records);
  const totalVisits = records.length;
  const uniqueVisitors = unique.length;
  const avgBebacks = unique.length
    ? parseFloat((unique.reduce((a, v) => a + v.bebacks, 0) / unique.length).toFixed(1))
    : 0;
  const returningVisitors = unique.filter((v) => v.bebacks > 1).length;

  // Top state by unique visitors
  const stateCounts: Record<string, number> = {};
  unique.forEach((v) => { if (v.state) stateCounts[v.state] = (stateCounts[v.state] || 0) + 1; });
  const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  // Top city
  const cityCounts: Record<string, number> = {};
  unique.forEach((v) => { if (v.city) cityCounts[v.city] = (cityCounts[v.city] || 0) + 1; });
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  // Date range
  const dates = records.map((r) => r.dateOnly).sort();
  const dateRange = dates.length
    ? `${fmtJourneyDate(dates[0])} – ${fmtJourneyDate(dates[dates.length - 1])}`
    : '—';

  return { totalVisits, uniqueVisitors, avgBebacks, returningVisitors, topState, topCity, dateRange };
}

// ─── Daily stats ───────────────────────────────────────────

export function getDailyStats(records: JourneyRecord[]): DailyStats[] {
  const byDate = new Map<string, Set<string>>();

  for (const r of records) {
    if (!byDate.has(r.dateOnly)) byDate.set(r.dateOnly, new Set());
    byDate.get(r.dateOnly)!.add(r.personId);
  }

  // Count raw visits per date
  const visitsByDate = new Map<string, number>();
  for (const r of records) {
    visitsByDate.set(r.dateOnly, (visitsByDate.get(r.dateOnly) || 0) + 1);
  }

  return Array.from(byDate.keys())
    .sort()
    .map((date) => ({
      date,
      totalVisits: visitsByDate.get(date) || 0,
      uniqueVisitors: byDate.get(date)!.size,
    }));
}

// ─── Beback segments ───────────────────────────────────────

export function getBebackSegments(visitors: UniqueVisitor[]): {
  labels: BebackSegment[];
  values: number[];
} {
  const segments: Record<BebackSegment, number> = {
    'First Visit': 0,
    '2–3 Visits': 0,
    '4–6 Visits': 0,
    '7+ Visits': 0,
  };

  for (const v of visitors) {
    if (v.bebacks === 1) segments['First Visit']++;
    else if (v.bebacks <= 3) segments['2–3 Visits']++;
    else if (v.bebacks <= 6) segments['4–6 Visits']++;
    else segments['7+ Visits']++;
  }

  return {
    labels: Object.keys(segments) as BebackSegment[],
    values: Object.values(segments),
  };
}

/** Bar chart data: bebacks value distribution (1–11) */
export function getBebackDistribution(visitors: UniqueVisitor[]): {
  labels: string[];
  values: number[];
} {
  const counts: Record<number, number> = {};
  for (const v of visitors) {
    counts[v.bebacks] = (counts[v.bebacks] || 0) + 1;
  }
  const keys = Object.keys(counts).map(Number).sort((a, b) => a - b);
  return {
    labels: keys.map((k) => `${k} visit${k === 1 ? '' : 's'}`),
    values: keys.map((k) => counts[k]),
  };
}

// ─── Page distribution ─────────────────────────────────────

/** Page labels made human-readable */
function labelPage(page: string): string {
  if (page === '/') return 'Home';
  if (page === '/apply') return 'Apply';
  if (page === '/book') return 'Book';
  if (page === '/vsl') return 'VSL';
  if (page === '/thank-you') return 'Thank You';
  if (page.startsWith('/preview')) return 'Preview' + page.replace('/preview', '') || ' Home';
  return page;
}

export function getPageCounts(records: JourneyRecord[]): PageCount[] {
  const counts: Record<string, number> = {};
  for (const r of records) {
    const lbl = labelPage(r.page);
    counts[lbl] = (counts[lbl] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Geographic ───────────────────────────────────────────

export function getStateCounts(visitors: UniqueVisitor[]): StateCount[] {
  const counts: Record<string, { count: number; unique: number }> = {};
  for (const v of visitors) {
    if (!v.state) continue;
    if (!counts[v.state]) counts[v.state] = { count: 0, unique: 0 };
    counts[v.state].count += v.visitCount;
    counts[v.state].unique++;
  }
  return Object.entries(counts)
    .map(([state, { count, unique }]) => ({ state, count, uniqueVisitors: unique }))
    .sort((a, b) => b.uniqueVisitors - a.uniqueVisitors);
}

export function getCityCounts(visitors: UniqueVisitor[], limit = 10): CityCount[] {
  const counts: Record<string, { city: string; state: string; count: number }> = {};
  for (const v of visitors) {
    if (!v.city) continue;
    const key = `${v.city},${v.state}`;
    if (!counts[key]) counts[key] = { city: v.city, state: v.state, count: 0 };
    counts[key].count++;
  }
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ─── Gender ───────────────────────────────────────────────

export function getGenderSplit(visitors: UniqueVisitor[]): { labels: string[]; values: number[] } {
  const counts: Record<string, number> = {};
  for (const v of visitors) {
    const g = v.gender || 'Unknown';
    counts[g] = (counts[g] || 0) + 1;
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return { labels: entries.map(([l]) => l), values: entries.map(([, v]) => v) };
}

// ─── Top returning users ───────────────────────────────────

export function getTopReturningUsers(visitors: UniqueVisitor[], limit = 10): UniqueVisitor[] {
  return [...visitors].sort((a, b) => b.bebacks - a.bebacks || b.visitCount - a.visitCount).slice(0, limit);
}

// ─── Helpers ──────────────────────────────────────────────

/** Format ISO date "YYYY-MM-DD" → "May 6" */
export function fmtJourneyDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Percentage of total */
export function journeyPct(n: number, total: number): string {
  if (!total) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
}

/** Avatar colour from a string */
export function journeyAvatarColor(s: string): string {
  const colors = ['#0d9e7e', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#0891b2', '#059669', '#9333ea'];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

/** Get all unique states in the dataset */
export function getUniqueStates(records: JourneyRecord[]): string[] {
  return Array.from(new Set(records.map((r) => r.state).filter(Boolean))).sort();
}
