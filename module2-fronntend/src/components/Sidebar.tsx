import { useState, useEffect } from 'react';
import { navItems } from './navConfig';
import { api, DEFAULT_STUDENT_ID } from '@/services/api';
import type { StudentProfile, TabId } from '@/types';

import logoImg from '@/assets/logo.jpeg';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await api.getStudent();
        if (data) {
          setStudent(data);
        }
      } catch (err) {
        console.error('Failed to load student profile', err);
      }
    }
    loadStudent();
  }, []);

  const studentName = student
    ? `${student.first_name} ${student.last_name}`.trim()
    : 'Student';

  const studentId = student?.student_id ?? DEFAULT_STUDENT_ID;

  const initials = student?.first_name
    ? `${student.first_name[0]}${student.last_name ? student.last_name[0] : ''}`.toUpperCase()
    : `S${studentId}`;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-[230px] flex-col bg-sidebar text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-6">
        <img
          src={logoImg}
          alt="Swais Demo Junior College"
          className="h-10 w-10 shrink-0 rounded-lg object-cover border border-white/10 shadow-sm"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Swais
          </span>
          <span className="text-xs font-bold leading-tight text-white uppercase tracking-tight">
            DEMO JUNIOR COLLEGE
          </span>
        </div>
      </div>

      {/* Menu label */}
      <p className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Menu
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = item.id === activeTab;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={[
                'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-left transition-colors',
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User profile */}
      <div className="flex items-center gap-3 border-t border-white/5 px-5 py-5">
        {student?.photo ? (
          <img
            src={student.photo}
            alt={studentName}
            className="h-10 w-10 shrink-0 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-sm">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white" title={studentName}>
            {studentName}
          </p>
          <p className="truncate text-xs text-slate-400">
            Student · ID {studentId}
          </p>
        </div>
      </div>
    </aside>
  );
}

