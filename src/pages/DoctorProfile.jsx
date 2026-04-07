import { User, Stethoscope, MapPin, GraduationCap, Star, Clock, BookOpen, Award, Phone, Mail, Calendar, ChevronRight } from 'lucide-react';

// ── Skeleton shimmer ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
);

// ── Doctor card skeleton ──────────────────────────────────────────────────────
const DoctorCardSkeleton = () => (
  <div className="rounded-2xl border p-5 flex flex-col gap-4
    bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
    <div className="flex items-start gap-4">
      <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <Skeleton className="h-9 w-full rounded-xl" />
  </div>
);

// ── Stats bar ─────────────────────────────────────────────────────────────────
const StatBox = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center gap-1 p-4 rounded-xl border
    bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-center">
    <Icon className="w-5 h-5 text-[#F9B406] dark:text-teal-400 mb-1" />
    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-500">{label}</p>
  </div>
);

// ── Doctor Profile detail skeleton ────────────────────────────────────────────
const DoctorDetailSkeleton = () => (
  <div className="flex flex-col gap-5">
    {/* Hero card */}
    <div className="rounded-2xl border p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 flex-wrap">
            {[80, 64, 96, 72].map((w, i) => <Skeleton key={i} className={`h-6 w-${w/4} rounded-full`} style={{ width: w }} />)}
          </div>
        </div>
      </div>
    </div>

    {/* About */}
    <div className="rounded-2xl border p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 space-y-3">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>

    {/* Availability */}
    <div className="rounded-2xl border p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 space-y-3">
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const DoctorProfile = () => {
  // Placeholder doctor data structure — will be populated from API
  const SPECIALISATIONS = ['NEET Counselling', 'AIIMS Expert', 'State Quota', 'Deemed Universities', 'MBBS Abroad'];
  const MOCK_DOCTORS = Array.from({ length: 6 });

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(249,180,6,0.05),transparent)]
          dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5
            bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <Stethoscope className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Expert Counsellors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[#2D409C]">
            Meet Our{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Expert Doctors</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            Get guidance from experienced doctors and MBBS students who've been through the counselling process.
          </p>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox icon={User}         label="Expert Doctors"    value="—" />
          <StatBox icon={Star}         label="Avg. Rating"       value="—" />
          <StatBox icon={GraduationCap} label="Students Guided" value="—" />
          <StatBox icon={Award}        label="Years Experience"  value="—" />
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors
            bg-[#F9B406] dark:bg-teal-400 text-slate-950 border-[#F9B406] dark:border-teal-400">
            All
          </button>
          {SPECIALISATIONS.map((s) => (
            <button key={s}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors
                bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60
                text-slate-600 dark:text-slate-400
                hover:border-[#F9B406]/40 dark:hover:border-teal-500/30">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Doctor Cards Grid (skeleton) ─────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-14">

        {/* Coming soon notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl border mb-6 text-sm
          bg-[#F9B406]/5 dark:bg-teal-500/5 border-[#F9B406]/20 dark:border-teal-500/20
          text-[#c8920a] dark:text-teal-400">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Doctor profiles are being set up. Data will be available soon. The layout below shows how profiles will appear.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_DOCTORS.map((_, i) => <DoctorCardSkeleton key={i} />)}
        </div>
      </div>

      {/* ── Single Doctor Detail preview ─────────────────────────────────── */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Doctor Detail View</h2>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
            Clicking a doctor card will show their full profile — specialisation, about, availability slots, and contact.
          </p>
          <DoctorDetailSkeleton />
        </div>
      </div>

    </div>
  );
};

export default DoctorProfile;
