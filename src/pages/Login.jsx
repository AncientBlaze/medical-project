import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, GraduationCap, TrendingUp, BookOpen, Award } from 'lucide-react';
import api from '../utils/api';

const STATS = [
  { icon: GraduationCap, label: 'Colleges Tracked', value: '650+' },
  { icon: TrendingUp,    label: 'Predictions Made', value: '2.4L+' },
  { icon: Award,         label: 'Success Rate',     value: '94%' },
  { icon: BookOpen,      label: 'Seats Analysed',   value: '1.1L+' },
];

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData,      setFormData]      = useState({ email: '', password: '' });
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [loading,       setLoading]       = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);
  const [rememberMe,    setRememberMe]    = useState(false);

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

  const inputClass = "w-full pl-10 pr-10 py-3 rounded-xl bg-[#2C2E69]/40 border border-[#2C2E69] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#F9B406]/60 focus:ring-1 focus:ring-[#F9B406]/20 transition-colors";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 bg-[#2C2E69]/20 overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(249,180,6,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#2C2E69] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-[#F9B406] rounded-full blur-3xl opacity-5 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20">
            <GraduationCap className="w-5 h-5 text-[#F9B406]" />
          </div>
          <span className="text-white! font-bold text-lg tracking-tight selection:bg-amber-500!">
            Med<span className="text-[#F9B406]! selection:bg-white! selection:text-[#F9B406]! ">Sankalp</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9B406]/10 border border-[#F9B406]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] animate-pulse" />
            <span className="text-[#F9B406]/80 text-xs font-medium tracking-wide uppercase">NEET 2025 Predictions Live</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Know Your College<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#F9B406]/60">
              Before Counselling
            </span>
          </h2>

          <p className="text-white/40 text-base leading-relaxed mb-10">
            AI-powered cutoff predictions across all MBBS, BDS & AYUSH colleges.
            State quota, all-India quota, management seats — all in one place.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-[#F9B406]/30 transition-colors">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F9B406]/10 shrink-0">
                  <Icon className="w-4 h-4 text-[#F9B406]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{value}</p>
                  <p className="text-white/30 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/20 text-xs">
          © 2025 MedPredict · Data sourced from MCC, State DME & NEET official records
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-950">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20">
              <GraduationCap className="w-4 h-4 text-[#F9B406]" />
            </div>
            <span className="text-white font-bold tracking-tight">
              MedPredict<span className="text-[#F9B406]">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Sign in to your account</h1>
          <p className="text-white/40 text-sm mb-8">
            Access personalised cutoff predictions & college shortlists
          </p>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
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
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} required placeholder="••••••••"
                  className={inputClass} />
                <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#2C2E69]/40 border-[#2C2E69] accent-[#F9B406] cursor-pointer" />
              <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors">
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
          <p className="mt-6 text-center text-sm text-white/30">
            New here?{' '}
            <button onClick={onSwitchToSignup} type="button"
              className="text-[#F9B406] font-semibold hover:text-[#F9B406]/80 transition-colors underline underline-offset-2">
              Create a free account
            </button>
          </p>

          {/* Demo box */}
          <div className="mt-6 p-4 rounded-xl bg-[#2C2E69]/30 border border-[#2C2E69]">
            <p className="flex items-center gap-2 text-xs font-semibold text-white/60 mb-2.5 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] animate-pulse" />
              Demo Credentials (Admin)
            </p>
            <div className="space-y-1.5 text-xs text-white/30">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/20" /> admin@example.com
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-white/20" /> demo123
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-white/15">
            By signing in you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;