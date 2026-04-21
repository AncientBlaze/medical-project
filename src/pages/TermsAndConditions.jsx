// import { FileText, Users, BookOpen, CreditCard, Building2, ShieldAlert, Lock, RefreshCw, Scale } from 'lucide-react';

// const SECTIONS = [
//   {
//     icon: BookOpen,
//     title: '1. Nature of Services',
//     content: (
//       <>
//         <p>MedSankalp provides <strong>educational counselling, admission guidance, and strategic support</strong> for medical admissions including MBBS and BDS programs in India and abroad.</p>
//         <p className="mt-3">MedSankalp acts solely as an <strong>independent advisory platform</strong> and does not represent any government authority, counselling body, or educational institution.</p>
//         <p className="mt-3">All admissions are subject to:</p>
//         <ul className="mt-2 space-y-1 list-disc list-inside">
//           <li>NEET qualification requirements</li>
//           <li>Counselling authority rules</li>
//           <li>Institutional admission policies</li>
//           <li>Seat availability</li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     icon: Users,
//     title: '2. User Responsibilities',
//     content: (
//       <>
//         <p>Students and parents using MedSankalp services must:</p>
//         <ul className="mt-2 space-y-1 list-disc list-inside">
//           <li>Provide <strong>accurate academic and personal information</strong></li>
//           <li>Submit <strong>valid documents for verification</strong></li>
//           <li>Follow counselling instructions provided by MedSankalp advisors</li>
//           <li>Complete counselling registrations on official portals independently</li>
//         </ul>
//         <p className="mt-3">Failure to provide correct information may affect admission outcomes.</p>
//       </>
//     ),
//   },
//   {
//     icon: FileText,
//     title: '3. Counselling Scope',
//     content: (
//       <>
//         <p>MedSankalp services include guidance such as:</p>
//         <ul className="mt-2 space-y-1 list-disc list-inside">
//           <li>Admission strategy planning</li>
//           <li>Counselling round planning</li>
//           <li>College selection assistance</li>
//           <li>Documentation guidance</li>
//           <li>Admission process coordination</li>
//         </ul>
//         <p className="mt-3"><strong>Final admission decisions are made by counselling authorities or educational institutions.</strong></p>
//       </>
//     ),
//   },
//   {
//     icon: CreditCard,
//     title: '4. Payment Terms',
//     content: (
//       <>
//         <p>Program fees are charged for <strong>counselling expertise, advisory services, and support provided by MedSankalp</strong>.</p>
//         <p className="mt-3">The MedSankalp service fee does <strong>not include any official admission or counselling fees</strong>.</p>
//         <p className="mt-3">Students and parents must pay all official fees directly to counselling authorities, universities or colleges, and official admission portals.</p>
//       </>
//     ),
//   },
//   {
//     icon: Building2,
//     title: '5. Management Quota Guidance',
//     content: (
//       <>
//         <p>MedSankalp may assist students with <strong>admission guidance for management quota or institutional quota seats</strong> where permitted by regulations.</p>
//         <ul className="mt-3 space-y-1 list-disc list-inside">
//           <li>MedSankalp <strong>does not sell seats</strong></li>
//           <li>MedSankalp <strong>does not collect capitation fees</strong></li>
//           <li>All admissions must follow official admission procedures</li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     icon: ShieldAlert,
//     title: '6. Limitation of Liability',
//     content: (
//       <>
//         <p>MedSankalp shall not be responsible for:</p>
//         <ul className="mt-2 space-y-1 list-disc list-inside">
//           <li>Changes in counselling rules or regulations</li>
//           <li>Seat availability changes</li>
//           <li>Institutional admission decisions</li>
//           <li>Government policy updates</li>
//         </ul>
//         <p className="mt-3">Admission outcomes ultimately depend on official counselling authorities and institutions.</p>
//       </>
//     ),
//   },
//   {
//     icon: Lock,
//     title: '7. Intellectual Property',
//     content: (
//       <p>All materials provided by MedSankalp including counselling guides, predictor tools, data reports, and strategy documents are <strong>proprietary resources</strong> and may not be copied, reproduced, or distributed without permission.</p>
//     ),
//   },
//   {
//     icon: RefreshCw,
//     title: '8. Modification of Services',
//     content: (
//       <p>MedSankalp reserves the right to modify or discontinue services at any time in order to comply with regulatory requirements or improve service quality.</p>
//     ),
//   },
//   {
//     icon: Scale,
//     title: '9. Governing Law',
//     content: (
//       <p>These terms shall be governed by the laws of <strong>India</strong>. Any disputes shall fall under the jurisdiction of courts located in <strong>[Insert City/State]</strong>.</p>
//     ),
//   },
// ];

// const TermsAndConditions = () => (
//   <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-[#2d409c] dark:text-white transition-colors duration-300">

//     {/* Hero */}
//     <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
//       <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
//         {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 border-amber-300 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
//           <FileText className="w-3.5 h-3.5 text-[#F9B406]" />
//           <span className="text-xs font-medium text-amber-800 dark:text-[#F9B406]">Last Updated: [Insert Date]</span>
//         </div> */}
//         <h1 className="text-4xl font-bold tracking-tight mb-3">
//           Terms & <span className="text-[#F9B406]">Conditions</span>
//         </h1>
//         <p className="text-base max-w-xl mx-auto text-slate-500 dark:text-white/50">
//           By accessing or using MedSankalp services, you agree to comply with these terms.
//         </p>
//       </div>
//     </div>

//     {/* Sections */}
//     <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">
//       {SECTIONS.map(({ icon: Icon, title, content }) => (
//         <div key={title} className="rounded-2xl p-8 border bg-white border-slate-200 shadow-sm dark:bg-[#2C2E69]/30 dark:border-[#2C2E69] dark:shadow-none transition-colors">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 dark:bg-[#F9B406]/10 dark:border-[#F9B406]/20">
//               <Icon className="w-4 h-4 text-[#F9B406]" />
//             </div>
//             <h2 className="text-base font-semibold text-[#2d409c] dark:text-white">{title}</h2>
//           </div>
//           <div className="text-sm leading-relaxed text-slate-500 dark:text-white/50">
//             {content}
//           </div>
//         </div>
//       ))}
//       <p className="text-center text-xs pt-4 text-slate-400 dark:text-white/20">
//         © 2026 MedSankalp · All rights reserved
//       </p>
//     </div>
//   </div>
// );

// export default TermsAndConditions;


import { FileText, Users, BookOpen, CreditCard, Building2, ShieldAlert, Lock, RefreshCw, Scale, Phone, CheckCircle, XCircle, Ban, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  {
    icon: BookOpen,
    title: '1. Nature of Services',
    content: (
      <>
        <p>MedSankalp provides <strong>educational counselling, admission guidance, and strategic support</strong> for medical admissions including MBBS and BDS programs in India and abroad.</p>
        <p className="mt-3">MedSankalp acts solely as an <strong>independent advisory platform</strong> and does not represent any government authority, counselling body, or educational institution.</p>
        <p className="mt-3">All admissions are subject to:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>NEET qualification requirements</li>
          <li>Counselling authority rules</li>
          <li>Institutional admission policies</li>
          <li>Seat availability</li>
        </ul>
      </>
    ),
  },
  {
    icon: Users,
    title: '2. User Responsibilities',
    content: (
      <>
        <p>Students and parents using MedSankalp services must:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Provide <strong>accurate academic and personal information</strong></li>
          <li>Submit <strong>valid documents for verification</strong></li>
          <li>Follow counselling instructions provided by MedSankalp advisors</li>
          <li>Complete counselling registrations on official portals independently</li>
          <li>Maintain professional communication</li>
        </ul>
        <p className="mt-3">Failure to provide correct information may affect admission outcomes.</p>
      </>
    ),
  },
  {
    icon: FileText,
    title: '3. Counselling Scope',
    content: (
      <>
        <p>MedSankalp services include guidance such as:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Admission strategy planning</li>
          <li>Counselling round planning</li>
          <li>College selection assistance</li>
          <li>Documentation guidance</li>
          <li>Admission process coordination</li>
        </ul>
        <p className="mt-3"><strong>Final admission decisions are made by counselling authorities or educational institutions.</strong></p>
      </>
    ),
  },
  {
    icon: CreditCard,
    title: '4. Payment Terms',
    content: (
      <>
        <p>Program fees are charged for <strong>counselling expertise, advisory services, and support provided by MedSankalp</strong>. All fees must be paid in advance unless otherwise agreed.</p>
        <p className="mt-3">The MedSankalp service fee does <strong>not include</strong> any official admission or counselling fees.</p>
        <p className="mt-3">Students and parents must pay all official fees directly to counselling authorities, universities or colleges, and official admission portals. Fees are subject to change without prior notice.</p>
      </>
    ),
  },
  {
    icon: CreditCard,
    title: '5. Refund Policy',
    content: (
      <>
        <p>All payments made towards MedSankalp services are <strong>non-refundable</strong> as a general rule. This includes change of mind, non-participation in counselling, dissatisfaction after service usage, and delay or inaction from the student side.</p>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2C2E69]/60">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-white/80">Exception – Company Error</span>
          </div>
          <p>Refund will be considered only in cases of proven mistake from MedSankalp, such as incorrect guidance causing loss of opportunity, failure to deliver committed services, major documentation or process error by our team, or verified unprofessional conduct. Refund may be full or partial depending on evaluation.</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2C2E69]/60">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-white/80">Non-Refundable Situations</span>
          </div>
          <p>Refunds will NOT be applicable if:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Student withdraws midway</li>
            <li>Documents are not provided on time</li>
            <li>Deadlines are missed by the student</li>
            <li>Change of mind after service initiation</li>
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2C2E69]/60">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-white/80">Refund Process</span>
          </div>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>Request within <strong>7 days</strong> of issue identification</li>
            <li>Review: <strong>3–5 working days</strong></li>
            <li>Processing: <strong>7–10 working days</strong></li>
          </ul>
        </div>
      </>
    ),
  },
  {
    icon: Building2,
    title: '6. Management Quota Guidance',
    content: (
      <>
        <p>MedSankalp may assist students with <strong>admission guidance for management quota or institutional quota seats</strong> where permitted by regulations.</p>
        <ul className="mt-3 space-y-1 list-disc list-inside">
          <li>MedSankalp <strong>does not sell seats</strong></li>
          <li>MedSankalp <strong>does not collect capitation fees</strong></li>
          <li>All admissions must follow official admission procedures</li>
        </ul>
      </>
    ),
  },
  {
    icon: ShieldAlert,
    title: '7. Limitation of Liability',
    content: (
      <>
        <p>MedSankalp shall not be held liable for:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Changes in counselling rules or regulations</li>
          <li>Seat availability changes</li>
          <li>Institutional admission decisions</li>
          <li>Government policy updates</li>
          <li>Third-party delays</li>
          <li>Force majeure events (natural disasters, lockdowns, court orders, technical failures, strikes)</li>
        </ul>
        <p className="mt-3">Admission outcomes ultimately depend on official counselling authorities and institutions. No refund or compensation shall be applicable in force majeure cases.</p>
      </>
    ),
  },
  {
    icon: Lock,
    title: '8. Intellectual Property',
    content: (
      <p>All materials provided by MedSankalp including counselling guides, predictor tools, data reports, and strategy documents are <strong>proprietary resources</strong> and may not be copied, reproduced, or distributed without permission.</p>
    ),
  },
  {
    icon: Ban,
    title: '9. Misuse of Services',
    content: (
      <>
        <p>MedSankalp reserves the right to terminate services without refund if:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>False or inaccurate information is provided</li>
          <li>Misuse of services is observed</li>
          <li>Abusive behavior is directed at our team</li>
        </ul>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: '10. Modifications to Terms',
    content: (
      <p>MedSankalp reserves the right to modify or discontinue services at any time in order to comply with regulatory requirements or improve service quality. Continued use of our services constitutes acceptance of any revised terms.</p>
    ),
  },
  {
    icon: Scale,
    title: '11. Governing Law & Jurisdiction',
    content: (
      <p>These terms shall be governed by the laws of <strong>India</strong>. Any disputes shall fall under the exclusive jurisdiction of courts located in <strong>Kolkata</strong>. MedSankalp Education shall not be liable for any delay, disruption, or failure in services due to events beyond its control including but not limited to government policy changes, counselling delays, regulatory decisions, court orders, natural disasters, technical failures, strikes, lockdowns, or unforeseen circumstances.</p>
    ),
  },
  {
    icon: Phone,
    title: '12. Contact Information',
    content: (
      <>
        <p>For any queries or concerns regarding these terms, please reach out to us:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Email: <strong>support@medsankalp.com</strong></li>
          <li>WhatsApp: <strong>+91 94773 46186</strong></li>
        </ul>
      </>
    ),
  },
  {
    icon: CheckCircle,
    title: '13. Acceptance of Terms',
    content: (
      <>
        <p>By making a payment or using our services, you confirm that:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>You have read and understood these Terms</li>
          <li>You agree to all conditions</li>
          <li>You accept the policies as legally binding</li>
        </ul>
      </>
    ),
  },
];

const TermsAndConditions = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-[#2d409c] dark:text-white transition-colors duration-300">

    {/* Hero */}
    <div className="relative border-b border-amber-200 dark:border-[#2C2E69]/60 bg-amber-50 dark:bg-[#2C2E69]/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Terms & <span className="text-[#F9B406]">Conditions</span>
        </h1>
        <p className="text-base max-w-xl mx-auto text-slate-500 dark:text-white/50">
          By accessing or using MedSankalp services, you agree to comply with these terms.
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
            <h2 className="text-base font-semibold text-[#2d409c] dark:text-white">{title}</h2>
          </div>
          <div className="text-sm leading-relaxed text-slate-500 dark:text-white/50">
            {content}
          </div>
        </div>
      ))}
      <p className="text-center text-xs pt-4 text-slate-400 dark:text-white/20">
        © 2026 MedSankalp · All rights reserved
      </p>
    </div>
  </div>
);

export default TermsAndConditions;