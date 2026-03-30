import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, MapPin, Clock, IndianRupee, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, GraduationCap, Shield, Plane,
  Users, BookOpen, ChevronRight, Info, X, Send, Loader2,
  User, Mail, Phone, AlertCircle, CheckCircle
} from 'lucide-react';
import { ABROAD_COUNTRIES, ABROAD_FAQS } from '../data/abroadData.js';
import api from '../utils/api.js';

// ── Lead Capture Modal ────────────────────────────────────────────────────────
const LeadModal = ({ university, country, onClose }) => {
  const [form,    setForm]    = useState({ name: '', phone: '', email: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const overlayRef = useRef(null);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                     e.name  = 'Name is required';
    if (!form.phone.trim())                                    e.phone = 'Phone is required';
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
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/leads', {
        name:        form.name,
        phone:       form.phone,
        email:       form.email,
        university:  university.name,
        country:     country.name,
        source:      'study-abroad',
      });
      setSuccess(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden
        bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
        style={{ maxHeight: '95dvh' }}>

        {/* Drag handle mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {success ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center
              bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">Request Received!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Our counsellor will reach out to you within 24 hours regarding{' '}
                <span className="font-semibold text-slate-700 dark:text-white">{university.name}</span>.
              </p>
            </div>
            <button onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              Done
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <div className="overflow-y-auto" style={{ maxHeight: '95dvh' }}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{country.name}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {university.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-600">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{university.city}</span>
                  <span className="font-semibold text-[#c8920a] dark:text-teal-400">{university.annualFee}/yr</span>
                </div>
              </div>
              <button onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-colors
                  bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-500 dark:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4" noValidate>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Get Free Counselling</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Share your details and our abroad counsellor will contact you within 24 hours.
                </p>
              </div>

              {serverError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs border
                  bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {serverError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="Arjun Sharma" autoFocus
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                      bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                      ${errors.name
                        ? 'border-red-300 dark:border-red-500/40 focus:border-red-400 focus:ring-red-400/15 dark:focus:ring-red-500/15'
                        : 'border-slate-200 dark:border-slate-700/60 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15'
                      }`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
                  <input
                    type="tel" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="98765 43210"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                      bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                      ${errors.phone
                        ? 'border-red-300 dark:border-red-500/40 focus:border-red-400 focus:ring-red-400/15 dark:focus:ring-red-500/15'
                        : 'border-slate-200 dark:border-slate-700/60 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15'
                      }`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">
                  Email Address <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-600" />
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2
                      bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600
                      ${errors.email
                        ? 'border-red-300 dark:border-red-500/40 focus:border-red-400 focus:ring-red-400/15 dark:focus:ring-red-500/15'
                        : 'border-slate-200 dark:border-slate-700/60 focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/15 dark:focus:ring-teal-500/15'
                      }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60
                  bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300
                  text-slate-950 shadow-md shadow-[#F9B406]/20 dark:shadow-teal-400/20">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                  : <><Send className="w-4 h-4" />Request Free Counselling</>
                }
              </button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                By submitting, you agree to be contacted by a MedSankalp counsellor. No spam, ever.
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
    WHO:    'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
    NMC:    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    FAIMER: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    ECFMG:  'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[label] ?? 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
      {label}
    </span>
  );
};

// ── Country Card ──────────────────────────────────────────────────────────────
const CountryCard = ({ country, onClick, isSelected }) => (
  <button
    onClick={() => onClick(country.id)}
    className={`group w-full text-left rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200
      ${isSelected
        ? 'border-[#F9B406] dark:border-teal-400 bg-[#F9B406]/5 dark:bg-teal-500/10 shadow-md shadow-[#F9B406]/10 dark:shadow-teal-500/10'
        : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40 hover:border-[#F9B406]/50 dark:hover:border-teal-500/40 hover:shadow-sm'
      }`}>

    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2.5">
        <span className="text-3xl leading-none">{country.flag}</span>
        <div>
          <p className="font-extrabold text-base text-slate-900 dark:text-white">{country.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">{country.tagline}</p>
        </div>
      </div>
      {country.badge && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0
          ${country.highlight
            ? 'bg-[#F9B406]/10 border-[#F9B406]/30 text-[#c8920a] dark:bg-teal-500/10 dark:border-teal-500/30 dark:text-teal-400'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
          }`}>
          {country.badge}
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">Total Cost</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{country.totalCost}</span>
      </div>
      <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">Duration</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{country.duration}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {country.recognition.map((r) => <RecognitionBadge key={r} label={r} />)}
    </div>

    <div className={`flex items-center gap-1 text-xs font-semibold transition-colors
      ${isSelected ? 'text-[#c8920a] dark:text-teal-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-[#F9B406] dark:group-hover:text-teal-400'}`}>
      {isSelected ? 'Viewing details' : 'View details'}
      <ChevronRight className="w-3.5 h-3.5" />
    </div>
  </button>
);

// ── University Card (grid) ────────────────────────────────────────────────────
const UniversityCard = ({ uni, index, onApply }) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200
    bg-white dark:bg-slate-900/40
    border-slate-200 dark:border-slate-700/60
    hover:border-[#F9B406]/40 dark:hover:border-teal-500/30
    hover:shadow-md">

    {/* Index + NMC */}
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0
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

    {/* Name */}
    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem]">
      {uni.name}
    </p>

    {/* Meta */}
    <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-500">
      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" /> {uni.city}</span>
      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 shrink-0" /> Est. {uni.founded}</span>
      {uni.seats && <span className="flex items-center gap-1.5"><Users className="w-3 h-3 shrink-0" /> {uni.seats} seats/yr</span>}
    </div>

    {/* Fees */}
    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-600">Tuition / Year</p>
        <p className="text-sm font-extrabold text-slate-900 dark:text-white">{uni.annualFee}</p>
      </div>
      {uni.hostelFee && (
        <div className="text-right">
          <p className="text-[10px] text-slate-400 dark:text-slate-600">Hostel / Year</p>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{uni.hostelFee}</p>
        </div>
      )}
    </div>

    {/* Ranking */}
    {uni.ranking && (
      <span className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-lg
        bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
        text-slate-500 dark:text-slate-400">
        {uni.ranking}
      </span>
    )}

    {/* Apply Now */}
    <button
      onClick={() => onApply(uni)}
      className="mt-auto w-full py-2.5 rounded-xl text-sm font-bold transition-colors
        bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300
        text-slate-950">
      Apply Now
    </button>
  </div>
);

// ── Country Detail Panel ──────────────────────────────────────────────────────
const CountryDetail = ({ country }) => {
  const [applyUni, setApplyUni] = useState(null);
  return (
  <div className="flex flex-col gap-5">
    {/* Header */}
    <div className="rounded-2xl border p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-5xl leading-none">{country.flag}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {country.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border
                bg-[#F9B406]/10 border-[#F9B406]/30 text-[#c8920a]
                dark:bg-teal-500/10 dark:border-teal-500/30 dark:text-teal-400">
                {country.badge}
              </span>
            )}
            {country.recognition.map((r) => <RecognitionBadge key={r} label={r} />)}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">MBBS in {country.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{country.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{country.overview}</p>

      {/* Extra stats if available */}
      {(country.fmgePassRate || country.indianStudents) && (
        <div className="flex flex-wrap gap-3 mt-4">
          {country.fmgePassRate && (
            <div className="flex flex-col gap-0.5 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-medium">FMGE Pass Rate</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{country.fmgePassRate}</span>
            </div>
          )}
          {country.indianStudents && (
            <div className="flex flex-col gap-0.5 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-medium">Indian Students</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{country.indianStudents}</span>
            </div>
          )}
        </div>
      )}

      {/* Key stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {[
          { icon: Clock,       label: 'Duration',       val: country.duration },
          { icon: BookOpen,    label: 'Medium',         val: country.medium },
          { icon: IndianRupee, label: 'Tuition / Year', val: country.tuitionPerYear },
          { icon: IndianRupee, label: 'Total Cost',     val: country.totalCost },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border p-5 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advantages
        </h3>
        <ul className="space-y-2">
          {country.pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border p-5 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" /> Considerations
        </h3>
        <ul className="space-y-2">
          {country.cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-red-400 font-bold mt-0.5 shrink-0">✗</span> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Universities — card grid */}
    <div className="rounded-2xl border overflow-hidden bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700/60">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white dark:bg-slate-900/40">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Top Universities in {country.name}
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-600">{country.universities.length} listed</span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {country.universities.map((uni, i) => (
          <UniversityCard key={i} uni={uni} index={i} onApply={setApplyUni} />
        ))}
      </div>
    </div>

    {/* Living cost + CTA */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border p-5 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Living Cost</h3>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{country.livingPerMonth}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">per month (food, transport, personal)</p>
      </div>
      <div className="rounded-2xl border p-5 flex flex-col justify-between
        bg-[#F9B406]/5 dark:bg-teal-500/5 border-[#F9B406]/20 dark:border-teal-500/20">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Ready to apply?</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            MedSankalp's Global & Global Elite programs cover university selection, visa, documentation and arrival support.
          </p>
        </div>
        <Link to="/admission-support"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
            bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 self-start">
          View Abroad Plans →
        </Link>
      </div>
    </div>

    {/* Lead capture modal */}
    {applyUni && (
      <LeadModal
        university={applyUni}
        country={country}
        onClose={() => setApplyUni(null)}
      />
    )}
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
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left
              text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <span>{q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
              : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
          </button>
          {open === i && (
            <div className="px-5 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
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
  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/60">
    <table className="w-full text-xs min-w-[700px]">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40">
          <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">Country</th>
          <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">Duration</th>
          <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">Tuition / Year</th>
          <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">Total Cost</th>
          <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">FMGE Rate</th>
          <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">NMC</th>
          <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">ECFMG</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/40">
        {ABROAD_COUNTRIES.map((c) => (
          <tr key={c.id} className={c.highlight ? 'bg-[#F9B406]/3 dark:bg-teal-500/5' : ''}>
            <td className="px-4 py-3">
              <span className="mr-2">{c.flag}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
              {c.highlight && <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F9B406]/20 dark:bg-teal-500/20 text-[#c8920a] dark:text-teal-400">★</span>}
            </td>
            <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{c.duration}</td>
            <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">{c.tuitionPerYear}</td>
            <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{c.totalCost}</td>
            <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{c.fmgePassRate ?? '—'}</td>
            <td className="px-4 py-3 text-center">{c.recognition.includes('NMC')   ? '✅' : '—'}</td>
            <td className="px-4 py-3 text-center">{c.recognition.includes('ECFMG') ? '✅' : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const StudyAbroad = () => {
  const [selectedId,      setSelectedId]  = useState('russia');
  const [activeTab,       setActiveTab]   = useState('countries');
  const [continentFilter, setFilter]      = useState('all');

  const selected = ABROAD_COUNTRIES.find((c) => c.id === selectedId);
  const filtered = continentFilter === 'all'
    ? ABROAD_COUNTRIES
    : ABROAD_COUNTRIES.filter((c) => c.continent === continentFilter);

  const handleSelect = (id) => { setSelectedId(id); setActiveTab('countries'); };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(249,180,6,0.05),transparent)]
          dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5
            bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <Plane className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">MBBS Abroad 2025-26</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Study MBBS{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Abroad</span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-slate-500 dark:text-slate-400 mb-8">
            NMC-approved universities across 10 countries — at 60–80% less than Indian private colleges.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Globe,         label: '10 countries' },
              { icon: GraduationCap, label: '71+ universities' },
              { icon: Shield,        label: 'NMC approved' },
              { icon: IndianRupee,   label: 'From ₹12 Lakhs' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium
                bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60
                text-slate-600 dark:text-slate-400">
                <Icon className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notice ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-start gap-3 p-4 rounded-xl border text-xs
          bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20
          text-amber-700 dark:text-amber-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span><strong>Important:</strong> NEET-UG qualification is mandatory for Indian students studying MBBS abroad and returning to practice in India. Always verify that the university is listed in the World Directory of Medical Schools (WDOMS) and NMC's approved list before applying.</span>
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-1 p-1 rounded-xl border bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 w-fit">
          {[
            { id: 'countries', label: 'Countries & Universities' },
            { id: 'compare',   label: 'Compare All' },
            { id: 'faq',       label: 'FAQs' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Countries tab */}
        {activeTab === 'countries' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: country list */}
            <div className="lg:w-80 shrink-0 flex flex-col gap-3">
              <div className="flex gap-2">
                {[{ val: 'all', label: 'All' }, { val: 'asia', label: 'Asia' }, { val: 'europe', label: 'Europe' }].map(({ val, label }) => (
                  <button key={val} onClick={() => setFilter(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                      ${continentFilter === val
                        ? 'bg-[#F9B406] dark:bg-teal-400 text-slate-950 border-[#F9B406] dark:border-teal-400'
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-[#F9B406]/40 dark:hover:border-teal-500/30'
                      }`}>
                    {label}
                  </button>
                ))}
              </div>
              {filtered.map((c) => (
                <CountryCard key={c.id} country={c} onClick={handleSelect} isSelected={selectedId === c.id} />
              ))}
            </div>

            {/* Right: detail */}
            <div className="flex-1 min-w-0">
              {selected
                ? <CountryDetail country={selected} />
                : <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-600 text-sm">Select a country to view details</div>
              }
            </div>
          </div>
        )}

        {/* Compare tab */}
        {activeTab === 'compare' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Country Comparison</h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">Side-by-side comparison of all MBBS abroad destinations for Indian students.</p>
            </div>
            <ComparisonTable />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Budget',    range: '₹12–22 Lakhs', countries: 'Kyrgyzstan, Uzbekistan',     color: 'emerald' },
                { label: 'Mid-Range', range: '₹18–32 Lakhs', countries: 'Kazakhstan, Russia, China',  color: 'amber' },
                { label: 'Premium',   range: '₹30–65 Lakhs', countries: 'Georgia, Philippines, Nepal', color: 'violet' },
              ].map(({ label, range, countries, color }) => (
                <div key={label} className={`p-4 rounded-2xl border bg-${color}-50 dark:bg-${color}-500/10 border-${color}-200 dark:border-${color}-500/20`}>
                  <p className={`text-xs font-bold uppercase tracking-wider text-${color}-600 dark:text-${color}-400 mb-1`}>{label}</p>
                  <p className={`text-lg font-extrabold text-${color}-700 dark:text-${color}-300`}>{range}</p>
                  <p className={`text-xs text-${color}-600 dark:text-${color}-400 mt-1`}>{countries}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ tab */}
        {activeTab === 'faq' && (
          <div className="flex flex-col gap-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">Everything you need to know before applying for MBBS abroad.</p>
            </div>
            <FAQ />
          </div>
        )}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="rounded-2xl border p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8
            bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Need help choosing the right country?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                MedSankalp's Global programs include university selection, documentation, visa guidance, and arrival support — all in one place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/admission-support"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105
                  bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
                View Abroad Plans →
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105
                  bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Talk to Counsellor
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudyAbroad;