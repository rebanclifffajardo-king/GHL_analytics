// components/ui/MetricCard.tsx

interface MetricCardProps {
  stripe: 'teal' | 'blue' | 'violet' | 'amber' | 'rose';
  icon: string;
  label: string;
  value: string | number;
  sub?: React.ReactNode;
  valueColor?: string;
}

/**
 * Reusable metric card with colored top stripe and icon.
 */
export default function MetricCard({
  stripe,
  icon,
  label,
  value,
  sub,
  valueColor,
}: MetricCardProps) {
  return (
    <div className="card">
      <div className={`stripe s-${stripe}`} />
      <div className={`metric-icon mi-${stripe}`}>{icon}</div>
      <div className="metric-lbl">{label}</div>
      <div className="metric-val" style={valueColor ? { color: `var(--${valueColor})` } : undefined}>
        {value}
      </div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}
