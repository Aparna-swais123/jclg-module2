interface PageHeaderProps {
  title: string;
  subtitle: string;
  moduleLabel?: string;
}

export function PageHeader({ title, subtitle, moduleLabel = 'Module 1' }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {moduleLabel && (
        <span className="mb-1 block text-sm font-semibold text-blue-600">
          {moduleLabel}
        </span>
      )}
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
