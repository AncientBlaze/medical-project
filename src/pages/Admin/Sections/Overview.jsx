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
      <div className="flex items-center justify-between px-6 py-4 border-b transition-colors bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Predictions</h2>
        <button onClick={() => setSection('predictions')}
          className="flex items-center gap-1 text-xs transition-colors text-[#F9B406]/70 hover:text-[#F9B406] dark:text-teal-400/70 dark:hover:text-teal-400">
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {leads.slice(0, 5).map((l, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3.5 transition-colors bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-800/30">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold bg-[#F9B406]/10 dark:bg-teal-400/20 border-[#F9B406]/20 dark:border-teal-400/30 text-[#F9B406] dark:text-teal-400">
              {l.user?.name?.charAt(0) || 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{l.user?.name || 'Guest'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{l.course} · Rank {l.rank?.toLocaleString()}</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{fmt(l.createdAt)}</span>
          </div>
        ))}
        {leads.length === 0 && (
          <p className="text-center text-sm py-10 text-slate-400">No predictions yet</p>
        )}
      </div>
    </div>
    </>
  );

export default Overview;