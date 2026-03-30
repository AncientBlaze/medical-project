import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, Star, GraduationCap, Award, ChevronRight, Clock } from 'lucide-react';
import api from '../../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
);

const DoctorCardSkeleton = () => (
  <div className="rounded-2xl border p-5 flex flex-col gap-4 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
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
    </div>
    <Skeleton className="h-9 w-full rounded-xl" />
  </div>
);

const StatBox = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center gap-1 p-4 rounded-xl border text-center
    bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
    <Icon className="w-5 h-5 text-[#F9B406] dark:text-teal-400 mb-1" />
    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-500">{label}</p>
  </div>
);

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const photoUrl = doctor.photo ? `${BASE_URL}${doctor.photo}` : null;

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-4 transition-colors
      bg-white dark:bg-slate-900/40
      border-slate-200 dark:border-slate-700/60
      hover:border-[#F9B406]/40 dark:hover:border-teal-500/30
      hover:shadow-md h-auto justify-between">

      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full shrink-0 overflow-hidden border-2
          bg-[#F9B406]/10 dark:bg-teal-500/10
          border-[#F9B406] dark:border-teal-500
          flex items-center justify-center">
          {photoUrl
            ? <img src={photoUrl} alt={doctor.name} className="w-full h-full object-cover" />
            : <User className="w-7 h-7 text-[#F9B406] dark:text-teal-400" />
          }
        </div>
        
        <div className="flex-1 min-w-full items-start">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{doctor.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{doctor.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {doctor.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-current" />{doctor.rating.toFixed(1)}
              </span>
            )}
            {doctor.experience > 0 && (
              <span className="text-md text-slate-400 dark:text-slate-500">
                {doctor.experience}y exp
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Specialisation tags */}
      {doctor.specialisations?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {doctor.specialisations.slice(0, 3).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-lg border text-[10px] font-medium
              bg-slate-50 dark:bg-slate-800/60
              border-slate-200 dark:border-slate-700/60
              text-slate-600 dark:text-slate-400">
              {s}
            </span>
          ))}
          {doctor.specialisations.length > 3 && (
            <span className="px-2 py-0.5 rounded-lg border text-[10px] font-medium
              bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60
              text-slate-400 dark:text-slate-500">
              +{doctor.specialisations.length - 3}
            </span>
          )}
        </div>
      )}

      <button onClick={() => {
        window.scrollTo(0, 0);
        navigate(`/doctors/${doctor._id}`);
      }}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-sm font-medium transition-colors
          bg-slate-50 dark:bg-slate-800/60
          border-slate-200 dark:border-slate-700/60
          text-slate-700 dark:text-slate-300
          hover:bg-[#F9B406]/10 dark:hover:bg-teal-500/10
          hover:border-[#F9B406]/30 dark:hover:border-teal-500/30
          hover:text-[#c8920a] dark:hover:text-teal-400">
        View Profile <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const ALL_SPECIALISATIONS = [
  'NEET Counselling', 'AIIMS Expert', 'State Quota',
  'Deemed Universities', 'MBBS Abroad', 'Management Quota',
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/doctors')
      .then((res) => setDoctors(res.data.doctors ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? doctors
    : doctors.filter((d) => d.specialisations?.includes(filter));

  const avgRating = doctors.length
    ? (doctors.reduce((s, d) => s + (d.rating ?? 0), 0) / doctors.length).toFixed(1)
    : '—';

  const totalExp = doctors.length
    ? Math.max(...doctors.map((d) => d.experience ?? 0))
    : '—';

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* Hero */}
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Meet Our{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Expert Doctors</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            Get guidance from experienced doctors and MBBS students who've been through the counselling process.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox icon={User} label="Expert Doctors" value={loading ? '—' : doctors.length} />
          <StatBox icon={Star} label="Avg. Rating" value={loading ? '—' : avgRating} />
          <StatBox icon={GraduationCap} label="Specialisations" value={loading ? '—' : ALL_SPECIALISATIONS.length} />
          <StatBox icon={Award} label="Max Experience" value={loading ? '—' : `${totalExp}y`} />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {['All', ...ALL_SPECIALISATIONS].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filter === s
                ? 'bg-[#F9B406] dark:bg-teal-400 text-slate-950 border-[#F9B406] dark:border-teal-400'
                : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-[#F9B406]/40 dark:hover:border-teal-500/30'
                }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <DoctorCardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((d) => <DoctorCard key={d._id} doctor={d} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center
              bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
              <Stethoscope className="w-6 h-6 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">No doctors found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;