import { BarChart3, ClipboardCheck, CalendarDays, Award, BookOpen, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TabId } from '@/types';

export interface TabItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'attendance', label: 'Attendance', icon: CalendarDays },
  { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
  { id: 'activities', label: 'Activities', icon: Award },
  { id: 'leaves', label: 'Leaves', icon: CalendarDays },
  { id: 'materials', label: 'Study Materials', icon: BookOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

interface TopTabsProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TopTabs({ active, onChange }: TopTabsProps) {
  return (
    <div className="rounded-2xl bg-white p-2 shadow-card">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={[
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                  isActive ? 'bg-white/20' : 'bg-slate-100',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
