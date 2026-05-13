// components/layout/SectionHeader.tsx
interface SectionHeaderProps {
  title: string;
}

/** Styled section divider with teal left accent bar. */
export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
    </div>
  );
}
