// components/conversations/SmsTemplateBreakdown.tsx
'use client';

import type { TemplateCount } from '@/types/conversations';

interface SmsTemplateBreakdownProps {
  templates: TemplateCount[];
}

const TEMPLATE_STYLES: Record<string, { gradient: string; badge: string; color: string }> = {
  Budget:      { gradient: 'linear-gradient(90deg,#0d9e7e,#2563eb)', badge: 'var(--teal-lt)', color: 'var(--teal)' },
  Payments:    { gradient: 'linear-gradient(90deg,#2563eb,#7c3aed)', badge: 'var(--blue-lt)', color: 'var(--blue)' },
  'Car Buying':{ gradient: 'linear-gradient(90deg,#7c3aed,#d97706)', badge: 'var(--violet-lt)', color: 'var(--violet)' },
  'STOP Reply':{ gradient: 'linear-gradient(90deg,#dc2626,#d97706)', badge: 'var(--rose-lt)', color: 'var(--rose)' },
};

export default function SmsTemplateBreakdown({ templates }: SmsTemplateBreakdownProps) {
  if (!templates.length) return <div className="empty-state">📭 No SMS data</div>;

  const max = templates[0]?.count || 1;
  const total = templates.reduce((a, t) => a + t.count, 0);

  return (
    <div>
      {templates.map((t) => {
        const style = TEMPLATE_STYLES[t.label] ?? {
          gradient: 'linear-gradient(90deg,#94a3b8,#64748b)',
          badge: 'var(--subtle)',
          color: 'var(--muted)',
        };
        const pct = total ? ((t.count / total) * 100).toFixed(1) : '0';

        return (
          <div key={t.label} style={{ marginBottom: 14 }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span
                className="badge"
                style={{ background: style.badge, color: style.color, fontSize: '0.63rem', whiteSpace: 'nowrap' }}
              >
                {t.label}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', flex: 1 }}>
                {pct}% of SMS
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text)', fontWeight: 600 }}>
                {t.count.toLocaleString()}
              </span>
            </div>
            {/* Progress bar */}
            <div className="scale-track" style={{ height: 10 }}>
              <div
                className="scale-fill"
                style={{ width: `${(t.count / max) * 100}%`, background: style.gradient }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
