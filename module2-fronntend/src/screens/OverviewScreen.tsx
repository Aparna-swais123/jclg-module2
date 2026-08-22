import { useState, useEffect } from 'react';
import { CalendarDays, ClipboardCheck, CalendarPlus, Bell } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { api } from '@/services/api';
import type { AttendanceData, Assignment, LeaveRequest, NotificationItem } from '@/types';

export function OverviewScreen() {
  const [attendance, setAttendance] = useState<AttendanceData>({
    percentage: 0,
    sessionsAttended: 0,
    sessionsTotal: 0,
    sessionsMissed: 0,
    weekly: [],
  });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [attData, assignData, leaveData, notifData] = await Promise.all([
          api.getAttendance(),
          api.getAssignments(),
          api.getLeaves(),
          api.getNotifications(),
        ]);
        setAttendance(attData);
        setAssignments(assignData);
        setLeaves(leaveData);
        setNotifications(notifData);
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <PageHeader
        title="Student Welfare Dashboard"
        subtitle="Overview of attendance, assignments, leaves and notifications"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Attendance"
          value={loading ? '...' : `${attendance.percentage}%`}
          icon={CalendarDays}
        />
        <StatCard
          label="Assignments"
          value={loading ? '...' : assignments.length}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Leave Requests"
          value={loading ? '...' : leaves.length}
          icon={CalendarPlus}
        />
        <StatCard
          label="Notifications"
          value={loading ? '...' : notifications.length}
          icon={Bell}
        />
      </div>
    </div>
  );
}
