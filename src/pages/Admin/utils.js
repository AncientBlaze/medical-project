export const getRankBadge = (rank) => {
  if (rank <= 100)   return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
  if (rank <= 1000)  return 'bg-teal-500/15 text-teal-400 border-teal-500/20';
  if (rank <= 10000) return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
  return 'bg-slate-700 text-slate-400 border-slate-600';
};

export const fmt = (d) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(d));
