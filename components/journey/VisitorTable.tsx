// components/journey/VisitorTable.tsx
'use client';

import { useState, useMemo } from 'react';
import type { UniqueVisitor } from '@/types/journey';
import { journeyAvatarColor, fmtJourneyDate } from '@/lib/utils/journeyAnalytics';

interface VisitorTableProps {
  visitors: UniqueVisitor[];
  /** Max rows per page */
  pageSize?: number;
}

type SortKey = keyof Pick<UniqueVisitor, 'firstName' | 'lastName' | 'city' | 'state' | 'bebacks' | 'visitCount' | 'lastSeen'>;

function BebackBadge({ n }: { n: number }) {
  let cls = 'b-sent';
  if (n === 1) cls = 'b-failed';
  else if (n <= 3) cls = 'b-received';
  else if (n >= 7) cls = 'b-email';
  return <span className={`badge ${cls}`}>{n}✕</span>;
}

function GenderBadge({ g }: { g: string }) {
  if (g === 'Female') return <span className="badge b-violet" style={{ background: 'var(--violet-lt)', color: 'var(--violet)' }}>F</span>;
  if (g === 'Male') return <span className="badge b-blue" style={{ background: 'var(--blue-lt)', color: 'var(--blue)' }}>M</span>;
  return <span className="badge" style={{ background: 'var(--subtle)', color: 'var(--muted)' }}>—</span>;
}

export default function VisitorTable({ visitors, pageSize = 15 }: VisitorTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('bebacks');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  }

  const sorted = useMemo(() => {
    return [...visitors].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [visitors, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  function SortArrow({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4, color: 'var(--teal)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const thStyle: React.CSSProperties = { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };

  if (!visitors.length) {
    return <div className="empty-state">📭 No visitors match this filter</div>;
  }

  return (
    <div>
      <div className="tbl-wrap" style={{ maxHeight: 360 }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th style={thStyle} onClick={() => handleSort('firstName')}>
                Name <SortArrow k="firstName" />
              </th>
              <th>Email</th>
              <th style={thStyle} onClick={() => handleSort('city')}>
                City <SortArrow k="city" />
              </th>
              <th style={thStyle} onClick={() => handleSort('state')}>
                State <SortArrow k="state" />
              </th>
              <th>Gender</th>
              <th style={thStyle} onClick={() => handleSort('bebacks')}>
                Bebacks <SortArrow k="bebacks" />
              </th>
              <th style={thStyle} onClick={() => handleSort('visitCount')}>
                Visits <SortArrow k="visitCount" />
              </th>
              <th style={thStyle} onClick={() => handleSort('lastSeen')}>
                Last Seen <SortArrow k="lastSeen" />
              </th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((v, i) => (
              <tr key={v.personId}>
                <td style={{ color: 'var(--dim)' }}>{(page - 1) * pageSize + i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      className="avatar"
                      style={{
                        background: journeyAvatarColor(v.firstName + v.lastName),
                        width: 24,
                        height: 24,
                        fontSize: '0.6rem',
                        flexShrink: 0,
                      }}
                    >
                      {(v.firstName[0] || '?').toUpperCase()}
                    </div>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                      {v.firstName} {v.lastName}
                    </span>
                  </div>
                </td>
                <td style={{ fontSize: '0.65rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.email || '—'}
                </td>
                <td>{v.city || '—'}</td>
                <td>
                  {v.state ? (
                    <span className="badge" style={{ background: 'var(--teal-lt)', color: 'var(--teal)' }}>
                      {v.state}
                    </span>
                  ) : '—'}
                </td>
                <td><GenderBadge g={v.gender} /></td>
                <td><BebackBadge n={v.bebacks} /></td>
                <td style={{ color: 'var(--blue)', fontWeight: 600 }}>{v.visitCount}</td>
                <td>{fmtJourneyDate(v.lastSeen)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>{v.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 12, gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length} visitors
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className="clear-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={{ opacity: page === 1 ? 0.4 : 1 }}
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pg > totalPages) return null;
              return (
                <button
                  key={pg}
                  className={`pill${pg === page ? ' active' : ''}`}
                  onClick={() => setPage(pg)}
                  style={{ padding: '4px 10px' }}
                >
                  {pg}
                </button>
              );
            })}
            <button
              className="clear-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{ opacity: page === totalPages ? 0.4 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
