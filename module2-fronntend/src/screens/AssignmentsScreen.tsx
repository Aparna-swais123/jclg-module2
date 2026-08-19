import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { InsightsPanel } from '@/components/InsightsPanel';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/services/api';
import type { Assignment } from '@/types';

export function AssignmentsScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAssignments()
      .then(setAssignments)
      .finally(() => setLoading(false));
  }, []);

  const submitted = assignments.filter((a) => a.status === 'Submitted').length;
  const pending = assignments.filter((a) => a.status === 'Pending').length;
  const overdue = assignments.filter((a) => a.status === 'Overdue').length;

  return (
    <div>
      <PageHeader title="Assignments" subtitle="All assignments and their current submission status" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={loading ? '...' : assignments.length} />
        <StatCard label="Submitted" value={loading ? '...' : submitted} />
        <StatCard label="Pending" value={loading ? '...' : pending} caption={`${overdue} overdue`} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5">Assignment</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted">
                    Loading assignments...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted">
                    No assignments found
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 transition-colors hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <FileText className="h-4 w-4" />
                        </span>
                        <span className="font-semibold text-ink">{a.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{a.subject}</td>
                    <td className="px-5 py-4 text-muted">{a.dueDate || '-'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <InsightsPanel
          insights={[
            assignments.length > 0
              ? `You have ${assignments.length} total assignment(s): ${submitted} submitted and ${pending} pending.`
              : 'No assignments assigned yet.',
            overdue > 0
              ? `${overdue} assignment(s) are overdue. Prioritize submitting these first.`
              : 'No overdue assignments — all up to date.',
            pending > 0
              ? 'Stay ahead by reviewing requirements and submitting assignments early.'
              : 'Great job staying on top of your coursework!',
          ]}
        />
      </div>
    </div>
  );
}
