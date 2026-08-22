import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { api } from '@/services/api';
import type { AttendanceData } from '@/types';

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-[180px] w-[180px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#22C55E"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isNaN(offset) ? 0 : offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-ink">{percentage}%</span>
          <span className="text-xs text-muted">attended</span>
        </div>
      </div>
    </div>
  );
}

function WeeklyTrendChart({ weekly }: { weekly: { week: string; percentage: number }[] }) {
  if (!weekly || weekly.length === 0) {
    return (
      <div className="flex h-[160px] items-center justify-center text-sm text-muted">
        No weekly trend data available
      </div>
    );
  }

  const width = 320;
  const height = 160;
  const padding = 30;
  const maxVal = 100;
  const minVal = 80;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = weekly.map((d, i) => {
    const x = padding + (weekly.length > 1 ? (i / (weekly.length - 1)) * chartWidth : chartWidth / 2);
    const y = padding + ((maxVal - d.percentage) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={width - padding}
            y1={padding + t * chartHeight}
            y2={padding + t * chartHeight}
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <path d={areaD} fill="url(#trendGradient)" />
        <path d={pathD} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#22C55E" strokeWidth="2.5" />
            <text x={p.x} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[9px] font-medium">
              {p.week}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function AttendanceScreen() {
  const [attendance, setAttendance] = useState<AttendanceData>({
    percentage: 0,
    sessionsAttended: 0,
    sessionsTotal: 0,
    sessionsMissed: 0,
    weekly: [],
  });

  useEffect(() => {
    api.getAttendance().then(setAttendance);
  }, []);

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Attendance records and percentage"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Attendance"
          value={`${attendance.percentage}%`}
          caption={`${attendance.sessionsAttended} of ${attendance.sessionsTotal} sessions`}
        />
        <StatCard label="Sessions Attended" value={attendance.sessionsAttended} />
        <StatCard label="Sessions Missed" value={attendance.sessionsMissed} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Overall Attendance
          </h3>
          <CircularProgress percentage={attendance.percentage} />
        </div>
        <div className="rounded-xl bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Weekly Trend
          </h3>
          <WeeklyTrendChart weekly={attendance.weekly} />
        </div>
      </div>
    </div>
  );
}
