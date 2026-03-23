import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, User, X, Check, Upload } from 'lucide-react';
import api from '../../../utils/api';


const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const SPECIALISATION_OPTIONS = [
  'NEET Counselling', 'AIIMS Expert', 'State Quota',
  'Deemed Universities', 'MBBS Abroad', 'Management Quota',
];

const EMPTY_FORM = {
  name: '', title: '', about: '',
  experience: '', rating: '',
  specialisations: [],
};

const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
  bg-slate-50 dark:bg-white/5
  border-slate-200 dark:border-white/10
  text-slate-900 dark:text-white
  placeholder-slate-400 dark:placeholder-white/20
  focus:border-amber-400 dark:focus:border-[#F9B406]/60`;

const DoctorForm = ({ initial, onSave, onCancel, saving }) => {
  const [form,    setForm]    = useState(initial ?? EMPTY_FORM);
  const [preview, setPreview] = useState(initial?.photo ? `${BASE_URL}${initial.photo}` : null);
  const [file,    setFile]    = useState(null);
  const fileRef = useRef();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleSpec = (s) => setForm((f) => ({
    ...f,
    specialisations: f.specialisations.includes(s)
      ? f.specialisations.filter((x) => x !== s)
      : [...f.specialisations, s],
  }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => onSave(form, file);

  return (
    <div className="space-y-4">

      {/* Photo upload */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl border overflow-hidden shrink-0
          bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10
          flex items-center justify-center">
          {preview
            ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
            : <User className="w-8 h-8 text-slate-400 dark:text-white/20" />
          }
        </div>
        <div>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors
              bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10
              text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10">
            <Upload className="w-4 h-4" /> Upload Photo
          </button>
          <p className="text-xs text-slate-400 dark:text-white/20 mt-1">JPEG / PNG / WEBP · Max 5MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">Name *</label>
          <input className={inputCls} placeholder="Dr. Arjun Sharma" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">Title / Qualification *</label>
          <input className={inputCls} placeholder="MBBS, MD — AIIMS Delhi" value={form.title} onChange={set('title')} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">Experience (years)</label>
          <input className={inputCls} type="number" min="0" placeholder="5" value={form.experience} onChange={set('experience')} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">Rating (0–5)</label>
          <input className={inputCls} type="number" min="0" max="5" step="0.1" placeholder="4.8" value={form.rating} onChange={set('rating')} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-white/40">About / Bio *</label>
        <textarea className={`${inputCls} resize-none`} rows={4}
          placeholder="Brief bio about the doctor..."
          value={form.about} onChange={set('about')} />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-white/40">Specialisations</label>
        <div className="flex flex-wrap gap-2">
          {SPECIALISATION_OPTIONS.map((s) => {
            const active = form.specialisations.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSpec(s)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#F9B406]/10 dark:bg-[#F9B406]/10 border-[#F9B406]/30 dark:border-[#F9B406]/30 text-[#c8920a] dark:text-[#F9B406]'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:border-amber-300 dark:hover:border-white/20'
                }`}>
                {active && <Check className="w-3 h-3 inline mr-1" />}{s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSubmit} disabled={saving || !form.name || !form.title || !form.about}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
            bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69]
            disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? <span className="w-4 h-4 border-2 rounded-full animate-spin border-[#2C2E69]/30 border-t-[#2C2E69]" /> : <Check className="w-4 h-4" />}
          {initial ? 'Save Changes' : 'Add Doctor'}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors
            border-slate-200 dark:border-white/10
            text-slate-600 dark:text-white/60
            hover:bg-slate-100 dark:hover:bg-white/5">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
};

const DoctorsAdmin = ({ isDark }) => {
  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [mode,     setMode]     = useState(null);   // 'add' | { edit: doctor }
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/doctors')
      .then((r) => setDoctors(r.data.doctors ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const buildFormData = (form, file) => {
    const fd = new FormData();
    fd.append('name',            form.name);
    fd.append('title',           form.title);
    fd.append('about',           form.about);
    fd.append('experience',      form.experience || 0);
    fd.append('rating',          form.rating     || 0);
    fd.append('specialisations', JSON.stringify(form.specialisations));
    if (file) fd.append('photo', file);
    return fd;
  };

  const handleAdd = async (form, file) => {
    setSaving(true);
    try {
      await api.post('/doctors', buildFormData(form, file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMode(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form, file) => {
    setSaving(true);
    try {
      await api.put(`/doctors/${mode.edit._id}`, buildFormData(form, file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMode(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/doctors/${id}`);
      setDoctors((d) => d.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const card = `rounded-2xl border transition-colors
    bg-white dark:bg-[#2C2E69]/20
    border-slate-200 dark:border-[#2C2E69]`;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className={`${card} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Doctors</h2>
            <p className="text-xs text-slate-500 dark:text-white/30 mt-0.5">
              {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          {mode === null && (
            <button onClick={() => setMode('add')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69]">
              <Plus className="w-4 h-4" /> Add Doctor
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      {mode === 'add' && (
        <div className={`${card} p-6`}>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">New Doctor</h3>
          <DoctorForm onSave={handleAdd} onCancel={() => setMode(null)} saving={saving} />
        </div>
      )}

      {/* Doctor rows */}
      {loading ? (
        <div className={`${card} p-10 text-center`}>
          <span className="w-6 h-6 border-2 rounded-full animate-spin border-slate-200 dark:border-white/10 border-t-[#F9B406] inline-block" />
        </div>
      ) : doctors.length === 0 ? (
        <div className={`${card} p-10 text-center`}>
          <p className="text-sm text-slate-400 dark:text-white/30">No doctors added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((d) => (
            <div key={d._id}>
              {/* Edit form inline */}
              {mode?.edit?._id === d._id ? (
                <div className={`${card} p-6`}>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">Edit — {d.name}</h3>
                  <DoctorForm initial={d} onSave={handleEdit} onCancel={() => setMode(null)} saving={saving} />
                </div>
              ) : (
                <div className={`${card} p-5 flex items-center gap-4`}>
                  {/* Photo */}
                  <div className="w-12 h-12 rounded-xl border overflow-hidden shrink-0
                    bg-[#F9B406]/10 dark:bg-[#F9B406]/5
                    border-[#F9B406]/20 dark:border-[#F9B406]/10
                    flex items-center justify-center">
                    {d.photo
                      ? <img src={`${BASE_URL}${d.photo}`} alt={d.name} className="w-full h-full object-cover" />
                      : <User className="w-5 h-5 text-[#F9B406]" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{d.name}</p>
                    <p className="text-xs text-slate-400 dark:text-white/30 truncate">{d.title}</p>
                    {d.specialisations?.length > 0 && (
                      <p className="text-xs text-slate-400 dark:text-white/20 mt-0.5 truncate">
                        {d.specialisations.join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => setMode({ edit: d })}
                      className="p-2 rounded-xl border transition-colors
                        border-slate-200 dark:border-white/10
                        text-slate-500 dark:text-white/40
                        hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(d._id)} disabled={deleting === d._id}
                      className="p-2 rounded-xl border transition-colors
                        border-red-200 dark:border-red-500/20
                        text-red-400 dark:text-red-400/60
                        hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400
                        disabled:opacity-40">
                      {deleting === d._id
                        ? <span className="w-4 h-4 border-2 rounded-full animate-spin border-red-200 border-t-red-400 inline-block" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsAdmin;