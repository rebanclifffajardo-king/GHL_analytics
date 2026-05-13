// ============================================================
// lib/api/dataService.ts
//
// Data service layer. Switches between mock and real API
// based on the USE_MOCK_DATA flag in config.ts.
//
// TO CONNECT REAL API:
//   1. Set USE_MOCK_DATA = false in lib/api/config.ts
//   2. Set API_BASE_URL and API_HEADERS in config.ts
//   3. This file will automatically call your real endpoints
// ============================================================

import {
  USE_MOCK_DATA,
  API_BASE_URL,
  DEFAULT_FETCH_OPTIONS,
  ENDPOINTS,
  API_TIMEOUT_MS,
} from './config';
import { MOCK_CONTACTS, MOCK_COMMS } from './mockData';
import type { ContactRecord, CommRecord } from '@/types';

/**
 * Generic fetch wrapper with timeout and error handling.
 * Used for all real API calls.
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...DEFAULT_FETCH_OPTIONS,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${API_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch all contact records.
 *
 * Real API: GET {API_BASE_URL}/contacts/
 * Expected response: ContactRecord[] (or wrapped in { contacts: [...] })
 *
 * TODO: Adjust the response mapping below to match your actual API shape.
 */
export async function fetchContacts(): Promise<ContactRecord[]> {
  if (USE_MOCK_DATA) {
    // Simulate realistic network delay in dev
    await new Promise((r) => setTimeout(r, 120));
    return MOCK_CONTACTS;
  }

  // Real API call — adjust response mapping to match your API shape:
  const data = await apiFetch<ContactRecord[] | { contacts: ContactRecord[] }>(
    ENDPOINTS.contacts
  );

  // Handle both flat array or wrapped response:
  return Array.isArray(data) ? data : data.contacts;
}

/**
 * Fetch all communication records.
 *
 * Real API: GET {API_BASE_URL}/conversations/
 * Expected response: CommRecord[] (or wrapped in { conversations: [...] })
 *
 * TODO: Adjust the response mapping below to match your actual API shape.
 */
export async function fetchCommunications(): Promise<CommRecord[]> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_COMMS;
  }

  const data = await apiFetch<CommRecord[] | { conversations: CommRecord[] }>(
    ENDPOINTS.communications
  );

  return Array.isArray(data) ? data : data.conversations;
}
