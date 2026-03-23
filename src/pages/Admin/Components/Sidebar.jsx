import { memo } from 'react';
import { LayoutDashboard, Users, Settings, Download, BarChart3 } from 'lucide-react';
import NavItem from './NavItem';

const NAV = [
  { id: 'overview',    icon: LayoutDashboard, label: 'Overview'    },
  { id: 'predictions', icon: BarChart3,       label: 'Predictions' },
  { id: 'users',       icon: Users,           label: 'Users'       },
  { id: 'settings',    icon: Settings,        label: 'Settings'    },
  { id: 'export',      icon: Download,        label: 'Export'      },
];

const Sidebar = memo(({ section, setSection, stats, leadsCount }) => {
  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-20 space-y-1">
        <div className="px-3 py-2 mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/20">
            Navigation
          </p>
        </div>

        {NAV.map(({ id, icon, label }) => {
          const badge = id === 'predictions' ? leadsCount : id === 'users' ? stats.users : null;
          return (
            <NavItem key={id} icon={icon} label={label} badge={badge}
              active={section === id} onClick={() => setSection(id)} />
          );
        })}

        <div className="pt-4 mt-4 border-t space-y-2.5 px-1 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between text-xs">
            <span className="text-[#2d409c] dark:text-slate-500">Today</span>
            <span className="font-semibold text-[#2d409c] dark:text-white">{stats.today}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2d409c] dark:text-slate-500">Conversion</span>
            <span className="font-semibold text-[#F9B406] dark:text-teal-400">68%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-900/40">
            <div className="h-full rounded-full bg-linear-to-r from-[#F9B406] dark:from-teal-400 to-[#F9B406]/60 dark:to-teal-400/60" style={{ width: '68%' }} />
          </div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;