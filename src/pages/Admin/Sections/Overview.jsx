import { Target, Users, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import StatCard from '../Components/StatCard';
import { fmt } from '../utils';

const Overview = ({ leads, stats, setSection }) => (
  <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Target} label="Total Predictions" value={stats.total} trend={stats.growth} />
      <StatCard icon={Users} label="Unique Users" value={stats.users} trend={8.2} />
      <StatCard icon={Activity} label="Today" value={stats.today} />
      <StatCard icon={TrendingUp} label="Growth" value={`${stats.growth}%`} />
    </div>

    <div className="rounded-2xl overflow-hidden border">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2E69]">
        <h2 className="text-sm font-semibold dark:text-white text-black">Recent Predictions</h2>
        <button onClick={() => setSection('predictions')}
          className="flex items-center gap-1 text-xs text-[#F9B406]/70 hover:text-[#F9B406] transition-colors">
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="divide-y divide-black">
        {leads.slice(0, 5).map((l, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3.5 bg-white dark:bg-black hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center text-sm font-bold text-[#F9B406]">
              {l.user?.name?.charAt(0) || 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black dark:text-white truncate">{l.user?.name || 'Guest'}</p>
              <p className="text-xs text-black dark:text-white/30">{l.course} · Rank {l.rank?.toLocaleString()}</p>
            </div>
            <span className="text-xs text-black dark:text-white/20">{fmt(l.createdAt)}</span>
          </div>
        ))}
        {leads.length === 0 && (
          <p className="text-center text-white/20 text-sm py-10">No predictions yet</p>
        )}
      </div>
    </div>
  </>
);

export default Overview;