import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, GraduationCap, TrendingUp, BookOpen, Award } from 'lucide-react';
import api from '../utils/api';

const STATS = [
  { icon: GraduationCap, label: 'Colleges Tracked',  value: '650+' },
  { icon: TrendingUp,    label: 'Predictions Made',  value: '2.4L+' },
  { icon: Award,         label: 'Success Rate',       value: '94%' },
  { icon: BookOpen,      label: 'Seats Analysed',     value: '1.1L+' },
];

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData,     setFormData]     = useState({ email: '', password: '' });
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);

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
      setTimeout(() => onLoginSuccess(data.user), 1400);
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fffdf7] dark:bg-slate-950 transition-colors">

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12
        bg-[#FFF7E1] dark:bg-slate-900 overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(249,180,6,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

        <div className="absolute top-20 left-20 w-72 h-72 bg-[#F9B406] rounded-full blur-3xl opacity-10 pointer-events-none dark:bg-teal-500" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-[#e0a205] rounded-full blur-3xl opacity-10 pointer-events-none dark:bg-teal-400" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9B406]/20 border border-[#F9B406]/30 dark:bg-teal-500/20 dark:border-teal-500/30">
            <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#2C2E69] dark:text-white">
            Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9B406]/10 border border-[#F9B406]/20 dark:bg-teal-500/10 dark:border-teal-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] dark:bg-teal-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#2C2E69] dark:text-teal-300">
              NEET 2025 Predictions Live
            </span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#2C2E69] dark:text-white leading-tight tracking-tight mb-4">
            Know Your College
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#e0a205] dark:from-teal-400 dark:to-teal-300">
              Before Counselling
            </span>
          </h2>

          <p className="text-sm text-[#2C2E69] dark:text-slate-400 leading-relaxed mb-10">
            AI-powered cutoff predictions across all MBBS, BDS & AYUSH colleges.
            State quota, all-India quota, management seats — all in one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label}
                className="flex items-center gap-3 p-4 rounded-2xl border transition-colors
                  bg-white/70 dark:bg-white/5
                  border-[#F9B406]/20 dark:border-slate-700/60
                  hover:border-[#F9B406]/40 dark:hover:border-teal-500/30">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0
                  bg-[#F9B406]/10 dark:bg-teal-500/10">
                  <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none text-[#2C2E69] dark:text-white">{value}</p>
                  <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400 dark:text-[#2C2E69]">
          © 2025 MedSankalp · Data sourced from MCC, State DME & NEET official records
        </p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#fffdf7] dark:bg-slate-950 transition-colors">
        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold text-[#2C2E69] dark:text-white mb-1 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mb-8">
            Access personalised cutoff predictions & college shortlists
          </p>

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20 text-[#c8920a] dark:text-teal-400 text-sm mb-5">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                    bg-white dark:bg-slate-900
                    border-slate-200 dark:border-slate-700/60
                    text-[#2C2E69] dark:text-white
                    placeholder-slate-400 dark:placeholder-slate-600
                    focus:border-[#F9B406] dark:focus:border-teal-500
                    focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15
                    shadow-sm" />
                {formData.email && isValidEmail && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
                  Password
                </label>
                <button type="button" className="text-xs text-[#F9B406] dark:text-teal-400 hover:opacity-80 transition-opacity">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                    bg-white dark:bg-slate-900
                    border-slate-200 dark:border-slate-700/60
                    text-[#2C2E69] dark:text-white
                    placeholder-slate-400 dark:placeholder-slate-600
                    focus:border-[#F9B406] dark:focus:border-teal-500
                    focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15
                    shadow-sm" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#2C2E69] hover:text-[#2C2E69] dark:hover:text-slate-400 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                bg-[#F9B406] hover:bg-[#e0a205] dark:bg-teal-400 dark:hover:bg-teal-300
                text-slate-950 shadow-[#F9B406]/25 dark:shadow-teal-400/20">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Verifying…</>
              ) : (
                <><LogIn className="w-4 h-4" />Sign In</>
              )}
            </button>

            {/* Switch */}
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-white/30">
              New here?{' '}
              <button onClick={onSwitchToSignup} type="button"
                className="text-[#F9B406] dark:text-teal-400 font-semibold hover:opacity-80 transition-opacity underline underline-offset-2">
                Create a free account
              </button>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
              <p className="flex items-center gap-2 text-xs font-semibold mb-2.5 uppercase tracking-wide text-slate-500 dark:text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] dark:bg-teal-400 animate-pulse" />
                Demo Credentials (Admin)
              </p>
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#2C2E69]" /> admin@example.com
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-[#2C2E69]" /> demo123
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;