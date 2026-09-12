interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mt-6 mb-4 space-y-1.5">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      )}
    </div>
  );
}
