import { LogOut } from 'lucide-react';

interface TopHeaderProps {
  onLogout?: () => void;
}

export function TopHeader({ onLogout }: TopHeaderProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        const confirmed = window.confirm('Are you sure you want to log out?');
        if (confirmed) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white px-8 py-3.5 shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          Demo Junior College
        </h1>
        <p className="text-xs font-normal text-slate-500 mt-0.5">
          Student Welfare Dashboard
        </p>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
