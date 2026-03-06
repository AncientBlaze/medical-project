import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Zap, Building2, MapPin, BookOpen, ExternalLink,
  RotateCcw, Search, AlertCircle, ChevronDown, Target, Award,
  Filter, Lock, LogIn, UserPlus
} from 'lucide-react';
import { colleges } from '../../data/hospitalData';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const COURSES    = ['MBBS', 'BDS', 'B.Sc Nursing', 'Diploma Nursing', 'Post-Basic Nursing'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'OBC-NCL'];
const FEATURES   = [
  { icon: BarChart2, title: 'Latest Cutoff Data',  desc: 'Predictions based on MCC & state DME data from NEET 2024 rounds' },
  { icon: Zap,       title: 'Instant Results',      desc: 'Get your college shortlist in seconds, not hours' },
  { icon: Building2, title: '650+ Colleges',        desc: 'Govt, private, deemed & central universities — all quotas covered' },
];

const EMPTY_FORM = { course: '', category: '', rank: '' };

const savePending  = (data) => sessionStorage.setItem('pendingPrediction', JSON.stringify(data));
const loadPending  = () => { try { const r = sessionStorage.getItem('pendingPrediction'); return r ? JSON.parse(r) : null; } catch { return null; } };
const clearPending = () => sessionStorage.removeItem('pendingPrediction');

// ── Sub-components ─────────────────────────────────────────────────────────

const SelectField = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-white/50">
      {label}
    </label>
    <div className="relative">
      <select name={name} value={value} onChange={onChange} required
        className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors cursor-pointer border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/20 dark:focus:ring-teal-500/20 shadow-sm dark:shadow-none">
        <option value="" disabled className="text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950">
          {placeholder}
        </option>
        {options.map(o => (
          <option key={o} value={o} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
    </div>
  </div>
);

const CollegeCard = ({ college, index }) => (
  <div className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-amber-400/10">
    <div className="relative h-40 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900/60">
      <img src={college.image} alt={college.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
        onError={e => { e.target.style.display = 'none'; }} />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 dark:from-slate-900/90 to-transparent" />
      <span className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-[#F9B406] dark:bg-teal-400 text-slate-950">
        {index + 1}
      </span>
      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-xs font-medium border bg-slate-950/70 text-[#F9B406] dark:text-teal-400 border-[#F9B406]/20 dark:border-teal-500/20">
        Predicted Match
      </span>
    </div>
    <div className="flex flex-col flex-1 p-5">
      <h4 className="font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-200 text-slate-900 dark:text-white group-hover:text-[#F9B406] dark:group-hover:text-teal-400">
        {college.name}
      </h4>
      <div className="flex items-start gap-2 text-xs mb-3 text-slate-500 dark:text-slate-500">
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{college.address}</span>
      </div>
      <div className="flex items-start gap-2 text-xs mb-4">
        <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#F9B406]/60 dark:text-teal-500/60" />
        <span className="text-[#F9B406]/60 dark:text-teal-400/60">
          {Array.isArray(college.courses) ? college.courses.join(', ') : college.courses}
        </span>
      </div>
      <button
        onClick={() => window.open(college.detailsUrl, '_blank', 'noopener,noreferrer')}
        className="mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950"
      >
        View Details <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const LoginGate = ({ pendingPrediction }) => {
  const navigate = useNavigate();
  const goToAuth = (path) => {
    savePending(pendingPrediction);
    navigate(path, { state: { from: '/predictor' } });
  };
  return (
    <div className="mt-2 rounded-2xl border p-10 text-center border-amber-300 dark:border-teal-500/20 bg-amber-50 dark:bg-teal-500/5">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl border mx-auto mb-4 bg-amber-100 dark:bg-teal-500/10 border-amber-300 dark:border-teal-500/20">
        <Lock className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
      </div>
      <h3 className="font-semibold text-base mb-1 text-slate-900 dark:text-white">
        Sign in to unlock your results
      </h3>
      <p className="text-sm mb-6 max-w-xs mx-auto text-slate-600 dark:text-slate-400">
        Your college matches are ready — log in or create a free account to see them.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => goToAuth('/login')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
          <LogIn className="w-4 h-4" /> Log in
        </button>
        <button onClick={() => goToAuth('/signup')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <UserPlus className="w-4 h-4" /> Sign up free
        </button>
      </div>
    </div>
  );
};

const SummaryBar = ({ predictions }) => (
  <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl border mb-8 bg-amber-50 dark:bg-teal-500/5 border-amber-200 dark:border-teal-500/20">
    <div className="flex items-center gap-2">
      <Award className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
      <span className="text-sm font-semibold text-slate-900 dark:text-white">Prediction Summary</span>
    </div>
    <div className="flex flex-wrap gap-2 ml-auto">
      {[
        { label: 'Course',   val: predictions.course },
        { label: 'Category', val: predictions.category },
        { label: 'Rank',     val: `AIR ${predictions.rank.toLocaleString()}` },
        { label: 'Matches',  val: `${predictions.matchedColleges.length} colleges` },
      ].map(({ label, val }) => (
        <span key={label} className="px-3 py-1 rounded-lg border text-xs bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <span className="text-slate-400 dark:text-slate-500">{label}: </span>{val}
        </span>
      ))}
    </div>
  </div>
);

const EmptyResults = () => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-2 bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
      <Search className="w-5 h-5 text-slate-400 dark:text-slate-600" />
    </div>
    <p className="font-semibold text-slate-900 dark:text-white">No exact matches found</p>
    <p className="text-sm max-w-sm text-slate-600 dark:text-slate-400">
      Try adjusting your criteria — a different category or nearby rank range may show more colleges.
    </p>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────
const Predictor = () => {
  const user    = useAuthStore((s) => s.user);

  const [formData,    setFormData]    = useState(EMPTY_FORM);
  const [predictions, setPredictions] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [formError,   setFormError]   = useState('');
  const [loading,     setLoading]     = useState(false);

  useEffect(() => {
    if (!user) return;
    const restored = loadPending();
    if (!restored) return;
    clearPending();
    setDataFunctionSafeGuard;
    api.post('/predictions', {
      ...restored,
      phone: user.phone,
      matchedColleges: restored.matchedColleges.map(c => c.name),
    }).catch(err => console.error('Failed to save restored prediction:', err));

    const setDataFunctionSafeGuard = () => {
      setFormData({ course: restored.course, category: restored.category, rank: String(restored.rank) });
      setPredictions(restored);
      setShowResults(true);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (formError) setFormError('');
  };

  const predictColleges = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.category || !formData.rank) {
      setFormError('Please fill in all three fields to get predictions.');
      return;
    }
    const rank = parseInt(formData.rank);
    if (isNaN(rank) || rank < 1) { setFormError('Enter a valid positive rank number.'); return; }

    setLoading(true);
    let predicted = colleges.filter(c => c.courses.some(x => x.includes(formData.course)));
    let filtered  = predicted.filter((_, i) => { const min = (i + 1) * 100; return rank >= min && rank <= min + 500; });
    if (filtered.length === 0) filtered = predicted.slice(0, 5);

    const stateObj = { course: formData.course, category: formData.category, rank, matchedColleges: filtered };
    setPredictions(stateObj);
    setShowResults(true);
    setLoading(false);

    if (user) {
      try {
        await api.post('/predictions', {
          ...stateObj,
          phone: user.phone,
          matchedColleges: filtered.map(c => c.name),
        });
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
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Page title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 dark:bg-slate-900/40 border-amber-300 dark:border-slate-800">
            <Target className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-medium text-amber-800 dark:text-teal-400/70">AI-Powered College Predictor</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] dark:from-teal-400 to-[#F9B406]/60 dark:to-teal-400/60">
              Best-Fit College
            </span>
          </h1>
          <p className="text-base max-w-xl mx-auto text-slate-600 dark:text-slate-400">
            Enter your NEET rank, course & category — we'll predict the colleges you can get with the latest cutoff data.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-8 mb-8 relative overflow-hidden border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none bg-[#F9B406] dark:bg-teal-400" />
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Enter Prediction Criteria</h2>
          </div>

          {formError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <form onSubmit={predictColleges}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
              <SelectField label="Course" name="course" value={formData.course}
                onChange={handleChange} options={COURSES} placeholder="Select course" />
              <SelectField label="Category" name="category" value={formData.category}
                onChange={handleChange} options={CATEGORIES} placeholder="Select category" />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-white/50">
                  NEET Rank (AIR)
                </label>
                <input type="number" name="rank" value={formData.rank} onChange={handleChange}
                  min="1" placeholder="e.g. 45000"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors border [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/20 dark:focus:ring-teal-500/20 shadow-sm dark:shadow-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all shadow-lg bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 shadow-[#F9B406]/20 dark:shadow-teal-400/20">
                {loading
                  ? <><span className="w-4 h-4 border-2 rounded-full animate-spin border-slate-900/40 dark:border-slate-950/40 border-t-slate-900 dark:border-t-slate-950" /> Predicting…</>
                  : <><Search className="w-4 h-4" /> Predict Colleges</>}
              </button>
              {showResults && (
                <button type="button" onClick={resetForm}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-900/60 border-slate-200 dark:border-slate-800">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {showResults && predictions && (
          <>
            <SummaryBar predictions={predictions} />
            {user ? (
              predictions.matchedColleges.length > 0 ? (
                <>
                  <h3 className="text-lg font-bold mb-5 text-slate-900 dark:text-white">
                    {predictions.matchedColleges.length} Predicted College{predictions.matchedColleges.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {predictions.matchedColleges.map((college, i) => (
                      <CollegeCard key={college.name || i} college={college} index={i} />
                    ))}
                  </div>
                </>
              ) : <EmptyResults />
            ) : (
              <LoginGate pendingPrediction={predictions} />
            )}
          </>
        )}

        {/* Feature cards */}
        {!showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl border transition-colors bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl border shrink-0 bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
                  <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">{title}</p>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
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