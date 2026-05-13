// ============================================================
// lib/api/config.ts
//
// ✅ CENTRALIZED API CONFIGURATION
// ============================================================
// This is the single file you edit to connect to real APIs.
//
// STEPS TO CONNECT YOUR REAL API:
//  1. Set API_BASE_URL to your GHL or custom API base URL
//  2. Set your API_KEY / Bearer token in API_HEADERS
//  3. Update ENDPOINTS to match your API routes
//  4. Set USE_MOCK_DATA = false to switch from mock to live data
//
// Example for GoHighLevel (GHL):
//   API_BASE_URL = 'https://rest.gohighlevel.com/v1'
//   API_HEADERS['Authorization'] = 'Bearer YOUR_GHL_API_KEY'
//   ENDPOINTS.contacts = '/contacts/'
//   ENDPOINTS.conversations = '/conversations/'
// ============================================================

/** Toggle between mock data and real API */
export const USE_MOCK_DATA = true;

/** Your API base URL. Change this when connecting to a real backend. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rest.gohighlevel.com/v1';

/**
 * Default request headers sent with every API call.
 * Add your Authorization token here.
 *
 * Environment variables (set in .env.local):
 *   NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1
 *   NEXT_PUBLIC_API_KEY=your_token_here
 */
export const API_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  // Uncomment and set your auth token:
  // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
};

/**
 * API endpoint paths (relative to API_BASE_URL).
 * Update these to match your actual API routes.
 */
export const ENDPOINTS = {
  /** Returns CommRecord[] */
  communications: '/conversations/',

  /** Returns ContactRecord[] */
  contacts: '/contacts/',

  /** Optional: summary/analytics endpoint */
  summary: '/analytics/summary',
} as const;

/**
 * Default request options for fetch() calls.
 * Add query params, caching strategy, etc. here.
 */
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  method: 'GET',
  headers: API_HEADERS,
  // next: { revalidate: 60 }, // ISR: revalidate every 60s (Next.js only)
};

/** Timeout in milliseconds for API requests */
export const API_TIMEOUT_MS = 10_000;
