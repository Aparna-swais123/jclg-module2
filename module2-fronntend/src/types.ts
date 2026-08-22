export type TabId = 'overview' | 'attendance' | 'assignments' | 'activities' | 'leaves' | 'materials' | 'notifications';

export type ActivityCategory = 'NSS' | 'NCC' | 'Sports' | 'Olympiad' | 'Science Fair' | 'Cultural' | 'Other';
export type ActivityLevel = 'School' | 'District' | 'State' | 'National';
export type ActivityStatus = 'Registered' | 'Ongoing' | 'Completed' | 'Withdrawn' | 'Upcoming';
export type ActivityType = 'Individual' | 'Team' | 'Group';

export interface Activity {
  activity_id: string;
  activity_name: string;
  category: ActivityCategory;
  level: ActivityLevel;
  activity_type: ActivityType;
  start_date: string;
  end_date: string;
  venue: string;
  status: ActivityStatus;
  result: string;
  certificate_url?: string;
  description?: string;
  coordinator?: string;
  joined?: boolean;
}
export type TabId = 'overview' | 'attendance' | 'assignments' | 'leaves' | 'materials' | 'notifications' | 'ai-analysis';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  initials: string;
}

export interface StudentProfile {
  student_id: number;
  campus_id?: number;
  academic_year_id?: number;
  admission_id?: number;
  student_code?: string;
  roll_number?: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  photo?: string | null;
  blood_group?: string;
  group_id?: number;
  section_id?: number;
  status?: boolean;
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
