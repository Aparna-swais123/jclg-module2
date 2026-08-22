import { BarChart3, CalendarDays, ClipboardCheck, BookOpen, Bell, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TabId } from '@/types';

export interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'attendance', label: 'Attendance', icon: CalendarDays },
  { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
  { id: 'leaves', label: 'Leaves', icon: CalendarDays },
  { id: 'materials', label: 'Study Materials', icon: BookOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles },
];
