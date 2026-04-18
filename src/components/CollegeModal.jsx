// CollegeModal.jsx
import { X, MapPin, Building2, Users, Globe, TrendingDown, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

const formatFee = (n) => {
  if (!n || isNaN(n)) return 'N/A';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const getEffectiveCutoff = (rounds) => {
  if (!rounds || typeof rounds !== 'object') return null;
  const vals = [rounds.round4, rounds.round3, rounds.round2, rounds.round1].filter(
    (v) => v != null && !isNaN(v)
  );
  return vals[0] ?? null;
};

const getCollegeId = (college) => college?._id ?? college?.id ?? null;

// ── Preferences helpers ──────────────────────────────────────────────────────

const PREF_KEY = 'medsankalp_preferences';

export const getPreferences = () => {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const savePreference = (college) => {
  if (!college || !getCollegeId(college)) return false;
  const existing = getPreferences();
  const id = getCollegeId(college);
  if (existing.some((c) => getCollegeId(c) === id)) return false;
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify([...existing, college]));
    return true;
  } catch {
    return false;
  }
};

const removePreference = (collegeId) => {
  if (!collegeId) return;
  try {
    const updated = getPreferences().filter((c) => getCollegeId(c) !== collegeId);
    localStorage.setItem(PREF_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — fail silently
  }
};

export const exportPreferencesCSV = () => {
  const prefs = getPreferences();
  if (!prefs.length) return;

  const headers = ['Name', 'State', 'Management', 'Seats', 'Management Quota Fee', 'NRI Quota Fee', 'Website'];
  const rows = prefs.map((c) => [
    c?.name ?? '',
    c?.state ?? '',
    c?.management ?? '',
    c?.seats ?? '',
    c?.fees?.managementQuota ? `₹${(c.fees.managementQuota / 100000).toFixed(1)}L` : 'N/A',
    c?.fees?.nriQuota ? `₹${(c.fees.nriQuota / 100000).toFixed(1)}L` : 'N/A',
    c?.website ?? '',
  ]);

  try {
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medsankalp_preferences.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // download failed silently
  }
};

// ── Component ────────────────────────────────────────────────────────────────

const CollegeModal = ({ college, isOpen, onClose }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!college) return;
    const id = getCollegeId(college);
    setSaved(id ? getPreferences().some((c) => getCollegeId(c) === id) : false);
  }, [college]);

  if (!isOpen || !college) return null;

  const handleToggleSave = () => {
    const id = getCollegeId(college);
    if (!id) return;
    if (saved) {
      removePreference(id);
      setSaved(false);
    } else {
      savePreference(college);
      setSaved(true);
    }
  };

  const metaItems = [
    { Icon: MapPin, value: college.state, key: 'state' },
    { Icon: Building2, value: college.management, key: 'management' },
    { Icon: Users, value: college.seats != null ? `${college.seats} seats` : null, key: 'seats' },
  ].filter((item) => item.value != null);

  const hasFees = college.fees && (college.fees.managementQuota || college.fees.nriQuota);

  const cutoffEntries = college.cutoffs
    ? Object.entries(college.cutoffs).filter(([, rounds]) => getEffectiveCutoff(rounds) != null)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">

        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-semibold text-[#2d409c] dark:text-white truncate pr-4">
            {college.name ?? 'Unknown College'}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleSave}
              disabled={!getCollegeId(college)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40
                ${saved
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-[#F9B406]/10 dark:bg-teal-500/10 text-[#2d409c] dark:text-teal-400 border border-[#F9B406]/30 dark:border-teal-500/30 hover:bg-[#F9B406]/20 dark:hover:bg-teal-500/20'
                }`}
            >
              {saved
                ? <><BookmarkCheck className="w-4 h-4" /> Saved</>
                : <><BookmarkPlus className="w-4 h-4" /> Save</>
              }
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Meta info */}
          {metaItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metaItems.map(({ Icon, value, key }) => (
                <div key={key} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0" />
                  <span className="text-sm text-[#2d409c] dark:text-slate-300 truncate">{value}</span>
                </div>
              ))}
              {college.website && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Globe className="w-4 h-4 text-[#F9B406] dark:text-teal-400 shrink-0" />
                  <button
                    onClick={() => window.open(college.website, '_blank', 'noopener,noreferrer')}
                    className="text-sm text-[#F9B406] dark:text-teal-400 hover:underline truncate"
                  >
                    Website
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fees */}
          {hasFees && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2d409c] dark:text-slate-400 mb-3">
                Fees
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {college.fees.managementQuota != null && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Management Quota</p>
                    <p className="text-lg font-bold text-[#F9B406] dark:text-teal-400">
                      {formatFee(college.fees.managementQuota)}
                    </p>
                  </div>
                )}
                {college.fees.nriQuota != null && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">NRI Quota</p>
                    <p className="text-lg font-bold text-[#F9B406] dark:text-teal-400">
                      {formatFee(college.fees.nriQuota)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cutoffs */}
          {cutoffEntries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2d409c] dark:text-slate-400 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
                NEET Cutoff Ranks (2024)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {cutoffEntries.map(([quotaType, rounds]) => {
                  const cutoff = getEffectiveCutoff(rounds);
                  return (
                    <div key={quotaType} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 capitalize">
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
        </div>
      </div>
    </div>
  );
};

export default CollegeModal;