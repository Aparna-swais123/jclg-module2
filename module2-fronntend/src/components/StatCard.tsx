import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  icon?: LucideIcon;
  accent?: boolean;
}

export function StatCard({ label, value, caption, icon: Icon, accent = true }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      {accent && <div className="absolute left-0 top-0 h-full w-1 bg-brand-500" />}
      <div className="pl-1">
        {Icon && (
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        {caption && <p className="mt-1 text-xs text-muted">{caption}</p>}
      </div>
    </div>
  );
}
