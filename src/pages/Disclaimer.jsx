import {
  BookOpen, ShieldX, Ban, Building2, Unlink,
  CreditCard, BarChart2, UserCheck, HeartHandshake
} from 'lucide-react';

const SECTIONS = [
  {
    icon: BookOpen,
    title: '1. Nature of MedSankalp Services',
    content: (
      <>
        <p>MedSankalp provides educational counselling, admission guidance, and strategic advisory services for students seeking admission to MBBS and BDS programs in India and abroad.</p>
        <p className="mt-3">Services may include:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Counselling strategy planning</li>
          <li>College selection guidance</li>
          <li>Counselling round planning</li>
          <li>Documentation guidance</li>
          <li>Admission process coordination</li>
        </ul>
        <p className="mt-3">MedSankalp acts strictly as a <strong>guidance and advisory platform</strong>.</p>
      </>
    ),
  },
  {
    icon: ShieldX,
    title: '2. No Admission Guarantee',
    content: (
      <>
        <p>MedSankalp <strong>does not guarantee admission</strong> to any medical college or university.</p>
        <p className="mt-3">Admission outcomes depend on several factors including:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>NEET score and rank</li>
          <li>Category eligibility</li>
          <li>Seat availability</li>
          <li>Counselling authority rules</li>
          <li>Institutional admission policies</li>
        </ul>
        <p className="mt-3">Final admission decisions are made only by <strong>official counselling authorities or institutions</strong>.</p>
      </>
    ),
  },
  {
    icon: Ban,
    title: '3. No Seat Selling Policy',
    content: (
      <>
        <p>MedSankalp strictly follows a <strong>No Seat Selling / No Capitation Policy</strong>.</p>
        <p className="mt-3">MedSankalp:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Does not sell seats</li>
          <li>Does not accept capitation fees</li>
          <li>Does not engage in seat trading</li>
        </ul>
        <p className="mt-3">All admissions must follow official counselling procedures or institutional admission policies.</p>
      </>
    ),
  },
  {
    icon: Building2,
    title: '4. Management Quota Guidance',
    content: (
      <>
        <p>MedSankalp may assist students with guidance related to <strong>management quota or institutional quota admissions</strong> in eligible private medical colleges.</p>
        <p className="mt-3">This assistance may include:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Admission eligibility guidance</li>
          <li>Counselling strategy planning</li>
          <li>Documentation preparation</li>
          <li>Admission process coordination</li>
        </ul>
        <p className="mt-3">However, MedSankalp <strong>does not reserve or pre-book seats</strong>. Seat availability depends entirely on the respective institution and counselling authority.</p>
      </>
    ),
  },
  {
    icon: Unlink,
    title: '5. Independent Advisory Platform',
    content: (
      <>
        <p>MedSankalp is an <strong>independent counselling service provider</strong> and is not affiliated with:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>National Medical Commission (NMC)</li>
          <li>MCC Counselling Authority</li>
          <li>State counselling authorities</li>
          <li>Any specific medical college or university</li>
        </ul>
      </>
    ),
  },
  {
    icon: CreditCard,
    title: '6. Payment Transparency',
    content: (
      <>
        <p>MedSankalp only charges fees for <strong>counselling and advisory services</strong>.</p>
        <p className="mt-3">All official payments including counselling registration fees, security deposits, college tuition fees, and hostel fees must be paid <strong>directly by students or parents to official portals or institutions</strong>.</p>
        <p className="mt-3">MedSankalp <strong>does not collect admission fees</strong> on behalf of any college.</p>
      </>
    ),
  },
  {
    icon: BarChart2,
    title: '7. Data & Admission Predictions',
    content: (
      <>
        <p>Admission predictions and college recommendations are based on:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Historical cutoff trends</li>
          <li>Available seat matrices</li>
          <li>Counselling data analysis</li>
        </ul>
        <p className="mt-3">These predictions are <strong>indicative and not guaranteed outcomes</strong>.</p>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: '8. User Acknowledgement',
    content: (
      <>
        <p>By using MedSankalp services, students and parents acknowledge that:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Admission cannot be guaranteed</li>
          <li>Counselling results depend on official authorities</li>
          <li>MedSankalp provides advisory services only</li>
        </ul>
      </>
    ),
  },
];

const COMMITMENTS = [
  'Transparent counselling practices',
  'Ethical admission guidance',
  'Accurate information based on available data',
  'Student-first counselling support',
];

const Disclaimer = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

    {/* Hero */}
    <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 border-amber-300 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
          <HeartHandshake className="w-3.5 h-3.5 text-[#F9B406]" />
          <span className="text-xs font-medium text-amber-800 dark:text-[#F9B406]">Last Updated: [Insert Date]</span>
        </div> */}
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Counselling <span className="text-[#F9B406]">Disclaimer</span>
        </h1>
        <p className="text-base max-w-xl mx-auto text-slate-500 dark:text-white/50">
          MedSankalp is committed to maintaining transparency, ethical counselling practices, and compliance with Indian admission regulations.
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">

      {/* Main sections */}
      {SECTIONS.map(({ icon: Icon, title, content }) => (
        <div key={title} className="rounded-2xl p-8 border transition-colors bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
              <Icon className="w-4 h-4 text-[#F9B406]" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          </div>
          <div className="text-sm leading-relaxed text-slate-500 dark:text-white/50">
            {content}
          </div>
        </div>
      ))}

      {/* Ethical commitment — special card */}
      <div className="rounded-2xl p-8 border transition-colors bg-[#F9B406]/5 border-[#F9B406]/30 dark:bg-[#F9B406]/5 dark:border-[#F9B406]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-[#F9B406]/10 border-[#F9B406]/20">
            <HeartHandshake className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">9. Ethical Counselling Commitment</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-white/50 mb-4">MedSankalp is committed to:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMMITMENTS.map((c) => (
            <div key={c} className="flex items-center gap-3 p-3.5 rounded-xl border bg-white border-amber-200 dark:bg-white/5 dark:border-[#F9B406]/20">
              <div className="w-5 h-5 rounded-full bg-[#F9B406] flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-[#2C2E69]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-white/70">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs pt-4 text-slate-400 dark:text-white/20">
        © 2025 MedSankalp · All rights reserved
      </p>
    </div>
  </div>
);

export default Disclaimer;