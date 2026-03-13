import { RefreshCw, CheckCircle, XCircle, Globe, Clock } from 'lucide-react';

const RefundPolicy = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

    {/* Hero */}
    <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 border-amber-300 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
          <RefreshCw className="w-3.5 h-3.5 text-[#F9B406]" />
          <span className="text-xs font-medium text-amber-800 dark:text-[#F9B406]">Last Updated: [Insert Date]</span>
        </div> */}
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Refund <span className="text-[#F9B406]">Policy</span>
        </h1>
        <p className="text-base max-w-xl mx-auto text-slate-500 dark:text-white/50">
          MedSankalp maintains transparency in its counselling and advisory services.
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">

      {/* Non-refundable */}
      <div className="rounded-2xl p-8 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
            <XCircle className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Non-Refundable Programs</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-white/50 mb-4">
          The following programs are <strong>non-refundable once services have started</strong> as they involve personalised counselling support and access to proprietary tools:
        </p>
        <div className="space-y-2">
          {['MedSankalp Rank Analysis', 'MedStart Guidance', 'MedChoice Navigator'].map(p => (
            <div key={p} className="flex items-center gap-3 p-3 rounded-xl border text-sm bg-red-50 border-red-200 text-red-600 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-400">
              <XCircle className="w-4 h-4 shrink-0" />{p}
            </div>
          ))}
        </div>
      </div>

      {/* Refundable */}
      <div className="rounded-2xl p-8 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
            <CheckCircle className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Refundable Program</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-white/50 mb-4">
          Refund eligibility currently applies only to <strong>MedSankalp Seat Secure (WB)</strong>. Refund may be granted if:
        </p>
        <div className="space-y-2 mb-6">
          {[
            'Student qualifies NEET',
            'Student participates in all counselling rounds as advised',
            'Student provides valid documents',
            'No seat is allotted in any WB private medical college until the final counselling round',
          ].map(c => (
            <div key={c} className="flex items-start gap-3 p-3 rounded-xl border text-sm bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />{c}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-white/50 mb-4"><strong>Refund will NOT be granted if:</strong></p>
        <div className="space-y-2">
          {[
            'Student fails to qualify NEET',
            'Student withdraws voluntarily from counselling',
            'Student provides invalid documents',
            'Student declines a seat that becomes available',
          ].map(c => (
            <div key={c} className="flex items-start gap-3 p-3 rounded-xl border text-sm bg-red-50 border-red-200 text-red-600 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-400">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />{c}
            </div>
          ))}
        </div>
      </div>

      {/* Overseas */}
      <div className="rounded-2xl p-8 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
            <Globe className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Overseas & Deemed Programs</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-white/50 mb-4">
          The following programs are generally <strong>non-refundable once admission processing begins</strong>:
        </p>
        <div className="space-y-2">
          {['MedSankalp Global', 'MedSankalp Global Elite', 'MedSankalp Deemed Elite'].map(p => (
            <div key={p} className="flex items-center gap-3 p-3 rounded-xl border text-sm bg-red-50 border-red-200 text-red-600 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-400">
              <XCircle className="w-4 h-4 shrink-0" />{p}
            </div>
          ))}
        </div>
      </div>

      {/* Processing */}
      <div className="rounded-2xl p-8 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
            <Clock className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Refund Processing</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-white/50">
          Approved refunds will be processed within <strong>15–30 working days</strong> through the original payment method or bank transfer.
        </p>
      </div>

      <p className="text-center text-xs pt-4 text-slate-400 dark:text-white/20">
        © 2025 MedSankalp · All rights reserved
      </p>
    </div>
  </div>
);

export default RefundPolicy;