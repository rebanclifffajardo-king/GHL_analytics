// components/ui/FilterBar.tsx
'use client';

import { useState } from 'react';
import type { DateRange } from '@/types';
import { fmtDate } from '@/lib/utils/analytics';

interface Preset {
  label: string;
  key: string;
  from: string;
  to: string;
}

const PRESETS: Preset[] = [
  { label: 'Full Month', key: 'all', from: '2026-05-01', to: '2026-05-31' },
  { label: 'First Half', key: 'first', from: '2026-05-01', to: '2026-05-15' },
  { label: 'Second Half', key: 'second', from: '2026-05-16', to: '2026-05-31' },
  { label: 'Week 1', key: 'week1', from: '2026-05-01', to: '2026-05-07' },
  { label: 'Week 2', key: 'week2', from: '2026-05-08', to: '2026-05-14' },
  { label: 'Week 3', key: 'week3', from: '2026-05-15', to: '2026-05-21' },
  { label: 'Week 4+', key: 'week4', from: '2026-05-22', to: '2026-05-31' },
  { label: 'Contacts Day', key: 'contacts', from: '2026-05-04', to: '2026-05-04' },
];

interface FilterBarProps {
  dateRange: DateRange;
  activePreset: string;
  onApply: (range: DateRange) => void;
  onPreset: (key: string, from: string, to: string) => void;
  onReset: () => void;
}

/**
 * Date range filter bar with manual inputs and preset pills.
 */
export default function FilterBar({
  dateRange,
  activePreset,
  onApply,
  onPreset,
  onReset,
}: FilterBarProps) {
  const [localFrom, setLocalFrom] = useState(dateRange.from);
  const [localTo, setLocalTo] = useState(dateRange.to);

  function handleApply() {
    if (localFrom && localTo && localFrom <= localTo) {
      onApply({ from: localFrom, to: localTo });
    }
  }

  function handlePreset(p: Preset) {
    setLocalFrom(p.from);
    setLocalTo(p.to);
    onPreset(p.key, p.from, p.to);
  }

  function handleReset() {
    setLocalFrom('2026-05-01');
    setLocalTo('2026-05-31');
    onReset();
  }

  const activeLabel = `${fmtDate(dateRange.from)} – ${fmtDate(dateRange.to)}, 2026`;

  return (
    <div className="filter-bar">
      <div className="filter-top">
        <span className="filter-lbl">📅 Date Range</span>
        <div className="filter-divider" />

        <div className="date-range-group">
          <div className="date-input-wrap">
            <label htmlFor="dateFrom">From</label>
            <input
              type="date"
              id="dateFrom"
              value={localFrom}
              min="2026-05-01"
              max="2026-05-31"
              onChange={(e) => setLocalFrom(e.target.value)}
            />
          </div>
          <span className="date-sep">→</span>
          <div className="date-input-wrap">
            <label htmlFor="dateTo">To</label>
            <input
              type="date"
              id="dateTo"
              value={localTo}
              min="2026-05-01"
              max="2026-05-31"
              onChange={(e) => setLocalTo(e.target.value)}
            />
          </div>
          <button className="apply-btn" onClick={handleApply}>Apply</button>
          <button className="clear-btn" onClick={handleReset}>Reset</button>
        </div>

        <span className="filter-active-range">{activeLabel}</span>
      </div>

      {/* Preset pills */}
      <div className="presets">
        <span className="preset-lbl">Quick:</span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            className={`pill${activePreset === p.key ? ' active' : ''}`}
            onClick={() => handlePreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
