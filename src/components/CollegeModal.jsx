import { useState } from 'react';
import { X, MapPin, Building2, Users, Globe, IndianRupee, TrendingDown, Phone, Mail } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const formatFee = (n) => {
  if (!n) return 'N/A';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const getEffectiveCutoff = (cutoffs) => {
  const vals = [cutoffs.round4, cutoffs.round3, cutoffs.round2, cutoffs.round1].filter(Boolean);
  return vals[0] ?? null;
};

const CollegeModal = ({ college, isOpen, onClose }) => {
  const user = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState({ rank: '', category: '', quota: 'allIndia', state: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !college) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rank || !formData.category) {
      setMessage('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/predictions',
        {
          category: formData.category,
          rank: parseInt(formData.rank),
          quota: formData.quota,
          state: formData.state,
          course: '',
          phone: user?.phone || '',
          matchedColleges: [college.name]
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      setMessage('✓ Prediction saved successfully!');
      setTimeout(() => {
        onClose();
        setFormData({ rank: '', category: '', quota: 'allIndia', state: '' });
      }, 1500);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 z-10 p-3 -mr-2 -mt-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
        >
          <X className="w-5 h-5 text-[#2d409c] dark:text-slate-400" />
        </button>

        <div className="p-8">
          {/* College Header */}
          <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold mb-4 text-[#2d409c] dark:text-white">{college.name}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0" />
                <span className="text-sm text-[#2d409c] dark:text-slate-400">{college.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0" />
                <span className="text-sm text-[#2d409c] dark:text-slate-400">{college.management}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0" />
                <span className="text-sm text-[#2d409c] dark:text-slate-400">{college.seats} seats</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0" />
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#F9B406] dark:text-teal-400 hover:underline"
                >
                  Website
                </a>
              </div>
            </div>

            {/* Fees */}
            {college.fees && (
              <div className="grid grid-cols-2 gap-3">
                {college.fees.managementQuota && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-[#2d409c] dark:text-slate-400">Management Quota</p>
                    <p className="font-bold text-[#F9B406] dark:text-teal-400">{formatFee(college.fees.managementQuota)}</p>
                  </div>
                )}
                {college.fees.nriQuota && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-[#2d409c] dark:text-slate-400">NRI Quota</p>
                    <p className="font-bold text-[#F9B406] dark:text-teal-400">{formatFee(college.fees.nriQuota)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cutoffs */}
          {college.cutoffs && (
            <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#2d409c] dark:text-white">
                <TrendingDown className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
                NEET Cutoff Ranks (2024)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(college.cutoffs).map(([quotaType, rounds]) => {
                  const cutoff = getEffectiveCutoff(rounds);
                  if (!cutoff) return null;

                  return (
                    <div key={quotaType} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-[#2d409c] dark:text-slate-400 mb-1 capitalize">
                        {quotaType.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-lg font-bold text-[#F9B406] dark:text-teal-400">
                        {cutoff.toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Capture Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#2d409c] dark:text-white">Save Your Prediction</h3>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.includes('✓')
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2d409c] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F9B406] dark:focus:ring-teal-400"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              {/* Rank */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  NEET Rank *
                </label>
                <input
                  type="number"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  placeholder="Enter your NEET rank"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2d409c] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F9B406] dark:focus:ring-teal-400"
                />
              </div>

              {/* Quota */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Quota
                </label>
                <select
                  name="quota"
                  value={formData.quota}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2d409c] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F9B406] dark:focus:ring-teal-400"
                >
                  <option value="allIndia">All India Quota</option>
                  <option value="state">State Quota</option>
                </select>
              </div>

              {/* State (conditional) */}
              {formData.quota === 'state' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2d409c] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F9B406] dark:focus:ring-teal-400"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#2d409c] dark:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Prediction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeModal;
