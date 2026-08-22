import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Send,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { api } from '@/services/api';
import type { AttendanceData, Assignment, LeaveRequest, NotificationItem, StudyMaterial, StudentProfile } from '@/types';

interface ActionRecommendation {
  id: string;
  category: 'Attendance' | 'Assignments' | 'Leaves' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  actionText?: string;
  completed?: boolean;
}

export function AIAnalysisScreen() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
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
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive AI Assistant states
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [stuData, attData, assignData, leaveData, notifData, matData] = await Promise.all([
        api.getStudent(),
        api.getAttendance(),
        api.getAssignments(),
        api.getLeaves(),
        api.getNotifications(),
        api.getStudyMaterials(),
      ]);
      setStudent(stuData);
      setAttendance(attData);
      setAssignments(assignData);
      setLeaves(leaveData);
      setNotifications(notifData);
      setMaterials(matData);
    } catch (err) {
      console.error('Failed to load AI Analysis data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Compute key analytics
  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter((a) => a.status === 'Submitted').length;
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending').length;
  const overdueAssignments = assignments.filter((a) => a.status === 'Overdue').length;
  const assignmentRate = totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 100;

  const totalLeaves = leaves.length;
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

  const unreadNotifs = notifications.filter((n) => n.unread).length;
  const alertNotifs = notifications.filter((n) => n.category === 'alert').length;

  // Composite AI Health Score calculation (0 - 100)
  const attScore = Math.min(100, Math.max(0, attendance.percentage));
  const assignScore = assignmentRate;
  const overduePenalty = overdueAssignments * 15;
  const alertPenalty = alertNotifs * 10;
  const compositeScore = Math.max(
    10,
    Math.min(100, Math.round(attScore * 0.5 + assignScore * 0.4 + 10 - overduePenalty - alertPenalty))
  );

  let healthStatus = 'Optimal Standing';
  let healthColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let healthBarColor = 'bg-emerald-500';

  if (compositeScore < 60 || attendance.percentage < 75 || overdueAssignments > 1) {
    healthStatus = 'Needs Attention';
    healthColor = 'text-red-600 bg-red-50 border-red-200';
    healthBarColor = 'bg-red-500';
  } else if (compositeScore < 80) {
    healthStatus = 'Good Progress';
    healthColor = 'text-amber-600 bg-amber-50 border-amber-200';
    healthBarColor = 'bg-amber-500';
  }

  // Attendance margin calculation:
  // (attended) / (total + x) >= 0.75  => attended / 0.75 - total = safe miss sessions
  // or if below 75%: (attended + x) / (total + x) >= 0.75 => x = (0.75*total - attended) / 0.25
  const safeMisses = attendance.sessionsTotal > 0 && attendance.percentage >= 75
    ? Math.max(0, Math.floor((attendance.sessionsAttended - 0.75 * attendance.sessionsTotal) / 0.75))
    : 0;

  const recoverySessionsNeeded = attendance.sessionsTotal > 0 && attendance.percentage < 75
    ? Math.ceil((0.75 * attendance.sessionsTotal - attendance.sessionsAttended) / 0.25)
    : 0;

  // Generate dynamic actionable recommendations
  const recommendations: ActionRecommendation[] = [];

  if (overdueAssignments > 0) {
    recommendations.push({
      id: 'rec-1',
      category: 'Assignments',
      priority: 'High',
      title: `Submit ${overdueAssignments} Overdue Assignment(s)`,
      description: `You have overdue submissions which directly impact your internal assessment score. Submit them as soon as possible.`,
    });
  }

  if (attendance.percentage < 75 && attendance.sessionsTotal > 0) {
    recommendations.push({
      id: 'rec-2',
      category: 'Attendance',
      priority: 'High',
      title: `Attendance Recovery: Attend next ${recoverySessionsNeeded} session(s)`,
      description: `Your attendance is currently ${attendance.percentage}%. Attending the upcoming ${recoverySessionsNeeded} consecutive classes will lift your score back above 75%.`,
    });
  } else if (attendance.percentage >= 75 && safeMisses <= 2 && attendance.sessionsTotal > 0) {
    recommendations.push({
      id: 'rec-3',
      category: 'Attendance',
      priority: 'Medium',
      title: 'Maintain Attendance Buffer',
      description: `You have a narrow safety buffer of ~${safeMisses} session(s). Avoid non-emergency leaves to stay comfortably above the 75% threshold.`,
    });
  }

  if (pendingAssignments > 0) {
    recommendations.push({
      id: 'rec-4',
      category: 'Assignments',
      priority: 'Medium',
      title: `Complete ${pendingAssignments} Upcoming Assignment(s)`,
      description: `Check your assignments tab for approaching deadlines and utilize faculty study materials to complete them early.`,
    });
  }

  if (unreadNotifs > 0) {
    recommendations.push({
      id: 'rec-5',
      category: 'General',
      priority: 'Low',
      title: `Review ${unreadNotifs} Unread Notification(s)`,
      description: `Stay updated on administrative deadlines, schedule revisions, and announcements from the welfare office.`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-optimal',
      category: 'General',
      priority: 'Low',
      title: 'Maintain Current Performance',
      description: 'Your attendance, coursework, and records are in great standing. Keep up the consistent pace!',
    });
  }

  // Handle AI Chat Queries
  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || chatPrompt;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!promptText) setChatPrompt('');
    setIsAiThinking(true);

    setTimeout(() => {
      let aiReply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('attendance') || lower.includes('recovery') || lower.includes('miss')) {
        if (attendance.percentage >= 75) {
          aiReply = `📊 **Attendance Health Analysis**: Your current attendance is **${attendance.percentage}%** (${attendance.sessionsAttended}/${attendance.sessionsTotal} sessions). You are above the mandatory 75% cutoff with a safe margin of approximately **${safeMisses} session(s)**. Keep attending regularly to protect this buffer for end-semester exams.`;
        } else {
          aiReply = `⚠️ **Attendance Warning & Recovery Path**: Your attendance is **${attendance.percentage}%** (${attendance.sessionsAttended}/${attendance.sessionsTotal} sessions), which is below the required 75%. To restore your eligibility, you need to attend the next **${recoverySessionsNeeded} consecutive classes** without missing any sessions.`;
        }
      } else if (lower.includes('assignment') || lower.includes('deadline') || lower.includes('homework') || lower.includes('due')) {
        aiReply = `📝 **Coursework & Submission Synthesis**: You have **${totalAssignments} total assignment(s)**. 
- **Submitted**: ${submittedAssignments}
- **Pending**: ${pendingAssignments}
- **Overdue**: ${overdueAssignments}
${overdueAssignments > 0 ? `🚨 Please prioritize your overdue coursework immediately.` : `✅ Great job having 0 overdue assignments!`}`;
      } else if (lower.includes('study') || lower.includes('plan') || lower.includes('schedule') || lower.includes('catch-up')) {
        aiReply = `🗓️ **Personalized AI 7-Day Study Plan**:
1. **Day 1–2**: Clear ${overdueAssignments > 0 ? 'overdue assignments and ' : ''}urgent pending assignments.
2. **Day 3–4**: Review ${materials.length} shared lecture materials and slide decks.
3. **Day 5**: Self-assessment on weak topic areas identified in assignments.
4. **Day 6–7**: Consolidate notes and prepare questions for upcoming faculty office hours.`;
      } else if (lower.includes('leave') || lower.includes('apply')) {
        aiReply = `🏖️ **Leave Feasibility Analysis**: You have **${totalLeaves} historical leave request(s)** (${approvedLeaves} approved, ${pendingLeaves} pending). 
${attendance.percentage >= 80 ? '✅ Your high attendance percentage gives you safe room if you need to apply for emergency medical or family leave.' : '⚠️ Because your attendance is near or below 75%, avoid non-urgent leaves to maintain exam clearance.'}`;
      } else {
        aiReply = `🤖 **AI Student Welfare Diagnostic**:
- **Composite Academic Welfare Score**: **${compositeScore}/100** (${healthStatus})
- **Attendance**: ${attendance.percentage}% (${attendance.sessionsAttended} attended, ${attendance.sessionsMissed} missed)
- **Assignments**: ${submittedAssignments}/${totalAssignments} submitted (${assignmentRate}%)
- **Action Advice**: Focus on staying consistent with class sessions and submitting pending assignments before deadlines.`;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="AI Welfare & Academic Analysis"
          subtitle="Intelligent diagnostic synthesis across attendance, assignments, leaves, and student welfare"
        />
        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-xs transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 text-brand-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Top AI Score Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1220] via-[#132038] to-[#0B1220] p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                AI Welfare Intelligence Engine
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Student Welfare & Academic Health
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Synthesized evaluation for <span className="font-semibold text-white">{student ? `${student.first_name} ${student.last_name}` : 'Student'}</span> based on real-time academic records, attendance constancy, submission timeliness, and administrative alerts.
            </p>
          </div>

          {/* Composite Gauge Card */}
          <div className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {loading ? '--' : compositeScore}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </div>
              <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                AI Health Score
              </span>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${healthColor}`}>
                {healthStatus}
              </span>
              <p className="mt-1 text-xs text-slate-400">
                {attendance.percentage >= 75 ? 'Meets eligibility criteria' : 'Attendance shortfall detected'}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <span className="text-xs text-slate-400">Attendance Rate</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-bold text-white">{attendance.percentage}%</span>
                <span className={`text-xs ${attendance.percentage >= 75 ? 'text-brand-400' : 'text-red-400'}`}>
                  {attendance.percentage >= 75 ? '✓ Safe' : '⚠️ Shortage'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Assignment Completion</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-bold text-white">{assignmentRate}%</span>
                <span className="text-xs text-slate-400">({submittedAssignments}/{totalAssignments})</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Overdue Items</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-bold text-white">{overdueAssignments}</span>
                <span className={`text-xs ${overdueAssignments === 0 ? 'text-brand-400' : 'text-red-400'}`}>
                  {overdueAssignments === 0 ? '✓ None' : '⚠️ Action Req.'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Leaves Approved</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-bold text-white">{approvedLeaves}</span>
                <span className="text-xs text-slate-400">({pendingLeaves} pending)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Diagnostic Pillars */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Diagnostic */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${attendance.percentage >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {attendance.percentage >= 75 ? 'Compliant' : 'Shortage Risk'}
            </span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-ink">Attendance Trajectory</h3>
          <p className="mt-1 text-xs text-muted">
            {attendance.percentage >= 75
              ? `You can safely miss up to ~${safeMisses} session(s) while maintaining ≥75% requirement.`
              : `You must attend next ${recoverySessionsNeeded} consecutive session(s) to recover above 75%.`}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600 border-t border-border pt-2">
            <span>Attended: {attendance.sessionsAttended}</span>
            <span>Missed: {attendance.sessionsMissed}</span>
          </div>
        </div>

        {/* Academic Coursework Diagnostic */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${overdueAssignments === 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
              {overdueAssignments === 0 ? 'Up to date' : `${overdueAssignments} Overdue`}
            </span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-ink">Coursework Submissions</h3>
          <p className="mt-1 text-xs text-muted">
            {pendingAssignments > 0
              ? `${pendingAssignments} pending assignment(s) require submission before stated due dates.`
              : 'All assigned tasks and coursework are fully submitted.'}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600 border-t border-border pt-2">
            <span>Submitted: {submittedAssignments}</span>
            <span>Pending: {pendingAssignments}</span>
          </div>
        </div>

        {/* Welfare & Leaves Diagnostic */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
              {pendingLeaves > 0 ? `${pendingLeaves} In Review` : 'No Pending'}
            </span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-ink">Leave & Welfare Status</h3>
          <p className="mt-1 text-xs text-muted">
            {leaves.length > 0
              ? `${approvedLeaves} approved leaves across current academic term.`
              : 'No leave records filed yet.'}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600 border-t border-border pt-2">
            <span>Approved: {approvedLeaves}</span>
            <span>Total: {leaves.length}</span>
          </div>
        </div>

        {/* Study Resources Diagnostic */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
              {materials.length} Available
            </span>
          </div>
          <h3 className="mt-3 text-sm font-bold text-ink">Faculty Resources</h3>
          <p className="mt-1 text-xs text-muted">
            {materials.length > 0
              ? `Reference materials available across ${new Set(materials.map((m) => m.subject)).size} subjects.`
              : 'Study materials uploaded by faculty will appear here.'}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600 border-t border-border pt-2">
            <span>Subjects: {new Set(materials.map((m) => m.subject)).size}</span>
            <span>Files: {materials.length}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Recommendations + Interactive AI Assistant */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Smart Recommendations Checklist */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-xl bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-ink">Actionable AI Recommendations</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {recommendations.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const priorityStyles =
                  rec.priority === 'High'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : rec.priority === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <div
                    key={rec.id}
                    className="flex flex-col gap-2 rounded-xl border border-border p-4 transition-all hover:border-brand-300 hover:bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityStyles}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs font-semibold text-muted">{rec.category}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-ink">{rec.title}</h4>
                    <p className="text-xs leading-relaxed text-muted">{rec.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AI Prescriptions Card */}
          <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <h4 className="text-sm font-bold text-brand-900">AI Student Welfare Advisory</h4>
            </div>
            <ul className="space-y-2 text-xs text-brand-900">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" />
                <span>Maintain regular attendance in core subjects to stay above the 75% examination clearance threshold.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" />
                <span>Submit assignments at least 24 hours prior to deadline to prevent last-minute submission bottlenecks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" />
                <span>Ensure planned leaves are submitted 48 hours in advance for faculty approval.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive AI Assistant */}
        <div className="lg:col-span-6">
          <div className="flex h-full min-h-[500px] flex-col rounded-xl bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Ask AI Welfare Advisor</h3>
                  <p className="text-xs text-muted">Real-time answers contextualized to your academic records</p>
                </div>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleSendPrompt('Analyze my attendance recovery and safety buffer')}
                className="flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-pointer"
              >
                <span>📊 Attendance Analysis</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendPrompt('Generate a 7-day study and coursework catch-up plan')}
                className="flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-pointer"
              >
                <span>🗓️ 7-Day Study Plan</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendPrompt('Summarize pending deadlines and assignments')}
                className="flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-pointer"
              >
                <span>📝 Coursework Deadlines</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendPrompt('Evaluate leave feasibility and balance')}
                className="flex items-center gap-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-pointer"
              >
                <span>🏖️ Leave Feasibility</span>
              </button>
            </div>

            {/* Chat message display area */}
            <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border bg-slate-50/50 p-4 min-h-[260px] max-h-[360px]">
              {chatHistory.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 mb-3 shadow-xs">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-ink">Have questions about your welfare or academic standing?</p>
                  <p className="mt-1 text-xs text-muted max-w-sm">
                    Click any quick prompt above or type your question below to receive personalized diagnostic guidance.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-brand-500 text-white rounded-br-none shadow-xs'
                          : 'bg-white text-ink border border-border rounded-bl-none shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                    <span className="mt-1 px-1 text-[10px] text-muted">{msg.time}</span>
                  </div>
                ))
              )}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-muted p-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600 animate-pulse">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span>Analyzing student records...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="mt-3 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about attendance, upcoming deadlines, or study strategy..."
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                className="flex-1 rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:border-brand-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!chatPrompt.trim() || isAiThinking}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-xs transition-colors hover:bg-brand-600 disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
