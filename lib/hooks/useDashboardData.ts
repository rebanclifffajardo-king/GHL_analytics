// ============================================================
// lib/hooks/useDashboardData.ts
//
// Central data hook. Fetches contacts + comms, applies
// date-range filtering, and returns all derived analytics.
// ============================================================

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchContacts, fetchCommunications } from '@/lib/api/dataService';
import {
  filterContacts,
  filterComms,
  computeContactSummary,
  computeCommSummary,
  getDailyVolume,
  getWeeklyVolume,
  getDirectionByDate,
  getCommScaleSegments,
  getCompletenessPie,
  getDomainCounts,
  getContactsByHour,
  getTopDomains,
  getDomainScaleSegments,
} from '@/lib/utils/analytics';
import type { ContactRecord, CommRecord, DateRange } from '@/types';

const DEFAULT_RANGE: DateRange = { from: '2026-05-01', to: '2026-05-31' };

export function useDashboardData() {
  // ── Raw data state ──────────────────────────────────────
  const [allContacts, setAllContacts] = useState<ContactRecord[]>([]);
  const [allComms, setAllComms] = useState<CommRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filter state ────────────────────────────────────────
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_RANGE);
  const [activePreset, setActivePreset] = useState<string>('all');

  // ── Load data on mount ──────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [contacts, comms] = await Promise.all([
          fetchContacts(),
          fetchCommunications(),
        ]);
        setAllContacts(contacts);
        setAllComms(comms);
      } catch (err) {
        setError((err as Error).message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Filtered data (memoized) ────────────────────────────
  const contacts = useMemo(
    () => filterContacts(allContacts, dateRange),
    [allContacts, dateRange]
  );

  const comms = useMemo(
    () => filterComms(allComms, dateRange),
    [allComms, dateRange]
  );

  // ── Derived analytics (memoized) ───────────────────────
  const contactSummary = useMemo(() => computeContactSummary(contacts), [contacts]);
  const commSummary = useMemo(() => computeCommSummary(comms), [comms]);
  const dailyVolume = useMemo(() => getDailyVolume(comms), [comms]);
  const weeklyVolume = useMemo(() => getWeeklyVolume(comms), [comms]);
  const directionByDate = useMemo(() => getDirectionByDate(comms), [comms]);
  const commScaleSegments = useMemo(() => getCommScaleSegments(comms), [comms]);
  const completenessPie = useMemo(() => getCompletenessPie(contacts), [contacts]);
  const domainCounts = useMemo(() => getDomainCounts(contacts), [contacts]);
  const contactsByHour = useMemo(() => getContactsByHour(contacts), [contacts]);
  const topDomains = useMemo(() => getTopDomains(contacts, 8), [contacts]);
  const domainScaleSegments = useMemo(() => getDomainScaleSegments(contacts), [contacts]);

  // ── Filter actions ──────────────────────────────────────
  const applyDateRange = useCallback((range: DateRange) => {
    setDateRange(range);
    setActivePreset('custom');
  }, []);

  const applyPreset = useCallback((preset: string, from: string, to: string) => {
    setDateRange({ from, to });
    setActivePreset(preset);
  }, []);

  const resetFilter = useCallback(() => {
    setDateRange(DEFAULT_RANGE);
    setActivePreset('all');
  }, []);

  return {
    // State
    loading,
    error,
    dateRange,
    activePreset,

    // Filtered raw data
    contacts,
    comms,

    // Analytics
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

    // Actions
    applyDateRange,
    applyPreset,
    resetFilter,
  };
}
