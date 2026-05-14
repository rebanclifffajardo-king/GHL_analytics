// components/journey/TopReturningUsers.tsx
'use client';

import type { UniqueVisitor } from '@/types/journey';
import { journeyAvatarColor } from '@/lib/utils/journeyAnalytics';

interface TopReturningUsersProps {
  visitors: UniqueVisitor[];
}

function BebackBar({ n, max }: { n: number; max: number }) {
  const pct = max > 0 ? (n / max) * 100 : 0;
  const gradient =
    n >= 7
      ? 'linear-gradient(90deg,#0d9e7e,#2563eb)'
      : n >= 4
      ? 'linear-gradient(90deg,#2563eb,#7c3aed)'
      : 'linear-gradient(90deg,#d97706,#dc2626)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      <div className="scale-track" style={{ flex: 1 }}>
        <div className="scale-fill" style={{ width: `${pct}%`, background: gradient }} />
      </div>
      <span className="scale-num">{n}×</span>
    </div>
  );
}

export default function TopReturningUsers({ visitors }: TopReturningUsersProps) {
  if (!visitors.length) {
    return <div className="empty-state">📭 No visitors match this filter</div>;
  }

  const maxBebacks = visitors[0]?.bebacks ?? 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {visitors.map((v, i) => (
        <div
          key={v.personId}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          {/* Rank */}
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.6rem',
              color: 'var(--dim)',
              width: 18,
              flexShrink: 0,
              textAlign: 'right',
            }}
          >
            {i + 1}
          </div>

          {/* Avatar */}
          <div
            className="avatar"
            style={{
              background: journeyAvatarColor(v.firstName + v.lastName),
              width: 28,
              height: 28,
              fontSize: '0.65rem',
              flexShrink: 0,
            }}
          >
            {(v.firstName[0] || '?').toUpperCase()}
          </div>

          {/* Name + location */}
          <div style={{ minWidth: 0, flex: '0 0 140px' }}>
            <div className="contact-name" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {v.firstName} {v.lastName}
            </div>
            <div className="contact-domain" style={{ fontSize: '0.62rem' }}>
              {v.city || '—'}{v.state ? `, ${v.state}` : ''}
            </div>
          </div>

          {/* Progress bar */}
          <BebackBar n={v.bebacks} max={maxBebacks} />
        </div>
      ))}
    </div>
  );
}
