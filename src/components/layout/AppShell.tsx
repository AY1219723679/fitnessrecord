import { Activity, BarChart3, ClipboardCheck, Dumbbell, LayoutDashboard, Settings, UtensilsCrossed } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workouts', label: 'Log Workout', icon: Dumbbell },
  { to: '/meals', label: 'Log Meal', icon: UtensilsCrossed },
  { to: '/check-in', label: 'Daily Check-in', icon: ClipboardCheck },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/templates', label: 'Templates', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-8 pt-6 md:px-6">
      <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Performance Logbook</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">个人健身与饮食记录 MVP</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            记录训练、饮食、恢复、体型和主观状态，用一个偏 performance tracker 的界面看长期趋势。
          </p>
        </div>
      </header>

      <nav className="scrollbar-thin mb-6 flex gap-2 overflow-x-auto pb-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-w-fit items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition',
                isActive
                  ? 'border-accent bg-accent text-ink'
                  : 'border-line bg-panel text-muted hover:text-white'
              )
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}
