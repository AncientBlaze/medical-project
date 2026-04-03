import { memo } from 'react';

const NavItem = memo(({ icon: Icon, label, badge, active, onClick }) => {

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
        active
          ? 'bg-[#F9B406]/10 dark:bg-teal-500/10 text-[#F9B406] dark:text-teal-400 border-[#F9B406]/20 dark:border-teal-500/20'
          : 'text-[#2d409c] dark:text-slate-400 hover:text-[#2d409c] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40 border-transparent'
      }`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge != null && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
          active
            ? 'bg-[#F9B406]/20 dark:bg-teal-500/20 text-[#F9B406] dark:text-teal-400'
            : 'bg-slate-200 dark:bg-slate-900/40 text-[#2d409c] dark:text-slate-500'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
});

export default NavItem;