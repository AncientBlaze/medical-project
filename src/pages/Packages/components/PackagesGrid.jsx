import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { PACKAGES } from '../data/packages.js';
import EnquiryModal from './EnquiryModal.jsx';

const PackagesGrid = () => {
  const [enquiry, setEnquiry] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 border-amber-300 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F9B406]" />
            <span className="text-xs font-medium text-amber-800 dark:text-[#F9B406]">Ethical · Transparent · Student-First</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Our <span className="text-[#F9B406]">Programs</span>
          </h1>
          <p className="text-base max-w-xl mx-auto text-slate-500 dark:text-white/50">
            Choose the right admission support program for your NEET journey — India or abroad.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id}
              className={`relative rounded-2xl border p-6 flex flex-col transition-colors
                ${pkg.highlight
                  ? 'bg-[#2C2E69]/5 border-[#F9B406]/40 dark:bg-[#2C2E69]/50 dark:border-[#F9B406]/30'
                  : 'bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/20 dark:border-[#2C2E69] dark:shadow-none'
                }`}>

              {/* Badge */}
              {pkg.badge && (
                <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg border mb-4 text-xs font-medium
                  bg-amber-50 border-amber-200 text-amber-800
                  dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20 dark:text-[#F9B406]">
                  {pkg.badge}
                </div>
              )}

              {/* Tag */}
              <p className="text-xs font-medium text-slate-400 dark:text-white/30 mb-1">{pkg.tag}</p>

              {/* Name */}
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">{pkg.name}</h2>
              <p className="text-xs text-slate-400 dark:text-white/30 mb-3">{pkg.subtitle}</p>

              {/* Description */}
              <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed mb-4 flex-1">
                {pkg.description}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{pkg.price}</span>
                <span className="text-sm text-slate-400 dark:text-white/30 mb-0.5">+ GST</span>
              </div>
              {pkg.badgeNote && (
                <p className="text-xs text-slate-400 dark:text-white/30 mb-5">{pkg.badgeNote}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button onClick={() => setEnquiry(pkg)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors
                    bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69]">
                  Enquire Now
                </button>
                <button onClick={() => navigate(`/packages/${pkg.id}`)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors
                    border-slate-200 dark:border-white/10
                    text-slate-600 dark:text-white/60
                    hover:bg-slate-100 dark:hover:bg-white/5
                    hover:text-slate-900 dark:hover:text-white">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enquiry && <EnquiryModal pkg={enquiry} onClose={() => setEnquiry(null)} />}
    </div>
  );
};

export default PackagesGrid;