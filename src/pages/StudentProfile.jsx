import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, GraduationCap, Edit2, Check, X, Loader2,
  ShieldCheck, LogOut, Camera, AlertCircle
} from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';

const normalizePhone = (phone) => {
  const p = phone.replace(/\D/g, '');
  if (p.length === 10) return `+91${p}`;
  if (!p.startsWith('+')) return `+${p}`;
  return p;
};

const NEET_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021'];

// ── OTP Input ─────────────────────────────────────────────────────────────────
// Uses a single ref array — no hooks-in-loop violation
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
    <div className="flex gap-2 justify-center">
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
          className="w-11 h-12 rounded-xl border text-center text-lg font-bold transition-colors
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-700
            text-slate-900 dark:text-white
            focus:outline-none focus:ring-2
            focus:border-[#F9B406] dark:focus:border-teal-500
            focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15"
        />
      ))}
    </div>
  );
};

// ── Phone Verify Modal ────────────────────────────────────────────────────────
const PhoneVerifyModal = ({ phone, onVerified, onClose }) => {
  const [step, setStep] = useState('send');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
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
      setTimeout(() => { onVerified(normalizePhone(phone)); onClose(); }, 1200);
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
      <div className="w-full max-w-sm rounded-2xl border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 dark:text-white">Verify Phone Number</h3>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'send' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4
              bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20">
              <Phone className="w-6 h-6 text-[#F9B406] dark:text-teal-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">We'll send an OTP to</p>
            <p className="font-bold text-slate-900 dark:text-white mb-5">{phone}</p>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button onClick={sendOtp} disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Enter the 4-digit OTP sent to{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{phone}</span>
            </p>
            <OTPInput value={otp} onChange={setOtp} />
            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
            <button onClick={verifyOtp} disabled={loading || otp.length < 4}
              className="w-full mt-5 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify OTP'}
            </button>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-600">
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : <button onClick={sendOtp} className="text-[#F9B406] dark:text-teal-400 hover:underline">Resend OTP</button>
              }
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3
              bg-emerald-100 dark:bg-emerald-500/20">
              <ShieldCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">Phone Verified!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Editable Field ────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, value, onSave, type = 'text', options, readOnly, verified, onVerify }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const [saving, setSaving] = useState(false);

  // Keep draft in sync if parent value changes (e.g. after store update)
  useEffect(() => {
    if (!editing) setDraft(value ?? '');
  }, [value, editing]);

  const save = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => { setDraft(value ?? ''); setEditing(false); };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">
        {label}
      </label>
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors
        ${editing
          ? 'border-[#F9B406] dark:border-teal-500 ring-2 ring-[#F9B406]/10 dark:ring-teal-500/10 bg-white dark:bg-slate-900'
          : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40'
        }`}>
        <Icon className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-600" />

        {editing && !readOnly ? (
          options ? (
            <select value={draft} onChange={(e) => setDraft(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-slate-900 dark:text-white">
              <option value="">Select…</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              autoFocus
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
              className="flex-1 text-sm bg-transparent outline-none text-slate-900 dark:text-white"
            />
          )
        ) : (
          <span className={`flex-1 text-sm ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
            {value || `Add ${label.toLowerCase()}`}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {verified && !editing && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {onVerify && !verified && !editing && value && (
            <button onClick={onVerify}
              className="text-[10px] font-bold px-2 py-1 rounded-lg text-[#F9B406] dark:text-teal-400 border border-[#F9B406]/30 dark:border-teal-500/30 hover:bg-[#F9B406]/5 dark:hover:bg-teal-500/5">
              Verify
            </button>
          )}
          {!readOnly && (
            editing ? (
              <>
                <button onClick={save} disabled={saving}
                  className="p-1.5 rounded-lg transition-colors text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                </button>
                <button onClick={cancel}
                  className="p-1.5 rounded-lg transition-colors text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = name
    ? name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className="relative inline-block">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold
        bg-[#F9B406]/15 dark:bg-teal-500/15 text-[#c8920a] dark:text-teal-400 border-2 border-[#F9B406]/30 dark:border-teal-500/30">
        {initials}
      </div>
      <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center
        bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shadow-sm">
        <Camera className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const [verifyModal, setVerifyModal] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Single source of truth: the auth store's user object.
  // All fields read from `user` directly — no local profile state.

  const updateField = async (field, value) => {
    setSaveError('');
    try {
      await api.patch('/profile', { [field]: value });
      setUser({ ...user, [field]: value });
    } catch {
      setSaveError('Failed to save. Please try again.');
    }
  };

  const onPhoneVerified = (normalizedPhone) => {
    setUser({ ...user, phone: normalizedPhone, phoneVerified: true });
    // Persist to backend — fire and forget
    api.patch('/profile', { phone: normalizedPhone, phoneVerified: true }).catch(() => {});
  };

  if (!user) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Manage your personal information and NEET details
          </p>
        </div>

        {/* Avatar + name card */}
        <div className="flex items-center gap-5 p-6 rounded-2xl border mb-5
          bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <Avatar name={user.name} />
          <div>
            <p className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
              {user.name || 'Your Name'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {user.email || 'No email set'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border
                bg-[#F9B406]/10 dark:bg-teal-500/10 text-[#c8920a] dark:text-teal-400
                border-[#F9B406]/20 dark:border-teal-500/20">
                Student
              </span>
              {user.neetYear && (
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600">
                  NEET {user.neetYear}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Save error */}
        {saveError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4
            bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {saveError}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-3 p-6 rounded-2xl border mb-5
          bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Personal Information</h2>

          <Field
            label="Full Name"
            icon={User}
            value={user.name}
            onSave={(v) => updateField('name', v)}
            readOnly
          />
          <Field
            label="Email Address"
            icon={Mail}
            value={user.email}
            type="email"
            onSave={(v) => updateField('email', v)}
            readOnly
          />
          <Field
            label="Mobile Number"
            icon={Phone}
            value={user.phone}
            type="tel"
            onSave={(v) => updateField('phone', v)}
            verified={true}
            onVerify={() => setVerifyModal(true)}
            readOnly
          />
          {/* <Field
            label="NEET UG Year"
            icon={GraduationCap}
            value={user.neetYear}
            options={NEET_YEARS}
            onSave={(v) => updateField('neetYear', v)}
            readOnly
          /> */}
        </div>

        {/* Account */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Account</h2>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
              text-red-500 border border-red-200 dark:border-red-500/20
              hover:bg-red-50 dark:hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>

      </div>

      {verifyModal && user.phone && (
        <PhoneVerifyModal
          phone={user.phone}
          onVerified={onPhoneVerified}
          onClose={() => setVerifyModal(false)}
        />
      )}
    </div>
  );
};

export default StudentProfile;