// import { useState, useEffect, useRef, useMemo } from 'react';
// import {
//   Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle,
//   GraduationCap, TrendingUp, BookOpen, Award,
//   Phone, X, Loader2, ShieldCheck
// } from 'lucide-react';
// import api from '../utils/api';

// const STATS = [
//   { icon: GraduationCap, label: 'Colleges Tracked', value: '650+' },
//   { icon: TrendingUp, label: 'Predictions Made', value: '2.4L+' },
//   { icon: Award, label: 'Success Rate', value: '94%' },
//   { icon: BookOpen, label: 'Seats Analysed', value: '1.1L+' },
// ];

// const normalizePhone = (phone) => {
//   const p = phone.replace(/\D/g, '');
//   if (p.length === 10) return `+91${p}`;
//   if (!p.startsWith('+')) return `+${p}`;
//   return p;
// };

// // ── OTP Input ─────────────────────────────────────────────────────────────────

// const OTPInput = ({ value, onChange, length = 4 }) => {
//   // ✅ Single ref holding an array — no hooks-in-loop violation
//   const refs = useRef([]);

//   const handleKey = (e, idx) => {
//     if (e.key === 'Backspace' && !value[idx] && idx > 0)
//       refs.current[idx - 1]?.focus();
//   };

//   const handleChange = (e, idx) => {
//     const char = e.target.value.replace(/\D/g, '').slice(-1);
//     const arr = value.split('');
//     arr[idx] = char;
//     onChange(arr.join(''));
//     if (char && idx < length - 1) refs.current[idx + 1]?.focus();
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
//     onChange(pasted.padEnd(length, ''));
//     refs.current[Math.min(pasted.length, length - 1)]?.focus();
//   };

//   return (
//     <div className="flex gap-3 justify-center">
//       {Array.from({ length }).map((_, i) => (
//         <input
//           key={i}
//           ref={(el) => (refs.current[i] = el)}
//           type="text"
//           inputMode="numeric"
//           maxLength={1}
//           value={value[i] ?? ''}
//           onChange={(e) => handleChange(e, i)}
//           onKeyDown={(e) => handleKey(e, i)}
//           onPaste={handlePaste}
//           className="w-13 h-14 rounded-xl border text-center text-xl font-bold transition-colors
//             bg-white dark:bg-slate-900
//             border-slate-200 dark:border-slate-700
//             text-[#2C2E69] dark:text-white
//             focus:outline-none focus:ring-2
//             focus:border-[#F9B406] dark:focus:border-teal-500
//             focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
//         />
//       ))}
//     </div>
//   );
// };

// // ── OTP Modal ─────────────────────────────────────────────────────────────────

// const OTPModal = ({ phone, onVerified, onClose }) => {
//   const [step, setStep] = useState('send');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [timer, setTimer] = useState(0);

//   useEffect(() => {
//     if (timer > 0) {
//       const t = setTimeout(() => setTimer(v => v - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [timer]);

//   const sendOtp = async () => {
//     setLoading(true); setError('');
//     try {
//       await api.post('/auth/send-otp', { phone: normalizePhone(phone) });
//       setStep('verify');
//       setTimer(30);
//     } catch (err) {
//       setError(err?.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     if (otp.length < 4) { setError('Enter the 4-digit OTP.'); return; }
//     setLoading(true); setError('');
//     try {
//       await api.post('/auth/verify-otp', { phone: normalizePhone(phone), otp });
//       setStep('success');
//       setTimeout(onVerified, 1200);
//     } catch (err) {
//       setError(err?.response?.data?.message || 'Invalid OTP');
//       setOtp('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="w-full max-w-sm rounded-2xl border p-7 shadow-2xl
//         bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">

//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="font-bold text-lg text-[#2C2E69] dark:text-white">Verify your phone</h3>
//             <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Required to access your account</p>
//           </div>
//           <button onClick={onClose}
//             className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {step === 'send' && (
//           <div className="text-center">
//             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5
//               bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20">
//               <Phone className="w-7 h-7 text-[#F9B406] dark:text-teal-400" />
//             </div>
//             <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">We'll send a 4-digit OTP to</p>
//             <p className="font-bold text-[#2C2E69] dark:text-white mb-6 text-lg">{phone}</p>
//             {error && (
//               <div className="flex items-center gap-2 text-xs text-red-500 mb-4 justify-center">
//                 <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
//               </div>
//             )}
//             <button onClick={sendOtp} disabled={loading}
//               className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
//                 bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
//               {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send OTP'}
//             </button>
//           </div>
//         )}

//         {step === 'verify' && (
//           <div className="text-center">
//             <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
//               Enter the 4-digit code sent to{' '}
//               <span className="font-semibold text-[#2C2E69] dark:text-white">{phone}</span>
//             </p>
//             <OTPInput value={otp} onChange={setOtp} />
//             {error && (
//               <div className="flex items-center gap-2 text-xs text-red-500 mt-3 justify-center">
//                 <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
//               </div>
//             )}
//             <button onClick={verifyOtp} disabled={loading || otp.length < 4}
//               className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
//                 bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
//               {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify & Sign In'}
//             </button>
//             <div className="mt-4 text-xs text-slate-400 dark:text-slate-600">
//               {timer > 0
//                 ? `Resend OTP in ${timer}s`
//                 : <button onClick={sendOtp} className="text-[#F9B406] dark:text-teal-400 hover:underline font-medium">Resend OTP</button>
//               }
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="text-center py-6">
//             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
//               bg-emerald-100 dark:bg-emerald-500/20">
//               <ShieldCheck className="w-8 h-8 text-emerald-500" />
//             </div>
//             <p className="font-bold text-lg text-[#2C2E69] dark:text-white">Verified!</p>
//             <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Signing you in…</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Login ─────────────────────────────────────────────────────────────────────

// const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
//   const [formData, setFormData] = useState({ identifier: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [otpPhone, setOtpPhone] = useState(null);

//   // helpers
//   const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
//   const isPhone = (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, ''));

//   // derive what to send to the API
//   const buildIdentifier = (identifier) =>
//     isEmail(identifier)
//       ? { email: identifier }
//       : { phone: normalizePhone(identifier) };

//   useEffect(() => {
//     const saved = localStorage.getItem('savedEmail');
//     if (saved) { setFormData(p => ({ ...p, email: saved })); setRememberMe(true); }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(p => ({ ...p, [name]: value }));
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');
//     try {
//       const payload = { ...buildIdentifier(formData.identifier), password: formData.password };
//       const { data } = await api.post('/auth/login', payload);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       rememberMe
//         ? localStorage.setItem('savedEmail', formData.email)
//         : localStorage.removeItem('savedEmail');
//       setSuccess('Verified! Loading your dashboard…');
//       setTimeout(() => onLoginSuccess(data.user), 1400);
//     } catch (err) {
//       const res = err?.response;
//       if (res?.status === 403) {
//         setOtpPhone(res.data.phone);
//         return;
//       }
//       setError(res?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpVerified = async () => {
//     setOtpPhone(null);
//     setLoading(true); setError('');
//     try {
//       const payload = { ...buildIdentifier(formData.identifier), password: formData.password };
//       const { data } = await api.post('/auth/login', payload);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       setSuccess('Verified! Loading your dashboard…');
//       setTimeout(() => onLoginSuccess(data.user), 1400);
//     } catch (err) {
//       const res = err?.response;
//       if (res?.status === 403) {
//         // verification didn't persist — re-open modal
//         setOtpPhone(res.data.phone);
//         return;
//       }
//       setError(res?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isValidEmail = useMemo(
//     () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
//     [formData.email]
//   );

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-[#fffdf7] dark:bg-slate-950 transition-colors">

//       {/* ── Left panel ──────────────────────────────────────────────────── */}
//       <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12
//         bg-[#FFF7E1] dark:bg-slate-900 overflow-hidden">

//         <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
//           style={{
//             backgroundImage: 'linear-gradient(rgba(249,180,6,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.5) 1px, transparent 1px)',
//             backgroundSize: '48px 48px',
//           }} />
//         <div className="absolute top-20 left-20 w-72 h-72 bg-[#F9B406] rounded-full blur-3xl opacity-10 pointer-events-none dark:bg-teal-500" />
//         <div className="absolute bottom-32 right-10 w-56 h-56 bg-[#e0a205] rounded-full blur-3xl opacity-10 pointer-events-none dark:bg-teal-400" />

//         <div className="relative z-10 flex items-center gap-3">
//           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9B406]/20 border border-[#F9B406]/30 dark:bg-teal-500/20 dark:border-teal-500/30">
//             <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
//           </div>
//           <span className="font-bold text-lg tracking-tight text-[#2C2E69] dark:text-white">
//             Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
//           </span>
//         </div>

//         <div className="relative z-10 max-w-lg">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9B406]/10 border border-[#F9B406]/20 dark:bg-teal-500/10 dark:border-teal-500/20 mb-6">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] dark:bg-teal-400 animate-pulse" />
//             <span className="text-xs font-medium tracking-wide uppercase text-[#2C2E69] dark:text-teal-300">
//               NEET 2026 Predictions Live
//             </span>
//           </div>
//           <h2 className="text-4xl xl:text-5xl font-extrabold text-[#2C2E69] dark:text-white leading-tight tracking-tight mb-4">
//             Know Your College
//             <br />
//             <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F9B406] to-[#e0a205] dark:from-teal-400 dark:to-teal-300">
//               Before Counselling
//             </span>
//           </h2>
//           <p className="text-sm text-[#2C2E69] dark:text-slate-400 leading-relaxed mb-10">
//             AI-powered cutoff predictions across all MBBS, BDS & AYUSH colleges.
//             State quota, all-India quota, management seats — all in one place.
//           </p>
//           <div className="grid grid-cols-2 gap-4">
//             {STATS.map(({ icon: Icon, label, value }) => (
//               <div key={label}
//                 className="flex items-center gap-3 p-4 rounded-2xl border transition-colors
//                   bg-white/70 dark:bg-white/5 border-[#F9B406]/20 dark:border-slate-700/60
//                   hover:border-[#F9B406]/40 dark:hover:border-teal-500/30">
//                 <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0
//                   bg-[#F9B406]/10 dark:bg-teal-500/10">
//                   <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg leading-none text-[#2C2E69] dark:text-white">{value}</p>
//                   <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-500">{label}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p className="relative z-10 text-xs text-slate-400 dark:text-[#2C2E69]">
//           © 2026 MedSankalp · Data sourced from MCC, State DME & NEET official records
//         </p>
//       </div>

//       {/* ── Right panel ─────────────────────────────────────────────────── */}
//       <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#fffdf7] dark:bg-slate-950 transition-colors">
//         <div className="w-full max-w-md">

//           <h1 className="text-2xl font-bold text-[#2C2E69] dark:text-white mb-1 tracking-tight">
//             Sign in to your account
//           </h1>
//           <p className="text-sm text-slate-500 dark:text-white/40 mb-8">
//             Access personalised cutoff predictions & college shortlists
//           </p>

//           {error && (
//             <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-5">
//               <AlertCircle className="w-4 h-4 shrink-0" /> {error}
//             </div>
//           )}
//           {success && (
//             <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20 text-[#c8920a] dark:text-teal-400 text-sm mb-5">
//               <CheckCircle className="w-4 h-4 shrink-0" /> {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
//                 Email or Phone
//               </label>
//               <div className="relative">
//                 {isPhone(formData.identifier)
//                   ? <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
//                   : <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
//                 }
//                 <input
//                   type="text"
//                   name="identifier"
//                   value={formData.identifier}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter Email or Phone"
//                   className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
//                 />
//                 {(isEmail(formData.identifier) || isPhone(formData.identifier)) && (
//                   <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F9B406] dark:text-teal-400" />
//                 )}
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
//                   Password
//                 </label>
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
//                 <input type={showPassword ? 'text' : 'password'} name="password"
//                   value={formData.password} onChange={handleChange} required placeholder="••••••••"
//                   className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 shadow-sm
//                     bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60
//                     text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600
//                     focus:border-[#F9B406] dark:focus:border-teal-500
//                     focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15" />
//                 <button type="button" onClick={() => setShowPassword(v => !v)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#2C2E69] hover:text-[#2C2E69] dark:hover:text-slate-400 transition-colors">
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>
//             {/* // Add this above the submit button
//             <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={e => setRememberMe(e.target.checked)}
//                 className="rounded accent-[#F9B406] dark:accent-teal-400"
//               />
//               Remember me
//             </label> */}
//             <button type="submit" disabled={loading}
//               className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
//                 bg-[#F9B406] hover:bg-[#e0a205] dark:bg-teal-400 dark:hover:bg-teal-300
//                 text-slate-950 shadow-[#F9B406]/25 dark:shadow-teal-400/20">
//               {loading
//                 ? <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Verifying…</>
//                 : <><LogIn className="w-4 h-4" />Sign In</>
//               }
//             </button>

//             <p className="mt-6 text-center text-sm text-slate-500 dark:text-white/30">
//               New here?{' '}
//               <button onClick={onSwitchToSignup} type="button"
//                 className="text-[#F9B406] dark:text-teal-400 font-semibold hover:opacity-80 transition-opacity underline underline-offset-2">
//                 Create a free account
//               </button>
//             </p>
//           </form>
//         </div>
//       </div>

//       {otpPhone && (
//         <OTPModal
//           phone={otpPhone}
//           onVerified={handleOtpVerified}
//           onClose={() => setOtpPhone(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Login;


import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle,
  GraduationCap, TrendingUp, BookOpen, Award,
  Phone, X, Loader2, ShieldCheck, KeyRound
} from 'lucide-react';
import api from '../utils/api';

const STATS = [
  { icon: GraduationCap, label: 'Colleges Tracked', value: '650+' },
  { icon: TrendingUp, label: 'Predictions Made', value: '2.4L+' },
  { icon: Award, label: 'Success Rate', value: '94%' },
  { icon: BookOpen, label: 'Seats Analysed', value: '1.1L+' },
];

const normalizePhone = (phone) => {
  const p = phone.replace(/\D/g, '');
  if (p.length === 10) return `+91${p}`;
  if (!p.startsWith('+')) return `+${p}`;
  return p;
};

// ── OTP Input ─────────────────────────────────────────────────────────────────

const OTPInput = ({ value, onChange, length = 4 }) => {
  const refs = useRef([]);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0)
      refs.current[idx - 1]?.focus();
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[idx] = char;
    onChange(arr.join(''));
    if (char && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, ''));
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
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
  const [step, setStep] = useState('send');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(v => v - 1), 1000);
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
      await api.post('/auth/verify-otp', { phone: normalizePhone(phone), otp });
      setStep('success');
      setTimeout(onVerified, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border p-7 shadow-2xl
        bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-[#2C2E69] dark:text-white">Verify your phone</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Required to access your account</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

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
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send OTP'}
            </button>
          </div>
        )}

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
            <button onClick={verifyOtp} disabled={loading || otp.length < 4}
              className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify & Sign In'}
            </button>
            <div className="mt-4 text-xs text-slate-400 dark:text-slate-600">
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : <button onClick={sendOtp} className="text-[#F9B406] dark:text-teal-400 hover:underline font-medium">Resend OTP</button>
              }
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
              bg-emerald-100 dark:bg-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="font-bold text-lg text-[#2C2E69] dark:text-white">Verified!</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Signing you in…</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Forgot Password Modal ─────────────────────────────────────────────────────

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState('phone');   // phone → otp → newPassword → success
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(v => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  // Step 1 — send OTP to phone
  const sendOtp = async () => {
    if (!phone) { setError('Enter your registered phone number.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { phone: normalizePhone(phone) });
      setStep('otp');
      setTimer(30);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP then move to new password
  const verifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the 4-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      // We just check the OTP is correct before asking for new password.
      // Actual reset happens in the next step.
      setStep('newPassword');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — reset password (sends phone + otp + newPassword together)
  const resetPassword = async () => {
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', {
        phone: normalizePhone(phone),
        otp,
        newPassword,
      });
      setStep('success');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reset failed. Please try again.';
      // If OTP was wrong/expired, go back to OTP step
      if (err?.response?.status === 400) {
        setError(msg);
        setStep('otp');
        setOtp('');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="font-bold text-lg text-[#2C2E69] dark:text-white">Reset Password</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {step === 'phone' && 'Enter your registered phone number'}
              {step === 'otp' && 'Check your phone for the OTP'}
              {step === 'newPassword' && 'Choose a new password'}
              {step === 'success' && 'All done!'}
            </p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-1.5 mb-6">
            {['phone', 'otp', 'newPassword'].map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                ['phone', 'otp', 'newPassword'].indexOf(step) >= i
                  ? 'bg-[#F9B406] dark:bg-teal-400'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            ))}
          </div>
        )}

        {/* ── Step 1: Phone ── */}
        {step === 'phone' && (
          <div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5
              bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20">
              <Phone className="w-6 h-6 text-[#F9B406] dark:text-teal-400" />
            </div>
            <div className="relative mb-4">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
                placeholder="10-digit phone number"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                  bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700
                  text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                  focus:border-[#F9B406] dark:focus:border-teal-500
                  focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 mb-4">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <button onClick={sendOtp} disabled={loading || !phone}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send OTP'}
            </button>
          </div>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
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
            <button onClick={verifyOtp} disabled={loading || otp.length < 4}
              className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify OTP'}
            </button>
            <div className="mt-4 text-xs text-slate-400 dark:text-slate-600">
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : <button onClick={sendOtp} className="text-[#F9B406] dark:text-teal-400 hover:underline font-medium">Resend OTP</button>
              }
            </div>
          </div>
        )}

        {/* ── Step 3: New Password ── */}
        {step === 'newPassword' && (
          <div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5
              bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20">
              <KeyRound className="w-6 h-6 text-[#F9B406] dark:text-teal-400" />
            </div>
            <div className="relative mb-4">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                placeholder="New password (min. 8 chars)"
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                  bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700
                  text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                  focus:border-[#F9B406] dark:focus:border-teal-500
                  focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-[#2C2E69] dark:hover:text-slate-400 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 mb-4">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <button onClick={resetPassword} disabled={loading || newPassword.length < 8}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Reset Password'}
            </button>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
              bg-emerald-100 dark:bg-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="font-bold text-lg text-[#2C2E69] dark:text-white">Password Reset!</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-6">You can now sign in with your new password.</p>
            <button onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Login ─────────────────────────────────────────────────────────────────────

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otpPhone, setOtpPhone] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // helpers
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, ''));

  const buildIdentifier = (identifier) =>
    isEmail(identifier)
      ? { email: identifier }
      : { phone: normalizePhone(identifier) };

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
      const payload = { ...buildIdentifier(formData.identifier), password: formData.password };
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      rememberMe
        ? localStorage.setItem('savedEmail', formData.email)
        : localStorage.removeItem('savedEmail');
      setSuccess('Verified! Loading your dashboard…');
      setTimeout(() => onLoginSuccess(data.user), 1400);
    } catch (err) {
      const res = err?.response;
      if (res?.status === 403) {
        setOtpPhone(res.data.phone);
        return;
      }
      setError(res?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = async () => {
    setOtpPhone(null);
    setLoading(true); setError('');
    try {
      const payload = { ...buildIdentifier(formData.identifier), password: formData.password };
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('Verified! Loading your dashboard…');
      setTimeout(() => onLoginSuccess(data.user), 1400);
    } catch (err) {
      const res = err?.response;
      if (res?.status === 403) {
        setOtpPhone(res.data.phone);
        return;
      }
      setError(res?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    [formData.email]
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fffdf7] dark:bg-slate-950 transition-colors">

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12
        bg-[#FFF7E1] dark:bg-slate-900 overflow-hidden">

        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(249,180,6,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,180,6,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#F9B406] rounded-full blur-3xl opacity-10 pointer-events-none dark:bg-teal-500" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-[#e0a205] rounded-full blur-3xl opacity-10 pointer-events-none dark:bg-teal-400" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9B406]/20 border border-[#F9B406]/30 dark:bg-teal-500/20 dark:border-teal-500/30">
            <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#2C2E69] dark:text-white">
            Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9B406]/10 border border-[#F9B406]/20 dark:bg-teal-500/10 dark:border-teal-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] dark:bg-teal-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#2C2E69] dark:text-teal-300">
              NEET 2026 Predictions Live
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
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label}
                className="flex items-center gap-3 p-4 rounded-2xl border transition-colors
                  bg-white/70 dark:bg-white/5 border-[#F9B406]/20 dark:border-slate-700/60
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
          © 2026 MedSankalp · Data sourced from MCC, State DME & NEET official records
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
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">
                Email or Phone
              </label>
              <div className="relative">
                {isPhone(formData.identifier)
                  ? <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
                  : <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
                }
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  placeholder="Enter Email or Phone"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
                />
                {(isEmail(formData.identifier) || isPhone(formData.identifier)) && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
                  Password
                </label>
                {/* ── Forgot password link ── */}
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-[#F9B406] dark:text-teal-400 font-medium hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-[#2C2E69]" />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange} required placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 shadow-sm
                    bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60
                    text-[#2C2E69] dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                    focus:border-[#F9B406] dark:focus:border-teal-500
                    focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#2C2E69] hover:text-[#2C2E69] dark:hover:text-slate-400 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                bg-[#F9B406] hover:bg-[#e0a205] dark:bg-teal-400 dark:hover:bg-teal-300
                text-slate-950 shadow-[#F9B406]/25 dark:shadow-teal-400/20">
              {loading
                ? <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Verifying…</>
                : <><LogIn className="w-4 h-4" />Sign In</>
              }
            </button>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-white/30">
              New here?{' '}
              <button onClick={onSwitchToSignup} type="button"
                className="text-[#F9B406] dark:text-teal-400 font-semibold hover:opacity-80 transition-opacity underline underline-offset-2">
                Create a free account
              </button>
            </p>
          </form>
        </div>
      </div>

      {otpPhone && (
        <OTPModal
          phone={otpPhone}
          onVerified={handleOtpVerified}
          onClose={() => setOtpPhone(null)}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;