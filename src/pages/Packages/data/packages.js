// ── Counselling Packages (PackagesGrid page) ──────────────────────────────────
export const COUNSELLING_PACKAGES = [
  {
    id: 'rank-analysis',
    emoji: '🔍',
    name: 'MedSankalp Rank Analysis',
    tag: 'FREE / ₹199',
    subtitle: 'For MBBS aspirants across India',
    description: 'Understand your admission chances before counselling begins.',
    price: '₹199',
    originalPrice: null,
    discount: null,
    isFree: true,
    highlight: false,
    badge: null,
    refundable: false,
    features: [
      'MBBS admission insights — AIQ, State Quota, Deemed & Private',
      'Category-wise and round-wise cutoff trends',
      'Personalised college shortlist based on score & category',
      'Overview of seat availability & approximate fee ranges',
      'Predict expected rank before results',
      'Build a counselling strategy before results',
    ],
  },
  {
    id: 'medstart',
    emoji: '🎓',
    name: 'MedStart Guidance',
    tag: 'GOVT FOCUS PLAN',
    subtitle: 'Targeting AIIMS, JIPMER & Government Medical Colleges',
    description: 'Structured support for students aiming for government MBBS seats.',
    price: '₹4,999',
    originalPrice: '₹10,000',
    discount: '50% off',
    isFree: false,
    highlight: false,
    badge: null,
    refundable: false,
    features: [
      '2 personalised 1-on-1 mentor sessions (Zoom / Google Meet)',
      'Strategic guidance based on score, category & state eligibility',
      'Verified round-wise cutoff data',
      'Seat matrix insights & bond/stipend overview',
      'Government college fee structures',
      'Central & State scholarship guidance',
      'Access to MedSankalp College Predictor Tool',
      'Round-wise counselling strategy (R1, R2, Mop-Up, Stray)',
      'Government college reviews (academics, internship quality)',
      'WhatsApp support for counselling queries',
      'Video guidance for form filling & choice filling',
    ],
  },
  {
    id: 'medchoice',
    emoji: '🏆',
    name: 'MedChoice Navigator',
    tag: 'ALL-IN-ONE PREMIUM',
    subtitle: 'Govt + Private + Deemed + Management MBBS Colleges',
    description: 'Complete counselling support across all college types and all India quotas.',
    price: '₹14,999',
    originalPrice: '₹49,999',
    discount: '70% off',
    isFree: false,
    highlight: true,
    badge: 'Most Popular',
    refundable: false,
    features: [
      '4 personalised mentor sessions',
      'Dedicated counsellor throughout the entire cycle',
      'Personalised college preference list (score, category, budget, bond)',
      'Full support — AIQ, State Counselling, Deemed Universities',
      'Verified round-wise cutoff trends & seat matrices',
      'Fee structures & hostel info for all colleges',
      'Documentation support (category, domicile, gap, migration certs)',
      'Scholarship & education loan guidance',
      'Counselling alerts & deadline updates',
      'MedSankalp counselling guidebook',
      'College insights — internship, academics, infrastructure',
      'Post-admission reporting checklist',
    ],
  },
];

// ── Admission & Support Packages (AdmissionSupport page) ─────────────────────
export const ADMISSION_PACKAGES = [
  {
    id: 'seat-secure',
    emoji: '🔒',
    name: 'MedSankalp Seat Secure',
    tag: 'WB ONLY — RANK2SEAT',
    subtitle: 'West Bengal Private Medical Colleges',
    description: 'Admission assurance support for management quota seats in WB private colleges.',
    price: '₹49,999',
    originalPrice: null,
    discount: null,
    isFree: false,
    highlight: false,
    badge: 'WB Exclusive',
    refundable: false,
    scope: 'india',
    features: [
      'Everything in MedChoice Navigator',
      'Admission assurance for WB private management quota',
      'Priority counselling monitoring',
      'Admission probability evaluation',
      'Private college admission coordination support',
    ],
  },
  {
    id: 'national-elite',
    emoji: '🌐',
    name: 'MedSankalp National Elite',
    tag: 'PAN-INDIA ADMISSION',
    subtitle: 'Deemed Universities & Private Colleges across India',
    description: 'End-to-end admission guidance for students targeting national-level private and deemed seats.',
    price: '₹99,999',
    originalPrice: null,
    discount: null,
    isFree: false,
    highlight: true,
    badge: 'Best Value',
    refundable: false,
    scope: 'india',
    features: [
      'Everything in MedChoice Navigator',
      'Dedicated admission counsellor till final admission',
      'Pan-India college selection — Deemed + Private',
      'Fee structure & bond/service rule comparisons',
      'Management / institutional quota guidance',
      'Eligibility verification & documentation preparation',
      'Counselling round monitoring (R1, R2, Mop-Up, Stray)',
      'Curated college insights (patient load, internship, infra)',
      'NEET & category certificate documentation support',
    ],
  },
  {
    id: 'global',
    emoji: '✈️',
    name: 'MedSankalp Global',
    tag: 'MBBS ABROAD',
    subtitle: 'Russia, Kazakhstan, Georgia, Uzbekistan, Kyrgyzstan, Nepal, China & more',
    description: 'Structured end-to-end guidance for students planning MBBS abroad.',
    price: '₹1,24,999',
    originalPrice: null,
    discount: null,
    isFree: false,
    highlight: false,
    badge: null,
    refundable: false,
    scope: 'abroad',
    features: [
      'Everything in MedChoice Navigator',
      'University selection based on budget, recognition & exposure',
      'Application submission & admission confirmation support',
      'Document preparation (academic, NEET, passport, medical)',
      'Student visa documentation & application guidance',
      'Hostel & accommodation guidance',
      'Pre-departure checklist & travel preparation',
      'Living expense overview for destination country',
    ],
  },
  {
    id: 'global-elite',
    emoji: '👑',
    name: 'MedSankalp Global Elite',
    tag: 'PREMIUM MBBS ABROAD',
    subtitle: 'Russia, Kazakhstan, Georgia, Uzbekistan, Kyrgyzstan & more',
    description: 'Premium abroad admission support including arrival coordination and airport pickup guidance.',
    price: '₹1,49,999',
    originalPrice: null,
    discount: null,
    isFree: false,
    highlight: false,
    badge: 'Premium',
    refundable: false,
    scope: 'abroad',
    features: [
      'Everything in MedSankalp Global',
      'Premium university selection with accreditation guidance',
      'Complete visa documentation & pre-interview prep',
      'Airport pickup coordination on arrival',
      'Accommodation & hostel arrangement assistance',
      'Pre-departure orientation for students & parents',
      'Arrival & initial local orientation support',
      'University reporting procedures guidance',
    ],
  },
];

// ── Policy text (shared across both pages) ────────────────────────────────────
export const TERMS = `
**Terms & Conditions**

MedSankalp provides educational counselling, admission guidance, and strategic advisory services for students seeking admission to medical programs such as MBBS and BDS in India and abroad. MedSankalp acts solely as an independent advisory platform and does not represent any government authority, counselling body, or educational institution.

All admissions depend on NEET eligibility, counselling authority rules, seat availability, and institutional admission policies.

**User Responsibilities:** Students and parents must provide accurate academic and personal information, submit valid documents when requested, and complete official counselling registrations independently.

**Payment Terms:** Program fees are for advisory services only and do not include counselling registration fees, college tuition fees, security deposits, or hostel fees. All official payments must be made directly to the respective counselling authority or institution.

**Limitation of Liability:** MedSankalp shall not be responsible for changes in counselling rules, seat availability, institutional admission decisions, or government policy updates.
`;

export const REFUND_POLICY = `
**Refund Policy**

Most MedSankalp programs are non-refundable once service has been activated or access has been granted — this includes Rank Analysis, MedStart Guidance, MedChoice Navigator, National Elite, Global, and Global Elite.

**MedSankalp Seat Secure (WB) — Refundable** under the following conditions: student has qualified NEET, participated in counselling rounds as advised, provided complete valid documentation, and remained eligible. If no seat is allotted in any WB private medical college until the final round, the program fee will be refunded within 15–30 working days.

Refunds will NOT be granted if the student does not qualify NEET, provides incorrect documentation, fails to participate in counselling rounds, voluntarily withdraws, declines an allotted seat, or independently pursues admission without informing MedSankalp.
`;

export const PRIVACY_POLICY = `
**Privacy Policy**

MedSankalp collects student name, contact number, email address, academic details, category/domicile details, and NEET score information. This data is used solely for admission counselling services, counselling updates, college recommendations, and customer support.

User information will not be sold or rented to third parties. The website may use third-party tools such as payment gateways, analytics platforms, and communication tools, each operating under their own privacy policies.
`;

export const DISCLAIMER = `
**Counselling Disclaimer**

MedSankalp provides counselling and admission advisory services only. MedSankalp does not guarantee admission to any college or university. Admission outcomes depend on NEET rank, category eligibility, seat availability, and counselling authority policies.

MedSankalp does not sell seats, collect capitation fees, or reserve/pre-book seats. All admissions are conducted through official counselling processes or institutional admission procedures as permitted by regulatory authorities.
`;