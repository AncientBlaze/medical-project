import { useState, useMemo } from 'react';
import { Search, RefreshCw, Phone } from 'lucide-react';
import { fmt } from '../utils';

const PredictionsTable = ({ leads, onOpenModal }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return leads;
    const q = query.toLowerCase();
    return leads.filter(l =>
      [l.user?.name, l.user?.email, l.user?.phone, l.course, l.category].some(v => v?.toLowerCase().includes(q))
    );
  }, [leads, query]);

  return (
    <div className="rounded-2xl overflow-hidden border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold shrink-0 text-slate-900 dark:text-white">
          All Predictions
        </h2>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          <input type="text" placeholder="Search…" value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-colors border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-400 dark:focus:border-teal-400" />
        </div>
        <button onClick={() => setQuery('')}
          className="p-2 rounded-lg border transition-colors bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                {['User', 'Course', 'Category', 'Rank', 'Phone', 'Colleges', 'Date'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((l) => (
                <tr key={l._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">

                  {/* User */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold bg-amber-50 dark:bg-teal-400/20 border-amber-200 dark:border-teal-400/30 text-[#F9B406] dark:text-teal-400">
                        {l.user?.name?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {l.user?.name || 'Guest'}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {l.user?.email || '—'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                    {l.course}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg border text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      {l.category}
                    </span>
                  </td>

                  {/* Rank */}
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg border text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      #{l.rank?.toLocaleString()}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5">
                    {l.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 shrink-0 text-[#F9B406]/50 dark:text-teal-400/50" />
                        <span className="text-xs whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {l.phone}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 dark:text-slate-500">—</span>
                    )}
                  </td>

                  {/* Colleges */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onOpenModal(l.matchedColleges)}>
                      {(l.matchedColleges || []).slice(0, 1).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded border text-xs truncate max-w-30 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">{c}</span>
                      ))}
                      {(l.matchedColleges?.length || 0) > 1 && (
                        <span className="text-xs text-[#F9B406]/60 dark:text-teal-400/60">
                          +{l.matchedColleges.length - 1}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 text-xs whitespace-nowrap text-slate-400 dark:text-slate-500">
                    {fmt(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-10 h-10 rounded-2xl border flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No results found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default PredictionsTable;