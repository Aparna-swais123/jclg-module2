export type TabId = 'overview' | 'attendance' | 'assignments' | 'leaves' | 'materials' | 'notifications';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  initials: string;
}

export interface AttendanceData {
  percentage: number;
  sessionsAttended: number;
  sessionsTotal: number;
  sessionsMissed: number;
  weekly: { week: string; percentage: number }[];
}

export type AssignmentStatus = 'Pending' | 'Submitted' | 'Overdue';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
}

export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

export interface LeaveRequest {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  appliedDate: string;
  status: LeaveStatus;
}

export type MaterialType = 'PDF' | 'VIDEO' | 'PPTX' | 'DOCX';

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: MaterialType;
  size: string;
  date: string;
  fileUrl?: string;
}

export type NotificationCategory = 'alert' | 'leave' | 'study' | 'announcement' | 'assignment';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
}

export interface Insight {
  text: string;
}
