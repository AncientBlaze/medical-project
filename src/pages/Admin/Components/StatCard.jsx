import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import useThemeStore from '../../../store/themeStore';

const StatCard = memo(({ icon: Icon, label, value, trend }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 border transition-colors ${
      isDark
        ? 'bg-[#2C2E69]/30 border-[#2C2E69] hover:border-[#F9B406]/30'
        : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          {label}
        </p>
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
          isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'
        }`}>
          <Icon className="w-4 h-4 text-[#F9B406]" />
        </div>
      </div>
      <p className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </p>
      {trend != null && (
        <p className="flex items-center gap-1 text-xs text-[#F9B406] mt-2">
          <TrendingUp className="w-3.5 h-3.5" /> +{trend}% this month
        </p>
      )}
    </div>
  );
});

export default StatCard;