import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Zap, Building2, MapPin,
  RotateCcw, Search, AlertCircle, ChevronDown, Target, Award,
  Filter, Lock, LogIn, UserPlus, IndianRupee, Users, GraduationCap,
  TrendingDown, Globe, Info
} from 'lucide-react';
import { allColleges } from '../../data/allColleges.js';
import { PAN_INDIA_STATES } from '../../data/panIndiaCollegeData.js';
import api from '../utils/api.js';
import useAuthStore from '../store/authStore.js';

// ── Constants ────────────────────────────────────────────────────────────────

const ALL_STATES = ['West Bengal', ...PAN_INDIA_STATES];

const CATEGORIES = [
  { value: 'UR', label: 'General (UR)' },
  { value: 'EWS', label: 'EWS' },
  { value: 'OBC', label: 'OBC' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
  { value: 'UR_PWD', label: 'UR (PWD)' },
];

const QUOTA_TYPES = [
  { value: 'allIndia', label: 'All India Quota (AIQ)', short: 'AIQ', desc: 'MCC centralized counselling — 15% seats. Only Govt / Central Govt colleges.' },
  { value: 'state', label: 'State Quota', short: 'SQ', desc: 'State counselling — 85% seats across all colleges.' },
  { value: 'privateManagement', label: 'Private Management', short: 'PM', desc: 'Management quota seats in private colleges — not category-specific.' },
];

const ROUNDS = [
  { value: 'round1', label: 'Round 1' },
  { value: 'round2', label: 'Round 2' },
  { value: 'round3', label: 'Round 3 / Mop-Up' },
  { value: 'round4', label: 'Round 4 / Stray' },
];

const MANAGEMENT_FILTERS = [
  { value: 'all', label: 'All Colleges' },
  { value: 'govt', label: 'Govt / Central Govt' },
  { value: 'private', label: 'Private' },
];

const ROUND_LABELS = { round1: 'Rnd 1', round2: 'Rnd 2', round3: 'Mop-Up', round4: 'Stray' };

const FEATURES = [
  { icon: BarChart2, title: 'NEET 2026 Cutoffs', desc: 'Real counselling data — 4 rounds, all categories' },
  { icon: Building2, title: '415+ Colleges', desc: '20 states — Govt, Central Govt & Private colleges' },
  { icon: Zap, title: 'Category-Wise Results', desc: 'UR / OBC / EWS / SC / ST / PWD — precise eligibility' },
];

const EMPTY_FORM = { state: 'West Bengal', category: 'UR', rank: '', quota: 'state', round: 'round1', mgmtFilter: 'all' };

const savePending = (d) => sessionStorage.setItem('pendingPrediction', JSON.stringify(d));
const loadPending = () => { try { const r = sessionStorage.getItem('pendingPrediction'); return r ? JSON.parse(r) : null; } catch { return null; } };
const clearPending = () => sessionStorage.removeItem('pendingPrediction');

// ── Data helpers ──────────────────────────────────────────────────────────────

function getCollegesForState(state) {
  return allColleges.filter((c) => c.state === state);
}

// WB uses OBCA for state quota; other states use OBC directly
function getCutoff(college, quotaType, category, round, isWB) {
  const { cutoffs } = college;
  if (!cutoffs) return null;

  if (quotaType === 'allIndia') {
    const cat = cutoffs.allIndiaQuota?.[category];
    return cat?.[round] ?? null;
  }
  if (quotaType === 'state') {
    const stateKey = isWB && category === 'OBC' ? 'OBCA' : category;
    const cat = cutoffs.stateQuota?.[stateKey];
    return cat?.[round] ?? null;
  }
  if (quotaType === 'privateManagement') {
    return cutoffs.privateManagement?.[round] ?? null;
  }
  return null;
}

function getEligibility(rank, cutoff) {
  if (!cutoff) return null;
  if (rank <= cutoff * 0.85) return 'safe';
  if (rank <= cutoff) return 'borderline';
  return 'unlikely';
}

function predictColleges({ rank, category, quota, round, mgmtFilter, state }) {
  const isWB = state === 'West Bengal';
  const pool = getCollegesForState(state);

  return pool
    .filter((c) => {
      if (mgmtFilter === 'govt' && c.management === 'Private') return false;
      if (mgmtFilter === 'private' && c.management !== 'Private') return false;
      if (quota === 'allIndia' && c.management === 'Private') return false;
      if (quota === 'privateManagement' && c.management !== 'Private') return false;
      const cutoff = getCutoff(c, quota, category, round, isWB);
      return cutoff && rank <= cutoff * 1.1;
    })
    .map((c) => ({ ...c, _cutoff: getCutoff(c, quota, category, round, isWB) }))
    .map((c) => ({ ...c, _eligibility: getEligibility(rank, c._cutoff) }))
    .sort((a, b) => (a._cutoff ?? Infinity) - (b._cutoff ?? Infinity));
}

// ── Sub-components ───────────────────────────────────────────────────────────

const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-[#2C2E69] dark:hover:text-slate-300 transition-colors"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
      {show && (
        <span className="absolute left-5 top-0 z-50 w-56 p-2.5 text-xs rounded-lg shadow-lg bg-slate-900 text-slate-200 dark:bg-white dark:text-[#2C2E69] pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
};

const SelectField = ({ label, name, value, onChange, options, icon: Icon, tooltip }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
      {label} {tooltip && <InfoTooltip text={tooltip} />}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69] z-10" />}
      <select name={name} value={value} onChange={onChange}
        className={`w-full appearance-none ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors cursor-pointer border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-[#2C2E69] dark:text-white focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 shadow-sm`}>
        {options.map((o) => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
    </div>
  </div>
);

const ELIGIBILITY_META = {
  safe: { label: '✓ Safe', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', card: 'border-emerald-200 dark:border-emerald-500/30' },
  borderline: { label: '~ Borderline', cls: 'text-amber-600  dark:text-amber-400  bg-amber-50  dark:bg-amber-500/10  border-amber-200  dark:border-amber-500/20', card: 'border-amber-200  dark:border-amber-500/30' },
  unlikely: { label: 'Unlikely', cls: 'text-red-600    dark:text-red-400    bg-red-50    dark:bg-red-500/10    border-red-200    dark:border-red-500/20', card: 'border-slate-200 dark:border-slate-700/60 hover:border-[#F9B406]/50 dark:hover:border-teal-500/40' },
};

const CollegeCard = ({ college, index, quota, round, isWB }) => {
  const meta = ELIGIBILITY_META[college._eligibility] ?? ELIGIBILITY_META.unlikely;
  const isGovt = college.management !== 'Private';
  const feeShow = quota === 'privateManagement' ? college.fees?.managementQuota
    : quota === 'state' ? college.fees?.stateQuota : null;

  return (
    <div className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 border bg-white dark:bg-slate-900/50 hover:shadow-lg ${meta.card}`}>
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-2 mb-2">
          <img src={college?.image} alt={college?.name} />
          <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 bg-[#F9B406]/15 dark:bg-teal-500/15 text-[#c8920a] dark:text-teal-400">
            {index + 1}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${meta.cls}`}>
            {meta.label}
          </span>
        </div>
        <h4 className="font-bold text-sm leading-snug line-clamp-2 text-[#2C2E69] dark:text-white group-hover:text-[#c8920a] dark:group-hover:text-teal-400 transition-colors">
          {college.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isGovt ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'}`}>
            {college.management}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-[#2C2E69] flex items-center gap-0.5">
            <MapPin className="w-3 h-3" /> {college.state}
          </span>
          {college.established && <span className="text-[10px] text-slate-400 dark:text-[#2C2E69]">Est. {college.established}</span>}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ROUND_LABELS).map(([r, label]) => {
            let val = null;
            if (quota === 'allIndia') {
              val = college.cutoffs?.allIndiaQuota?.UR?.[r];
            } else if (quota === 'state') {
              const cat = isWB ? 'OBCA' : 'UR';
              val = college.cutoffs?.stateQuota?.UR?.[r];
            } else {
              val = college.cutoffs?.privateManagement?.[r];
            }
            const isActive = r === round;
            return (
              <div key={r} className={`flex flex-col gap-0.5 px-2.5 py-2 rounded-lg border transition-colors ${isActive ? 'bg-[#F9B406]/8 dark:bg-teal-500/10 border-[#F9B406]/30 dark:border-teal-500/30' : val ? 'bg-slate-50 dark:bg-slate-800/60 border-transparent' : 'bg-slate-50/50 dark:bg-slate-800/20 border-transparent opacity-40'}`}>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-[#c8920a] dark:text-teal-400' : 'text-slate-400 dark:text-[#2C2E69]'}`}>{label}</span>
                <span className={`text-xs font-bold ${val ? 'text-[#2C2E69] dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                  {val ? val.toLocaleString('en-IN') : '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-[#2C2E69] dark:text-slate-400">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{feeShow ?? '—'}</span>
          </div>
          {college.seats && (
            <div className="flex items-center gap-1.5 text-[#2C2E69] dark:text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>{college.seats} seats</span>
            </div>
          )}
        </div>
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
      <h3 className="font-bold text-base mb-1 text-[#2C2E69] dark:text-white">Sign in to unlock your results</h3>
      <p className="text-sm mb-6 max-w-xs mx-auto text-slate-500 dark:text-slate-400">
        Your college matches are ready — log in or create a free account to see them.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => goToAuth('/login')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 transition-colors">
          <LogIn className="w-4 h-4" /> Log in
        </button>
        <button onClick={() => goToAuth('/signup')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
          <UserPlus className="w-4 h-4" /> Sign up free
        </button>
      </div>
    </div>
  );
};

const SummaryBar = ({ predictions }) => {
  const quotaLabel = QUOTA_TYPES.find((q) => q.value === predictions.quota)?.short ?? predictions.quota;
  const catLabel = CATEGORIES.find((c) => c.value === predictions.category)?.label ?? predictions.category;
  const roundLabel = ROUNDS.find((r) => r.value === predictions.round)?.label ?? predictions.round;
  const safe = predictions.matchedColleges.filter((c) => c._eligibility === 'safe').length;
  const border = predictions.matchedColleges.filter((c) => c._eligibility === 'borderline').length;
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border mb-6 bg-amber-50/80 dark:bg-teal-500/5 border-amber-200 dark:border-teal-500/20">
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
        <span className="text-sm font-semibold text-[#2C2E69] dark:text-white">Prediction Summary</span>
      </div>
      <div className="flex flex-wrap gap-2 ml-auto">
        {[
          { label: 'State', val: predictions.state },
          { label: 'Rank', val: `AIR ${predictions.rank.toLocaleString('en-IN')}` },
          { label: 'Category', val: catLabel },
          { label: 'Quota', val: quotaLabel },
          { label: 'Round', val: roundLabel },
          { label: '✓ Safe', val: safe },
          { label: '~ Border', val: border },
          { label: 'Total', val: `${predictions.matchedColleges.length} college${predictions.matchedColleges.length !== 1 ? 's' : ''}` },
        ].map(({ label, val }) => (
          <span key={label} className="px-3 py-1 rounded-lg border text-xs bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 dark:text-slate-500">{label}: </span>{val}
          </span>
        ))}
      </div>
    </div>
  );
};

const EmptyResults = ({ quota }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-2 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
      <Search className="w-6 h-6 text-slate-300 dark:text-[#2C2E69]" />
    </div>
    <p className="font-bold text-[#2C2E69] dark:text-white">No matching colleges found</p>
    <p className="text-sm max-w-sm text-slate-500 dark:text-slate-500">
      {quota === 'allIndia'
        ? 'AIQ is only at Govt colleges — try a different round or category.'
        : quota === 'privateManagement'
          ? 'Try a later round — private management seats open up more in Rounds 2–4.'
          : 'Try a different round, category, or switch quota type.'}
    </p>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────

const Predictor = () => {
  const user = useAuthStore((s) => s.user);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [predictions, setPredictions] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

  const isWB = formData.state === 'West Bengal';

  // Restore pending prediction after login redirect
  useEffect(() => {
    if (!user) return;
    const restored = loadPending();
    if (!restored) return;
    clearPending();
    setFormData({
      state: restored.state ?? 'West Bengal',
      category: restored.category,
      rank: String(restored.rank),
      quota: restored.quota ?? 'state',
      round: restored.round ?? 'round1',
      mgmtFilter: restored.mgmtFilter ?? 'all',
    });
    setPredictions(restored);
    setShowResults(true);
    api.post('/predictions', { ...restored, phone: user.phone, matchedColleges: restored.matchedColleges.map((c) => c.name) })
      .catch((err) => console.error('Failed to save restored prediction:', err));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rank) { setFormError('Please enter your NEET rank.'); return; }
    const rank = parseInt(formData.rank, 10);
    if (isNaN(rank) || rank < 1) { setFormError('Enter a valid positive NEET rank.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));

    const matched = predictColleges({ rank, ...formData });
    const stateObj = { rank, ...formData, matchedColleges: matched };

    setPredictions(stateObj);
    setShowResults(true);
    setLoading(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    if (user) {
      api.post('/predictions', { ...stateObj, phone: user.phone, matchedColleges: matched.map((c) => c.name) })
        .catch((err) => console.error('Failed to save prediction:', err));
    }
  };

  const resetForm = () => { setFormData(EMPTY_FORM); setPredictions(null); setShowResults(false); setFormError(''); clearPending(); };

  const quotaHint = QUOTA_TYPES.find((q) => q.value === formData.quota)?.desc;

  // College pool stats for selected state
  const stateCollegeCount = getCollegesForState(formData.state).length;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-[#2D409C] dark:text-white">

        {/* Page header */}
        <div className="relative border-b border-amber-200 dark:border-slate-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-slate-900/60 dark:to-slate-950 overflow-hidden">

          {/* Glow layer */}
          <div className="absolute inset-0 
    bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] 
    dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]"
          />

          <div className="relative max-w-screen mx-auto px-4 sm:px-6 py-12 sm:py-16">

            <div className="text-center mb-6">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 
        bg-amber-100/80 dark:bg-slate-900/40 
        border-amber-300 dark:border-slate-800 
        backdrop-blur-sm"
              >
                <Target className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                <span className="text-xs font-semibold text-amber-800 dark:text-teal-400/70">
                  NEET 2026 · Pan India
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[#2D409C] dark:text-white">
                Find Your{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r 
          from-[#F9B406] to-[#F9B406]/60 
          dark:from-teal-400 dark:to-teal-400/60"
                >
                  Medical College
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-600 dark:text-slate-400">
                Enter your rank, select your state and category to get matched against real 2026 cutoff data across 20 states.
              </p>

            </div>

          </div>
        </div>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-12">


        {/* Form card */}
        <div className="rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-[0.04] pointer-events-none bg-[#F9B406] dark:bg-teal-400" />

          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
              <h2 className="text-sm font-semibold text-[#2C2E69] dark:text-white">Prediction Criteria</h2>
            </div>
            {formData.state && (
              <span className="text-xs text-slate-400 dark:text-[#2C2E69]">
                {stateCollegeCount} colleges in {formData.state}
              </span>
            )}
          </div>

          {formError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

              {/* State — first and prominent */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">State</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69] z-10" />
                  <select name="state" value={formData.state} onChange={handleChange}
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors cursor-pointer border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-[#2C2E69] dark:text-white focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 shadow-sm">
                    {ALL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
                </div>
              </div>

              {/* Rank */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">NEET Rank (AIR)</label>
                <input type="number" name="rank" value={formData.rank} onChange={handleChange} min="1" placeholder="e.g. 25000" required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors border [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 shadow-sm" />
              </div>

              <SelectField label="Category" name="category" value={formData.category} onChange={handleChange}
                options={CATEGORIES} icon={GraduationCap}
                tooltip={isWB ? "WB State Quota maps OBC → OBC-A. OBC-B students may qualify at a slightly lower cutoff." : "Select your NEET category."} />

              <SelectField label="Quota Type" name="quota" value={formData.quota} onChange={handleChange}
                options={QUOTA_TYPES} icon={Globe}
                tooltip="AIQ: Govt colleges only. State: all colleges. Private Mgmt: private colleges only, no category split." />

              <SelectField label="Round" name="round" value={formData.round} onChange={handleChange} options={ROUNDS} />

              <SelectField label="College Type" name="mgmtFilter" value={formData.mgmtFilter} onChange={handleChange} options={MANAGEMENT_FILTERS} />
            </div>

            {/* Quota hint */}
            <p className="text-xs text-slate-400 dark:text-[#2C2E69] mb-4">{quotaHint}</p>

            {/* Contextual banners */}
            {formData.quota === 'allIndia' && (
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3 text-xs text-blue-700 dark:text-blue-300 mb-5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> AIQ is only available at Govt / Central Govt colleges — private colleges are automatically excluded.
              </div>
            )}
            {formData.quota === 'privateManagement' && (
              <div className="flex items-start gap-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-3 text-xs text-purple-700 dark:text-purple-300 mb-5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Private Management cutoffs are not category-specific — the same cutoff applies regardless of category.
              </div>
            )}
            {formData.category === 'OBC' && formData.quota === 'state' && isWB && (
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-300 mb-5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> WB State Quota uses OBC-A (stricter cutoff). OBC-B candidates may qualify at slightly higher ranks — verify with WBMCC.
              </div>
            )}
            {!isWB && (
              <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-3 text-xs text-[#2C2E69] dark:text-slate-400 mb-5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Data for {formData.state} may have fewer rounds or categories than WB. Where data is unavailable, cells show —. Always verify with official state counselling authority.
              </div>
            )}

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
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors text-[#2C2E69] dark:text-slate-300 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800">
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
                      <h3 className="text-lg font-bold text-[#2C2E69] dark:text-white">
                        {predictions.matchedColleges.length} Matched College{predictions.matchedColleges.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                        <TrendingDown className="w-3.5 h-3.5" /><span>Sorted by cutoff rank</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-4 rounded-xl border mb-6 text-xs bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      Predictions are based on NEET 2026 counselling cutoff data. Actual admission depends on seat availability, state-specific rules, and current-year counselling trends. Always verify with official MCC / state counselling portals.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {predictions.matchedColleges.map((college, i) => (
                        <CollegeCard key={college.uid} college={college} index={i}
                          quota={predictions.quota} round={predictions.round}
                          isWB={predictions.state === 'West Bengal'} />
                      ))}
                    </div>
                  </>
                ) : <EmptyResults quota={predictions.quota} />
              ) : <LoginGate pendingPrediction={predictions} />}
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
                  <p className="font-semibold text-sm mb-1 text-[#2C2E69] dark:text-white">{title}</p>
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
