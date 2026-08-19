import { useState, useEffect } from 'react';
import { CalendarDays, ClipboardCheck, CalendarPlus, Bell } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { InsightsPanel } from '@/components/InsightsPanel';
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

  const pendingAssignments = assignments.filter((a) => a.status === 'Pending').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  const unreadNotifications = notifications.filter((n) => n.unread).length;

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

      {/* Insights */}
      <div className="mt-6">
        <InsightsPanel
          insights={[
            attendance.percentage > 0
              ? `Your attendance is at ${attendance.percentage}%, ${attendance.percentage >= 75 ? 'well above the 75% requirement — keep it up.' : 'below the 75% requirement.'}`
              : 'No attendance records logged yet.',
            pendingAssignments > 0
              ? `You have ${pendingAssignments} pending assignment(s). Submit them before the due dates to avoid penalties.`
              : 'No pending assignments.',
            pendingLeaves > 0
              ? `${pendingLeaves} leave request(s) currently pending approval.`
              : 'No pending leave requests.',
            unreadNotifications > 0
              ? `You have ${unreadNotifications} unread notification(s).`
              : 'No unread notifications.',
          ]}
        />
      </div>
    </div>
  );
}
