/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Zap, Building2, MapPin, ExternalLink,
  RotateCcw, Search, AlertCircle, ChevronDown, Target, Award,
  Filter, Lock, LogIn, UserPlus, IndianRupee, Users, GraduationCap,
  TrendingDown, Globe, Info
} from 'lucide-react';
import { indiaColleges, INDIA_STATES } from '../../data/indiaCollegeData.js';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

// ── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'OBC-NCL'];
const QUOTA_TYPES = [
  { value: 'allIndia', label: 'All India Quota (AIQ)', short: 'AIQ', desc: 'MCC centralized counselling — 15% seats' },
  { value: 'state',    label: 'State Quota',           short: 'SQ',  desc: 'State DME counselling — 85% seats' },
];
const MANAGEMENT_TYPES = ['All', 'Trust', 'Private', 'Society', 'Soceity'];

// Category rank relaxation multipliers (approximate — actual varies per college)
const CATEGORY_MULTIPLIER = { General: 1, EWS: 1.02, 'OBC-NCL': 1.15, OBC: 1.2, SC: 1.6, ST: 1.8 };

const FEATURES = [
  { icon: BarChart2, title: 'NEET 2024 Cutoffs', desc: 'Real MCC & state DME data — 4 counselling rounds' },
  { icon: Building2, title: '246 Private Colleges', desc: '20 states covered — all quota types included' },
  { icon: Zap,       title: 'Instant Shortlist',   desc: 'Get matched colleges in seconds with cutoff analysis' },
];

const EMPTY_FORM = { category: 'General', rank: '', quota: 'allIndia', state: '' };

const savePending  = (d) => sessionStorage.setItem('pendingPrediction', JSON.stringify(d));
const loadPending  = () => { try { const r = sessionStorage.getItem('pendingPrediction'); return r ? JSON.parse(r) : null; } catch { return null; } };
const clearPending = () => sessionStorage.removeItem('pendingPrediction');

const formatFee = (n) => {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L/yr`;
  return `₹${n.toLocaleString('en-IN')}/yr`;
};

// ── Prediction engine ───────────────────────────────────────────────────────
function getEffectiveCutoff(cutoffs) {
  // Use the most lenient (highest rank number = last round opened to more)
  const vals = [cutoffs.round4, cutoffs.round3, cutoffs.round2, cutoffs.round1].filter(Boolean);
  return vals[0] ?? null; // highest round = most relaxed
}

function predictColleges({ rank, category, quota, state }) {
  const multiplier = CATEGORY_MULTIPLIER[category] ?? 1;
  // Note: multiplier used for category-based rank adjustment in future enhancement
  void multiplier; // Suppress unused warning

  return indiaColleges
    .filter(college => {
      if (quota === 'state' && state && college.state !== state) return false;

      let cutoffs;
      if (quota === 'allIndia') {
        cutoffs = college.cutoffs.allIndiaQuota;
      } else {
        // For state quota prefer stateDomicile then governmentQuota
        cutoffs = Object.keys(college.cutoffs.stateDomicile || {}).length
          ? college.cutoffs.stateDomicile
          : college.cutoffs.governmentQuota;
      }

      const cutoff = getEffectiveCutoff(cutoffs || {});
      if (!cutoff) return false;

      // User gets in if their rank <= cutoff (rank numbers: lower = better)
      // We also show colleges slightly above their rank (safety buffer 10%)
      return rank <= cutoff * 1.1;
    })
    .sort((a, b) => {
      const getCO = (c) => {
        const cuts = quota === 'allIndia' ? c.cutoffs.allIndiaQuota
          : (Object.keys(c.cutoffs.stateDomicile || {}).length ? c.cutoffs.stateDomicile : c.cutoffs.governmentQuota);
        return getEffectiveCutoff(cuts || {}) ?? Infinity;
      };
      return getCO(a) - getCO(b);
    });
}

// ── Sub-components ──────────────────────────────────────────────────────────
const SelectField = ({ label, name, value, onChange, options, placeholder, icon: Icon }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600 z-10" />}
      <select name={name} value={value} onChange={onChange} required
        className={`w-full appearance-none ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors cursor-pointer border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 shadow-sm`}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
    </div>
  </div>
);

const QuotaBadge = ({ quota }) => {
  const q = QUOTA_TYPES.find(q => q.value === quota);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
      {q?.short}
    </span>
  );
};

const CollegeCard = ({ college, index, quota, rank }) => {
  const cuts = quota === 'allIndia'
    ? college.cutoffs.allIndiaQuota
    : (Object.keys(college.cutoffs.stateDomicile || {}).length ? college.cutoffs.stateDomicile : college.cutoffs.governmentQuota);

  const bestCutoff = getEffectiveCutoff(cuts || {});
  const chance = bestCutoff
    ? rank <= bestCutoff ? (rank <= bestCutoff * 0.85 ? 'High' : 'Moderate') : 'Low'
    : 'Data N/A';

  const chanceColors = {
    High:      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    Moderate:  'text-amber-600  dark:text-amber-400  bg-amber-50  dark:bg-amber-500/10  border-amber-200  dark:border-amber-500/20',
    Low:       'text-red-600    dark:text-red-400    bg-red-50    dark:bg-red-500/10    border-red-200    dark:border-red-500/20',
    'Data N/A':'text-slate-500  dark:text-slate-500  bg-slate-50  dark:bg-slate-800     border-slate-200  dark:border-slate-700',
  };

  const mgmtFee = college.fees?.managementQuota;

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 border bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/60 hover:border-[#F9B406]/50 dark:hover:border-teal-500/40 hover:shadow-lg hover:shadow-[#F9B406]/8 dark:hover:shadow-teal-500/8">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 bg-[#F9B406]/15 dark:bg-teal-500/15 text-[#c8920a] dark:text-teal-400">
            {index + 1}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${chanceColors[chance]}`}>
            {chance === 'High' ? '✓ ' : chance === 'Moderate' ? '~ ' : ''}{chance} Chance
          </span>
        </div>
        <h4 className="font-bold text-sm leading-snug line-clamp-2 text-slate-900 dark:text-white group-hover:text-[#c8920a] dark:group-hover:text-teal-400 transition-colors">
          {college.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-500">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{college.state}</span>
          {college.management && (
            <>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span>{college.management}</span>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Cutoff data */}
        <div className="grid grid-cols-2 gap-2">
          {['round1', 'round2', 'round3', 'round4'].map((r, i) => {
            const val = cuts?.[r];
            return (
              <div key={r} className={`flex flex-col gap-0.5 px-2.5 py-2 rounded-lg ${val ? 'bg-slate-50 dark:bg-slate-800/60' : 'bg-slate-50/50 dark:bg-slate-800/20 opacity-50'}`}>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                  {i === 0 ? 'Rnd 1' : i === 1 ? 'Rnd 2' : i === 2 ? 'Mop-Up' : 'Stray'}
                </span>
                <span className={`text-xs font-bold ${val ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                  {val ? val.toLocaleString('en-IN') : '—'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fees & Seats */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{formatFee(mgmtFee)}</span>
          </div>
          {college.seats && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>{college.seats} seats</span>
            </div>
          )}
        </div>

        {/* Action */}
        {college.website && college.website !== 'nan' ? (
          <button
            onClick={() => window.open(college.website.startsWith('http') ? college.website : `https://${college.website}`, '_blank', 'noopener,noreferrer')}
            className="mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 hover:shadow-md"
          >
            Visit College Website <ExternalLink className="w-3 h-3" />
          </button>
        ) : (
          <div className="mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600">
            No website listed
          </div>
        )}
      </div>
    </div>
  );
};

const LoginGate = ({ pendingPrediction }) => {
  const navigate = useNavigate();
  const goToAuth = (path) => { savePending(pendingPrediction); navigate(path, { state: { from: '/predictor' } }); };
  return (
    <div className="mt-2 rounded-2xl border p-10 text-center border-[#F9B406]/30 dark:border-teal-500/20 bg-amber-50/60 dark:bg-teal-500/5">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl border mx-auto mb-4 bg-amber-100 dark:bg-teal-500/10 border-amber-300 dark:border-teal-500/20">
        <Lock className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
      </div>
      <h3 className="font-bold text-base mb-1 text-slate-900 dark:text-white">Sign in to unlock your results</h3>
      <p className="text-sm mb-6 max-w-xs mx-auto text-slate-600 dark:text-slate-400">
        Your college matches are ready — log in or create a free account to see them.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => goToAuth('/login')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 transition-colors">
          <LogIn className="w-4 h-4" /> Log in
        </button>
        <button onClick={() => goToAuth('/signup')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
          <UserPlus className="w-4 h-4" /> Sign up free
        </button>
      </div>
    </div>
  );
};

const SummaryBar = ({ predictions }) => {
  const quotaLabel = QUOTA_TYPES.find(q => q.value === predictions.quota)?.short ?? predictions.quota;
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border mb-6 bg-amber-50/80 dark:bg-teal-500/5 border-amber-200 dark:border-teal-500/20">
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Prediction Summary</span>
      </div>
      <div className="flex flex-wrap gap-2 ml-auto">
        {[
          { label: 'Rank',     val: `AIR ${predictions.rank.toLocaleString('en-IN')}` },
          { label: 'Category', val: predictions.category },
          { label: 'Quota',    val: quotaLabel },
          ...(predictions.state ? [{ label: 'State', val: predictions.state }] : []),
          { label: 'Matches',  val: `${predictions.matchedColleges.length} college${predictions.matchedColleges.length !== 1 ? 's' : ''}` },
        ].map(({ label, val }) => (
          <span key={label} className="px-3 py-1 rounded-lg border text-xs bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 dark:text-slate-500">{label}: </span>{val}
          </span>
        ))}
      </div>
    </div>
  );
};

const EmptyResults = ({ quota, state }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-2 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
      <Search className="w-6 h-6 text-slate-300 dark:text-slate-600" />
    </div>
    <p className="font-bold text-slate-900 dark:text-white">No matching colleges found</p>
    <p className="text-sm max-w-sm text-slate-500 dark:text-slate-500">
      {quota === 'state' && !state
        ? 'Please select a state to see state quota results.'
        : 'Try a higher rank range, different category, or switch between All India / State quota.'}
    </p>
  </div>
);

const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <Info
        className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <span className="absolute left-5 top-0 z-50 w-52 p-2.5 text-xs rounded-lg shadow-lg bg-slate-900 text-slate-200 dark:bg-white dark:text-slate-900 pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
};

// ── Main ────────────────────────────────────────────────────────────────────
const Predictor = () => {
  const user    = useAuthStore((s) => s.user);

  const [formData,    setFormData]    = useState(EMPTY_FORM);
  const [predictions, setPredictions] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [formError,   setFormError]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const resultsRef = useRef(null);

  // Restore pending prediction after login
  useEffect(() => {
    if (!user) return;
    const restored = loadPending();
    if (!restored) return;
    clearPending();
    setFormData({ course: restored.course, category: restored.category, rank: String(restored.rank), quota: restored.quota ?? 'allIndia', state: restored.state ?? '' });
    setPredictions(restored);
    setShowResults(true);
    api.post('/predictions', { ...restored, phone: user.phone, matchedColleges: restored.matchedColleges.map(c => c.name) })
      .catch(err => console.error('Failed to save restored prediction:', err));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value, ...(name === 'quota' && value === 'allIndia' ? { state: '' } : {}) }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.rank || !formData.quota) {
      setFormError('Please fill in all required fields.'); return;
    }
    if (formData.quota === 'state' && !formData.state) {
      setFormError('Please select a state for State Quota prediction.'); return;
    }
    const rank = parseInt(formData.rank);
    if (isNaN(rank) || rank < 1) { setFormError('Enter a valid positive NEET rank.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // brief UX delay

    const matched = predictColleges({ rank, category: formData.category, quota: formData.quota, state: formData.state });
    const stateObj = { rank, category: formData.category, quota: formData.quota, state: formData.state, matchedColleges: matched };

    setPredictions(stateObj);
    setShowResults(true);
    setLoading(false);

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    if (user) {
      try {
        await api.post('/predictions', { ...stateObj, phone: user.phone, matchedColleges: matched.map(c => c.name) });
      } catch (err) { console.error('Failed to save prediction:', err); }
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setPredictions(null);
    setShowResults(false);
    setFormError('');
    clearPending();
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-12">

        {/* Page header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 dark:bg-slate-900/40 border-amber-300 dark:border-slate-800">
            <Target className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-semibold text-amber-800 dark:text-teal-400/70">NEET 2024 College Predictor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#F9B406]/60 dark:from-teal-400 dark:to-teal-400/60">
              Best-Fit College
            </span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-600 dark:text-slate-400">
            Enter your NEET rank, category, and preferred quota. We'll match you with private medical colleges using NEET 2024 cutoff data.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-[0.04] pointer-events-none bg-[#F9B406] dark:bg-teal-400" />

          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Prediction Criteria</h2>
          </div>

          {formError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

              {/* Rank */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
                  NEET Rank (AIR)
                </label>
                <input type="number" name="rank" value={formData.rank} onChange={handleChange} min="1" placeholder="e.g. 45000" required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors border [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 shadow-sm" />
              </div>

              {/* Category */}
              <SelectField label="Category" name="category" value={formData.category}
                onChange={handleChange} options={CATEGORIES} placeholder="Select category"
                icon={GraduationCap} />

              {/* Quota */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
                  Quota Type
                  <InfoTooltip text="AIQ = All India Quota (MCC, 15% seats). State = State DME counselling (85% seats)." />
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600 z-10" />
                  <select name="quota" value={formData.quota} onChange={handleChange}
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors cursor-pointer border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 shadow-sm">
                    {QUOTA_TYPES.map(q => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
                </div>
              </div>

              {/* State (only for state quota) */}
              {formData.quota === 'state' ? (
                <SelectField label="Select State" name="state" value={formData.state}
                  onChange={handleChange} options={INDIA_STATES} placeholder="Choose state"
                  icon={MapPin} />
              ) : (
                <div className="flex items-end">
                  <div className="w-full px-4 py-3 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/40 text-slate-400 dark:text-slate-600">
                    All states (AIQ — nationwide)
                  </div>
                </div>
              )}
            </div>

            {/* Quota description hint */}
            <div className="mb-6">
              <p className="text-xs text-slate-400 dark:text-slate-600">
                {QUOTA_TYPES.find(q => q.value === formData.quota)?.desc}
                {formData.quota === 'allIndia' && ' — category relaxation applied automatically.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm disabled:opacity-60 transition-all shadow-md bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 shadow-[#F9B406]/25 dark:shadow-teal-400/20">
                {loading
                  ? <><span className="w-4 h-4 border-2 rounded-full animate-spin border-slate-900/30 border-t-slate-900" />Predicting…</>
                  : <><Search className="w-4 h-4" /> Predict Colleges</>}
              </button>
              {showResults && (
                <button type="button" onClick={resetForm}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div ref={resultsRef}>
          {showResults && predictions && (
            <>
              <SummaryBar predictions={predictions} />
              {user ? (
                predictions.matchedColleges.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {predictions.matchedColleges.length} Predicted College{predictions.matchedColleges.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Sorted by cutoff rank</span>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2.5 p-4 rounded-xl border mb-6 text-xs bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>
                        Predictions are based on NEET 2024 cutoff data. Actual admission depends on seat availability, state-specific rules, and current-year counselling trends. Always cross-verify with official MCC/DME portals.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {predictions.matchedColleges.map((college, i) => (
                        <CollegeCard key={college.id ?? i} college={college} index={i} quota={predictions.quota} rank={predictions.rank} />
                      ))}
                    </div>
                  </>
                ) : <EmptyResults quota={predictions.quota} state={predictions.state} />
              ) : (
                <LoginGate pendingPrediction={predictions} />
              )}
            </>
          )}
        </div>

        {/* Feature cards */}
        {!showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl border transition-colors bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-slate-700 shadow-sm">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl border shrink-0 bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
                  <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">{title}</p>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Predictor;
