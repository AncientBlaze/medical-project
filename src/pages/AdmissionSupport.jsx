import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Check, Shield, ChevronDown, ChevronUp,
  FileText, Lock, Info, Globe, MapPin, Plane
} from 'lucide-react';
import { ADMISSION_PACKAGES, TERMS, PRIVACY_POLICY, DISCLAIMER } from "../pages/Packages/data/packages.js";
import EnquiryModal from '../pages/Packages/components/EnquiryModal.jsx';

// ── Package Card ──────────────────────────────────────────────────────────────
const PackageCard = ({ pkg, onEnquire, onDetails }) => {
  const isPopular = pkg.highlight;
  return (
    <div className={`relative rounded-2xl border flex flex-col transition-all duration-200
      ${isPopular
        ? 'border-[#F9B406]/50 dark:border-teal-500/40 bg-white dark:bg-slate-900/70 shadow-lg shadow-[#F9B406]/10 dark:shadow-teal-500/10'
        : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40'
      }`}>

      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold
          bg-[#F9B406] dark:bg-teal-400 text-slate-950 whitespace-nowrap">
          ⭐ {pkg.badge}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {pkg.badge && !isPopular && (
          <span className="self-start px-2.5 py-1 rounded-lg border mb-3 text-[11px] font-semibold
            bg-amber-50 border-amber-200 text-amber-700
            dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-400">
            {pkg.badge}
          </span>
        )}

        <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-[#2C2E69]/50 dark:text-teal-400/60">{pkg.tag}</p>
        <h2 className="text-lg font-extrabold mb-1 text-[#2C2E69] dark:text-white">
          {pkg.emoji} {pkg.name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-white/40 mb-4 leading-snug">{pkg.subtitle}</p>

        {/* <div className="mb-1 flex items-end gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{pkg.price}</span>
          <span className="text-sm text-slate-400 dark:text-white/30 mb-1">+ GST /- only</span>
        </div> */}
        <div className="mb-4" />

        {pkg.refundable && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Refund guarantee (conditions apply)</span>
          </div>
        )}

        <ul className="flex flex-col gap-2.5 mb-6 flex-1">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#F9B406] dark:text-teal-400' : 'text-[#2C2E69] dark:text-teal-400'}`} />
              <span className="text-slate-700 dark:text-white/70 leading-snug">{f}</span>
            </li>
          ))}
        </ul>

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
              border-slate-200 dark:border-slate-700 text-slate-500 dark:text-white/40
              hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Policies accordion ────────────────────────────────────────────────────────
const policies = [
  { id: 'terms', icon: FileText, label: 'Terms & Conditions', content: TERMS },
  { id: 'privacy', icon: Lock, label: 'Privacy Policy', content: PRIVACY_POLICY },
  { id: 'disclaimer', icon: Info, label: 'Counselling Disclaimer', content: DISCLAIMER },
];

const PoliciesSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-5xl mx-auto px-6 pb-14">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4 text-center">
        Policies applicable to all programs
      </h3>
      <div className="flex flex-col gap-2">
        {policies.map(({ id, icon: Icon, label, content }) => (
          <div key={id} className="rounded-2xl border overflow-hidden border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
            <button onClick={() => setOpen(open === id ? null : id)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left
                text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-[#2C2E69] dark:text-teal-400 shrink-0" />
                {label}
              </span>
              {open === id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {open === id && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                {content.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className={`text-sm leading-relaxed mb-2 ${para.startsWith('**')
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
const AdmissionSupport = () => {
  const [enquiry, setEnquiry] = useState(null);
  const navigate = useNavigate();

  const indiaPackages = ADMISSION_PACKAGES.filter((p) => p.scope === 'india');
  const abroadPackages = ADMISSION_PACKAGES.filter((p) => p.scope === 'abroad');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(249,180,6,0.05),transparent)]
          dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5
            bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <Shield className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Direct Admission Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 dark:text-white text-[#2D409C]">
            Admission &{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Support Programs</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            From WB private college seat assurance to pan-India admission guidance and MBBS abroad — get dedicated end-to-end support for your final admission.
          </p>
        </div>
      </div>

      {/* ── What's included in all plans ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Check, label: 'Dedicated Counsellor' },
            { icon: Shield, label: 'Documentation Support' },
            { icon: Globe, label: 'Round-wise Strategy' },
            { icon: Info, label: 'Post-Admission Help' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl border text-center
              bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center
                bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20">
                <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-white/70">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── India Admission Plans ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <MapPin className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">India Admission Plans</h2>
            <p className="text-xs text-slate-500 dark:text-slate-500">WB private seats & pan-India deemed/private colleges</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {indiaPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEnquire={setEnquiry} onDetails={(id) => navigate(`/packages/${id}`)} />
          ))}
        </div>
      </div>

      {/* ── Abroad Plans ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
            <Plane className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">MBBS Abroad Plans</h2>
            <p className="text-xs text-slate-500 dark:text-slate-500">Russia, Kazakhstan, Georgia, Uzbekistan, Nepal & more</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {abroadPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onEnquire={setEnquiry} onDetails={(id) => navigate(`/packages/${id}`)} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div className="border-t border-slate-200 dark:border-white/5" />
      </div>

      {/* ── Transparency box ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="flex items-start gap-4 p-5 rounded-2xl border
          bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
          <Shield className="w-5 h-5 text-[#F9B406] dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Transparency Policy</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
              MedSankalp provides counselling and admission guidance services only. We do not sell seats, collect capitation fees, or reserve/pre-book seats. All admissions are conducted through official counselling processes or institutional admission procedures as permitted by regulatory authorities. All university and counselling fees must be paid directly by students or parents to the respective institution.
            </p>
          </div>
        </div>
      </div>

      {/* ── Policies ──────────────────────────────────────────────────────── */}
      <PoliciesSection />

      {enquiry && <EnquiryModal pkg={enquiry} onClose={() => setEnquiry(null)} />}
    </div>
  );
};

export default AdmissionSupport;
