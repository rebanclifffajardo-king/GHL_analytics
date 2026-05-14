// components/journey/JourneyFilterBar.tsx
'use client';

import { useState } from 'react';
import type { JourneyFilter } from '@/types/journey';
import { fmtJourneyDate } from '@/lib/utils/journeyAnalytics';

interface JourneyFilterBarProps {
  filter: JourneyFilter;
  allStates: string[];
  onUpdate: (patch: Partial<JourneyFilter>) => void;
  onReset: () => void;
  searchInput: string;
  onSearch: (q: string) => void;
}

const BEBACK_OPTIONS = [
  { label: 'All Visits', value: 0 },
  { label: 'Returning (2+)', value: 2 },
  { label: 'Engaged (4+)', value: 4 },
  { label: 'Loyal (7+)', value: 7 },
];

export default function JourneyFilterBar({
  filter,
  allStates,
  onUpdate,
  onReset,
  searchInput,
  onSearch,
}: JourneyFilterBarProps) {
  const [localFrom, setLocalFrom] = useState(filter.dateFrom);
  const [localTo, setLocalTo] = useState(filter.dateTo);

  function handleApplyDates() {
    if (localFrom <= localTo) {
      onUpdate({ dateFrom: localFrom, dateTo: localTo });
    }
  }

  const activeLabel = `${fmtJourneyDate(filter.dateFrom)} – ${fmtJourneyDate(filter.dateTo)}`;

  return (
    <div className="filter-bar">
      {/* Row 1: dates + state + search */}
      <div className="filter-top" style={{ flexWrap: 'wrap', gap: 12 }}>
        <span className="filter-lbl">📅 Date</span>
        <div className="filter-divider" />

        <div className="date-range-group">
          <div className="date-input-wrap">
            <label htmlFor="jDateFrom">From</label>
            <input
              type="date"
              id="jDateFrom"
              value={localFrom}
              min="2026-05-01"
              max="2026-05-14"
              onChange={(e) => setLocalFrom(e.target.value)}
            />
          </div>
          <span className="date-sep">→</span>
          <div className="date-input-wrap">
            <label htmlFor="jDateTo">To</label>
            <input
              type="date"
              id="jDateTo"
              value={localTo}
              min="2026-05-01"
              max="2026-05-14"
              onChange={(e) => setLocalTo(e.target.value)}
            />
          </div>
          <button className="apply-btn" onClick={handleApplyDates}>Apply</button>
        </div>

        <div className="filter-divider" />

        {/* State filter */}
        <div className="date-input-wrap">
          <label htmlFor="jState">State</label>
          <select
            id="jState"
            value={filter.state}
            onChange={(e) => onUpdate({ state: e.target.value })}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--mono)',
              fontSize: '0.72rem',
              color: 'var(--text)',
              cursor: 'pointer',
              minWidth: 80,
            }}
          >
            <option value="">All States</option>
            {allStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="date-input-wrap" style={{ flex: '1 1 200px', maxWidth: 280 }}>
          <label htmlFor="jSearch">🔍</label>
          <input
            id="jSearch"
            type="text"
            placeholder="Search name, email, city…"
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--mono)',
              fontSize: '0.72rem',
              color: 'var(--text)',
              width: '100%',
            }}
          />
        </div>

        <span className="filter-active-range">{activeLabel}</span>
        <button className="clear-btn" onClick={onReset}>Reset</button>
      </div>

      {/* Row 2: beback engagement presets */}
      <div className="presets">
        <span className="preset-lbl">Engagement:</span>
        {BEBACK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`pill${filter.bebackMin === opt.value ? ' active' : ''}`}
            onClick={() => onUpdate({ bebackMin: opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
