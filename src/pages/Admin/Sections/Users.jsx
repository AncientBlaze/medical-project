import { useMemo } from 'react';

const Users = ({ leads, stats }) => {
  // Memoize unique users and prediction counts for performance
  const { uniqueUsers, predictionCounts } = useMemo(() => {
    const userMap = new Map();
    const counts = new Map();
    
    leads.filter((l) => l.user?._id).forEach((l) => {
      const userId = l.user._id;
      if (!userMap.has(userId)) {
        userMap.set(userId, l);
        counts.set(userId, 0);
      }
      counts.set(userId, (counts.get(userId) || 0) + 1);
    });
    
    return {
      uniqueUsers: Array.from(userMap.values()),
      predictionCounts: counts
    };
  }, [leads]);

  return (
    <div
      className="rounded-2xl overflow-hidden p-2 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-[#2d409c] dark:text-white">
          Unique Users
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {stats.users} users have made at least one prediction
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {uniqueUsers.map((l) => (
          <div key={l.user._id} className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold bg-amber-50 dark:bg-teal-400/20 border-amber-200 dark:border-teal-400/30 text-[#F9B406] dark:text-teal-400">
              {l.user.name?.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2d409c] dark:text-white">
                {l.user.name}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {l.user.email}
              </p>
            </div>

            {/* Predictions */}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {predictionCounts.get(l.user._id)} prediction(s)
            </span>
          </div>
        ))}

        {stats.users === 0 && (
          <p className="text-center text-sm py-10 text-slate-500 dark:text-slate-400">
            No registered users yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Users;