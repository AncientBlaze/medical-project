import { Shield, Database, Eye, Lock, Globe, Cookie, UserCheck, RefreshCw } from 'lucide-react';

const SECTIONS = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: (
      <>
        <p>We may collect personal information including:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Student name</li>
          <li>Contact details & email address</li>
          <li>Academic details</li>
          <li>Category / domicile information</li>
          <li>Exam scores</li>
        </ul>
        <p className="mt-3">This information is used only for <strong>counselling and admission guidance purposes</strong>.</p>
      </>
    ),
  },
  {
    icon: Eye,
    title: 'How We Use Information',
    content: (
      <>
        <p>Collected information may be used for:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Admission counselling services</li>
          <li>Communication regarding counselling updates</li>
          <li>Providing personalised college recommendations</li>
          <li>Customer support</li>
        </ul>
      </>
    ),
  },
  {
    icon: Lock,
    title: 'Data Protection',
    content: (
      <>
        <p>MedSankalp takes reasonable steps to protect user data and prevent unauthorized access.</p>
        <p className="mt-3">Personal information is <strong>not sold or rented to third parties</strong>.</p>
      </>
    ),
  },
  {
    icon: Globe,
    title: 'Third-Party Services',
    content: (
      <>
        <p>Our website may use third-party tools such as payment gateways, analytics services, and communication platforms.</p>
        <p className="mt-3">These services may collect limited technical information in accordance with their own privacy policies.</p>
      </>
    ),
  },
  {
    icon: Cookie,
    title: 'Cookies',
    content: (
      <>
        <p>The website may use cookies to improve user experience and analyse website performance.</p>
        <p className="mt-3">Users may disable cookies through their browser settings.</p>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: 'User Rights',
    content: (
      <>
        <p>Users may request correction or removal of personal data where applicable.</p>
        <p className="mt-3">Requests can be sent to <strong>[Insert Support Email]</strong>.</p>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: 'Policy Updates',
    content: (
      <p>MedSankalp reserves the right to update this Privacy Policy when required. Updates will be published on the website.</p>
    ),
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

    {/* Hero */}
    <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 border-amber-300 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
          <Shield className="w-3.5 h-3.5 text-[#F9B406]" />
          <span className="text-xs font-medium text-amber-800 dark:text-[#F9B406]">Last Updated: [Insert Date]</span>
        </div> */}
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Privacy <span className="text-[#F9B406]">Policy</span>
        </h1>
        <p className="text-base max-w-xl mx-auto text-slate-500 dark:text-white/50">
          MedSankalp respects the privacy of students and parents using its services.
        </p>
      </div>
    </div>

    {/* Sections */}
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">
      {SECTIONS.map(({ icon: Icon, title, content }) => (
        <div key={title} className="rounded-2xl p-8 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none transition-colors">
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
      <p className="text-center text-xs pt-4 text-slate-400 dark:text-white/20">
        © 2025 MedSankalp · All rights reserved
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;