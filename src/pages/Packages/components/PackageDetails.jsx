import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { PACKAGES } from '../data/packages.js';
import EnquiryModal from './EnquiryModal.jsx';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(false);
  const [open, setOpen] = useState({});

  const pkg = PACKAGES.find(p => p.id === id);
  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-3">
        <p className="text-slate-500 dark:text-white/40">Package not found.</p>
        <button onClick={() => navigate('/packages')}
          className="text-sm text-[#F9B406] hover:underline">← Back to Programs</button>
      </div>
    </div>
  );

  const toggle = (i) => setOpen(o => ({ ...o, [i]: !o[i] }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">

          {/* Back */}
          <button onClick={() => navigate('/packages')}
            className="flex items-center gap-1.5 text-sm mb-6 transition-colors
              text-slate-500 dark:text-white/40
              hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" /> All Programs
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              {pkg.badge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border mb-3 text-xs font-medium
                  bg-amber-100 border-amber-300 text-amber-800
                  dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20 dark:text-[#F9B406]">
                  {pkg.badge}
                </div>
              )}
              <p className="text-xs font-medium text-slate-400 dark:text-white/30 mb-1">{pkg.tag}</p>
              <h1 className="text-3xl font-bold tracking-tight mb-1">{pkg.name}</h1>
              <p className="text-sm text-slate-400 dark:text-white/30">{pkg.subtitle}</p>
            </div>

            <div className="shrink-0 text-right">
              <div className="flex items-end gap-1 justify-end">
                <span className="text-3xl font-bold">{pkg.price}</span>
                <span className="text-sm text-slate-400 dark:text-white/30 mb-1">+ GST</span>
              </div>
              {pkg.badgeNote && (
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{pkg.badgeNote}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-5">

        {/* Description */}
        <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none">
          <p className="text-sm leading-relaxed text-slate-500 dark:text-white/50">{pkg.description}</p>
        </div>

        {/* Sections — accordion */}
        <div className="rounded-2xl border overflow-hidden bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">What's Included</h2>
          </div>
          {pkg.sections.map((s, i) => (
            <div key={i} className={`border-b last:border-b-0 border-slate-100 dark:border-white/10`}>
              <button onClick={() => toggle(i)}
                className="flex items-center justify-between w-full px-6 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                <span className="text-sm font-medium text-slate-800 dark:text-white/80">{s.title}</span>
                {open[i]
                  ? <ChevronUp className="w-4 h-4 text-slate-400 dark:text-white/30 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 dark:text-white/30 shrink-0" />}
              </button>
              {open[i] && (
                <div className="px-6 pb-4 space-y-2">
                  {s.points.map((p, j) => (
                    <div key={j} className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-white/50">
                      <CheckCircle className="w-4 h-4 text-[#F9B406] shrink-0 mt-0.5" />
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ideal For */}
        <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Ideal For</h2>
          <div className="space-y-2.5">
            {pkg.idealFor.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-white/50">
                <div className="w-5 h-5 rounded-full bg-[#F9B406] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-[#2C2E69]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Transparency */}
        <div className="rounded-2xl p-6 border bg-[#F9B406]/5 border-[#F9B406]/30 dark:border-[#F9B406]/20">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#F9B406]" />
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
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-[#2C2E69]">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{pkg.name}</p>
              <p className="text-xs text-slate-400 dark:text-white/30">{pkg.price} + GST</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => setEnquiry(true)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69]">
                Enquire Now
              </button>
              <button onClick={() => navigate('/packages')}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors
                  border-slate-200 dark:border-white/10
                  text-slate-600 dark:text-white/60
                  hover:bg-slate-100 dark:hover:bg-white/5">
                All Programs
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