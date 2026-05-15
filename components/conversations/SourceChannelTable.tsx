// components/conversations/SourceChannelTable.tsx
'use client';

import type { SourceChannelRow } from '@/types/conversations';

interface SourceChannelTableProps {
  rows: SourceChannelRow[];
  total: number;
}

function pct(n: number, d: number) {
  return d ? `${((n / d) * 100).toFixed(1)}%` : '0%';
}

export default function SourceChannelTable({ rows, total }: SourceChannelTableProps) {
  if (!rows.length || !total) return <div className="empty-state">📭 No data</div>;

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>Source Type</th>
            <th>SMS</th>
            <th>Email</th>
            <th>Total</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.source}>
              <td>
                <span
                  className="badge"
                  style={{
                    background: r.source === 'AUTOMATION' ? 'var(--blue-lt)'
                      : r.source === 'CUSTOMER REPLY' ? 'var(--teal-lt)'
                      : 'var(--violet-lt)',
                    color: r.source === 'AUTOMATION' ? 'var(--blue)'
                      : r.source === 'CUSTOMER REPLY' ? 'var(--teal)'
                      : 'var(--violet)',
                    fontSize: '0.62rem',
                  }}
                >
                  {r.source}
                </span>
              </td>
              <td style={{ color: 'var(--violet)' }}>{r.sms.toLocaleString()}</td>
              <td style={{ color: 'var(--blue)' }}>{r.email.toLocaleString()}</td>
              <td style={{ color: 'var(--text)', fontWeight: 600 }}>{r.total.toLocaleString()}</td>
              <td>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                  {pct(r.total, total)}
                </span>
              </td>
            </tr>
          ))}
          {/* Totals row */}
          <tr style={{ borderTop: '2px solid var(--border2)' }}>
            <td style={{ fontWeight: 700, color: 'var(--text)' }}>TOTAL</td>
            <td style={{ color: 'var(--violet)', fontWeight: 700 }}>
              {rows.reduce((a, r) => a + r.sms, 0).toLocaleString()}
            </td>
            <td style={{ color: 'var(--blue)', fontWeight: 700 }}>
              {rows.reduce((a, r) => a + r.email, 0).toLocaleString()}
            </td>
            <td style={{ color: 'var(--text)', fontWeight: 700 }}>{total.toLocaleString()}</td>
            <td style={{ color: 'var(--teal)', fontFamily: 'var(--mono)', fontSize: '0.65rem', fontWeight: 700 }}>
              100%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
