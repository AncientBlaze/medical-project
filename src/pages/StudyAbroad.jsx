import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, MapPin, Clock, IndianRupee, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, GraduationCap, Shield, Plane,
  Users, BookOpen, ChevronRight, Info, X, Send, Loader2,
  User, Mail, Phone, AlertCircle, CheckCircle, ArrowRight,
} from 'lucide-react';
import { ABROAD_COUNTRIES, ABROAD_FAQS } from '../data/abroadData.js';
import api from '../utils/api.js';

// ── Lead Capture Modal ────────────────────────────────────────────────────────
const LeadModal = ({ university, country, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await api.post("/leads/send-abroad", {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.trim(),
        university: university.name,
        country: country.name,
        source: "study-abroad",
        type: "abroad", // 🔥 important
      });

      if (res.data?.success) {
        setSuccess(true);
      } else {
        setServerError(res.data?.message || "Something went wrong");
      }
    } catch (err) {
      if (err?.response?.data?.message?.includes("already exists")) {
        setServerError("You’ve already applied. Our team will reach out shortly.");
      } else {
        setServerError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden anim-fade-up
          bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
        style={{ maxHeight: '95dvh' }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-5 px-6 py-12 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center
              bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're all set!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our counsellor will reach out within 24 hours about{' '}
                <span className="font-semibold text-slate-700 dark:text-white">{university.name}</span>.
              </p>
            </div>
            <button onClick={onClose}
              className="px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-95
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              Done
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: '92dvh' }}>
            {/* header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{country.name}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {university.name}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{university.city}</span>
                  <span className="font-bold text-[#c8920a] dark:text-teal-400">{university.annualFee}/yr</span>
                </div>
              </div>
              <button onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors
                  bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-500 dark:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4" noValidate>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white mb-0.5">Free Counselling Session</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Our abroad counsellor will contact you within 24 hours.
                </p>
              </div>

              {serverError && (
                <div className="flex items-center gap-2 px-3 py-3 rounded-xl text-xs border
                  bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {serverError}
                </div>
              )}

              {[
                { name: 'name', label: 'Full Name', placeholder: 'Arjun Sharma', type: 'text', Icon: User, required: true },
                { name: 'phone', label: 'Mobile Number', placeholder: '98765 43210', type: 'tel', Icon: Phone, required: true },
                { name: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email', Icon: Mail, required: false },
              ].map(({ name, label, placeholder, type, Icon, required }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-400 dark:text-white/40">
                    {label} {!required && <span className="normal-case font-normal">(optional)</span>}
                    {required && ' *'}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
                    <input
                      type={type} name={name} value={form[name]}
                      onChange={handleChange} placeholder={placeholder}
                      autoFocus={name === 'name'}
                      className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2
                        bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600
                        ${errors[name]
                          ? 'border-red-300 dark:border-red-500/40 focus:border-red-400 focus:ring-red-400/15'
                          : 'border-slate-200 dark:border-slate-700/60 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15'
                        }`}
                    />
                  </div>
                  {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all
                  active:scale-[0.98] disabled:opacity-60
                  bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300
                  text-slate-950 shadow-lg shadow-[#F9B406]/25 dark:shadow-teal-400/20">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                  : <><Send className="w-4 h-4" />Request Free Counselling</>}
              </button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                By submitting, you agree to be contacted by a MedSankalp counsellor.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Recognition badge ─────────────────────────────────────────────────────────
const RecognitionBadge = ({ label }) => {
  const colors = {
    WHO: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
    NMC: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    FAIMER: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    ECFMG: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[label] ?? 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
      {label}
    </span>
  );
};

// ── Country Dropdown (mobile) ─────────────────────────────────────────────────
const CountryDropdown = ({ countries, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = countries.find((c) => c.id === selectedId);
  const filtered = search.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countries;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSearch('');
  }, [open]);

  const handleSelect = (id) => { onSelect(id); setOpen(false); };

  return (
    <div ref={ref} className="relative min-w-100">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all
          ${open
            ? 'border-[#F9B406] dark:border-teal-400 ring-2 ring-[#F9B406]/20 dark:ring-teal-400/20'
            : 'border-slate-200 dark:border-slate-700/60 hover:border-[#F9B406]/50 dark:hover:border-teal-500/40'
          } bg-white dark:bg-slate-900/60`}
      >
        {selected ? (
          <>
            <span className="text-2xl leading-none shrink-0">{selected.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selected.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {selected.totalCost}
                {selected.duration ? ` · ${selected.duration}` : ''}
              </p>
            </div>
            {selected.highlight && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0
                bg-[#F9B406]/20 dark:bg-teal-500/20 text-[#c8920a] dark:text-teal-400
                border border-[#F9B406]/30 dark:border-teal-500/30">★</span>
            )}
          </>
        ) : (
          <>
            <Globe className="w-5 h-5 text-slate-400 shrink-0" />
            <p className="flex-1 text-sm text-slate-400 dark:text-slate-600">Select a country…</p>
          </>
        )}
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-40 top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl overflow-hidden
          bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60"
        >
          {/* Search */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800
                  border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white
                  placeholder-slate-400 dark:placeholder-slate-600
                  focus:outline-none focus:border-[#F9B406] dark:focus:border-teal-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-50" >
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-xs text-center text-slate-400 dark:text-slate-600">
                No countries found for "{search}"
              </p>
            ) : (
              filtered.map((c) => {
                const isSel = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isSel ? 'bg-[#F9B406]/8 dark:bg-teal-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                  >
                    <span className="text-2xl leading-none shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${isSel ? 'text-[#c8920a] dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                          {c.name}
                        </p>
                        {c.highlight && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0
                            bg-[#F9B406]/15 text-[#c8920a] dark:bg-teal-500/15 dark:text-teal-400">★</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 dark:text-slate-600">
                        <span>{c.totalCost}</span>
                        <span>·</span>
                        <span>{c.duration}</span>
                        {c.fmgePassRate && <><span>·</span><span className="text-emerald-600 dark:text-emerald-400 font-medium">FMGE {c.fmgePassRate}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex gap-1">
                        {c.recognition.slice(0, 2).map((r) => (
                          <span key={r} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border
                            bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                            {r}
                          </span>
                        ))}
                      </div>
                      {isSel && <CheckCircle2 className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Country Sidebar Card (desktop) ────────────────────────────────────────────
const CountrySidebarCard = ({ country, onClick, isSelected }) => (
  <button
    onClick={() => onClick(country.id)}
    className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition-all duration-200 active:scale-[0.99]
      ${isSelected
        ? 'border-[#F9B406] dark:border-teal-400 bg-[#F9B406]/8 dark:bg-teal-500/10 shadow-md shadow-[#F9B406]/8'
        : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40 hover:border-[#F9B406]/50 dark:hover:border-teal-500/40'
      }`}
  >
    <span className="text-3xl leading-none shrink-0">{country.flag}</span>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{country.name}</p>
        {country.highlight && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0
            bg-[#F9B406]/15 text-[#c8920a] dark:bg-teal-500/15 dark:text-teal-400">★</span>
        )}
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-500 truncate">{country.tagline}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs font-bold text-slate-700 dark:text-white">{country.totalCost}</span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-600">{country.duration}</span>
      </div>
    </div>
    <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-[#F9B406] dark:text-teal-400' : 'text-slate-300 dark:text-slate-700'}`} />
  </button>
);

// ── University Card ────────────────────────────────────────────────────────────
const UniversityCard = ({ uni, index, onApply }) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 h-full
    bg-white dark:bg-slate-900/60
    border-slate-200 dark:border-slate-700/60
    hover:border-[#F9B406]/40 dark:hover:border-teal-500/30
    hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-black/20
    hover:-translate-y-0.5">

    <div className="flex items-center justify-between">
      <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold
        bg-[#F9B406]/15 dark:bg-teal-500/15 text-[#c8920a] dark:text-teal-400">
        {index + 1}
      </span>
      {uni.nmcApproved && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border
          bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
          border-emerald-200 dark:border-emerald-500/20">
          NMC ✓
        </span>
      )}
    </div>

    {uni?.image && (
      <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
        <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
    )}

    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-10">
      {uni.name}
    </p>

    <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-500">
      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" /> {uni.city}</span>
      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 shrink-0" /> Est. {uni.founded}</span>
      {uni.seats && <span className="flex items-center gap-1.5"><Users className="w-3 h-3 shrink-0" /> {uni.seats} seats/yr</span>}
    </div>

    <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-slate-800">
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wide">Tuition / Year</p>
        <p className="text-base font-extrabold text-slate-900 dark:text-white">{uni.annualFee}</p>
      </div>
      {uni.hostelFee && (
        <div className="text-right">
          <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wide">Hostel / Year</p>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{uni.hostelFee}</p>
        </div>
      )}
    </div>

    {uni.ranking && (
      <span className="self-start text-[10px] font-semibold px-2 py-1 rounded-lg
        bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
        text-slate-500 dark:text-slate-400">
        {uni.ranking}
      </span>
    )}

    <button
      onClick={() => onApply(uni)}
      className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]
        bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300
        text-slate-950 shadow-sm shadow-[#F9B406]/20">
      Apply Now
    </button>
  </div>
);

// ── Country Detail Panel ──────────────────────────────────────────────────────
const CountryDetail = ({ country }) => {
  const [applyUni, setApplyUni] = useState(null);

  return (
    <div className="flex flex-col gap-4 anim-fade-up">

      {/* Header card */}
      <div className="rounded-2xl border p-5 sm:p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl sm:text-5xl leading-none">{country.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {country.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border
                  bg-[#F9B406]/10 border-[#F9B406]/30 text-[#c8920a]
                  dark:bg-teal-500/10 dark:border-teal-500/30 dark:text-teal-400">
                  {country.badge}
                </span>
              )}
              {country.recognition.map((r) => <RecognitionBadge key={r} label={r} />)}
            </div>
            <h2 className="abroad-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              MBBS in {country.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{country.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{country.overview}</p>

        {(country.fmgePassRate || country.indianStudents) && (
          <div className="flex flex-wrap gap-2.5 mt-4">
            {country.fmgePassRate && (
              <div className="flex flex-col gap-0.5 px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-medium">FMGE Pass Rate</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{country.fmgePassRate}</span>
              </div>
            )}
            {country.indianStudents && (
              <div className="flex flex-col gap-0.5 px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-medium">Indian Students</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{country.indianStudents}</span>
              </div>
            )}
          </div>
        )}

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          {[
            { icon: Clock, label: 'Duration', val: country.duration },
            { icon: BookOpen, label: 'Medium', val: country.medium },
            { icon: IndianRupee, label: 'Tuition / Year', val: country.tuitionPerYear },
            { icon: IndianRupee, label: 'Total Cost', val: country.totalCost },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-medium">
                <Icon className="w-3 h-3" /> {label}
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            title: 'Advantages', icon: CheckCircle2, iconColor: 'text-emerald-500',
            items: country.pros, bullet: '✓', bulletColor: 'text-emerald-500',
          },
          {
            title: 'Considerations', icon: XCircle, iconColor: 'text-red-400',
            items: country.cons, bullet: '✗', bulletColor: 'text-red-400',
          },
        ].map(({ title, icon: Icon, iconColor, items, bullet, bulletColor }) => (
          <div key={title} className="rounded-2xl border p-5 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Icon className={`w-4 h-4 ${iconColor}`} /> {title}
            </h3>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className={`${bulletColor} font-bold mt-0.5 shrink-0`}>{bullet}</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Universities */}
      <div className="rounded-2xl border overflow-hidden bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700/60">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white dark:bg-slate-900/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Top Universities in {country.name}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">{country.universities.length} listed</span>
        </div>
        <div className="p-3 sm:p-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {country.universities.map((uni, i) => (
            <UniversityCard key={i} uni={uni} index={i} onApply={setApplyUni} />
          ))}
        </div>
      </div>

      {/* Living cost + CTA
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border p-5 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Monthly Living Cost</p>
          <p className="abroad-display text-3xl font-black text-slate-900 dark:text-white">{country.livingPerMonth}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">food, transport & personal expenses</p>
        </div>
        <div className="rounded-2xl border p-5 flex flex-col justify-between
          bg-linear-to-br from-[#F9B406]/8 to-[#F9B406]/3
          dark:from-teal-500/8 dark:to-teal-500/3
          border-[#F9B406]/20 dark:border-teal-500/20">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Ready to apply?</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
              MedSankalp's Global programs cover university selection, visa, documentation and arrival support.
            </p>
          </div>
          <Link to="/admission-support"
            className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95
              bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 self-start shadow-sm">
            View Abroad Plans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {applyUni && (
        <LeadModal university={applyUni} country={country} onClose={() => setApplyUni(null)} />
      )} */}
    </div>
  );
};

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="flex flex-col gap-2">
      {ABROAD_FAQS.map(({ q, a }, i) => (
        <div key={i} className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left gap-3
              text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <span className="leading-snug">{q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
              : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
          </button>
          {open === i && (
            <div className="px-5 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 anim-fade-in">
              {a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Comparison Table ──────────────────────────────────────────────────────────
const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/60 mx-0">
    <table className="w-full text-xs min-w-140">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40">
          {['Country', 'Duration', 'Tuition / Year', 'Total Cost', 'FMGE Rate', 'NMC', 'ECFMG'].map((h, i) => (
            <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 ${i === 0 ? 'text-left' : 'text-center'}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/40">
        {ABROAD_COUNTRIES.map((c) => (
          <tr key={c.id} className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 ${c.highlight ? 'bg-[#F9B406]/3 dark:bg-teal-500/5' : ''}`}>
            <td className="px-4 py-3">
              <span className="mr-2">{c.flag}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
              {c.highlight && <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F9B406]/20 dark:bg-teal-500/20 text-[#c8920a] dark:text-teal-400">★</span>}
            </td>
            <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{c.duration}</td>
            <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">{c.tuitionPerYear}</td>
            <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{c.totalCost}</td>
            <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{c.fmgePassRate ?? '—'}</td>
            <td className="px-4 py-3 text-center">{c.recognition.includes('NMC') ? '✅' : '—'}</td>
            <td className="px-4 py-3 text-center">{c.recognition.includes('ECFMG') ? '✅' : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const StudyAbroad = () => {
  const [selectedId, setSelectedId] = useState('russia');
  const [activeTab, setActiveTab] = useState('countries');
  const [continentFilter, setFilter] = useState('all');
  const detailRef = useRef(null);

  const selected = ABROAD_COUNTRIES.find((c) => c.id === selectedId);
  const filtered = continentFilter === 'all'
    ? ABROAD_COUNTRIES
    : ABROAD_COUNTRIES.filter((c) => c.continent === continentFilter);

  const handleSelect = (id) => {
    setSelectedId(id);
    setActiveTab('countries');
    // On mobile, scroll to detail after a tick
    setTimeout(() => {
      if (detailRef.current && window.innerWidth < 1024) {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const tabs = [
    { id: 'countries', label: 'Countries' },
    { id: 'compare', label: 'Compare' },
    { id: 'faq', label: 'FAQs' },
  ];

  return (
    <div className="abroad-root min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-slate-900/60 dark:to-slate-950 overflow-hidden">

        {/* Glow gradient */}
        <div className="absolute inset-0 pointer-events-none
    bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.12),transparent)]
    dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.12),transparent)]"
        />

        {/* Decorative blur orb */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.06] dark:opacity-[0.08]
    bg-[#F9B406] dark:bg-teal-400 blur-3xl pointer-events-none"
        />

        <div className="relative w-full px-4 sm:px-6 lg:px-10 pt-12 pb-12 sm:pt-16 sm:pb-16 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6
      bg-white/70 dark:bg-slate-900/50 
      border-amber-200 dark:border-slate-700 
      backdrop-blur-md"
          >
            <Plane className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-400">
              MBBS Abroad 2026–27
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-[1.1] text-[#2D409C] dark:text-white">
            Study MBBS{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r 
        from-[#F9B406] to-[#F9B406]/60 
        dark:from-teal-400 dark:to-teal-400/60"
            >
              Abroad
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            NMC-approved universities across 10 countries — at 60–80% less than Indian private colleges.
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { icon: Globe, label: '10 countries' },
              { icon: GraduationCap, label: '71+ universities' },
              { icon: Shield, label: 'NMC approved' },
              { icon: IndianRupee, label: 'From ₹12 Lakhs' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium
          bg-white/70 dark:bg-slate-900/50
          border-amber-200 dark:border-slate-700/60
          text-slate-700 dark:text-slate-400
          backdrop-blur-md
          transition hover:shadow-lg hover:shadow-amber-200/30 dark:hover:shadow-teal-900/20"
              >
                <Icon className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                {label}
              </div>
            ))}
          </div>

        </div>
      </div>
      
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-10 py-12">
          <div className="rounded-2xl border p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10
            bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60
            max-w-4xl mx-auto">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="abroad-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                Need help choosing the right country?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                MedSankalp's Global programs include university selection, documentation, visa guidance, and arrival support — all in one place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link to="/admission-support"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all
                  active:scale-95 hover:scale-[1.02]
                  bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300
                  text-slate-950 shadow-lg shadow-[#F9B406]/25 dark:shadow-teal-300/25">
                View Admission Plans <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all
                  active:scale-95 hover:scale-[1.02]
                  bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700
                  text-slate-700 dark:text-slate-300">
                Talk to Counsellor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notice ───────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 pt-5">
        <div className="flex items-start gap-3 p-4 rounded-2xl border text-xs
          bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20
          text-amber-700 dark:text-amber-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> NEET-UG qualification is mandatory for Indian students studying MBBS abroad.
            Always verify the university is listed in the World Directory of Medical Schools (WDOMS) and NMC's approved list before applying.
          </span>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 px-4 sm:px-6 lg:px-10 pt-4 pb-3
        bg-[#fffdf7]/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-transparent">
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-8">

        {/* ── Countries tab ── */}
        {activeTab === 'countries' && (
          <div className="flex flex-col  gap-5 lg:gap-8 lg:items-start">

            {/* Selector column */}
            <div className="lg:w-64 xl:w-72 shrink-0">
              {/* Filter pills */}
              <div className="flex gap-2 mb-3">
                {[{ val: 'all', label: 'All' }, { val: 'asia', label: 'Asia' }, { val: 'europe', label: 'Europe' }].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setFilter(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95
                      ${continentFilter === val
                        ? 'bg-[#F9B406] dark:bg-teal-400 text-slate-950 border-[#F9B406] dark:border-teal-400'
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Mobile: dropdown */}
              <div>
                <CountryDropdown
                  countries={filtered}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </div>

              {/* Desktop: vertical sidebar list
              <div className="hidden lg:flex flex-col gap-2 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                {filtered.map((c) => (
                  <CountrySidebarCard key={c.id} country={c} onClick={handleSelect} isSelected={selectedId === c.id} />
                ))}
              </div> */}
            </div>

            {/* Detail panel */}
            <div ref={detailRef} className="flex-1 min-w-0 scroll-mt-24">
              {selected
                ? <CountryDetail key={selected.id} country={selected} />
                : (
                  <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
                    <Globe className="w-10 h-10 text-slate-200 dark:text-slate-800" />
                    <p className="text-slate-400 dark:text-slate-600 text-sm">Select a country to view details</p>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ── Compare tab ── */}
        {activeTab === 'compare' && (
          <div className="flex flex-col gap-6 anim-fade-up">
            <div>
              <h2 className="abroad-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                Country Comparison
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Side-by-side comparison of all MBBS abroad destinations for Indian students.
              </p>
            </div>
            <ComparisonTable />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Budget', range: '₹12–22 Lakhs', countries: 'Kyrgyzstan, Uzbekistan', colorClass: 'emerald' },
                { label: 'Mid-Range', range: '₹18–32 Lakhs', countries: 'Kazakhstan, Russia, China', colorClass: 'amber' },
                { label: 'Premium', range: '₹30–65 Lakhs', countries: 'Georgia, Philippines, Nepal', colorClass: 'violet' },
              ].map(({ label, range, countries, colorClass }) => (
                <div key={label} className={`p-4 rounded-2xl border bg-${colorClass}-50 dark:bg-${colorClass}-500/10 border-${colorClass}-200 dark:border-${colorClass}-500/20`}>
                  <p className={`text-xs font-bold uppercase tracking-wider text-${colorClass}-600 dark:text-${colorClass}-400 mb-1`}>{label}</p>
                  <p className={`abroad-display text-2xl font-black text-${colorClass}-700 dark:text-${colorClass}-300`}>{range}</p>
                  <p className={`text-xs text-${colorClass}-600 dark:text-${colorClass}-400 mt-1`}>{countries}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ tab ── */}
        {activeTab === 'faq' && (
          <div className="flex flex-col gap-6 max-w-3xl anim-fade-up">
            <div>
              <h2 className="abroad-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Everything you need to know before applying for MBBS abroad.
              </p>
            </div>
            <FAQ />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyAbroad;