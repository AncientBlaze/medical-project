const Users = ({ leads, stats }) => {

  const uniqueUsers = [
    ...new Map(
      leads.filter((l) => l.user?._id).map((l) => [l.user._id, l])
    ).values(),
  ];

  return (
    <div
      className="dark:bg-teal-950/20 dark:border dark:shadow-sm rounded-2xl overflow-hidden p-2 bg-white border-slate-200 shadow-sm"
    >
      {/* Header */}
      <div className="dark:border-b pb-4 dark:flex dark:items-center dark:justify-between  flex items-center justify-between p-4 border-b border-slate-200">
        <h2 className="dark:text-sm dark:font-semibold dark:text-white text-sm font-semibold text-slate-900">
          Unique Users
        </h2>

        <p className="dark:text-xs dark:mt-0.5 dark:text-slate-400 text-xs text-slate-500">
          {stats.users} users have made at least one prediction
        </p>
      </div>

      {/* List */}
      <div className="dark:divide-y dark:divide-slate-800/60 divide-y divide-slate-200">
        {uniqueUsers.map((l, i) => (
          <div key={i} className="dark:flex dark:items-center dark:gap-4  dark:py-3.5 dark:transition-colors dark:hover:bg-slate-800/40 flex items-center gap-4 p-4 transition-colors hover:bg-slate-200">
            {/* Avatar */}
            <div className="dark:w-8 dark:h-8 dark:rounded-lg dark:border w-8 h-8 rounded-lg bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
              <div className="dark:flex dark:items-center dark:justify-center dark:text-xs dark:font-bold dark:text-[#F9B406] flex items-center justify-center text-xs font-bold text-[#F9B406] mt-2">
                {l.user.name?.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="dark:flex-1 dark:min-w-0 flex-1 min-w-0">
              <p className="dark:text-sm dark:font-medium dark:text-white text-sm font-medium text-slate-900">
                {l.user.name}
              </p>

              <p className="dark:text-xs dark:text-slate-400 text-xs text-slate-500">
                {l.user.email}
              </p>
            </div>

            {/* Predictions */}
            <span className="dark:text-xs dark:text-slate-500 text-xs text-slate-500">
              {
                leads.filter((x) => x.user?._id === l.user._id).length
              } prediction(s)
            </span>
          </div>
        ))}

        {stats.users === 0 && (
          <p className="dark:text-center dark:text-sm dark:py-10 dark:text-slate-500 text-center text-sm py-10 text-slate-500">
            No registered users yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Users;

