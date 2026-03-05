
import { useState } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Phone, CheckCircle,
  AlertCircle, GraduationCap, UserPlus, ArrowRight,
  BookOpen, TrendingUp, Star
} from 'lucide-react';
import api from '../utils/api';

const BENEFITS = [
  { icon: TrendingUp,    text: 'AI cutoff predictions for 650+ colleges' },
  { icon: BookOpen,      text: 'State & AIQ quota analysis in one place' },
  { icon: Star,          text: 'Personalised college shortlist based on your rank' },
  { icon: GraduationCap, text: 'MBBS, BDS & AYUSH seat matrix access' },
];

const InputField = ({ label, icon: Icon, rightElement, error, hint, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-[#F9B406]/70 uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      <input
        {...props}
        className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#2C2E69]/40 text-white text-sm placeholder-white/20
          focus:outline-none focus:ring-1 transition-colors border
          ${error
            ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
            : 'border-[#2C2E69] focus:border-[#F9B406]/60 focus:ring-[#F9B406]/20'
          }`}
      />
      {rightElement && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
    {hint  && !error && <p className="mt-1.5 text-xs text-white/25">{hint}</p>}
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())     errs.name = 'Full name is required';
    if (!formData.email.trim())    errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                   errs.email = 'Enter a valid email';
    if (!formData.password)        errs.password = 'Password is required';
    else if (formData.password.length < 6)
                                   errs.password = 'Minimum 6 characters';
    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
                                   errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setServerError('');
    try {
      const { data } = await api.post('/auth/signup', {
        name: formData.name, email: formData.email,
        password: formData.password, phone: formData.phone,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSignupSuccess(data.user);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-500',      w: 'w-1/4' };
    if (p.length < 8) return { label: 'Weak',      color: 'bg-orange-400',   w: 'w-2/4' };
    if (/[A-Z]/.test(p) && /\d/.test(p))
                      return { label: 'Strong',    color: 'bg-[#F9B406]',    w: 'w-full' };
    return            { label: 'Fair',             color: 'bg-yellow-400',   w: 'w-3/4' };
  })();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-12 bg-[#2C2E69]/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(249,180,6,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute top-10 -right-16 w-72 h-72 bg-[#2C2E69] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-20 -left-8 w-56 h-56 bg-[#F9B406] rounded-full blur-3xl opacity-5 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20">
            <GraduationCap className="w-5 h-5 text-[#F9B406]" />
          </div>
          <span className="text-white! font-bold text-lg tracking-tight selection:bg-amber-500!">
            Med<span className="text-[#F9B406]! selection:bg-white! selection:text-[#F9B406]! ">Sankalp</span>
          </span>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9B406]/10 border border-[#F9B406]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] animate-pulse" />
            <span className="text-[#F9B406]/80 text-xs font-medium tracking-wide uppercase">Free Account · No Credit Card</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Start Predicting<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#F9B406]/60">
              Your MBBS Seat
            </span>
          </h2>

          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Join 2.4 lakh+ NEET aspirants who use MedPredictAI to plan smarter
            and walk into counselling with confidence.
          </p>

          <div className="space-y-3">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#F9B406]" />
                </div>
                <p className="text-white/60 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/20 text-xs">
          © 2025 MedPredictAI · Data sourced from MCC, State DME & NEET official records
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md py-6">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20">
              <GraduationCap className="w-4 h-4 text-[#F9B406]" />
            </div>
            <span className="text-white font-bold tracking-tight">
              MedPredict<span className="text-[#F9B406]">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Create your account</h1>
          <p className="text-white/40 text-sm mb-8">Free forever · Cutoff predictions for NEET 2025</p>

          {serverError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <InputField label="Full Name" icon={User}
              type="text" name="name" value={formData.name}
              onChange={handleChange} required placeholder="Arjun Sharma"
              error={fieldErrors.name} />

            <InputField label="Email Address" icon={Mail}
              type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="you@example.com"
              error={fieldErrors.email}
              rightElement={
                formData.email && !fieldErrors.email &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                  ? <CheckCircle className="w-4 h-4 text-[#F9B406]" />
                  : null
              } />

            <InputField label="Phone (Optional)" icon={Phone}
              type="tel" name="phone" value={formData.phone}
              onChange={handleChange} placeholder="+91 98765 43210"
              hint="Used for counselling deadline reminders" />

            {/* Password + strength */}
            <div>
              <InputField label="Password" icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password}
                onChange={handleChange} required placeholder="Min 6 characters"
                error={fieldErrors.password}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                    className="text-white/30 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                } />
              {passwordStrength && (
                <div className="mt-2">
                  <div className="h-1 bg-[#2C2E69] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.w}`} />
                  </div>
                  <p className={`text-xs mt-1 ${
                    passwordStrength.label === 'Strong' ? 'text-[#F9B406]' :
                    passwordStrength.label === 'Fair'   ? 'text-yellow-400' : 'text-red-400'
                  }`}>{passwordStrength.label}</p>
                </div>
              )}
            </div>

            <InputField label="Confirm Password" icon={Lock}
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} required placeholder="Re-enter your password"
              error={fieldErrors.confirmPassword}
              rightElement={
                formData.confirmPassword
                  ? formData.password === formData.confirmPassword
                    ? <CheckCircle className="w-4 h-4 text-[#F9B406]" />
                    : <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                        className="text-white/30 hover:text-white transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                  : null
              } />

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-semibold text-sm text-[#2C2E69] bg-[#F9B406] hover:bg-[#F9B406]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F9B406]/20">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-[#2C2E69]/30 border-t-[#2C2E69] rounded-full animate-spin" /> Creating Account…</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Free Account <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} type="button"
              className="text-[#F9B406] font-semibold hover:text-[#F9B406]/80 transition-colors underline underline-offset-2">
              Sign in
            </button>
          </p>

          <p className="mt-5 text-center text-xs text-white/15">
            By creating an account you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;