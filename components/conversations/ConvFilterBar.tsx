// components/conversations/ConvFilterBar.tsx
'use client';

import { useState } from 'react';
import type { ConvFilter } from '@/types/conversations';
import { fmtConvDate } from '@/lib/utils/convAnalytics';

interface ConvFilterBarProps {
  filter: ConvFilter;
  onUpdate: (patch: Partial<ConvFilter>) => void;
  onReset: () => void;
  searchInput: string;
  onSearch: (q: string) => void;
}

const MSG_TYPE_PILLS = [
  { label: 'All Channels', value: '' },
  { label: 'SMS Only', value: 'SMS' },
  { label: 'Email Only', value: 'Email' },
] as const;

const DIR_PILLS = [
  { label: 'All Directions', value: '' },
  { label: 'Outbound', value: 'outbound' },
  { label: 'Inbound', value: 'inbound' },
] as const;

const SOURCE_PILLS = [
  { label: 'All Sources', value: '' },
  { label: 'Agent / Manual', value: 'AGENT / MANUAL' },
  { label: 'Automation', value: 'AUTOMATION' },
  { label: 'Customer Reply', value: 'CUSTOMER REPLY' },
] as const;

export default function ConvFilterBar({
  filter,
  onUpdate,
  onReset,
  searchInput,
  onSearch,
}: ConvFilterBarProps) {
  const [localFrom, setLocalFrom] = useState(filter.dateFrom);
  const [localTo, setLocalTo] = useState(filter.dateTo);

  function handleApply() {
    if (localFrom <= localTo) onUpdate({ dateFrom: localFrom, dateTo: localTo });
  }

  const activeLabel = `${fmtConvDate(filter.dateFrom)} – ${fmtConvDate(filter.dateTo)}`;

  return (
    <div className="filter-bar">
      {/* Row 1: dates + search */}
      <div className="filter-top">
        <span className="filter-lbl">📅 Date</span>
        <div className="filter-divider" />

        <div className="date-range-group">
          <div className="date-input-wrap">
            <label htmlFor="cvFrom">From</label>
            <input
              type="date" id="cvFrom" value={localFrom}
              min="2026-05-07" max="2026-05-15"
              onChange={(e) => setLocalFrom(e.target.value)}
            />
          </div>
          <span className="date-sep">→</span>
          <div className="date-input-wrap">
            <label htmlFor="cvTo">To</label>
            <input
              type="date" id="cvTo" value={localTo}
              min="2026-05-07" max="2026-05-15"
              onChange={(e) => setLocalTo(e.target.value)}
            />
          </div>
          <button className="apply-btn" onClick={handleApply}>Apply</button>
          <button className="clear-btn" onClick={onReset}>Reset</button>
        </div>

        {/* Search */}
        <div className="date-input-wrap" style={{ flex: '1 1 180px', maxWidth: 260 }}>
          <label htmlFor="cvSearch">🔍</label>
          <input
            id="cvSearch" type="text"
            placeholder="Search name, email, phone…"
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text)', width: '100%' }}
          />
        </div>

        <span className="filter-active-range">{activeLabel}</span>
      </div>

      {/* Row 2: quick-filter pills */}
      <div className="presets" style={{ gap: 12 }}>
        <span className="preset-lbl">Channel:</span>
        {MSG_TYPE_PILLS.map((p) => (
          <button key={p.value} className={`pill${filter.messageType === p.value ? ' active' : ''}`}
            onClick={() => onUpdate({ messageType: p.value as ConvFilter['messageType'] })}>
            {p.label}
          </button>
        ))}

        <div className="filter-divider" />

        <span className="preset-lbl">Direction:</span>
        {DIR_PILLS.map((p) => (
          <button key={p.value} className={`pill${filter.direction === p.value ? ' active' : ''}`}
            onClick={() => onUpdate({ direction: p.value as ConvFilter['direction'] })}>
            {p.label}
          </button>
        ))}

        <div className="filter-divider" />

        <span className="preset-lbl">Source:</span>
        {SOURCE_PILLS.map((p) => (
          <button key={p.value} className={`pill${filter.sourceType === p.value ? ' active' : ''}`}
            onClick={() => onUpdate({ sourceType: p.value as ConvFilter['sourceType'] })}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
