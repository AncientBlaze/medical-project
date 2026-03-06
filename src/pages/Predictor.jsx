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
import useThemeStore from '../store/themeStore';

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

const SelectField = ({ label, name, value, onChange, options, placeholder, isDark }) => (
  <div>
    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-[#F9B406]/70' : 'text-amber-800/70'}`}>
      {label}
    </label>
    <div className="relative">
      <select name={name} value={value} onChange={onChange} required
        className={`w-full appearance-none pl-4 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors cursor-pointer border ${
          isDark
            ? 'bg-[#2C2E69]/40 border-[#2C2E69] text-white focus:border-[#F9B406]/60 focus:ring-[#F9B406]/20'
            : 'bg-white border-slate-200 text-slate-900 focus:border-amber-400 focus:ring-amber-400/20 shadow-sm'
        }`}>
        <option value="" disabled className={isDark ? 'text-white/30 bg-slate-900' : 'text-slate-400 bg-white'}>
          {placeholder}
        </option>
        {options.map(o => (
          <option key={o} value={o} className={isDark ? 'bg-slate-900' : 'bg-white'}>{o}</option>
        ))}
      </select>
      <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
    </div>
  </div>
);

const CollegeCard = ({ college, index, isDark }) => (
  <div className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 border ${
    isDark
      ? 'bg-[#2C2E69]/40 border-[#2C2E69] hover:border-[#F9B406]/40 hover:shadow-lg hover:shadow-[#F9B406]/5'
      : 'bg-white border-slate-200 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-400/10'
  }`}>
    <div className={`relative h-40 overflow-hidden shrink-0 ${isDark ? 'bg-[#2C2E69]/60' : 'bg-slate-100'}`}>
      <img src={college.image} alt={college.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
        onError={e => { e.target.style.display = 'none'; }} />
      <div className={`absolute inset-0 bg-linear-to-t ${isDark ? 'from-[#2C2E69]/90' : 'from-slate-900/60'} to-transparent`} />
      <span className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-lg bg-[#F9B406] text-[#2C2E69] text-xs font-bold">
        {index + 1}
      </span>
      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/70 text-[#F9B406]/80 text-xs font-medium border border-[#F9B406]/20">
        Predicted Match
      </span>
    </div>
    <div className="flex flex-col flex-1 p-5">
      <h4 className={`font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[#F9B406] ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {college.name}
      </h4>
      <div className={`flex items-start gap-2 text-xs mb-3 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{college.address}</span>
      </div>
      <div className="flex items-start gap-2 text-xs mb-4">
        <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#F9B406]/60" />
        <span className="text-[#F9B406]/60 line-clamp-2">
          {Array.isArray(college.courses) ? college.courses.join(', ') : college.courses}
        </span>
      </div>
      <button
        onClick={() => window.open(college.detailsUrl, '_blank', 'noopener,noreferrer')}
        className="mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-[#2C2E69] bg-[#F9B406] hover:bg-[#F9B406]/90 transition-colors"
      >
        View Details <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const LoginGate = ({ pendingPrediction, isDark }) => {
  const navigate = useNavigate();
  const goToAuth = (path) => {
    savePending(pendingPrediction);
    navigate(path, { state: { from: '/predictor' } });
  };
  return (
    <div className={`mt-2 rounded-2xl border p-10 text-center ${isDark ? 'border-[#F9B406]/20 bg-[#F9B406]/5' : 'border-amber-300 bg-amber-50'}`}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border mx-auto mb-4 ${isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-100 border-amber-300'}`}>
        <Lock className="w-5 h-5 text-[#F9B406]" />
      </div>
      <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Sign in to unlock your results
      </h3>
      <p className={`text-sm mb-6 max-w-xs mx-auto ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
        Your college matches are ready — log in or create a free account to see them.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => goToAuth('/login')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] text-sm font-semibold transition-colors">
          <LogIn className="w-4 h-4" /> Log in
        </button>
        <button onClick={() => goToAuth('/signup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white/80 hover:text-white'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}>
          <UserPlus className="w-4 h-4" /> Sign up free
        </button>
      </div>
    </div>
  );
};

const SummaryBar = ({ predictions, isDark }) => (
  <div className={`flex flex-wrap items-center gap-3 p-5 rounded-2xl border mb-8 ${isDark ? 'bg-[#F9B406]/5 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'}`}>
    <div className="flex items-center gap-2">
      <Award className="w-4 h-4 text-[#F9B406]" />
      <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Prediction Summary</span>
    </div>
    <div className="flex flex-wrap gap-2 ml-auto">
      {[
        { label: 'Course',   val: predictions.course },
        { label: 'Category', val: predictions.category },
        { label: 'Rank',     val: `AIR ${predictions.rank.toLocaleString()}` },
        { label: 'Matches',  val: `${predictions.matchedColleges.length} colleges` },
      ].map(({ label, val }) => (
        <span key={label} className={`px-3 py-1 rounded-lg border text-xs ${
          isDark
            ? 'bg-[#2C2E69]/60 border-[#2C2E69] text-white/80'
            : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <span className={isDark ? 'text-white/40' : 'text-slate-400'}>{label}: </span>{val}
        </span>
      ))}
    </div>
  </div>
);

const EmptyResults = ({ isDark }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-2 ${isDark ? 'bg-[#2C2E69]/60 border-[#2C2E69]' : 'bg-slate-100 border-slate-200'}`}>
      <Search className={`w-5 h-5 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
    </div>
    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>No exact matches found</p>
    <p className={`text-sm max-w-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
      Try adjusting your criteria — a different category or nearby rank range may show more colleges.
    </p>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────
const Predictor = () => {
  const user    = useAuthStore((s) => s.user);
  const { theme } = useThemeStore();
  const isDark  = theme === 'dark';

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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Page title */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 ${isDark ? 'bg-[#2C2E69]/60 border-[#2C2E69]' : 'bg-amber-100 border-amber-300'}`}>
            <Target className="w-3.5 h-3.5 text-[#F9B406]" />
            <span className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-amber-800'}`}>AI-Powered College Predictor</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#F9B406]/60">
              Best-Fit College
            </span>
          </h1>
          <p className={`text-base max-w-xl mx-auto ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            Enter your NEET rank, course & category — we'll predict the colleges you can get with the latest cutoff data.
          </p>
        </div>

        {/* Form */}
        <div className={`rounded-2xl p-8 mb-8 relative overflow-hidden border ${isDark ? 'bg-[#2C2E69]/30 border-[#2C2E69]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9B406] rounded-full blur-3xl opacity-5 pointer-events-none" />
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-[#F9B406]" />
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Enter Prediction Criteria</h2>
          </div>

          {formError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <form onSubmit={predictColleges}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
              <SelectField label="Course" name="course" value={formData.course}
                onChange={handleChange} options={COURSES} placeholder="Select course" isDark={isDark} />
              <SelectField label="Category" name="category" value={formData.category}
                onChange={handleChange} options={CATEGORIES} placeholder="Select category" isDark={isDark} />
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-[#F9B406]/70' : 'text-amber-800/70'}`}>
                  NEET Rank (AIR)
                </label>
                <input type="number" name="rank" value={formData.rank} onChange={handleChange}
                  min="1" placeholder="e.g. 45000"
                  className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors border [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${
                    isDark
                      ? 'bg-[#2C2E69]/40 border-[#2C2E69] text-white placeholder-white/20 focus:border-[#F9B406]/60 focus:ring-[#F9B406]/20'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:ring-amber-400/20 shadow-sm'
                  }`} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-[#2C2E69] bg-[#F9B406] hover:bg-[#F9B406]/90 disabled:opacity-50 transition-all shadow-lg shadow-[#F9B406]/20">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-[#2C2E69]/40 border-t-[#2C2E69] rounded-full animate-spin" /> Predicting…</>
                  : <><Search className="w-4 h-4" /> Predict Colleges</>}
              </button>
              {showResults && (
                <button type="button" onClick={resetForm}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                    isDark
                      ? 'text-white/70 bg-white/10 hover:bg-white/20 border-white/10'
                      : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
                  }`}>
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {showResults && predictions && (
          <>
            <SummaryBar predictions={predictions} isDark={isDark} />
            {user ? (
              predictions.matchedColleges.length > 0 ? (
                <>
                  <h3 className={`text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {predictions.matchedColleges.length} Predicted College{predictions.matchedColleges.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {predictions.matchedColleges.map((college, i) => (
                      <CollegeCard key={college.name || i} college={college} index={i} isDark={isDark} />
                    ))}
                  </div>
                </>
              ) : <EmptyResults isDark={isDark} />
            ) : (
              <LoginGate pendingPrediction={predictions} isDark={isDark} />
            )}
          </>
        )}

        {/* Feature cards */}
        {!showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={`flex gap-4 p-5 rounded-2xl border transition-colors ${
                isDark
                  ? 'bg-[#2C2E69]/30 border-[#2C2E69] hover:border-[#F9B406]/30'
                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
              }`}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl border shrink-0 ${isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'}`}>
                  <Icon className="w-4 h-4 text-[#F9B406]" />
                </div>
                <div>
                  <p className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{desc}</p>
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