import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { COUNSELLING_PACKAGES, ADMISSION_PACKAGES } from '../data/packages.js';
import EnquiryModal from './EnquiryModal.jsx';

// Combine both package lists so detail page works for all 7
const ALL_PACKAGES = [...COUNSELLING_PACKAGES, ...ADMISSION_PACKAGES];

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(false);

  const pkg = ALL_PACKAGES.find((p) => p.id === id);

  // Figure out which listing page to go back to
  const backTo = ADMISSION_PACKAGES.some((p) => p.id === id)
    ? '/admission-support'
    : '/packages';
  const backLabel = ADMISSION_PACKAGES.some((p) => p.id === id)
    ? 'Admission & Support'
    : 'All Programs';

  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-3">
        <p className="text-slate-500 dark:text-white/40">Package not found.</p>
        <button onClick={() => navigate('/packages')}
          className="text-sm text-[#F9B406] hover:underline">← Back to Programs</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Hero */}
      <div className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(249,180,6,0.05),transparent)]
          dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">

          {/* Back */}
          <button onClick={() => navigate(backTo)}
            className="flex items-center gap-1.5 text-sm mb-6 transition-colors
              text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              {pkg.badge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border mb-3 text-xs font-medium
                  bg-amber-50 border-amber-200 text-amber-800
                  dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-400">
                  {pkg.badge}
                </div>
              )}
              <p className="text-xs font-medium text-slate-400 dark:text-white/30 mb-1">{pkg.tag}</p>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-white">
                {pkg.emoji} {pkg.name}
              </h1>
              <p className="text-sm text-slate-400 dark:text-white/30">{pkg.subtitle}</p>
            </div>

            <div className="shrink-0 text-right">
              <div className="flex items-end gap-1 justify-end">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{pkg.price}</span>
                {!pkg.isFree && <span className="text-sm text-slate-400 dark:text-white/30 mb-1">+ GST</span>}
                {pkg.isFree  && <span className="text-sm font-semibold text-emerald-500 mb-1">or FREE</span>}
              </div>
              {pkg.originalPrice && (
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-sm line-through text-slate-400 dark:text-slate-600">{pkg.originalPrice}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full
                    bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                    border border-emerald-200 dark:border-emerald-500/20">
                    {pkg.discount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-5">

        {/* Description */}
        <div className="rounded-2xl p-6 border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-500 dark:text-white/50">{pkg.description}</p>
        </div>

        {/* Refund badge */}
        {pkg.refundable && (
          <div className="flex items-center gap-3 p-4 rounded-2xl border
            bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Refund Guarantee</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Full refund if no seat allotted in any WB private medical college (conditions apply — see Refund Policy)
              </p>
            </div>
          </div>
        )}

        {/* What's included */}
        <div className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">What's Included</h2>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {pkg.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 px-6 py-3.5 text-sm text-slate-600 dark:text-white/60">
                <CheckCircle className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Transparency */}
        <div className="rounded-2xl p-6 border bg-[#F9B406]/5 dark:bg-teal-500/5 border-[#F9B406]/20 dark:border-teal-500/20">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Transparency Commitment</h2>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-500 dark:text-white/50">
            <li>• Does not sell seats</li>
            <li>• Does not collect capitation fees</li>
            <li>• Does not pre-book or reserve seats</li>
            <li>• All admissions via official counselling processes</li>
          </ul>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-6 pt-2">
          <div className="rounded-2xl p-4 border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4
            bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{pkg.emoji} {pkg.name}</p>
              <p className="text-xs text-slate-400 dark:text-white/30">{pkg.price}{!pkg.isFree && ' + GST'}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => setEnquiry(true)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-colors
                  bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
                Enquire Now
              </button>
              <button onClick={() => navigate(backTo)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors
                  border-slate-200 dark:border-slate-700
                  text-slate-600 dark:text-white/60
                  hover:bg-slate-100 dark:hover:bg-slate-800/60">
                {backLabel}
              </button>
            </div>
          </div>
        </div>

      </div>

      {enquiry && <EnquiryModal pkg={pkg} onClose={() => setEnquiry(false)} />}
    </div>
  );
};

export default PackageDetail;