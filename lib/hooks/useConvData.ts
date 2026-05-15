// ============================================================
// lib/hooks/useConvData.ts
//
// Central data hook for the Conversations Overview.
// Loads CONV_RECORDS, applies filters, returns all derived
// analytics for every chart, KPI and table on the page.
// ============================================================

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CONV_RECORDS } from '@/lib/api/convData';
import {
  applyConvFilters,
  computeConvSummary,
  getConvDailyStats,
  getSmsTemplates,
  getSourceChannelRows,
  getConvScaleSegments,
  getConvTableRows,
} from '@/lib/utils/convAnalytics';
import type { ConvFilter } from '@/types/conversations';

const DEFAULT_FILTER: ConvFilter = {
  dateFrom: '2026-05-07',
  dateTo: '2026-05-15',
  messageType: '',
  direction: '',
  sourceType: '',
  search: '',
};

export function useConvData() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ConvFilter>(DEFAULT_FILTER);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Filtered records ────────────────────────────────────
  const records = useMemo(
    () => applyConvFilters(CONV_RECORDS, filter),
    [filter]
  );

  // ── Derived analytics ───────────────────────────────────
  const summary       = useMemo(() => computeConvSummary(records),     [records]);
  const dailyStats    = useMemo(() => getConvDailyStats(records),       [records]);
  const smsTemplates  = useMemo(() => getSmsTemplates(records),         [records]);
  const sourceChannel = useMemo(() => getSourceChannelRows(records),    [records]);
  const scaleSegments = useMemo(() => getConvScaleSegments(records),    [records]);
  const tableRows     = useMemo(() => getConvTableRows(records),        [records]);

  // ── Actions ─────────────────────────────────────────────
  const updateFilter = useCallback((patch: Partial<ConvFilter>) => {
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
    records,
    summary,
    dailyStats,
    smsTemplates,
    sourceChannel,
    scaleSegments,
    tableRows,
    totalRaw: CONV_RECORDS.length,
    updateFilter,
    resetFilter,
    applySearch,
  };
}
