import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Phone, CheckCircle,
  AlertCircle, GraduationCap, UserPlus, ArrowRight,
  BookOpen, TrendingUp, Star, X, Loader2, ShieldCheck
} from 'lucide-react';
import api from '../utils/api';

const BENEFITS = [
  { icon: TrendingUp,    text: 'AI cutoff predictions for 650+ colleges' },
  { icon: BookOpen,      text: 'State & AIQ quota analysis in one place' },
  { icon: Star,          text: 'Personalised college shortlist based on your rank' },
  { icon: GraduationCap, text: 'MBBS, BDS & AYUSH seat matrix access' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const normalizePhone = (phone) => {
  const p = phone.replace(/\D/g, '');
  if (p.length === 10) return `+91${p}`;
  if (!p.startsWith('+')) return `+${p}`;
  return p;
};

// ── OTP Input ─────────────────────────────────────────────────────────────────

const OTPInput = ({ value, onChange, length = 4 }) => {
  const refs = Array.from({ length }, () => useRef(null));

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0)
      refs[idx - 1].current?.focus();
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[idx] = char;
    onChange(arr.join(''));
    if (char && idx < length - 1) refs[idx + 1].current?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, ''));
    refs[Math.min(pasted.length, length - 1)].current?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-13 h-14 rounded-xl border text-center text-xl font-bold transition-colors
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-700
            text-[#2C2E69] dark:text-white
            focus:outline-none focus:ring-2
            focus:border-[#F9B406] dark:focus:border-teal-500
            focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
        />
      ))}
    </div>
  );
};

// ── OTP Modal ─────────────────────────────────────────────────────────────────

const OTPModal = ({ phone, onVerified, onClose }) => {
  const [step, setStep]       = useState('send');   // 'send' | 'verify' | 'success'
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [timer, setTimer]     = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const sendOtp = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/auth/send-otp', { phone: normalizePhone(phone) });
      setStep('verify');
      setTimer(30);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the 4-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { phone: normalizePhone(phone), otp });
      setStep('success');
      setTimeout(() => onVerified(data), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  sendOtp();
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border p-7 shadow-2xl
        bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-[#2C2E69] dark:text-white">Verify your phone</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">One last step to activate your account</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Step: Send ── */}
        {step === 'send' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5
              bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20">
              <Phone className="w-7 h-7 text-[#F9B406] dark:text-teal-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">We'll send a 4-digit OTP to</p>
            <p className="font-bold text-[#2C2E69] dark:text-white mb-6 text-lg">{phone}</p>
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 mb-4 justify-center">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <button onClick={sendOtp} disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                : 'Send OTP'}
            </button>
          </div>
        )}

        {/* ── Step: Verify ── */}
        {step === 'verify' && (
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Enter the 4-digit code sent to{' '}
              <span className="font-semibold text-[#2C2E69] dark:text-white">{phone}</span>
            </p>
            <OTPInput value={otp} onChange={setOtp} />
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 mt-3 justify-center">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length < 4}
              className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                : 'Verify & Continue'}
            </button>
            <div className="mt-4 text-xs text-slate-400 dark:text-slate-600">
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : (
                  <button onClick={sendOtp}
                    className="text-[#F9B406] dark:text-teal-400 hover:underline font-medium">
                    Resend OTP
                  </button>
                )
              }
            </div>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
              bg-emerald-100 dark:bg-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="font-bold text-lg text-[#2C2E69] dark:text-white">Phone Verified!</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Taking you in…</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Input Field ───────────────────────────────────────────────────────────────

const InputField = ({ label, icon: Icon, rightElement, error, hint, ...props }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
      <input
        {...props}
        className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 shadow-sm
          ${error
            ? 'border-red-300 dark:border-red-500/40 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400/15 dark:focus:ring-red-500/15 bg-white dark:bg-slate-900 text-[#2C2E69] dark:text-white'
            : 'border-slate-200 dark:border-slate-700/60 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15 bg-white dark:bg-slate-900 text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600'
          }`}
      />
      {rightElement && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
    {hint  && !error && <p className="mt-1.5 text-xs text-slate-400 dark:text-[#2C2E69]">{hint}</p>}
    {error &&           <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

// ── Signup ────────────────────────────────────────────────────────────────────

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [serverError,  setServerError]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // After signup succeeds, show OTP modal with the registered phone
  const [otpPhone, setOtpPhone] = useState(null);   // null = modal hidden

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())   errs.name = 'Full name is required';
    if (!formData.email.trim())  errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password)              errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!formData.confirmPassword)       errs.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setServerError('');
    try {
      await api.post('/auth/signup', {
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
        phone:    formData.phone,
      });

      // If user provided a phone, open OTP modal; otherwise go straight in
      if (formData.phone.trim()) {
        setOtpPhone(formData.phone.trim());
      } else {
        onSignupSuccess(null);
      }
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Called when OTP verified — backend returns token + user
  const handleOtpVerified = (data) => {
    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    onSignupSuccess(data?.user ?? null);
  };

  // "Skip for now" — close modal and proceed without verification
  const handleSkipOtp = () => {
    setOtpPhone(null);
    onSignupSuccess(null);
  };

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-500',                   w: 'w-1/4' };
    if (p.length < 8) return { label: 'Weak',      color: 'bg-orange-400',                w: 'w-2/4' };
    if (/[A-Z]/.test(p) && /\d/.test(p))
                      return { label: 'Strong',    color: 'bg-[#F9B406] dark:bg-teal-400',w: 'w-full' };
    return            { label: 'Fair',      color: 'bg-yellow-400',                w: 'w-3/4' };
  })();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950">

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-12 overflow-hidden
        bg-[#FFF7E1] dark:bg-slate-900">

        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(249,180,6,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute top-10 -right-16 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none bg-[#F9B406] dark:bg-teal-500" />
        <div className="absolute bottom-20 -left-8 w-56 h-56 rounded-full blur-3xl opacity-10 pointer-events-none bg-[#e0a205] dark:bg-teal-400" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl border bg-[#F9B406]/20 border-[#F9B406]/30 dark:bg-teal-400/10 dark:border-teal-400/20">
            <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#2C2E69] dark:text-white">
            Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#2C2E69] dark:text-white leading-tight tracking-tight mb-4">
            Your MBBS Seat
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#e0a205] dark:from-teal-400 dark:to-teal-300">
              Start Predicting
            </span>
          </h2>
          <p className="text-sm leading-relaxed mb-8 text-[#2C2E69] dark:text-slate-400">
            Join 2.4 lakh+ NEET aspirants who use MedSankalp to plan smarter
            and walk into counselling with confidence.
          </p>
          <div className="space-y-3">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg border shrink-0
                  bg-[#F9B406]/10 border-[#F9B406]/20 dark:bg-teal-400/10 dark:border-teal-400/20">
                  <Icon className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                </div>
                <p className="text-sm text-[#2C2E69] dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400 dark:text-[#2C2E69]">
          © 2026 MedSankalp · Data sourced from MCC, State DME & NEET official records
        </p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-[#fffdf7] dark:bg-slate-950">
        <div className="w-full max-w-md py-6">

          <h1 className="text-2xl font-bold mb-1 tracking-tight text-[#2C2E69] dark:text-white">
            Create your account
          </h1>
          <p className="text-sm mb-8 text-slate-500 dark:text-white/40">
            Free forever · Cutoff predictions for NEET 2026
          </p>

          {serverError && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-5">
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
                formData.email && !fieldErrors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                  ? <CheckCircle className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                  : null
              } />

            <InputField label="Phone Number" icon={Phone}
              type="tel" name="phone" value={formData.phone}
              onChange={handleChange} placeholder="+91 98765 43210"
              hint="We'll send an OTP to verify your number" />

            <div>
              <InputField label="Password" icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password}
                onChange={handleChange} required placeholder="Min 6 characters"
                error={fieldErrors.password}
                rightElement={
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="text-slate-400 dark:text-[#2C2E69] hover:text-[#2C2E69] dark:hover:text-slate-400 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                } />

              {passwordStrength && (
                <div className="mt-2">
                  <div className="h-1 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.w}`} />
                  </div>
                  <p className="text-xs mt-1 text-slate-500 dark:text-slate-500">{passwordStrength.label}</p>
                </div>
              )}
            </div>

            <InputField label="Confirm Password" icon={Lock}
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} required placeholder="Re-enter your password"
              error={fieldErrors.confirmPassword}
              rightElement={
                formData.password === formData.confirmPassword && formData.confirmPassword
                  ? <CheckCircle className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                  : null
              } />

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                bg-[#F9B406] hover:bg-[#e0a205] dark:bg-teal-400 dark:hover:bg-teal-300
                text-slate-950 shadow-[#F9B406]/25 dark:shadow-teal-400/20">
              {loading
                ? <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Creating Account…</>
                : <><UserPlus className="w-4 h-4" />Create Free Account<ArrowRight className="w-4 h-4 ml-1" /></>
              }
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-white/30">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} type="button"
              className="text-[#F9B406] dark:text-teal-400 font-semibold hover:opacity-80 transition-opacity underline underline-offset-2">
              Sign in
            </button>
          </p>
          <p className="mt-5 text-center text-xs text-slate-400 dark:text-[#2C2E69]">
            By creating an account you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>

      {/* ── OTP Modal ───────────────────────────────────────────────────── */}
      {otpPhone && (
        <OTPModal
          phone={otpPhone}
          onVerified={handleOtpVerified}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default Signup;