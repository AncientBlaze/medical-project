import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Star, Award, BookOpen, Stethoscope } from 'lucide-react';
import api from '../../utils/api';


const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor,  setDoctor]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get(`/doctors/${id}`)
      .then((res) => setDoctor(res.data.doctor))
      .catch(() => setError('Doctor not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffdf7] dark:bg-slate-950">
      <span className="w-8 h-8 border-2 rounded-full animate-spin border-slate-200 dark:border-slate-700 border-t-[#F9B406] dark:border-t-teal-400" />
    </div>
  );

  if (error || !doctor) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fffdf7] dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">{error || 'Doctor not found.'}</p>
      <button onClick={() => navigate('/doctors')}
        className="text-sm text-[#F9B406] dark:text-teal-400 hover:underline">
        ← Back to Doctors
      </button>
    </div>
  );

  const photoUrl = doctor.photo ? `${BASE_URL}${doctor.photo}` : null;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* Hero */}
      <div className="relative border-b border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900/40">
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(249,180,6,0.04),transparent)]
          dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(20,184,166,0.06),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-6 py-10">

          <button onClick={() => navigate('/doctors')}
            className="flex items-center gap-1.5 text-sm mb-8 transition-colors
              text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" /> All Doctors
          </button>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Photo */}
            <div className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden border
              bg-[#F9B406]/10 dark:bg-teal-500/10
              border-[#F9B406]/20 dark:border-teal-500/20
              flex items-center justify-center">
              {photoUrl
                ? <img src={photoUrl} alt={doctor.name} className="w-full h-full object-cover" />
                : <User className="w-10 h-10 text-[#F9B406] dark:text-teal-400" />
              }
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{doctor.title}</p>

              <div className="flex items-center gap-4 mt-3">
                {doctor.rating > 0 && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-500 dark:text-amber-400">
                    <Star className="w-4 h-4 fill-current" />{doctor.rating.toFixed(1)}
                  </span>
                )}
                {doctor.experience > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Award className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                    {doctor.experience} years experience
                  </span>
                )}
              </div>

              {/* Specialisation tags */}
              {doctor.specialisations?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {doctor.specialisations.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-xl border text-xs font-medium
                      bg-[#F9B406]/8 dark:bg-teal-500/10
                      border-[#F9B406]/25 dark:border-teal-500/25
                      text-[#c8920a] dark:text-teal-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-5">

        {/* About */}
        {doctor.about && (
          <div className="rounded-2xl border p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0
                bg-[#F9B406]/10 dark:bg-teal-500/10
                border-[#F9B406]/20 dark:border-teal-500/20">
                <BookOpen className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">About</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-white/50 whitespace-pre-line">
              {doctor.about}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5 text-center bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
              {doctor.experience > 0 ? `${doctor.experience}+` : '—'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Years Experience</p>
          </div>
          <div className="rounded-2xl border p-5 text-center bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
            <p className="text-2xl font-extrabold text-amber-500 dark:text-amber-400 mb-1">
              {doctor.rating > 0 ? doctor.rating.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Rating</p>
          </div>
        </div>

        {/* Specialisations */}
        {doctor.specialisations?.length > 0 && (
          <div className="rounded-2xl border p-6 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0
                bg-[#F9B406]/10 dark:bg-teal-500/10 border-[#F9B406]/20 dark:border-teal-500/20">
                <Stethoscope className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Specialisations</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {doctor.specialisations.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-xl border text-sm
                  bg-slate-50 dark:bg-slate-800/60
                  border-slate-200 dark:border-slate-700/60
                  text-slate-600 dark:text-slate-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetail;