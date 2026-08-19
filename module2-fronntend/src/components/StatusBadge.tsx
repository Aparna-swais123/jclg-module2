type BadgeVariant = 'approved' | 'pending' | 'overdue' | 'submitted';

const variants: Record<BadgeVariant, string> = {
  approved: 'bg-status-approvedBg text-status-approvedText',
  pending: 'bg-status-pendingBg text-status-pendingText',
  overdue: 'bg-status-overdueBg text-status-overdueText',
  submitted: 'border border-brand-500 text-brand-600 bg-white',
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase() as BadgeVariant;
  const cls = variants[key] ?? variants.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
