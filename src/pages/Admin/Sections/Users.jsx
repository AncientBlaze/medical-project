const Users = ({ leads, stats }) => {
  const uniqueUsers = [...new Map(
    leads.filter(l => l.user?._id).map(l => [l.user._id, l])
  ).values()];

  return (
    <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-white">Unique Users</h2>
        <p className="text-xs text-slate-500 mt-0.5">{stats.users} users have made at least one prediction</p>
      </div>
      <div className="divide-y divide-slate-800/60">
        {uniqueUsers.map((l, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-800/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center text-xs font-bold text-[#F9B406]">
              {l.user.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{l.user.name}</p>
              <p className="text-xs text-slate-500">{l.user.email}</p>
            </div>
            <span className="text-xs text-slate-600">
              {leads.filter(x => x.user?._id === l.user._id).length} prediction(s)
            </span>
          </div>
        ))}
        {stats.users === 0 && (
          <p className="text-center text-slate-600 text-sm py-10">No registered users yet</p>
        )}
      </div>
    </div>
  );
};

export default Users;