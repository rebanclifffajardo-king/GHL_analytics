// components/conversations/ConvRecordsTable.tsx
'use client';

import { useState, useMemo } from 'react';
import type { ConvTableRow } from '@/types/conversations';
import { fmtConvDate } from '@/lib/utils/convAnalytics';

interface ConvRecordsTableProps {
  rows: ConvTableRow[];
  pageSize?: number;
}

type SortKey = 'dateOnly' | 'fullName' | 'messageType' | 'direction' | 'sourceType';

function MsgTypeBadge({ t }: { t: 'SMS' | 'Email' }) {
  return (
    <span className={`badge ${t === 'SMS' ? 'b-sms' : 'b-email'}`}>{t}</span>
  );
}

function DirBadge({ d }: { d: 'inbound' | 'outbound' }) {
  return (
    <span className={`badge ${d === 'inbound' ? 'b-inbound' : 'b-outbound'}`}>{d}</span>
  );
}

function SrcBadge({ s }: { s: string }) {
  const style =
    s === 'AUTOMATION'
      ? { bg: 'var(--blue-lt)', fg: 'var(--blue)' }
      : s === 'CUSTOMER REPLY'
      ? { bg: 'var(--teal-lt)', fg: 'var(--teal)' }
      : { bg: 'var(--violet-lt)', fg: 'var(--violet)' };
  return (
    <span className="badge" style={{ background: style.bg, color: style.fg, fontSize: '0.6rem' }}>
      {s === 'AGENT / MANUAL' ? 'Manual' : s === 'AUTOMATION' ? 'Auto' : 'Reply'}
    </span>
  );
}

export default function ConvRecordsTable({ rows, pageSize = 15 }: ConvRecordsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('dateOnly');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  function handleSort(k: SortKey) {
    if (k === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('desc'); }
    setPage(1);
  }

  const sorted = useMemo(
    () => [...rows].sort((a, b) => {
      const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === 'asc' ? cmp : -cmp;
    }),
    [rows, sortKey, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  function Arrow({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span style={{ opacity: 0.25, marginLeft: 3 }}>↕</span>;
    return <span style={{ color: 'var(--teal)', marginLeft: 3 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const th: React.CSSProperties = { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };

  if (!rows.length) return <div className="empty-state">📭 No records for this filter</div>;

  return (
    <div>
      <div className="tbl-wrap" style={{ maxHeight: 380 }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th style={th} onClick={() => handleSort('dateOnly')}>Date <Arrow k="dateOnly" /></th>
              <th style={th} onClick={() => handleSort('fullName')}>Contact <Arrow k="fullName" /></th>
              <th>Email</th>
              <th>Phone</th>
              <th style={th} onClick={() => handleSort('messageType')}>Channel <Arrow k="messageType" /></th>
              <th style={th} onClick={() => handleSort('direction')}>Direction <Arrow k="direction" /></th>
              <th style={th} onClick={() => handleSort('sourceType')}>Source <Arrow k="sourceType" /></th>
              <th>Preview</th>
              <th>Inbox</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r, i) => (
              <tr key={r.id}>
                <td style={{ color: 'var(--dim)' }}>{(page - 1) * pageSize + i + 1}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{fmtConvDate(r.dateOnly)}</td>
                <td style={{ fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>{r.fullName}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.email || '—'}
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem' }}>{r.phone || '—'}</td>
                <td><MsgTypeBadge t={r.messageType} /></td>
                <td><DirBadge d={r.direction} /></td>
                <td><SrcBadge s={r.sourceType} /></td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', color: 'var(--muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.bodyPreview}
                </td>
                <td>
                  {r.unreadCount > 0 ? (
                    <span className="badge b-received" style={{ fontSize: '0.6rem' }}>📬 Unread</span>
                  ) : (
                    <span style={{ color: 'var(--dim)', fontFamily: 'var(--mono)', fontSize: '0.62rem' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="clear-btn" disabled={page === 1}
              onClick={() => setPage((p) => p - 1)} style={{ opacity: page === 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + idx;
              if (pg > totalPages) return null;
              return (
                <button key={pg} className={`pill${pg === page ? ' active' : ''}`}
                  style={{ padding: '4px 10px' }} onClick={() => setPage(pg)}>
                  {pg}
                </button>
              );
            })}
            <button className="clear-btn" disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)} style={{ opacity: page === totalPages ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
