import { useState, useMemo } from 'react';
import { Search, RefreshCw, Phone } from 'lucide-react';
import { fmt } from '../utils';
import useThemeStore from '../../../store/themeStore';

const PredictionsTable = ({ leads, onOpenModal }) => {
  const [query, setQuery] = useState('');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const filtered = useMemo(() => {
    if (!query) return leads;
    const q = query.toLowerCase();
    return leads.filter(l =>
      [l.user?.name, l.user?.email, l.user?.phone, l.course, l.category].some(v => v?.toLowerCase().includes(q))
    );
  }, [leads, query]);

  return (
    <div className={`rounded-2xl overflow-hidden border ${
      isDark ? 'bg-[#2C2E69]/30 border-[#2C2E69]' : 'bg-white border-slate-200 shadow-sm'
    }`}>

      {/* Header */}
      <div className={`flex items-center gap-4 px-6 py-4 border-b ${isDark ? 'border-[#2C2E69]' : 'border-slate-200'}`}>
        <h2 className={`text-sm font-semibold shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          All Predictions
        </h2>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
          <input type="text" placeholder="Search…" value={query}
            onChange={e => setQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-colors border ${
              isDark
                ? 'bg-[#2C2E69]/40 border-[#2C2E69] text-white placeholder-white/20 focus:border-[#F9B406]/60'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400'
            }`} />
        </div>
        <button onClick={() => setQuery('')}
          className={`p-2 rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#2C2E69]/40 border-[#2C2E69] text-white/30 hover:text-white'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
          }`}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-[#2C2E69]' : 'border-slate-200'}`}>
                {['User', 'Course', 'Category', 'Rank', 'Phone', 'Colleges', 'Date'].map(h => (
                  <th key={h} className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
                    isDark ? 'text-white/25' : 'text-slate-400'
                  }`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2C2E69]/50' : 'divide-slate-100'}`}>
              {filtered.map((l) => (
                <tr key={l._id} className={`transition-colors ${isDark ? 'hover:bg-[#2C2E69]/20' : 'hover:bg-slate-50'}`}>

                  {/* User */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold text-[#F9B406] ${
                        isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'
                      }`}>
                        {l.user?.name?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {l.user?.name || 'Guest'}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                          {l.user?.email || '—'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className={`px-5 py-3.5 font-medium ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                    {l.course}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs ${
                      isDark
                        ? 'bg-[#2C2E69]/60 border-[#2C2E69] text-white/60'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {l.category}
                    </span>
                  </td>

                  {/* Rank */}
                  <td className="px-5 py-3.5 ">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs ${
                      isDark
                        ? 'bg-[#2C2E69]/60 border-[#2C2E69] text-white/60'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      #{l.rank?.toLocaleString()}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5">
                    {l.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#F9B406]/50 shrink-0" />
                        <span className={`text-xs whitespace-nowrap ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                          {l.phone}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-xs ${isDark ? 'text-white/20' : 'text-slate-300'}`}>—</span>
                    )}
                  </td>

                  {/* Colleges */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onOpenModal(l.matchedColleges)}>
                      {(l.matchedColleges || []).slice(0, 1).map((c, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded border text-xs truncate max-w-30 ${
                          isDark
                            ? 'bg-[#2C2E69]/60 border-[#2C2E69] text-white/50'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>{c}</span>
                      ))}
                      {(l.matchedColleges?.length || 0) > 1 && (
                        <span className="text-xs text-[#F9B406]/60">
                          +{l.matchedColleges.length - 1}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className={`px-5 py-3.5 text-xs whitespace-nowrap ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
                    {fmt(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
            isDark ? 'bg-[#2C2E69]/60 border-[#2C2E69]' : 'bg-slate-100 border-slate-200'
          }`}>
            <Search className={`w-5 h-5 ${isDark ? 'text-white/20' : 'text-slate-400'}`} />
          </div>
          <p className={`text-sm font-medium ${isDark ? 'text-white/40' : 'text-slate-500'}`}>No results found</p>
          <p className={`text-xs ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default PredictionsTable;