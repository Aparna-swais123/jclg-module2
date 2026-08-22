'use client';

import { useState, useMemo } from 'react';
import {
  Award,
  Trophy,
  Medal,
  BadgeCheck,
  CalendarPlus,
  Download,
  X,
  MapPin,
  User,
  CalendarDays,
  Search,
  FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { mockActivities } from '@/data/activities';
import type {
  Activity,
  ActivityCategory,
  ActivityLevel,
  ActivityStatus,
} from '@/types';

type TabKey = 'mine' | 'browse';

const categoryStyles: Record<ActivityCategory, string> = {
  NSS: 'bg-emerald-50 text-emerald-700',
  NCC: 'bg-amber-50 text-amber-700',
  Sports: 'bg-blue-50 text-blue-700',
  Olympiad: 'bg-violet-50 text-violet-700',
  'Science Fair': 'bg-cyan-50 text-cyan-700',
  Cultural: 'bg-pink-50 text-pink-700',
  Other: 'bg-slate-100 text-slate-600',
};

const levelStyles: Record<ActivityLevel, string> = {
  School: 'bg-slate-100 text-slate-600',
  District: 'bg-blue-50 text-blue-700',
  State: 'bg-amber-50 text-amber-700',
  National: 'bg-violet-50 text-violet-700',
};

const statusStyles: Record<ActivityStatus, string> = {
  Completed: 'bg-emerald-50 text-emerald-700',
  Ongoing: 'bg-blue-50 text-blue-700',
  Registered: 'bg-slate-100 text-slate-600',
  Upcoming: 'bg-slate-100 text-slate-500',
  Withdrawn: 'bg-red-50 text-red-600',
};

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function formatDateRange(start: string, end: string) {
  const s = start ? new Date(start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const e = end ? new Date(end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  if (!s && !e) return '—';
  if (s === e) return s;
  return `${s} – ${e}`;
}

export function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [activeTab, setActiveTab] = useState<TabKey>('mine');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Browse filters
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | 'All'>('All');
  const [levelFilter, setLevelFilter] = useState<ActivityLevel | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const myActivities = useMemo(
    () => activities.filter((a) => a.joined),
    [activities]
  );
  const browseActivities = useMemo(
    () => activities.filter((a) => !a.joined),
    [activities]
  );

  const totalJoined = myActivities.length;
  const ongoing = myActivities.filter((a) => a.status === 'Ongoing').length;
  const certificates = myActivities.filter((a) => a.certificate_url).length;
  const upcomingOpen = browseActivities.filter((a) => a.status === 'Upcoming').length;

  const filteredBrowse = useMemo(() => {
    return browseActivities.filter((a) => {
      if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
      if (levelFilter !== 'All' && a.level !== levelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !a.activity_name.toLowerCase().includes(q) &&
          !a.venue.toLowerCase().includes(q) &&
          !a.category.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [browseActivities, categoryFilter, levelFilter, searchQuery]);

  const handleRegister = (id: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.activity_id === id ? { ...a, joined: true, status: 'Registered' } : a
      )
    );
  };

  return (
    <div>
      <PageHeader
        title="Extra-Curricular Activities"
        subtitle="Your NSS, NCC, Sports, Olympiad and Science Fair participation"
        moduleLabel="Module 2"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Activities Joined" value={totalJoined} icon={Award} />
        <StatCard label="Ongoing Activities" value={ongoing} icon={Trophy} />
        <StatCard
          label="Certificates / Achievements"
          value={certificates}
          icon={Medal}
        />
        <StatCard
          label="Upcoming Activities"
          value={upcomingOpen}
          icon={CalendarPlus}
          caption="Open for registration"
        />
      </div>

      {/* Tabs */}
      <div className="mt-6 inline-flex rounded-xl bg-white p-1.5 shadow-card">
        <button
          onClick={() => setActiveTab('mine')}
          className={[
            'rounded-lg px-5 py-2 text-sm font-semibold transition-all',
            activeTab === 'mine'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100',
          ].join(' ')}
        >
          My Activities
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={[
            'rounded-lg px-5 py-2 text-sm font-semibold transition-all',
            activeTab === 'browse'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100',
          ].join(' ')}
        >
          Browse &amp; Register
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'mine' ? (
        <MyActivitiesTable
          activities={myActivities}
          onSelect={setSelectedActivity}
        />
      ) : (
        <BrowseActivitiesGrid
          activities={filteredBrowse}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRegister={handleRegister}
          onSelect={setSelectedActivity}
        />
      )}

      {/* Detail modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}

/* ----------------------------- My Activities Table ---------------------------- */

function MyActivitiesTable({
  activities,
  onSelect,
}: {
  activities: Activity[];
  onSelect: (a: Activity) => void;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50 text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-5 py-3.5">Activity</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Level</th>
              <th className="px-5 py-3.5">Date(s)</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Result / Rank</th>
              <th className="px-5 py-3.5">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted">
                  No activities joined yet
                </td>
              </tr>
            ) : (
              activities.map((a) => (
                <tr
                  key={a.activity_id}
                  onClick={() => onSelect(a)}
                  className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Award className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-ink">{a.activity_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge label={a.category} className={categoryStyles[a.category]} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge label={a.level} className={levelStyles[a.level]} />
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {formatDateRange(a.start_date, a.end_date)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge label={a.status} className={statusStyles[a.status]} />
                  </td>
                  <td className="px-5 py-4 text-muted">{a.result || '—'}</td>
                  <td className="px-5 py-4">
                    {a.certificate_url ? (
                      <a
                        href={a.certificate_url}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100"
                        title="Download certificate"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------- Browse & Register Grid -------------------------- */

function BrowseActivitiesGrid({
  activities,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  searchQuery,
  setSearchQuery,
  onRegister,
  onSelect,
}: {
  activities: Activity[];
  categoryFilter: ActivityCategory | 'All';
  setCategoryFilter: (v: ActivityCategory | 'All') => void;
  levelFilter: ActivityLevel | 'All';
  setLevelFilter: (v: ActivityLevel | 'All') => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onRegister: (id: string) => void;
  onSelect: (a: Activity) => void;
}) {
  const categories: (ActivityCategory | 'All')[] = [
    'All', 'NSS', 'NCC', 'Sports', 'Olympiad', 'Science Fair', 'Cultural', 'Other',
  ];
  const levels: (ActivityLevel | 'All')[] = ['All', 'School', 'District', 'State', 'National'];

  return (
    <div className="mt-4">
      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search activities, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm text-ink focus:border-brand-500 focus:outline-hidden"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ActivityCategory | 'All')}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink focus:border-brand-500 focus:outline-hidden"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as ActivityLevel | 'All')}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink focus:border-brand-500 focus:outline-hidden"
        >
          {levels.map((l) => (
            <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>
          ))}
        </select>
      </div>

      {/* Card grid */}
      {activities.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-muted shadow-card">
          No activities match your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <div
              key={a.activity_id}
              className="flex flex-col rounded-xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">{a.activity_name}</h3>
                <Badge label={a.category} className={categoryStyles[a.category]} />
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                <Badge label={a.level} className={levelStyles[a.level]} />
                <Badge label={a.status} className={statusStyles[a.status]} />
              </div>
              <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-muted">
                {a.description || 'No description available.'}
              </p>
              <div className="mb-3 space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  <span>{formatDateRange(a.start_date, a.end_date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{a.venue}</span>
                </div>
              </div>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => onSelect(a)}
                  className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-muted transition-colors hover:bg-slate-50"
                >
                  Details
                </button>
                <button
                  onClick={() => onRegister(a.activity_id)}
                  className="flex-1 rounded-lg bg-brand-500 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Detail Modal ------------------------------ */

function ActivityDetailModal({
  activity,
  onClose,
}: {
  activity: Activity;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">{activity.activity_name}</h2>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge label={activity.category} className={categoryStyles[activity.category]} />
                <Badge label={activity.level} className={levelStyles[activity.level]} />
                <Badge label={activity.status} className={statusStyles[activity.status]} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
              Description
            </p>
            <p className="text-sm leading-relaxed text-ink">
              {activity.description || 'No description available.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Dates
              </p>
              <div className="flex items-center gap-2 text-sm text-ink">
                <CalendarDays className="h-4 w-4 text-brand-500" />
                <span>{formatDateRange(activity.start_date, activity.end_date)}</span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Venue
              </p>
              <div className="flex items-center gap-2 text-sm text-ink">
                <MapPin className="h-4 w-4 text-brand-500" />
                <span>{activity.venue}</span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Coordinator
              </p>
              <div className="flex items-center gap-2 text-sm text-ink">
                <User className="h-4 w-4 text-brand-500" />
                <span>{activity.coordinator || '—'}</span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Type
              </p>
              <div className="flex items-center gap-2 text-sm text-ink">
                <User className="h-4 w-4 text-brand-500" />
                <span>{activity.activity_type}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
              Result / Rank
            </p>
            <p className="text-sm text-ink">{activity.result || '—'}</p>
          </div>

          {/* Certificate preview */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Certificate
            </p>
            {activity.certificate_url ? (
              <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                    <BadgeCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {activity.activity_name} — Certificate
                    </p>
                    <p className="text-xs text-muted">Available for download</p>
                  </div>
                </div>
                <a
                  href={activity.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-slate-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-muted">
                  <FileText className="h-5 w-5" />
                </span>
                <p className="text-sm text-muted">
                  No certificate available yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
