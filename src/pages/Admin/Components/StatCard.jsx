
import { memo } from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = memo(({ icon: Icon, label, value, trend }) => (
  <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl p-5 hover:border-[#F9B406]/30 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">{label}</p>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20">
        <Icon className="w-4 h-4 text-[#F9B406]" />
      </div>
    </div>
    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    {trend != null && (
      <p className="flex items-center gap-1 text-xs text-[#F9B406] mt-2">
        <TrendingUp className="w-3.5 h-3.5" /> +{trend}% this month
      </p>
    )}
  </div>
));

export default StatCard;