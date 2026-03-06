export const getRankBadge = (rank, isDark) => {
  if (rank <= 100) {
    return isDark ? 'bg-[#0f172a]/15 text-[#ffffff] border-[#0f172a]/20' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
  }
  if (rank <= 1000) {
    return isDark ? 'bg-[#1e293b]/15 text-[#ffffff] border-[#1e293b]/20' : 'bg-teal-500/15 text-teal-400 border-teal-500/20';
  }
  if (rank <= 10000) {
    return isDark ? 'bg-[#f9b406]/15 text-[#ffffff] border-[#f9b406]/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20';
  }
  return isDark ? 'bg-[#2C2E69]/15 text-[#ffffff] border-[#2C2E69]/20' : 'bg-slate-700 text-slate-400 border-slate-600';
};

export const fmt = (d, isDark) => {
  const options = { day: '2-digit', month: 'short', year: '2-digit' };
  const date = new Date(d);
  const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(date);
  return isDark ? `<span class="text-white/70">${formattedDate}</span>` : formattedDate;
};