import { memo } from 'react';
import { LayoutDashboard, Users, Settings, Download, BarChart3 } from 'lucide-react';
import NavItem from './NavItem';
import useThemeStore from '../../../store/themeStore';

const NAV = [
  { id: 'overview',    icon: LayoutDashboard, label: 'Overview'    },
  { id: 'predictions', icon: BarChart3,       label: 'Predictions' },
  { id: 'users',       icon: Users,           label: 'Users'       },
  { id: 'settings',    icon: Settings,        label: 'Settings'    },
  { id: 'export',      icon: Download,        label: 'Export'      },
];

const Sidebar = memo(({ section, setSection, stats, leadsCount }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-20 space-y-1">
        <div className="px-3 py-2 mb-3">
          <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
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

        <div className={`pt-4 mt-4 border-t space-y-2.5 px-1 ${isDark ? 'border-[#2C2E69]' : 'border-slate-200'}`}>
          <div className="flex justify-between text-xs">
            <span className={isDark ? 'text-white/40' : 'text-slate-500'}>Today</span>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.today}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={isDark ? 'text-white/40' : 'text-slate-500'}>Conversion</span>
            <span className="text-[#F9B406] font-semibold">68%</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#2C2E69]/60' : 'bg-slate-200'}`}>
            <div className="h-full bg-linear-to-r from-[#F9B406] to-[#F9B406]/60 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;