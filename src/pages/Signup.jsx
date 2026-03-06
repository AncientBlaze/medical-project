import { useState } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Phone, CheckCircle,
  AlertCircle, GraduationCap, UserPlus, ArrowRight,
  BookOpen, TrendingUp, Star
} from 'lucide-react';
import api from '../utils/api';

const BENEFITS = [
  { icon: TrendingUp, text: 'AI cutoff predictions for 650+ colleges' },
  { icon: BookOpen, text: 'State & AIQ quota analysis in one place' },
  { icon: Star, text: 'Personalised college shortlist based on your rank' },
  { icon: GraduationCap, text: 'MBBS, BDS & AYUSH seat matrix access' },
];

const InputField = ({ label, icon: Icon, rightElement, error, hint, ...props }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2
    text-amber-800/70 dark:text-teal-300/70">
      {label}
    </label>

    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
      text-slate-400 dark:text-teal-300/40" />

      <input
        {...props}
        className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors border
        ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:ring-amber-400/20 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:placeholder-white/20 dark:focus:border-teal-400 dark:focus:ring-teal-400/20'
          }`}
      />

      {rightElement && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>

    {hint && !error && (
      <p className="mt-1.5 text-xs text-slate-400 dark:text-white/30">{hint}</p>
    )}

    {error && (
      <p className="mt-1.5 text-xs text-red-400">{error}</p>
    )}
  </div>
);

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(p => ({ ...p, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(p => ({ ...p, [name]: '' }));
    }

    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {

    const errs = {};

    if (!formData.name.trim())
      errs.name = 'Full name is required';

    if (!formData.email.trim())
      errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email';

    if (!formData.password)
      errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Minimum 6 characters';

    if (!formData.confirmPassword)
      errs.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

    setFieldErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {

      const { data } = await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onSignupSuccess(data.user);

    } catch (err) {

      setServerError(
        err?.response?.data?.message || 'Server error. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {

    const p = formData.password;

    if (!p) return null;

    if (p.length < 6)
      return { label: 'Too short', color: 'bg-red-500', w: 'w-1/4' };

    if (p.length < 8)
      return { label: 'Weak', color: 'bg-orange-400', w: 'w-2/4' };

    if (/[A-Z]/.test(p) && /\d/.test(p))
      return { label: 'Strong', color: 'bg-[#F9B406] dark:bg-teal-400', w: 'w-full' };

    return { label: 'Fair', color: 'bg-yellow-400', w: 'w-3/4' };

  })();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300
    bg-slate-50 dark:bg-slate-950">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-12 overflow-hidden bg-amber-50 dark:bg-teal-950/30">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(249,180,6,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.35) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* glow blobs */}
        <div className="absolute top-10 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none bg-amber-400 dark:bg-teal-600" />
        <div className="absolute bottom-20 -left-8 w-56 h-56 rounded-full blur-3xl opacity-10 pointer-events-none bg-amber-300 dark:bg-teal-400" />
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl border bg-[#F9B406]/20 border-[#F9B406]/30 dark:bg-teal-400/10 dark:border-teal-400/20">
            <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-amber-900 dark:text-white">
            Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
          </span>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight mb-4 text-amber-950 dark:text-white">
            Start Predicting
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-amber-700 dark:from-teal-400 dark:to-teal-300">
              Your MBBS Seat
            </span>
          </h2>
          <p className="text-sm leading-relaxed mb-8 text-amber-900/60 dark:text-white/40">
            Join 2.4 lakh+ NEET aspirants who use MedSankalp to plan smarter
            and walk into counselling with confidence.
          </p>
          <div className="space-y-3">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg border shrink-0 bg-[#F9B406]/10 border-[#F9B406]/20 dark:bg-teal-400/10 dark:border-teal-400/20">
                  <Icon className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                </div>
                <p className="text-sm text-amber-900/70 dark:text-white/60">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-amber-900/40 dark:text-white/20">
          © 2025 MedSankalp · Data sourced from MCC, State DME & NEET official records
        </p>
      </div>
      {/* RIGHT PANEL */}

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto
      bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md py-6">
          <h1 className="text-2xl font-bold mb-1 tracking-tight
          text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-sm mb-8
          text-slate-500 dark:text-white/40">
            Free forever · Cutoff predictions for NEET 2025
          </p>
          {serverError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField label="Full Name" icon={User}
              type="text" name="name" value={formData.name}
              onChange={handleChange} required
              placeholder="Arjun Sharma"
              error={fieldErrors.name}
            />
            <InputField label="Email Address" icon={Mail}
              type="email" name="email" value={formData.email}
              onChange={handleChange} required
              placeholder="you@example.com"
              error={fieldErrors.email}
              rightElement={
                formData.email &&
                  !fieldErrors.email &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                  ? <CheckCircle className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                  : null
              }
            />
            <InputField label="Phone (Optional)" icon={Phone}
              type="tel" name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              hint="Used for counselling deadline reminders"
            />
            <div>
              <InputField label="Password" icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min 6 characters"
                error={fieldErrors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    className="text-slate-400 hover:text-slate-700
                    dark:text-white/30 dark:hover:text-white"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                }

              />
              {passwordStrength && (
                <div className="mt-2">
                  <div className="h-1 rounded-full overflow-hidden
                  bg-slate-200 dark:bg-slate-800">
                    <div className={`h-full rounded-full transition-all duration-300
                    ${passwordStrength.color}
                    ${passwordStrength.w}`} />
                  </div>
                  <p className="text-xs mt-1 text-slate-500 dark:text-white/50">
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
            <InputField label="Confirm Password" icon={Lock}
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              error={fieldErrors.confirmPassword}
              rightElement={
                formData.confirmPassword
                  ? formData.password === formData.confirmPassword
                    ? <CheckCircle className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                    : <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                      className="text-slate-400 hover:text-slate-700
                        dark:text-white/30 dark:hover:text-white"
                    >
                      {showConfirm
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                  : null
              }
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-semibold text-sm
              text-[#2C2E69] bg-[#F9B406] hover:bg-[#F9B406]/90
              dark:text-slate-950 dark:bg-teal-400 dark:hover:bg-teal-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all shadow-lg shadow-[#F9B406]/20 dark:shadow-teal-500/20"
            >
              {loading
                ? <>
                  <span className="w-4 h-4 border-2 border-[#2C2E69]/30 border-t-[#2C2E69] rounded-full animate-spin" />
                  Creating Account…
                </>
                : <>

                  <UserPlus className="w-4 h-4" />
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              }
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-white/30">
            Already have an account?
            <button
              onClick={onSwitchToLogin}
              type="button"
              className="ml-1 text-[#F9B406] dark:text-teal-400 font-semibold hover:opacity-80 transition-colors underline underline-offset-2"
            >
              Sign in
            </button>
          </p>
          <p className="mt-5 text-center text-xs text-slate-400 dark:text-white/15">
            By creating an account you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;