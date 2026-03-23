/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, Search, Building2 } from 'lucide-react';

const CollegesModal = ({ isOpen, colleges = [], onClose }) => {
  const [query, setQuery]       = useState('');
  const [visible, setVisible]   = useState(false);
  const [rendered, setRendered] = useState(false);
  const overlayRef = useRef(null);
  const inputRef   = useRef(null);

  // Mount / unmount with animation timing
  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setVisible(false);
      const t = setTimeout(() => { setRendered(false); setQuery(''); }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const filtered = colleges.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  if (!rendered) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        backgroundColor: `rgba(0,0,0,${visible ? 0.55 : 0})`,
        backdropFilter: `blur(${visible ? 4 : 0}px)`,
        transition: 'background-color 300ms ease, backdrop-filter 300ms ease',
      }}
    >
      <div
        className="relative w-full sm:max-w-lg flex flex-col rounded-t-3xl sm:rounded-2xl overflow-hidden border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/20"
        style={{
          maxHeight: '85dvh',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
          opacity: visible ? 1 : 0,
          transition: 'transform 300ms cubic-bezier(0.34,1.2,0.64,1), opacity 250ms ease',
        }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-4 sm:pt-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F9B406]/12 dark:bg-teal-500/12 border border-[#F9B406]/20 dark:border-teal-500/20 shrink-0">
              <GraduationCap className="w-4.5 h-4.5 text-[#F9B406] dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2d409c] dark:text-white leading-tight">
                Matched Colleges
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {colleges.length} result{colleges.length !== 1 ? 's' : ''} based on your rank
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search — only show if enough results */}
        {colleges.length > 5 && (
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search colleges…"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/60 text-[#2d409c] dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F9B406]/20 dark:focus:ring-teal-500/20 focus:border-[#F9B406]/50 dark:focus:border-teal-500/50 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2d409c] dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {query && (
              <p className="text-xs mt-2 text-slate-400 dark:text-[#2d409c]">
                {filtered.length} match{filtered.length !== 1 ? 'es' : ''} for "{query}"
              </p>
            )}
          </div>
        )}

        {/* College list */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-3">
          {filtered.length > 0 ? (
            <ul className="space-y-2 pb-2">
              {filtered.map((c, i) => (
                <li
                  key={i}
                  className="group flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 bg-slate-50 dark:bg-slate-900/40 border-slate-150 dark:border-slate-800/70 hover:border-[#F9B406]/40 dark:hover:border-teal-500/30 hover:bg-amber-50/60 dark:hover:bg-teal-500/5"
                  style={{
                    animationDelay: `${i * 30}ms`,
                  }}
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold shrink-0 bg-[#F9B406]/12 dark:bg-teal-500/12 text-[#c8920a] dark:text-teal-400 group-hover:bg-[#F9B406]/20 dark:group-hover:bg-teal-500/20 transition-colors">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-700 group-hover:text-[#F9B406]/60 dark:group-hover:text-teal-500/60 transition-colors" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug truncate">
                      {c}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-1" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-500">No results for "{query}"</p>
              <button onClick={() => setQuery('')} className="text-xs text-[#F9B406] dark:text-teal-400 hover:underline mt-1">
                Clear search
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <GraduationCap className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-1" />
              <p className="text-sm text-slate-400 dark:text-[#2d409c]">No colleges matched your criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/40">
          <p className="text-xs text-slate-400 dark:text-[#2d409c]">
            Based on NEET 2024 cutoff data
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 shadow-sm hover:shadow-md hover:shadow-[#F9B406]/20 dark:hover:shadow-teal-400/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CollegesModal;