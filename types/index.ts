// ============================================================
// types/index.ts
// Central type definitions for Genesis Dashboard
// ============================================================

/** A single communication record (email or SMS) */
export interface CommRecord {
  date: string;           // ISO date string "YYYY-MM-DD"
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'received' | 'failed';
  channel: 'email' | 'sms';
}

/** A single contact record */
export interface ContactRecord {
  date: string;           // ISO date string "YYYY-MM-DD"
  month: string;          // "YYYY-MM"
  day_of_week: string;
  hour: number;           // 0–23
  first_name: string;
  has_email: 0 | 1;
  has_phone: 0 | 1;
  has_tags: 0 | 1;
  domain: string;
}

/** Date range filter state */
export interface DateRange {
  from: string;  // ISO date string
  to: string;    // ISO date string
}

/** Preset pill definition */
export interface DatePreset {
  label: string;
  key: string;
  from: string;
  to: string;
}

/** Theme mode */
export type Theme = 'light' | 'dark';

/** API response wrapper */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
}

/** Communications analytics summary */
export interface CommSummary {
  total: number;
  email: number;
  sms: number;
  emailPct: string;
  smsPct: string;
}

/** Contact analytics summary */
export interface ContactSummary {
  total: number;
  withPhone: number;
  withEmail: number;
  withBoth: number;
  missingPhone: number;
  phonePct: string;
  emailPct: string;
}

/** Scale chart segment */
export interface ScaleSegment {
  label: string;
  count: number;
  percentage: number;
  gradient: string;
}

/** Domain count */
export interface DomainCount {
  domain: string;
  count: number;
}
