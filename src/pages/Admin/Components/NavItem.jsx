/* eslint-disable no-unused-vars */
import { memo } from 'react';

const NavItem = memo(({ icon: Icon, label, badge, active, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      active
        ? 'bg-[#F9B406]/10 text-[#F9B406] border border-[#F9B406]/20'
        : 'text-white/80 hover:text-white hover:bg-[#2C2E69]/40 border border-transparent'
    }`}>
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1 text-left">{label}</span>
    {badge != null && (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
        active
          ? 'bg-[#F9B406]/20 text-[#F9B406]'
          : 'bg-[#2C2E69]/60 text-white/30'
      }`}>
        {badge}
      </span>
    )}
  </button>
));

export default NavItem;