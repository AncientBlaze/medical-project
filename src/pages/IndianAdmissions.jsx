import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Clock, Users, IndianRupee, CheckCircle2,
  ChevronRight, Info, X, Send, Loader2, User, Mail,
  Phone, AlertCircle, CheckCircle, GraduationCap,
  Building2, Shield, BookOpen, ChevronDown, ChevronUp,
  Search, BarChart3, FileText, Filter,
} from 'lucide-react';
import api from '../utils/api.js';
import { allColleges } from '../../data/allColleges.js';

// ── Management type config ─────────────────────────────────────────────────────
const MGMT_TYPES = ['Private', 'Trust', 'Society'];

const MGMT_CONFIG = {
  Private: {
    label: 'Private',
    badgeClass:
      'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    dotClass: 'bg-violet-500',
    filterClass: {
      active: 'bg-violet-600 dark:bg-violet-500 text-white border-violet-600 dark:border-violet-500',
      idle: 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-violet-700 dark:text-violet-400 hover:border-violet-400/50',
    },
  },
  Trust: {
    label: 'Trust',
    badgeClass:
      'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/20',
    dotClass: 'bg-sky-500',
    filterClass: {
      active: 'bg-sky-600 dark:bg-sky-500 text-white border-sky-600 dark:border-sky-500',
      idle: 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-sky-700 dark:text-sky-400 hover:border-sky-400/50',
    },
  },
  Society: {
    label: 'Society',
    badgeClass:
      'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20',
    dotClass: 'bg-rose-500',
    filterClass: {
      active: 'bg-rose-600 dark:bg-rose-500 text-white border-rose-600 dark:border-rose-500',
      idle: 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-rose-700 dark:text-rose-400 hover:border-rose-400/50',
    },
  },
};

// ── Data helpers ───────────────────────────────────────────────────────────────
const privateColleges = allColleges.filter((c) =>
  MGMT_TYPES.includes(c.management)
);

const parseLakh = (str) => {
  if (!str) return null;
  const crore = str.match(/(\d+\.?\d*)\s*~?\s*(\d+\.?\d*)?\s*crore/i);
  if (crore) return parseFloat(crore[1]) * 100;
  const lakh = str.match(/(\d+\.?\d*)\s*lakh/i);
  if (lakh) return parseFloat(lakh[1]);
  return null;
};

const fmtLakh = (n) => (n >= 100 ? `₹${(n / 100).toFixed(1)} Cr` : `₹${n}L`);

const getBestCutoff = (college) => {
  const sq = college.cutoffs?.stateQuota;
  if (!sq) return null;
  for (const cat of ['UR', 'OBCA', 'OBCB', 'EWS', 'SC', 'ST']) {
    const r = sq[cat];
    if (r?.round1) return { rank: r.round1, cat };
  }
  return null;
};

const stateData = (() => {
  const map = {};
  privateColleges.forEach((c) => {
    if (!map[c.state]) map[c.state] = [];
    map[c.state].push(c);
  });
  return Object.entries(map)
    .map(([state, colleges]) => {
      const mgmt = colleges.map((c) => parseLakh(c.fees?.managementQuota)).filter(Boolean);
      const state_ = colleges.map((c) => parseLakh(c.fees?.stateQuota)).filter(Boolean);

      // Per-management-type breakdown
      const byType = {};
      MGMT_TYPES.forEach((t) => {
        byType[t] = colleges.filter((c) => c.management === t).length;
      });

      return {
        id: state.toLowerCase().replace(/\s+/g, '-'),
        name: state,
        colleges,
        count: colleges.length,
        byType,
        seats: colleges.reduce((s, c) => s + (c.seats || 0), 0),
        mgmtMin: mgmt.length ? Math.min(...mgmt) : null,
        mgmtMax: mgmt.length ? Math.max(...mgmt) : null,
        stateMin: state_.length ? Math.min(...state_) : null,
        stateMax: state_.length ? Math.max(...state_) : null,
      };
    })
    .sort((a, b) => b.count - a.count).sort((a, b) => a.name.localeCompare(b.name));
})();

const PRIVATE_FAQS = [
  {
    q: 'What is the difference between State Quota and Management Quota seats?',
    a: 'State Quota (85% of seats) is filled via state counselling based on NEET rank — fees are regulated and significantly lower. Management Quota (15%) is filled directly by the college at higher fees, often with more flexible rank requirements. NRI seats are a small subset at international fee levels.',
  },
  {
    q: 'Is NRI Quota worth it for Indian students?',
    a: 'NRI Quota requires the student or a close relative (generally parents or grandparents) to hold NRI/OCI status. Fees are typically ₹1–1.5 crore for the full course. If a student narrowly misses the state-quota cutoff and the family qualifies, it can be a viable option. Otherwise management quota is usually more accessible.',
  },
  {
    q: 'What NEET rank do I need for a private college?',
    a: 'Under State Quota, private colleges typically fill after all government seats in the state. In West Bengal, state-quota UR cutoffs for private colleges generally fall between rank 40,000–80,000. Management quota has no official rank cutoff and is directly negotiated with the college.',
  },
  {
    q: 'Are private medical college fees regulated?',
    a: 'State Quota fees are fixed by the state fee-regulatory committee and are standardised. Management Quota fees are partly regulated but vary widely — currently ₹75–99 lakhs for the full MBBS course in most WB private colleges. Always verify the current fee structure directly with the college before committing.',
  },
  {
    q: 'What is the difference between Private, Trust, and Society-run colleges?',
    a: 'Private colleges are owned and managed by corporate entities or individuals for profit. Trust-run colleges are operated by registered charitable trusts — they may have a philanthropic mission but still charge significant fees. Society-run colleges are managed by registered societies (often with religious, cultural, or community roots) and may have additional reservation policies for community members. All three types fall under the same NMC regulations and fee-regulatory committees for State Quota seats.',
  },
  {
    q: 'Do private colleges have the same NMC recognition as government ones?',
    a: 'Yes — all NMC-recognised colleges, whether government or private, award the same MBBS degree and graduates are eligible for NEET-PG and state licensing. Always verify the college appears on the NMC approved-college list before applying.',
  },
  {
    q: 'What additional costs should I budget for?',
    a: 'Beyond tuition, budget for hostel/accommodation (₹1–2L/yr), mess charges, exam fees, caution deposits, and optional lab/library fees. Some colleges charge a bond amount against internship completion. Total out-of-pocket cost often exceeds the stated fee by 10–15%.',
  },
];

// ── Management Badge ───────────────────────────────────────────────────────────
const MgmtBadge = ({ management }) => {
  const cfg = MGMT_CONFIG[management];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
};

// ── Management Filter Pill ─────────────────────────────────────────────────────
const MgmtFilterPill = ({ type, active, count, onClick }) => {
  const cfg = MGMT_CONFIG[type];
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        active ? cfg.filterClass.active : cfg.filterClass.idle
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white/80' : cfg.dotClass}`} />
      {cfg.label}
      <span
        className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
          active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
        }`}
      >
        {count}
      </span>
    </button>
  );
};

// ── Lead Capture Modal ─────────────────────────────────────────────────────────
const LeadModal = ({ college, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (loading) return;
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/leads/send-admission', {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ''),
        email: form.email.trim(),
        college: college.name,
        state: college.state,
        source: 'indian-admissions',
        type: 'admission',
      });
      if (res.data?.success) {
        setSuccess(true);
      } else {
        setServerError(res.data?.message || 'Something went wrong');
      }
    } catch (err) {
      if (err?.response?.data?.message?.includes('already exists')) {
        setServerError("You've already submitted an enquiry. We'll contact you soon.");
      } else {
        setServerError('Server is busy. Try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden
          bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
        style={{ maxHeight: '95dvh' }}
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">Request Received!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Our counsellor will contact you within 24 hours regarding{' '}
                <span className="font-semibold text-slate-700 dark:text-white">{college.name}</span>.
              </p>
            </div>
            <button onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              Done
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: '95dvh' }}>
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-[#c8920a] dark:text-teal-400" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{college.state}</span>
                  {college.management && <MgmtBadge management={college.management} />}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{college.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-600">
                  {college.fees?.managementQuota && (
                    <span className="font-semibold text-[#c8920a] dark:text-teal-400">Mgmt: {college.fees.managementQuota}</span>
                  )}
                  {college.fees?.stateQuota && (
                    <span>State: {college.fees.stateQuota}</span>
                  )}
                </div>
              </div>
              <button onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-colors
                  bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-500 dark:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4" noValidate>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Get Free Counselling</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Our admission counsellor will contact you within 24 hours.
                </p>
              </div>

              {serverError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs border
                  bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {serverError}
                </div>
              )}

              {[
                { name: 'name', label: 'Full Name *', type: 'text', Icon: User, placeholder: 'Arjun Sharma', required: true },
                { name: 'phone', label: 'Mobile Number *', type: 'tel', Icon: Phone, placeholder: '98765 43210', required: true },
                { name: 'email', label: 'Email Address', type: 'email', Icon: Mail, placeholder: 'you@example.com', required: false },
              ].map(({ name, label, type, Icon, placeholder, required }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">
                    {label}
                    {!required && <span className="normal-case font-normal text-slate-400 ml-1">(optional)</span>}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
                    <input
                      type={type} name={name} value={form[name]}
                      onChange={handleChange} placeholder={placeholder}
                      autoFocus={name === 'name'}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                        bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                        ${errors[name]
                          ? 'border-red-300 dark:border-red-500/40 focus:border-red-400 focus:ring-red-400/15'
                          : 'border-slate-200 dark:border-slate-700/60 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15'
                        }`}
                    />
                  </div>
                  {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60
                  bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300
                  text-slate-950 shadow-md shadow-[#F9B406]/20 dark:shadow-teal-400/20">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                  : <><Send className="w-4 h-4" />Request Free Counselling</>}
              </button>
              <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                By submitting, you agree to be contacted by a MedSankalp counsellor. No spam, ever.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Fee Pill ───────────────────────────────────────────────────────────────────
const FeePill = ({ label, value, color }) => {
  const colors = {
    green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    slate: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  };
  return (
    <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border ${colors[color]}`}>
      <span className="font-medium opacity-75">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

// ── State Dropdown ─────────────────────────────────────────────────────────────
const StateDropdown = ({ states, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = states.find((s) => s.id === selectedId);
  const filtered = search.trim()
    ? states.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : states;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSearch('');
  }, [open]);

  const handleSelect = (id) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all
          ${open
            ? 'border-[#F9B406] dark:border-teal-400 ring-2 ring-[#F9B406]/20 dark:ring-teal-400/20'
            : 'border-slate-200 dark:border-slate-700/60 hover:border-[#F9B406]/50 dark:hover:border-teal-500/40'
          }
          bg-white dark:bg-slate-900/60`}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0
          bg-[#F9B406]/10 dark:bg-teal-500/10">
          <Building2 className="w-4.5 h-4.5 text-[#c8920a] dark:text-teal-400" style={{ width: 18, height: 18 }} />
        </div>
        <div className="flex-1 min-w-0">
          {selected ? (
            <>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selected.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {selected.count} college{selected.count !== 1 ? 's' : ''}
                  {selected.stateMin ? ` · State from ${fmtLakh(selected.stateMin)}` : ''}
                </p>
                {/* Type dots */}
                <div className="flex items-center gap-1">
                  {MGMT_TYPES.map((t) =>
                    selected.byType[t] > 0 ? (
                      <span key={t} title={`${selected.byType[t]} ${t}`}
                        className={`flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-bold
                          ${MGMT_CONFIG[t].badgeClass} border`}>
                        {t[0]} {selected.byType[t]}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-600">Select a state…</p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-40 top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl overflow-hidden
          bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60"
          style={{ maxHeight: '20rem' }}
        >
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search states…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800
                  border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white
                  placeholder-slate-400 dark:placeholder-slate-600
                  focus:outline-none focus:border-[#F9B406] dark:focus:border-teal-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '15rem' }}>
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-xs text-center text-slate-400 dark:text-slate-600">
                No states found for "{search}"
              </p>
            ) : (
              filtered.map((s) => {
                const isSelected = s.id === selectedId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isSelected
                        ? 'bg-[#F9B406]/8 dark:bg-teal-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? 'text-[#c8920a] dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                        {s.name}
                      </p>
                      <div className="flex items-center flex-wrap gap-1.5 mt-1">
                        {MGMT_TYPES.map((t) =>
                          s.byType[t] > 0 ? (
                            <span key={t}
                              className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded border ${MGMT_CONFIG[t].badgeClass}`}>
                              <span className={`w-1 h-1 rounded-full ${MGMT_CONFIG[t].dotClass}`} />
                              {t} {s.byType[t]}
                            </span>
                          ) : null
                        )}
                        {s.stateMin && (
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                            State {fmtLakh(s.stateMin)}+
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold
                        bg-[#F9B406]/15 dark:bg-teal-500/15 text-[#c8920a] dark:text-teal-400">
                        {s.count}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── College Card ───────────────────────────────────────────────────────────────
const CollegeCard = ({ college, index, onApply }) => {
  const [expanded, setExpanded] = useState(false);
  const bestCutoff = getBestCutoff(college);
  const sq = college.cutoffs?.stateQuota;
  const sqCategories = ['UR', 'OBCA', 'OBCB', 'EWS', 'SC', 'ST'];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200
      bg-white dark:bg-slate-900/40
      border-slate-200 dark:border-slate-700/60
      hover:border-[#F9B406]/40 dark:hover:border-teal-500/30
      hover:shadow-md">

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0
          bg-[#F9B406]/15 dark:bg-teal-500/15 text-[#c8920a] dark:text-teal-400">
          {index + 1}
        </span>
        {/* Management type badge — now shows actual type */}
        <MgmtBadge management={college.management} />
      </div>

      {college.image ? (
        <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
          <img src={college.image} alt={college.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="rounded-xl aspect-video bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
        </div>
      )}

      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-10">
        {college.name}
      </p>

      <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-500">
        <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3 shrink-0" /> {college.university}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 shrink-0" /> Est. {college.established}</span>
        {college.seats && (
          <span className="flex items-center gap-1.5"><Users className="w-3 h-3 shrink-0" /> {college.seats} seats / yr</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        {college.fees?.stateQuota && <FeePill label="State Quota" value={college.fees.stateQuota} color="green" />}
        {college.fees?.managementQuota && <FeePill label="Mgmt Quota" value={college.fees.managementQuota} color="amber" />}
        {college.fees?.nriQuota && <FeePill label="NRI Quota" value={college.fees.nriQuota} color="slate" />}
      </div>

      {bestCutoff && (
        <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg
          bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-600 font-medium">Best Cutoff (UR)</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {bestCutoff.rank.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {sq && (
        <>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center justify-between w-full text-xs font-semibold transition-colors
              text-slate-400 dark:text-slate-600 hover:text-[#c8920a] dark:hover:text-teal-400">
            <span>State Quota Cutoffs</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    <th className="px-2 py-1.5 text-left font-semibold text-slate-500 dark:text-slate-500">Cat</th>
                    {['R1', 'R2', 'R3', 'R4'].map((r) => (
                      <th key={r} className="px-1.5 py-1.5 text-center font-semibold text-slate-500 dark:text-slate-500">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 bg-white dark:bg-slate-900/40">
                  {sqCategories.map((cat) => {
                    const row = sq[cat];
                    if (!row) return null;
                    const hasData = Object.values(row).some((v) => v !== null);
                    if (!hasData) return null;
                    return (
                      <tr key={cat}>
                        <td className="px-2 py-1.5 font-bold text-slate-700 dark:text-slate-300">{cat}</td>
                        {['round1', 'round2', 'round3', 'round4'].map((r) => (
                          <td key={r} className="px-1.5 py-1.5 text-center text-slate-500 dark:text-slate-500">
                            {row[r] ? row[r].toLocaleString('en-IN') : '—'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => onApply(college)}
        className="mt-auto w-full py-2.5 rounded-xl text-sm font-bold transition-colors
          bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
        Apply Now
      </button>
    </div>
  );
};

// ── Management Summary Bar ─────────────────────────────────────────────────────
const MgmtSummaryBar = ({ colleges }) => {
  const counts = {};
  MGMT_TYPES.forEach((t) => {
    counts[t] = colleges.filter((c) => c.management === t).length;
  });
  const total = colleges.length;
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden flex gap-0.5">
        {MGMT_TYPES.map((t) => {
          const pct = ((counts[t] / total) * 100).toFixed(1);
          if (counts[t] === 0) return null;
          return (
            <div
              key={t}
              style={{ width: `${pct}%` }}
              className={`h-full rounded-full ${MGMT_CONFIG[t].dotClass}`}
              title={`${t}: ${counts[t]}`}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {MGMT_TYPES.map((t) =>
          counts[t] > 0 ? (
            <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className={`w-2 h-2 rounded-full ${MGMT_CONFIG[t].dotClass}`} />
              <span className="font-medium">{t}</span>
              <span className="text-slate-400 dark:text-slate-600">({counts[t]})</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

// ── State Detail ───────────────────────────────────────────────────────────────
const StateDetail = ({ state }) => {
  const [applyCollege, setApplyCollege] = useState(null);
  const [search, setSearch] = useState('');
  const [mgmtFilter, setMgmtFilter] = useState('all'); // 'all' | 'Private' | 'Trust' | 'Society'

  const filtered = state.colleges.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchMgmt = mgmtFilter === 'all' || c.management === mgmtFilter;
    return matchSearch && matchMgmt;
  });

  const totalSeats = state.colleges.reduce((s, c) => s + (c.seats || 0), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* State header */}
      <div className="rounded-2xl border p-5 sm:p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0
            bg-[#F9B406]/10 dark:bg-teal-500/10">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#c8920a] dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {MGMT_TYPES.map((t) =>
                state.byType[t] > 0 ? <MgmtBadge key={t} management={t} /> : null
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border
                bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300
                border-emerald-200 dark:border-emerald-500/20">
                NMC Recognised
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Private MBBS in {state.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              {state.count} NMC-approved medical colleges · {totalSeats} total seats
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {[
            { label: 'Colleges', val: state.count },
            { label: 'Total Seats', val: `${totalSeats}/yr` },
            { label: 'State Quota From', val: state.stateMin ? fmtLakh(state.stateMin) : '—' },
            { label: 'Mgmt Quota From', val: state.mgmtMin ? fmtLakh(state.mgmtMin) : '—' },
          ].map(({ label, val }) => (
            <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-medium">{label}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{val}</span>
            </div>
          ))}
        </div>

        
        {/* <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-3">
            College Types
          </p>
          <MgmtSummaryBar colleges={state.colleges} />
        </div> */}
      </div>

      {/* Colleges grid */}
      <div className="rounded-2xl border overflow-hidden bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700/60">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-700/60
          bg-white dark:bg-slate-900/40 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center justify-between gap-2 flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Medical Colleges in {state.name}
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-600 shrink-0">
                {filtered.length} of {state.count}
              </span>
            </div>
            <div className="relative sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-600 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search colleges…"
                className="w-full pl-8 pr-4 py-2 text-xs rounded-xl border transition-colors focus:outline-none focus:ring-2
                  bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700
                  text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                  focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
              />
            </div>
          </div>

          {/* Management type filter row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Type:
            </span>
            <button
              onClick={() => setMgmtFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                mgmtFilter === 'all'
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-400/50'
              }`}
            >
              All ({state.count})
            </button>
            {MGMT_TYPES.map((t) =>
              state.byType[t] > 0 ? (
                <MgmtFilterPill
                  key={t}
                  type={t}
                  active={mgmtFilter === t}
                  count={state.byType[t]}
                  onClick={() => setMgmtFilter(mgmtFilter === t ? 'all' : t)}
                />
              ) : null
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-600 text-sm">
            No colleges found{search ? ` for "${search}"` : ''}{mgmtFilter !== 'all' ? ` under ${mgmtFilter}` : ''}
          </div>
        ) : (
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((college, i) => (
              <CollegeCard key={college.uid ?? college.id} college={college} index={i} onApply={setApplyCollege} />
            ))}
          </div>
        )}
      </div>

      {applyCollege && (
        <LeadModal college={applyCollege} onClose={() => setApplyCollege(null)} />
      )}
    </div>
  );
};

// ── All Colleges Table ─────────────────────────────────────────────────────────
const AllCollegesTable = () => {
  const [sortKey, setSortKey] = useState('state');
  const [sortDir, setSortDir] = useState(1);
  const [stateFilter, setStateFilter] = useState('all');
  const [mgmtFilter, setMgmtFilter] = useState('all');
  const [applyCollege, setApplyCollege] = useState(null);

  const states = [...new Set(privateColleges.map((c) => c.state))].sort();

  const getCutoffVal = (c) => c.cutoffs?.stateQuota?.UR?.round1 ?? Infinity;

  // Type counts for the current state filter
  const typeCounts = {};
  MGMT_TYPES.forEach((t) => {
    typeCounts[t] = privateColleges.filter(
      (c) => (stateFilter === 'all' || c.state === stateFilter) && c.management === t
    ).length;
  });

  const sorted = [...privateColleges]
    .filter((c) => {
      const matchState = stateFilter === 'all' || c.state === stateFilter;
      const matchMgmt = mgmtFilter === 'all' || c.management === mgmtFilter;
      return matchState && matchMgmt;
    })
    .sort((a, b) => {
      if (sortKey === 'state') return a.state.localeCompare(b.state) * sortDir;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * sortDir;
      if (sortKey === 'management') return a.management.localeCompare(b.management) * sortDir;
      if (sortKey === 'seats') return ((b.seats || 0) - (a.seats || 0)) * sortDir;
      if (sortKey === 'stateFee') return ((parseLakh(a.fees?.stateQuota) ?? Infinity) - (parseLakh(b.fees?.stateQuota) ?? Infinity)) * sortDir;
      if (sortKey === 'mgmtFee') return ((parseLakh(a.fees?.managementQuota) ?? Infinity) - (parseLakh(b.fees?.managementQuota) ?? Infinity)) * sortDir;
      if (sortKey === 'cutoff') return (getCutoffVal(a) - getCutoffVal(b)) * sortDir;
      return 0;
    });

  const toggle = (key) => {
    if (sortKey === key) setSortDir((d) => d * -1);
    else { setSortKey(key); setSortDir(1); }
  };

  const SortTh = ({ label, k }) => (
    <th onClick={() => toggle(k)}
      className="px-3 py-3 text-center font-semibold text-slate-500 dark:text-slate-400 cursor-pointer select-none
        hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap">
      <span className="flex items-center justify-center gap-1">
        {label}
        {sortKey === k
          ? (sortDir === 1 ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)
          : <ChevronDown className="w-3 h-3 opacity-30" />}
      </span>
    </th>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* State filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...states].map((s) => (
          <button key={s} onClick={() => { setStateFilter(s); setMgmtFilter('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${stateFilter === s
                ? 'bg-[#F9B406] dark:bg-teal-400 text-slate-950 border-[#F9B406] dark:border-teal-400'
                : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-[#F9B406]/40'
              }`}>
            {s === 'all' ? 'All States' : s}
          </button>
        ))}
      </div>

      {/* Management type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Type:
        </span>
        <button
          onClick={() => setMgmtFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            mgmtFilter === 'all'
              ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200'
              : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-400/50'
          }`}
        >
          All
        </button>
        {MGMT_TYPES.map((t) =>
          typeCounts[t] > 0 ? (
            <MgmtFilterPill
              key={t}
              type={t}
              active={mgmtFilter === t}
              count={typeCounts[t]}
              onClick={() => setMgmtFilter(mgmtFilter === t ? 'all' : t)}
            />
          ) : null
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <table className="w-full text-xs min-w-176">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40">
              <th className="px-3 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 w-8">#</th>
              <SortTh label="College" k="name" />
              <SortTh label="State" k="state" />
              <SortTh label="Type" k="management" />
              <SortTh label="Seats" k="seats" />
              <SortTh label="State Quota" k="stateFee" />
              <SortTh label="Mgmt Quota" k="mgmtFee" />
              <SortTh label="Best Cutoff (UR)" k="cutoff" />
              <th className="px-3 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/40">
            {sorted.map((c, i) => {
              const co = getBestCutoff(c);
              return (
                <tr key={c.uid ?? c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-3 text-slate-400 dark:text-slate-600 font-medium">{i + 1}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white max-w-56">
                    <span className="line-clamp-2 leading-tight">{c.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 font-normal">{c.university} · Est. {c.established}</span>
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">{c.state}</td>
                  {/* Management type column */}
                  <td className="px-3 py-3 text-center">
                    <MgmtBadge management={c.management} />
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400">{c.seats ?? '—'}</td>
                  <td className="px-3 py-3 text-center font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">{c.fees?.stateQuota ?? '—'}</td>
                  <td className="px-3 py-3 text-center font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">{c.fees?.managementQuota ?? '—'}</td>
                  <td className="px-3 py-3 text-center text-slate-700 dark:text-slate-300 font-semibold">
                    {co ? co.rank.toLocaleString('en-IN') : '—'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => setApplyCollege(c)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors
                        bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
                      Apply
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-600">
        {sorted.length} college{sorted.length !== 1 ? 's' : ''} · Click column headers to sort
      </p>

      {applyCollege && (
        <LeadModal college={applyCollege} onClose={() => setApplyCollege(null)} />
      )}
    </div>
  );
};

// ── FAQ ────────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="flex flex-col gap-2">
      {PRIVATE_FAQS.map(({ q, a }, i) => (
        <div key={i} className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left gap-3
              text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <span className="leading-snug">{q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
              : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
          </button>
          {open === i && (
            <div className="px-5 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
              {a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────────
const Admissions = () => {
  const [selectedId, setSelectedId] = useState(stateData[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState('states');
  const detailRef = useRef(null);

  const selectedState = stateData.find((s) => s.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setActiveTab('states');
    setTimeout(() => {
      if (detailRef.current && window.innerWidth < 1024) {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const totalPrivate = privateColleges.length;
  const totalSeats = privateColleges.reduce((s, c) => s + (c.seats || 0), 0);
  const stateCount = stateData.length;

  // Global type counts for hero stats
  const globalTypeCounts = {};
  MGMT_TYPES.forEach((t) => {
    globalTypeCounts[t] = privateColleges.filter((c) => c.management === t).length;
  });

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-slate-900/60 dark:to-slate-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none
    bg-[radial-gradient(ellipse_75%_45%_at_50%_-10%,rgba(249,180,6,0.12),transparent)]
    dark:bg-[radial-gradient(ellipse_75%_45%_at_50%_-10%,rgba(20,184,166,0.12),transparent)]" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-[0.05] dark:opacity-[0.08]
    bg-[#F9B406] dark:bg-teal-400 blur-3xl pointer-events-none" />

        <div className="relative w-full px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6
      bg-white/70 dark:bg-slate-900/50 border-amber-200 dark:border-slate-700 backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-400">
              Private MBBS India 2026–27
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[#2D409C] dark:text-white">
            Private MBBS{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r
        from-[#F9B406] to-[#F9B406]/60
        dark:from-teal-400 dark:to-teal-400/60">
              in India
            </span>
          </h1>

          <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            NMC-approved private, trust & society medical colleges across India — fees, cutoffs, and seat availability at a glance.
          </p>

          {/* Stats — now includes type breakdown */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { icon: MapPin, label: `${stateCount} states` },
              { icon: Building2, label: `${totalPrivate} colleges` },
              { icon: Users, label: `${totalSeats.toLocaleString('en-IN')} seats/yr` },
              { icon: Shield, label: 'NMC recognised' },
              { icon: GraduationCap, label: 'NEET-based admissions' },
            ].map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium
          bg-white/70 dark:bg-slate-900/50 border-amber-200 dark:border-slate-700/60
          text-slate-700 dark:text-slate-400 backdrop-blur-md
          transition hover:shadow-lg hover:shadow-amber-200/30 dark:hover:shadow-teal-900/20">
                <Icon className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                {label}
              </div>
            ))}
          </div>

          {/* Management type pills in hero */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {MGMT_TYPES.map((t) =>
              globalTypeCounts[t] > 0 ? (
                <div key={t}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold
                    bg-white/70 dark:bg-slate-900/50 backdrop-blur-md ${MGMT_CONFIG[t].badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${MGMT_CONFIG[t].dotClass}`} />
                  {globalTypeCounts[t]} {t}-run
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="rounded-2xl border p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-8
            bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 max-w-4xl mx-auto">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Need help with private college admissions?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                MedSankalp's counsellors help you navigate state counselling, management quota seats, and documentation — end to end.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link to="/admission-support"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all
                  active:scale-95 bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
                View Admission Plans →
              </Link>
              <Link to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all
                  active:scale-95 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Talk to Counsellor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notice ───────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 pt-5 sm:pt-6">
        <div className="flex items-start gap-3 p-4 rounded-2xl border text-xs
          bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20
          text-amber-700 dark:text-amber-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> Cutoff data shown is from the most recent counselling cycle and is for reference only.
            State Quota seats are filled via state counselling; Management/NRI seats are filled by the college directly.
            Colleges listed include Private, Trust, and Society-managed institutions — all NMC recognised.
            Always verify current fee structures with the respective college before applying.
          </span>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 px-4 sm:px-6 lg:px-10 pt-4 pb-3
        bg-[#fffdf7]/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="flex gap-1 p-1 rounded-xl border bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 w-fit">
          {[
            { id: 'states', label: 'States & Colleges', icon: Building2 },
            { id: 'compare', label: 'Compare All', icon: BarChart3 },
            { id: 'faq', label: 'FAQs', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all
                ${activeTab === id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-8">

        {activeTab === 'states' && (
          <div className="flex flex-col gap-5">
            <div className="max-w-sm">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-2 px-1">
                Select State
              </label>
              <StateDropdown
                states={stateData}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </div>

            <div ref={detailRef} className="scroll-mt-24">
              {selectedState
                ? <StateDetail key={selectedState.id} state={selectedState} />
                : (
                  <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
                    <Building2 className="w-10 h-10 text-slate-200 dark:text-slate-800" />
                    <p className="text-slate-400 dark:text-slate-600 text-sm">Select a state to view colleges</p>
                  </div>
                )}
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">All Colleges</h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Sort and filter all {totalPrivate} Private, Trust & Society MBBS colleges across India.
              </p>
            </div>
            <AllCollegesTable />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="flex flex-col gap-5 max-w-3xl">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Common questions about private MBBS admissions in India.
              </p>
            </div>
            <FAQ />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admissions;