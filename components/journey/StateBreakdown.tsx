// components/journey/StateBreakdown.tsx
'use client';

import type { StateCount } from '@/types/journey';

interface StateBreakdownProps {
  states: StateCount[];
  limit?: number;
}

const STATE_GRADIENTS = [
  'linear-gradient(90deg,#0d9e7e,#2563eb)',
  'linear-gradient(90deg,#2563eb,#7c3aed)',
  'linear-gradient(90deg,#7c3aed,#d97706)',
  'linear-gradient(90deg,#d97706,#0d9e7e)',
  'linear-gradient(90deg,#dc2626,#7c3aed)',
  'linear-gradient(90deg,#0891b2,#059669)',
  'linear-gradient(90deg,#9333ea,#2563eb)',
  'linear-gradient(90deg,#0d9e7e,#dc2626)',
];

export default function StateBreakdown({ states, limit = 10 }: StateBreakdownProps) {
  const shown = states.slice(0, limit);
  const max = shown[0]?.uniqueVisitors ?? 1;

  if (!shown.length) {
    return <div className="empty-state">📭 No geographic data</div>;
  }

  return (
    <div>
      {shown.map((s, i) => (
        <div className="scale-row" key={s.state}>
          <div className="scale-lbl" style={{ width: 40 }}>
            <span
              className="badge"
              style={{ background: 'var(--teal-lt)', color: 'var(--teal)', fontSize: '0.6rem' }}
            >
              {s.state}
            </span>
          </div>
          <div className="scale-track">
            <div
              className="scale-fill"
              style={{
                width: `${(s.uniqueVisitors / max) * 100}%`,
                background: STATE_GRADIENTS[i % STATE_GRADIENTS.length],
              }}
            />
          </div>
          <div className="scale-num">{s.uniqueVisitors}</div>
        </div>
      ))}
    </div>
  );
}
