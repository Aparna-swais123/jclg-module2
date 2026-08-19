import type {
  Student,
  AttendanceData,
  Assignment,
  LeaveRequest,
  StudyMaterial,
  NotificationItem,
} from './types';

/*
================================================================================
 MOCK DATA (Commented out for Backend Integration)
================================================================================

export const mockStudent: Student = {
  id: '2024-117',
  name: 'Aarav Rao',
  rollNumber: '2024-117',
  initials: 'AR',
};

export const mockAttendance: AttendanceData = {
  percentage: 94.2,
  sessionsAttended: 123,
  sessionsTotal: 131,
  sessionsMissed: 8,
  weekly: [
    { week: 'W1', percentage: 90 },
    { week: 'W2', percentage: 95 },
    { week: 'W3', percentage: 88 },
    { week: 'W4', percentage: 96 },
    { week: 'W5', percentage: 98 },
    { week: 'W6', percentage: 94 },
  ],
};

export const mockAssignments: Assignment[] = [
  { id: 'a1', title: 'Data Structures Lab 4', subject: 'Computer Science', dueDate: '2026-08-22', status: 'Pending' },
  { id: 'a2', title: 'Linear Algebra Problem Set', subject: 'Mathematics', dueDate: '2026-08-19', status: 'Overdue' },
  { id: 'a3', title: 'OS Concepts Essay', subject: 'Operating Systems', dueDate: '2026-08-12', status: 'Submitted' },
  { id: 'a4', title: 'DBMS Normalization Exercise', subject: 'Database Systems', dueDate: '2026-08-28', status: 'Pending' },
  { id: 'a5', title: 'Network Topology Diagram', subject: 'Computer Networks', dueDate: '2026-08-10', status: 'Submitted' },
  { id: 'a6', title: 'Algorithm Analysis Report', subject: 'Computer Science', dueDate: '2026-09-02', status: 'Pending' },
];

export const mockLeaves: LeaveRequest[] = [
  { id: 'l1', type: 'Medical', fromDate: '2026-07-14', toDate: '2026-07-15', reason: 'Fever and doctor consultation', appliedDate: '2026-07-12', status: 'Approved' },
  { id: 'l2', type: 'Family', fromDate: '2026-08-05', toDate: '2026-08-06', reason: 'Family function out of town', appliedDate: '2026-08-01', status: 'Pending' },
  { id: 'l3', type: 'Personal', fromDate: '2026-06-20', toDate: '2026-06-20', reason: 'Personal errand', appliedDate: '2026-06-18', status: 'Rejected' },
];

export const mockStudyMaterials: StudyMaterial[] = [
  { id: 'm1', title: 'Introduction to Data Structures', subject: 'Computer Science', type: 'PDF', size: '2.4 MB', date: '2026-08-10' },
  { id: 'm2', title: 'Sorting Algorithms Lecture', subject: 'Computer Science', type: 'VIDEO', size: '148 MB', date: '2026-08-08' },
  { id: 'm3', title: 'Database Normalization Slides', subject: 'Database Systems', type: 'PPTX', size: '5.1 MB', date: '2026-08-06' },
  { id: 'm4', title: 'Linear Algebra Notes', subject: 'Mathematics', type: 'DOCX', size: '1.2 MB', date: '2026-08-05' },
  { id: 'm5', title: 'OS Scheduling Algorithms', subject: 'Operating Systems', type: 'PDF', size: '3.8 MB', date: '2026-08-03' },
  { id: 'm6', title: 'Network Topologies Overview', subject: 'Computer Networks', type: 'VIDEO', size: '96 MB', date: '2026-07-28' },
];

export const mockNotifications: NotificationItem[] = [
  { id: 'n1', category: 'alert', title: 'Assignment Overdue', description: 'Linear Algebra Problem Set was due on 2026-08-19. Please submit immediately.', timestamp: '2h ago', unread: true },
  { id: 'n2', category: 'leave', title: 'Leave Request Pending', description: 'Your Family leave request from 2026-08-05 is awaiting approval.', timestamp: '5h ago', unread: true },
  { id: 'n3', category: 'assignment', title: 'New Assignment Posted', description: 'Algorithm Analysis Report has been posted for Computer Science.', timestamp: '1d ago', unread: true },
  { id: 'n4', category: 'study', title: 'New Study Material', description: 'Introduction to Data Structures has been shared by your faculty.', timestamp: '2d ago', unread: false },
  { id: 'n5', category: 'announcement', title: 'Mid-Term Exam Schedule', description: 'The mid-term examination schedule has been published. Check the academics portal.', timestamp: '3d ago', unread: false },
  { id: 'n6', category: 'study', title: 'Lecture Recording Available', description: 'Sorting Algorithms Lecture is now available for review.', timestamp: '4d ago', unread: false },
];
*/

// Initial empty / default states ready for backend integration
export const student: Student = {
  id: '',
  name: '',
  rollNumber: '',
  initials: '',
};

export const attendance: AttendanceData = {
  percentage: 0,
  sessionsAttended: 0,
  sessionsTotal: 0,
  sessionsMissed: 0,
  weekly: [],
};

export const assignments: Assignment[] = [];
export const leaves: LeaveRequest[] = [];
export const studyMaterials: StudyMaterial[] = [];
export const notifications: NotificationItem[] = [];
