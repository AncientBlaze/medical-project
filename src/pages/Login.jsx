import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, GraduationCap, TrendingUp, BookOpen, Award } from 'lucide-react';
import api from '../utils/api';
import useThemeStore from '../store/themeStore';

const STATS = [
  { icon: GraduationCap, label: 'Colleges Tracked', value: '650+' },
  { icon: TrendingUp, label: 'Predictions Made', value: '2.4L+' },
  { icon: Award, label: 'Success Rate', value: '94%' },
  { icon: BookOpen, label: 'Seats Analysed', value: '1.1L+' },
];

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedEmail');
    if (saved) { setFormData(p => ({ ...p, email: saved })); setRememberMe(true); }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      rememberMe
        ? localStorage.setItem('savedEmail', formData.email)
        : localStorage.removeItem('savedEmail');
      setSuccess('Verified! Loading your dashboard…');
      setTimeout(() => onLoginSuccess(data.user), 700);
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const inputClass = isDark
    ? 'w-full pl-10 pr-10 py-3 rounded-xl bg-[#2C2E69]/40 border border-[#2C2E69] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#F9B406]/60 focus:ring-1 focus:ring-[#F9B406]/20 transition-colors'
    : 'w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#F9B406]/60 focus:ring-1 focus:ring-[#F9B406]/20 transition-colors shadow-sm';

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>

      {/* ── LEFT PANEL ── */}
      <div className={`hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 overflow-hidden ${isDark ? 'bg-[#2C2E69]/20' : 'bg-[#FFFBEF]'
        }`}>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(249,180,6,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.3) 1px, transparent 1px)'
            : 'linear-gradient(rgba(120,53,15,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(120,53,15,0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none ${isDark ? 'bg-[#2C2E69]' : 'bg-amber-600'}`} />
        <div className={`absolute bottom-32 right-10 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none ${isDark ? 'bg-[#F9B406]' : 'bg-amber-400'}`} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-900/10 border-amber-900/20'}`}>
            <GraduationCap className={`w-5 h-5 ${isDark ? 'text-[#F9B406]' : 'text-amber-900'}`} />
          </div>
          <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-amber-950'}`}>
            Med<span className={isDark ? 'text-[#F9B406]' : 'text-amber-700'}>Sankalp</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-lg">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-900/10 border-amber-900/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#F9B406]' : 'bg-amber-800'}`} />
            <span className={`text-xs font-medium tracking-wide uppercase ${isDark ? 'text-[#F9B406]/80' : 'text-amber-900/80'}`}>
              NEET 2025 Predictions Live
            </span>
          </div>

          <h2 className={`text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mb-4 ${isDark ? 'text-white' : 'text-amber-950'}`}>
            Know Your College<br />
            <span className={`text-transparent bg-clip-text bg-linear-to-r ${isDark ? 'from-[#F9B406] to-[#F9B406]/60' : 'from-amber-800 to-amber-600'}`}>
              Before Counselling
            </span>
          </h2>

          <p className={`text-base leading-relaxed mb-10 ${isDark ? 'text-white/60' : 'text-amber-900/60'}`}>
            AI-powered cutoff predictions across all MBBS, BDS & AYUSH colleges.
            State quota, all-India quota, management seats — all in one place.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors ${isDark
                  ? 'bg-white/10 border-white/10 hover:border-[#F9B406]/30'
                  : 'bg-amber-900/5 border-amber-900/10 hover:border-amber-900/25'
                  }`}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${isDark ? 'bg-[#F9B406]/10' : 'bg-amber-900/10'}`}>
                  <Icon className={`w-4 h-4 ${isDark ? 'text-[#F9B406]' : 'text-amber-800'}`} />
                </div>
                <div>
                  <p className={`font-bold text-lg leading-none ${isDark ? 'text-white' : 'text-amber-950'}`}>{value}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-amber-900/50'}`}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className={`relative z-10 text-xs ${isDark ? 'text-white/30' : 'text-amber-900/40'}`}>
          © 2025 MedSankalp · Data sourced from MCC, State DME & NEET official records
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={`flex-1 flex items-center justify-center p-6 lg:p-12 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'
        }`}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20">
              <GraduationCap className="w-4 h-4 text-[#F9B406]" />
            </div>
            <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Med<span className="text-[#F9B406]">Sankalp</span>
            </span>
          </div>

          <h1 className={`text-2xl font-bold mb-1 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Sign in to your account
          </h1>
          <p className={`text-sm mb-8 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            Access personalised cutoff predictions & college shortlists
          </p>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 text-[#F9B406] text-sm mb-5">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#F9B406]/70 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder="you@example.com"
                  className={inputClass} />
                {formData.email && isValidEmail && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F9B406] pointer-events-none" />
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F9B406]/70 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-[#F9B406]/70 hover:text-[#F9B406] transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} required placeholder="••••••••"
                  className={inputClass} />
                <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/30 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-[#F9B406] cursor-pointer" />
              <span className={`text-sm transition-colors ${isDark ? 'text-white/40 group-hover:text-white/70' : 'text-slate-500 group-hover:text-slate-700'}`}>
                Keep me signed in
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-[#2C2E69] bg-[#F9B406] hover:bg-[#F9B406]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F9B406]/20">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-[#2C2E69]/30 border-t-[#2C2E69] rounded-full animate-spin" /> Verifying…</>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          {/* Sign up */}
          <p className={`mt-6 text-center text-sm ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
            New here?{' '}
            <button onClick={onSwitchToSignup} type="button"
              className="text-[#F9B406] font-semibold hover:text-[#F9B406]/80 transition-colors underline underline-offset-2">
              Create a free account
            </button>
          </p>

          {/* Demo box */}
          <div className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-[#2C2E69]/30 border-[#2C2E69]' : 'bg-slate-100 border-slate-200'}`}>
            <p className={`flex items-center gap-2 text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] animate-pulse" />
              Demo Credentials (Admin)
            </p>
            <div className={`space-y-1.5 text-xs ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
              <div className="flex items-center gap-2">
                <Mail className={`w-3.5 h-3.5 ${isDark ? 'text-white/20' : 'text-slate-400'}`} /> admin@example.com
              </div>
              <div className="flex items-center gap-2">
                <Lock className={`w-3.5 h-3.5 ${isDark ? 'text-white/20' : 'text-slate-400'}`} /> demo123
              </div>
            </div>
          </div>

          <p className={`mt-5 text-center text-xs ${isDark ? 'text-white/15' : 'text-slate-400'}`}>
            By signing in you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;