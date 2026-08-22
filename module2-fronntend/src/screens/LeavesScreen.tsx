import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/services/api';
import type { LeaveRequest } from '@/types';

export function LeavesScreen() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await api.getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load leaves', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const approved = leaves.filter((l) => l.status === 'Approved').length;
  const pending = leaves.filter((l) => l.status === 'Pending').length;
  const rejected = leaves.filter((l) => l.status === 'Rejected').length;

  const handleSubmit = async (newLeave: { leave_type: string; from_date: string; to_date: string; reason: string }) => {
    try {
      await api.applyLeave(newLeave);
      await fetchLeaves();
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to apply for leave', err);
      alert('Failed to submit leave request. Please check backend connection.');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Leaves" subtitle="Apply for leave and review past leave requests" />
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Apply for Leave
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Requests" value={loading ? '...' : leaves.length} />
        <StatCard label="Pending" value={loading ? '...' : pending} />
        <StatCard label="Approved" value={loading ? '...' : approved} caption={`${rejected} rejected`} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">From</th>
                <th className="px-5 py-3.5">To</th>
                <th className="px-5 py-3.5">Reason</th>
                <th className="px-5 py-3.5">Applied</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                    Loading leave requests...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 transition-colors hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-ink">{l.type}</td>
                    <td className="px-5 py-4 text-muted">{l.fromDate}</td>
                    <td className="px-5 py-4 text-muted">{l.toDate}</td>
                    <td className="px-5 py-4 text-muted">{l.reason}</td>
                    <td className="px-5 py-4 text-muted">{l.appliedDate || '-'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={l.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {modalOpen && <ApplyLeaveModal onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  );
}

interface ApplyModalProps {
  onClose: () => void;
  onSubmit: (leave: { leave_type: string; from_date: string; to_date: string; reason: string }) => void;
}

function ApplyLeaveModal({ onClose, onSubmit }: ApplyModalProps) {
  const [type, setType] = useState('Medical');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ leave_type: type, from_date: fromDate, to_date: toDate, reason: reason.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-lg font-bold text-ink">Apply for Leave</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Leave Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm font-medium text-ink focus:border-brand-500 focus:outline-hidden"
            >
              <option value="Medical">Medical Leave</option>
              <option value="Family">Family Function / Emergency</option>
              <option value="Academic">Academic / Conference</option>
              <option value="Personal">Personal Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                From Date
              </label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                To Date
              </label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Reason
            </label>
            <textarea
              required
              rows={3}
              placeholder="Please provide details for your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-border px-3.5 py-2 text-sm text-ink focus:border-brand-500 focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
