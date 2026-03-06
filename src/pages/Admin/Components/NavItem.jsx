import { memo } from 'react';
import useThemeStore from '../../../store/themeStore';

const NavItem = memo(({ icon: Icon, label, badge, active, onClick }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
        active
          ? 'bg-[#F9B406]/10 text-[#F9B406] border-[#F9B406]/20'
          : isDark
            ? 'text-white/80 hover:text-white hover:bg-[#2C2E69]/40 border-transparent'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
      }`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge != null && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
          active
            ? 'bg-[#F9B406]/20 text-[#F9B406]'
            : isDark
              ? 'bg-[#2C2E69]/60 text-white/30'
              : 'bg-slate-200 text-slate-500'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
});

export default NavItem;