// ============================================================
// lib/hooks/useJourneyData.ts
//
// Central data hook for the Journey dashboard tab.
// Loads the raw records, applies filters, and returns all
// derived analytics needed for charts and tables.
// ============================================================

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { JOURNEY_RECORDS } from '@/lib/api/journeyData';
import {
  applyJourneyFilters,
  getUniqueVisitors,
  computeJourneySummary,
  getDailyStats,
  getBebackSegments,
  getBebackDistribution,
  getPageCounts,
  getStateCounts,
  getCityCounts,
  getGenderSplit,
  getTopReturningUsers,
  getUniqueStates,
} from '@/lib/utils/journeyAnalytics';
import type { JourneyFilter } from '@/types/journey';

const DEFAULT_FILTER: JourneyFilter = {
  dateFrom: '2026-05-01',
  dateTo: '2026-05-14',
  state: '',
  bebackMin: 0,
  search: '',
};

export function useJourneyData() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<JourneyFilter>(DEFAULT_FILTER);
  const [searchInput, setSearchInput] = useState('');

  // Simulate async load (data is bundled, but we still yield
  // to the paint cycle so the tab switches feel snappy)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Filtered raw records ────────────────────────────────
  const filteredRecords = useMemo(
    () => applyJourneyFilters(JOURNEY_RECORDS, filter),
    [filter]
  );

  // ── Unique visitors from filtered records ───────────────
  const uniqueVisitors = useMemo(
    () => getUniqueVisitors(filteredRecords),
    [filteredRecords]
  );

  // ── All derived analytics ───────────────────────────────
  const summary = useMemo(() => computeJourneySummary(filteredRecords), [filteredRecords]);
  const dailyStats = useMemo(() => getDailyStats(filteredRecords), [filteredRecords]);
  const bebackSegments = useMemo(() => getBebackSegments(uniqueVisitors), [uniqueVisitors]);
  const bebackDistribution = useMemo(() => getBebackDistribution(uniqueVisitors), [uniqueVisitors]);
  const pageCounts = useMemo(() => getPageCounts(filteredRecords), [filteredRecords]);
  const stateCounts = useMemo(() => getStateCounts(uniqueVisitors), [uniqueVisitors]);
  const cityCounts = useMemo(() => getCityCounts(uniqueVisitors, 10), [uniqueVisitors]);
  const genderSplit = useMemo(() => getGenderSplit(uniqueVisitors), [uniqueVisitors]);
  const topReturning = useMemo(() => getTopReturningUsers(uniqueVisitors, 10), [uniqueVisitors]);

  // Available states for filter dropdown
  const allStates = useMemo(() => getUniqueStates(JOURNEY_RECORDS), []);

  // ── Filter actions ──────────────────────────────────────
  const updateFilter = useCallback((patch: Partial<JourneyFilter>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setSearchInput('');
  }, []);

  const applySearch = useCallback((q: string) => {
    setSearchInput(q);
    setFilter((prev) => ({ ...prev, search: q }));
  }, []);

  return {
    loading,
    filter,
    searchInput,

    // Filtered data
    filteredRecords,
    uniqueVisitors,

    // Analytics
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

    // Total (unfiltered) for context
    totalRaw: JOURNEY_RECORDS.length,

    // Actions
    updateFilter,
    resetFilter,
    applySearch,
  };
}
