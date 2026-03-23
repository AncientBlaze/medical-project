import { memo } from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = memo(({ icon: Icon, label, value, trend }) => {
  return (
    <div className="rounded-2xl p-5 border transition-colors bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg border bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
          <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-[#2d409c] dark:text-white">
        {value}
      </p>
      {trend != null && (
        <p className="flex items-center gap-1 text-xs mt-2 text-[#F9B406] dark:text-teal-400">
          <TrendingUp className="w-3.5 h-3.5" /> +{trend}% this month
        </p>
      )}
    </div>
  );
});

export default StatCard;