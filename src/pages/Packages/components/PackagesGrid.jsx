import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Download, CheckCircle2, Check, X,
  ChevronDown, ChevronUp, Shield, FileText, Lock, Info
} from 'lucide-react';
import { PACKAGES, TERMS, REFUND_POLICY, PRIVACY_POLICY, DISCLAIMER } from '../data/packages.js';
import EnquiryModal from './EnquiryModal.jsx';

// ── Hero illustration ─────────────────────────────────────────────────────────
const CounsellingIllustration = () => (
  <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
    <ellipse cx="260" cy="200" rx="145" ry="130" fill="#2C2E69" fillOpacity="0.08" />
    <ellipse cx="260" cy="200" rx="145" ry="130" fill="url(#circleGrad)" fillOpacity="0.12" />
    <rect x="100" y="218" width="260" height="12" rx="6" fill="#2C2E69" fillOpacity="0.15" />
    <ellipse cx="175" cy="285" rx="38" ry="10" fill="#2C2E69" fillOpacity="0.08" />
    <rect x="148" y="200" width="54" height="85" rx="10" fill="#1a1a2e" />
    <circle cx="175" cy="185" r="22" fill="#2d2d44" />
    <rect x="155" y="195" width="40" height="20" rx="4" fill="#1a1a2e" />
    <ellipse cx="315" cy="285" rx="38" ry="10" fill="#2C2E69" fillOpacity="0.08" />
    <rect x="288" y="195" width="54" height="90" rx="10" fill="#6c63ff" fillOpacity="0.85" />
    <circle cx="315" cy="178" r="22" fill="#9b8fd4" />
    <rect x="295" y="188" width="40" height="20" rx="4" fill="#6c63ff" fillOpacity="0.7" />
    <rect x="200" y="198" width="65" height="42" rx="5" fill="#2C2E69" fillOpacity="0.7" />
    <rect x="203" y="201" width="59" height="33" rx="3" fill="#F9B406" fillOpacity="0.15" />
    <rect x="193" y="238" width="79" height="6" rx="3" fill="#2C2E69" fillOpacity="0.4" />
    <rect x="208" y="207" width="30" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
    <rect x="208" y="213" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
    <rect x="208" y="219" width="25" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
    <text x="218" y="234" fontSize="7" fill="white" fillOpacity="0.6" fontWeight="bold">MedSankalp</text>
    <rect x="52" y="80" width="52" height="44" rx="12" fill="#2C2E69" fillOpacity="0.08" stroke="#2C2E69" strokeOpacity="0.15" strokeWidth="1.5" />
    <circle cx="68" cy="99" r="5" fill="#2C2E69" fillOpacity="0.3" />
    <circle cx="78" cy="99" r="5" fill="#2C2E69" fillOpacity="0.3" />
    <circle cx="88" cy="99" r="5" fill="#2C2E69" fillOpacity="0.3" />
    <rect x="318" y="62" width="52" height="44" rx="12" fill="#2C2E69" fillOpacity="0.08" stroke="#2C2E69" strokeOpacity="0.15" strokeWidth="1.5" />
    <circle cx="340" cy="82" r="8" stroke="#2C2E69" strokeOpacity="0.4" strokeWidth="2" fill="none" />
    <line x1="346" y1="88" x2="352" y2="94" stroke="#2C2E69" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    <rect x="352" y="128" width="52" height="56" rx="10" fill="#2C2E69" fillOpacity="0.08" stroke="#2C2E69" strokeOpacity="0.15" strokeWidth="1.5" />
    <rect x="362" y="140" width="32" height="3" rx="1.5" fill="#2C2E69" fillOpacity="0.3" />
    <rect x="362" y="148" width="24" height="3" rx="1.5" fill="#2C2E69" fillOpacity="0.3" />
    <rect x="362" y="156" width="28" height="3" rx="1.5" fill="#2C2E69" fillOpacity="0.3" />
    <rect x="362" y="164" width="20" height="3" rx="1.5" fill="#F9B406" fillOpacity="0.5" />
    <rect x="50" y="150" width="52" height="56" rx="10" fill="#2C2E69" fillOpacity="0.08" stroke="#2C2E69" strokeOpacity="0.15" strokeWidth="1.5" />
    <rect x="66" y="172" width="20" height="24" rx="2" fill="#2C2E69" fillOpacity="0.25" />
    <rect x="70" y="162" width="12" height="12" rx="2" fill="#2C2E69" fillOpacity="0.2" />
    <rect x="185" y="55" width="52" height="44" rx="12" fill="#F9B406" fillOpacity="0.12" stroke="#F9B406" strokeOpacity="0.3" strokeWidth="1.5" />
    <path d="M211 68 L225 74 L211 80 L197 74 Z" fill="#F9B406" fillOpacity="0.5" />
    <path d="M221 76 L221 86 C221 90 216 93 211 93 C206 93 201 90 201 86 L201 76" stroke="#F9B406" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
    <defs>
      <radialGradient id="circleGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2C2E69" />
        <stop offset="100%" stopColor="#6c63ff" />
      </radialGradient>
    </defs>
  </svg>
);

// ── Policy modal ──────────────────────────────────────────────────────────────
const PolicyModal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
      onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm text-slate-600 dark:text-white/60 leading-relaxed whitespace-pre-line space-y-3">
        {content.split('\n').filter(Boolean).map((para, i) => (
          <p key={i} className={para.startsWith('**') ? 'font-semibold text-slate-900 dark:text-white' : ''}>
            {para.replace(/\*\*/g, '')}
          </p>
        ))}
      </div>
    </div>
  </div>
);

// ── Package card ──────────────────────────────────────────────────────────────
const PackageCard = ({ pkg, onEnquire, onDetails }) => {
  const isPopular = pkg.highlight;

  return (
    <div className={`relative rounded-2xl border flex flex-col transition-all duration-200
      ${isPopular
        ? 'border-[#F9B406]/50 dark:border-teal-500/40 bg-white dark:bg-slate-900/70 shadow-lg shadow-[#F9B406]/10 dark:shadow-teal-500/10'
        : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40'
      }`}>

      {/* Popular ribbon */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold
          bg-[#F9B406] dark:bg-teal-400 text-slate-950">
          ⭐ Most Popular
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Badge */}
        {pkg.badge && !isPopular && (
          <span className="self-start px-2.5 py-1 rounded-lg border mb-3 text-[11px] font-semibold
            bg-amber-50 border-amber-200 text-amber-700
            dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-400">
            {pkg.badge}
          </span>
        )}

        {/* Plan name */}
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-[#2C2E69]/50 dark:text-teal-400/60">{pkg.tag}</p>
        <h2 className="text-lg font-extrabold mb-1 text-[#2C2E69] dark:text-white">
          {pkg.emoji} {pkg.name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-white/40 mb-4 leading-snug">{pkg.subtitle}</p>

        {/* Price */}
        <div className="mb-1 flex items-end gap-2 flex-wrap">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{pkg.price}</span>
          {!pkg.isFree && <span className="text-sm text-slate-400 dark:text-white/30 mb-1">+ GST /- only</span>}
          {pkg.isFree && <span className="text-sm font-semibold text-emerald-500 mb-1">or FREE</span>}
        </div>
        {pkg.originalPrice && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm line-through text-slate-400 dark:text-slate-600">{pkg.originalPrice}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              {pkg.discount}
            </span>
          </div>
        )}
        {!pkg.originalPrice && <div className="mb-4" />}

        {/* Refundable note */}
        {pkg.refundable && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Refund guarantee (conditions apply)</span>
          </div>
        )}

        {/* Features */}
        <ul className="flex flex-col gap-2.5 mb-6 flex-1">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#F9B406] dark:text-teal-400' : 'text-[#2C2E69] dark:text-teal-400'}`} />
              <span className="text-slate-700 dark:text-white/70 leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onEnquire(pkg)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors
              ${isPopular
                ? 'bg-[#F9B406] hover:bg-[#e0a205] text-slate-950 dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950'
                : 'bg-[#2C2E69] hover:bg-[#23255a] text-white dark:bg-teal-500/20 dark:hover:bg-teal-500/30 dark:text-teal-300 dark:border dark:border-teal-500/30'
              }`}>
            Enquire Now
          </button>
          <button onClick={() => onDetails(pkg.id)}
            className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors
              border-slate-200 dark:border-slate-700
              text-slate-500 dark:text-white/40
              hover:bg-slate-50 dark:hover:bg-slate-800/60
              hover:text-slate-800 dark:hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Policies accordion ────────────────────────────────────────────────────────
const policies = [
  { id: 'terms',    icon: FileText, label: 'Terms & Conditions',              content: TERMS },
  { id: 'refund',   icon: Shield,   label: 'Refund Policy',                   content: REFUND_POLICY },
  { id: 'privacy',  icon: Lock,     label: 'Privacy Policy',                  content: PRIVACY_POLICY },
  { id: 'disclaimer', icon: Info,   label: 'Counselling Disclaimer',          content: DISCLAIMER },
];

const PoliciesSection = () => {
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-14">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4 text-center">
        Policies applicable to all programs
      </h3>
      <div className="flex flex-col gap-2">
        {policies.map(({ id, icon: Icon, label, content }) => (
          <div key={id} className="rounded-2xl border overflow-hidden border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
            <button onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left
                text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-[#2C2E69] dark:text-teal-400 shrink-0" />
                {label}
              </span>
              {open === id
                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {open === id && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                {content.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className={`text-sm leading-relaxed mb-2 ${
                    para.startsWith('**')
                      ? 'font-semibold text-slate-900 dark:text-white mt-4 first:mt-0'
                      : 'text-slate-500 dark:text-white/50'
                  }`}>
                    {para.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const PackagesGrid = () => {
  const [enquiry, setEnquiry]     = useState(null);
  const [policyModal, setPolicyModal] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white mb-3">
              Your One-Stop Solution for all<br />
              type of College Counselling<span className="text-[#F9B406] dark:text-teal-400">...</span>
            </h1>
            <div className="mb-5">
              <span className="text-sm font-semibold text-[#2C2E69] dark:text-teal-400">MBBS</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/50 mb-4 leading-relaxed">
              At <span className="font-bold text-slate-900 dark:text-white">MedSankalp</span>, we make your college admission journey stress-free and successful.
            </p>
            <p className="text-sm text-slate-500 dark:text-white/40 mb-3">Our expert team provides:</p>
            <ul className="flex flex-col gap-2 mb-7">
              {['Smooth Counseling Process', 'Personalized Guidance', 'Support Every Step of the Way'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-white/70">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2C2E69] dark:text-teal-400" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="/counselling-brochure.pdf" download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors
                border-[#2C2E69]/30 dark:border-teal-500/30
                text-[#2C2E69] dark:text-teal-400
                bg-[#2C2E69]/5 dark:bg-teal-500/10
                hover:bg-[#2C2E69]/10 dark:hover:bg-teal-500/20">
              <Download className="w-4 h-4" />
              Counselling Brochure
            </a>
          </div>
          <div className="flex-1 w-full max-w-xs md:max-w-sm">
            <CounsellingIllustration />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-slate-200 dark:border-white/5" />
      </div>

      {/* ── Choose Your Plan ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-2 text-slate-900 dark:text-white">
          Choose Your Plan
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-white/40 mb-10">
          From early rank analysis to full admission assurance — pick the support that fits your goal.
        </p>

        {/* Row 1: Free + Govt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {PACKAGES.slice(0, 2).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEnquire={setEnquiry} onDetails={(id) => navigate(`/packages/${id}`)} />
          ))}
        </div>

        {/* Row 2: MedChoice (full width, highlighted) */}
        <div className="mb-5">
          <div className="max-w-2xl mx-auto">
            <PackageCard pkg={PACKAGES[2]} onEnquire={setEnquiry} onDetails={(id) => navigate(`/packages/${id}`)} />
          </div>
        </div>

        {/* Row 3: Seat Secure + National Elite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {PACKAGES.slice(3, 5).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEnquire={setEnquiry} onDetails={(id) => navigate(`/packages/${id}`)} />
          ))}
        </div>

        {/* Row 4: Global + Global Elite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {PACKAGES.slice(5, 7).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEnquire={setEnquiry} onDetails={(id) => navigate(`/packages/${id}`)} />
          ))}
        </div>

        {/* Quick compare note */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs
              border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40
              text-slate-600 dark:text-white/50">
              <span>{pkg.emoji}</span>
              <span className="font-medium">{pkg.price}</span>
              <span className="text-slate-400 dark:text-white/30">— {pkg.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div className="border-t border-slate-200 dark:border-white/5" />
      </div>

      {/* ── Policies ──────────────────────────────────────────────────────── */}
      <PoliciesSection />

      {enquiry && <EnquiryModal pkg={enquiry} onClose={() => setEnquiry(null)} />}
      {policyModal && <PolicyModal title={policyModal.label} content={policyModal.content} onClose={() => setPolicyModal(null)} />}
    </div>
  );
};

export default PackagesGrid;