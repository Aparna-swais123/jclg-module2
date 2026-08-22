import { useState, useEffect } from 'react';
import { AlertTriangle, CalendarDays, BookOpen, Megaphone, ClipboardCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { api } from '@/services/api';
import type { NotificationItem, NotificationCategory } from '@/types';

const categoryConfig: Record<NotificationCategory, { icon: LucideIcon; bg: string }> = {
  alert: { icon: AlertTriangle, bg: 'bg-red-50 text-red-500' },
  leave: { icon: CalendarDays, bg: 'bg-amber-50 text-amber-500' },
  study: { icon: BookOpen, bg: 'bg-slate-100 text-slate-500' },
  announcement: { icon: Megaphone, bg: 'bg-blue-50 text-blue-500' },
  assignment: { icon: ClipboardCheck, bg: 'bg-brand-50 text-brand-600' },
};

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  const unread = notifications.filter((n) => n.unread).length;
  const alerts = notifications.filter((n) => n.category === 'alert').length;

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Recent announcements and alerts from the welfare office" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Notifications" value={loading ? '...' : notifications.length} />
        <StatCard label="Unread" value={loading ? '...' : unread} />
        <StatCard label="Alerts" value={loading ? '...' : alerts} />
      </div>

      {loading ? (
        <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-muted shadow-card">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-muted shadow-card">
          No notifications to display
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-card">
          {notifications.map((n, i) => {
            const cfg = categoryConfig[n.category] || categoryConfig.announcement;
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={[
                  'flex items-start gap-4 px-5 py-4',
                  i !== 0 ? 'border-t border-border' : '',
                  n.unread ? 'border-l-[3px] border-l-brand-500' : '',
                ].join(' ')}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-ink">{n.title}</p>
                    <span className="shrink-0 text-xs text-muted">{n.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{n.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
