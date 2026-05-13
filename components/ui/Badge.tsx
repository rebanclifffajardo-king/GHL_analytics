// components/ui/Badge.tsx

type BadgeVariant =
  | 'email' | 'sms'
  | 'sent' | 'received' | 'failed'
  | 'inbound' | 'outbound';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

/** Status/channel badge pill. */
export default function Badge({ variant, label }: BadgeProps) {
  return (
    <span className={`badge b-${variant}`}>
      {label ?? variant}
    </span>
  );
}
