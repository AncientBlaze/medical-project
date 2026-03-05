import { useState, useMemo } from 'react';
import { Search, RefreshCw, Phone } from 'lucide-react';
import { fmt, getRankBadge } from '../utils';

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
    <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#2C2E69]">
        <h2 className="text-sm font-semibold text-white shrink-0">All Predictions</h2>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input type="text" placeholder="Search…" value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#2C2E69]/40 border border-[#2C2E69] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#F9B406]/60 transition-colors" />
        </div>
        <button onClick={() => setQuery('')}
          className="p-2 rounded-lg bg-[#2C2E69]/40 border border-[#2C2E69] text-white/30 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2C2E69]">
                {['User', 'Course', 'Category', 'Rank', 'Phone', 'Colleges', 'Date'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/25 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2E69]/50">
              {filtered.map((l) => (
                <tr key={l._id} className="hover:bg-[#2C2E69]/20 transition-colors">

                  {/* User */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center text-xs font-bold text-[#F9B406]">
                        {l.user?.name?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{l.user?.name || 'Guest'}</p>
                        <p className="text-xs text-white/30">{l.user?.email || '—'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-5 py-3.5 text-white/70 font-medium">{l.course}</td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#2C2E69]/60 border border-[#2C2E69] text-xs text-white/60">
                      {l.category}
                    </span>
                  </td>

                  {/* Rank */}
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getRankBadge(l.rank)}`}>
                      #{l.rank?.toLocaleString()}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5">
                    {l.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#F9B406]/50 shrink-0" />
                        <span className="text-xs text-white/60 whitespace-nowrap">{l.phone}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </td>

                  {/* Colleges */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onOpenModal(l.matchedColleges)}>
                      {(l.matchedColleges || []).slice(0, 1).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#2C2E69]/60 border border-[#2C2E69] text-xs text-white/50 truncate max-w-30">{c}</span>
                      ))}
                      {(l.matchedColleges?.length || 0) > 1 && (
                        <span className="text-xs text-[#F9B406]/50">+{l.matchedColleges.length - 1}</span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 text-xs text-white/25 whitespace-nowrap">{fmt(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-10 h-10 rounded-2xl bg-[#2C2E69]/60 border border-[#2C2E69] flex items-center justify-center">
            <Search className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-white/40 text-sm font-medium">No results found</p>
          <p className="text-white/20 text-xs">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default PredictionsTable;