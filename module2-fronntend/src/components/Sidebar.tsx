import { navItems } from './navConfig';
import { DEFAULT_STUDENT_ID } from '@/services/api';
import type { TabId } from '@/types';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-[230px] flex-col bg-sidebar text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-7">
        <span className="text-2xl font-extrabold text-brand-500">JCLG</span>
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
          S{DEFAULT_STUDENT_ID}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">Student</p>
          <p className="truncate text-xs text-slate-500">
            Student · ID {DEFAULT_STUDENT_ID}
          </p>
        </div>
      </div>
    </aside>
  );
}
