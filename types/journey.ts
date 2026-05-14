// ============================================================
// types/journey.ts
// Type definitions for the Journey dashboard tab
// ============================================================

/** A single visitor journey record (one page visit) */
export interface JourneyRecord {
  dateOnly: string;       // "YYYY-MM-DD"
  personId: string;       // unique visitor ID
  firstName: string;
  lastName: string;
  email: string;
  bebacks: number;        // total return visits for this person
  phone: string;
  gender: string;         // "Male" | "Female" | ""
  address: string;
  city: string;
  state: string;
  zip: string;
  page: string;           // cleaned page path e.g. "/" | "/book" | "/apply"
}

/** Aggregated unique visitor (deduplicated by personId) */
export interface UniqueVisitor {
  personId: string;
  firstName: string;
  lastName: string;
  email: string;
  bebacks: number;
  phone: string;
  gender: string;
  city: string;
  state: string;
  address: string;
  zip: string;
  visitCount: number;     // number of raw visit records for this person
  lastSeen: string;       // most recent dateOnly
}

/** Beback engagement segment */
export type BebackSegment = 'First Visit' | '2–3 Visits' | '4–6 Visits' | '7+ Visits';

/** Daily stats for line chart */
export interface DailyStats {
  date: string;
  totalVisits: number;
  uniqueVisitors: number;
}

/** Page path visit count */
export interface PageCount {
  page: string;
  count: number;
}

/** State visitor count */
export interface StateCount {
  state: string;
  count: number;
  uniqueVisitors: number;
}

/** City visitor count */
export interface CityCount {
  city: string;
  state: string;
  count: number;
}

/** Journey summary KPIs */
export interface JourneySummary {
  totalVisits: number;
  uniqueVisitors: number;
  avgBebacks: number;
  returningVisitors: number;   // bebacks > 1
  topState: string;
  topCity: string;
  dateRange: string;
}

/** Filter state for Journey tab */
export interface JourneyFilter {
  dateFrom: string;
  dateTo: string;
  state: string;          // "" = all
  bebackMin: number;      // 0 = all
  search: string;         // name/email search
}
