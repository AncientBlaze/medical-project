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

const Sidebar = memo(({ section, setSection, stats, leadsCount }) => (
  <aside className="w-56 shrink-0">
    <div className="sticky top-20 space-y-1">
      <div className="px-3 py-2 mb-3">
        <p className="text-xs font-semibold text-white uppercase tracking-wider">Navigation</p>
      </div>

      {NAV.map(({ id, icon, label }) => {
        const badge = id === 'predictions' ? leadsCount : id === 'users' ? stats.users : null;
        return (
          <NavItem key={id} icon={icon} label={label} badge={badge}
            active={section === id} onClick={() => setSection(id)} />
        );
      })}

      <div className="pt-4 mt-4 border-t border-[#2C2E69] space-y-2.5 px-1">
        <div className="flex justify-between text-xs text-white">
          <span>Today</span>
          <span className="text-white font-semibold">{stats.today}</span>
        </div>
        <div className="flex justify-between text-xs text-white">
          <span>Conversion</span>
          <span className="text-[#F9B406] font-semibold">68%</span>
        </div>
        <div className="h-1.5 bg-[#2C2E69]/60 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-[#F9B406] to-[#F9B406]/60 rounded-full" style={{ width: '68%' }} />
        </div>
      </div>
    </div>
  </aside>
));

export default Sidebar;