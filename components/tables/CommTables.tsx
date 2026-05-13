// components/tables/CommTables.tsx
'use client';

import Badge from '@/components/ui/Badge';
import type { CommRecord } from '@/types';
import { fmtDate } from '@/lib/utils/analytics';

// ── All Records Table ──────────────────────────────────────

interface AllRecordsTableProps {
  records: CommRecord[];
}

export function AllRecordsTable({ records }: AllRecordsTableProps) {
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  if (!sorted.length) {
    return <div className="empty-state">📭 No records for this range</div>;
  }

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Channel</th>
            <th>Direction</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={`${r.date}-${r.channel}-${r.status}-${i}`}>
              <td style={{ color: 'var(--dim)' }}>{i + 1}</td>
              <td>{fmtDate(r.date)}</td>
              <td><Badge variant={r.channel} /></td>
              <td><Badge variant={r.direction} /></td>
              <td><Badge variant={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Direction Summary Table ────────────────────────────────

interface DirectionRow {
  date: string;
  inbound: number;
  outbound: number;
  total: number;
}

interface DirectionTableProps {
  rows: DirectionRow[];
}

export function DirectionTable({ rows }: DirectionTableProps) {
  if (!rows.length) {
    return <div className="empty-state">📭 No data for this range</div>;
  }

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Inbound</th>
            <th>Outbound</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.date}>
              <td>{fmtDate(r.date)}</td>
              <td style={{ color: 'var(--blue)' }}>{r.inbound}</td>
              <td style={{ color: 'var(--violet)' }}>{r.outbound}</td>
              <td style={{ color: 'var(--text)', fontWeight: 600 }}>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Email Records Table ────────────────────────────────────

interface ChannelTableProps {
  records: CommRecord[];
  channel: 'email' | 'sms';
}

export function ChannelTable({ records, channel }: ChannelTableProps) {
  const filtered = [...records]
    .filter((r) => r.channel === channel)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!filtered.length) {
    return <div className="empty-state">📭 No {channel} records</div>;
  }

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Direction</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={`${r.date}-${r.direction}-${r.status}-${i}`}>
              <td style={{ color: 'var(--dim)' }}>{i + 1}</td>
              <td>{fmtDate(r.date)}</td>
              <td><Badge variant={r.direction} /></td>
              <td><Badge variant={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
