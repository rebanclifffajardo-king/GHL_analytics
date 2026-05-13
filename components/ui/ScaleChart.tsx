// components/ui/ScaleChart.tsx
'use client';

import type { ScaleSegment } from '@/types';

interface ScaleChartProps {
  segments: ScaleSegment[];
  /** Optional empty state message */
  emptyMessage?: string;
}

/**
 * Horizontal progress-bar visualization.
 * Used for both comms breakdown and domain distribution.
 */
export default function ScaleChart({ segments, emptyMessage = 'No data' }: ScaleChartProps) {
  if (!segments.length) {
    return <div className="empty-state">📭 {emptyMessage}</div>;
  }

  return (
    <div>
      {segments.map((seg) => (
        <div className="scale-row" key={seg.label}>
          <div className="scale-lbl">{seg.label}</div>
          <div className="scale-track">
            <div
              className="scale-fill"
              style={{ width: `${seg.percentage}%`, background: seg.gradient }}
            />
          </div>
          <div className="scale-num">{seg.count}</div>
        </div>
      ))}
    </div>
  );
}
