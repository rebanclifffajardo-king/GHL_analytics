// components/tables/ContactTables.tsx
'use client';

import Badge from '@/components/ui/Badge';
import type { ContactRecord } from '@/types';
import { fmtDate, avatarColor } from '@/lib/utils/analytics';

// ── Contact Directory Table ────────────────────────────────

interface ContactTableProps {
  contacts: ContactRecord[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  const sorted = [...contacts].sort((a, b) => b.date.localeCompare(a.date));

  if (!sorted.length) {
    return <div className="empty-state">📭 No contacts for this range</div>;
  }

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Domain</th>
            <th>Phone</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, i) => (
            <tr key={`${c.first_name}-${c.date}-${i}`}>
              <td style={{ color: 'var(--dim)' }}>{i + 1}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    className="avatar"
                    style={{ background: avatarColor(c.first_name), width: 22, height: 22, fontSize: '0.6rem' }}
                  >
                    {c.first_name[0]}
                  </div>
                  {c.first_name}
                </div>
              </td>
              <td style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>{c.domain}</td>
              <td>
                {c.has_phone ? (
                  <Badge variant="sent" label="✓" />
                ) : (
                  <Badge variant="failed" label="✗" />
                )}
              </td>
              <td>{fmtDate(c.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Contact List Mini (Avatar rows) ───────────────────────

interface ContactListProps {
  contacts: ContactRecord[];
  /** Max rows to show */
  limit?: number;
}

export function ContactList({ contacts, limit = 10 }: ContactListProps) {
  const shown = contacts.slice(0, limit);

  if (!shown.length) {
    return <div className="empty-state">📭 No contacts</div>;
  }

  return (
    <div className="contact-list">
      {shown.map((c, i) => (
        <div className="contact-row" key={`${c.first_name}-${i}`}>
          <div className="avatar" style={{ background: avatarColor(c.first_name) }}>
            {c.first_name[0]}
          </div>
          <div>
            <div className="contact-name">{c.first_name}</div>
            <div className="contact-domain">{c.domain}</div>
          </div>
          <div className="contact-badges">
            {c.has_email ? <Badge variant="email" /> : null}
            {c.has_phone ? <Badge variant="sent" label="📱" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
