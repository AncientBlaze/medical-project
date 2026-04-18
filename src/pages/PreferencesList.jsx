// PreferencesList.jsx
import { MapPin, Download, Heart, Trash2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { allColleges } from "../../data/allColleges.js";
import CollegeModal, { getPreferences, exportPreferencesCSV } from "../components/CollegeModal";

const PREF_KEY = 'medsankalp_preferences';

const saveAllPreferences = (prefs) => {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
};

const formatFee = (n) => {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const STATES = [...new Set(allColleges.map((c) => c.state))].sort();

const PreferencesList = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(() => getPreferences());
  const [filterState, setFilterState] = useState('');
  const [filteredColleges, setFilteredColleges] = useState(allColleges);

  // Keep localStorage in sync whenever preferences change
  useEffect(() => {
    saveAllPreferences(preferences);
  }, [preferences]);

  // Re-sync if another tab changes localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === PREF_KEY) setPreferences(getPreferences());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!filterState) {
      setFilteredColleges(allColleges);
    } else {
      setFilteredColleges(
        allColleges.filter((c) =>
          c.state.toLowerCase().includes(filterState.toLowerCase())
        )
      );
    }
  }, [filterState]);

  const isAdded = useCallback(
    (college) => preferences.some((p) => (p._id ?? p.id) === (college._id ?? college.id)),
    [preferences]
  );

  const handleAdd = (college) => {
    if (!isAdded(college)) setPreferences((prev) => [...prev, college]);
  };

  const handleRemove = (college) => {
    const id = college._id ?? college.id;
    setPreferences((prev) => prev.filter((p) => (p._id ?? p.id) !== id));
  };

  const handleReorder = (index, dir) => {
    const next = index + dir;
    if (next < 0 || next >= preferences.length) return;
    setPreferences((prev) => {
      const arr = [...prev];
      [arr[index], arr[next]] = [arr[next], arr[index]];
      return arr;
    });
  };

  const handleOpenModal = (college) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCollege(null);
    // Re-sync in case modal toggled a save
    setPreferences(getPreferences());
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-[#2d409c] dark:text-white">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-slate-900/60 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-[#2d409c] dark:text-white">
            Find Your <span className="text-[#F9B406] dark:text-teal-400">Colleges</span>
          </h1>
          <p className="text-base sm:text-lg text-[#2d409c] dark:text-slate-400 max-w-3xl mx-auto">
            Build and organize your medical college preferences. Add colleges, reorder them, and export your final list for counselling.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Sidebar — Filter */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 lg:sticky lg:top-20">
              <h2 className="text-lg font-bold mb-5 text-[#2d409c] dark:text-white">Filter Colleges</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    State
                  </label>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2d409c] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F9B406] dark:focus:ring-teal-400 text-sm"
                  >
                    <option value="">All States</option>
                    {STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <p className="text-sm text-[#2d409c] dark:text-slate-400">
                  <span className="font-semibold text-[#2d409c] dark:text-white">{filteredColleges.length}</span> colleges available
                </p>
                <p className="text-sm text-[#2d409c] dark:text-slate-400">
                  <span className="font-semibold text-[#F9B406] dark:text-teal-400">{preferences.length}</span> added to list
                </p>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-6">

            {/* Preferences List */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#2d409c] dark:text-white">
                  Your Preferences
                  {preferences.length > 0 && (
                    <span className="ml-2 text-sm font-medium text-slate-400">({preferences.length})</span>
                  )}
                </h2>
                {preferences.length > 0 && (
                  <button
                    onClick={exportPreferencesCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9B406] dark:bg-teal-400 text-slate-950 font-medium text-sm hover:bg-[#e0a205] dark:hover:bg-teal-300 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                )}
              </div>

              {preferences.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {preferences.map((college, index) => (
                    <div
                      key={college._id ?? college.id}
                      className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-teal-500/10 border border-amber-200 dark:border-teal-500/20"
                    >
                      {/* Rank badge */}
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F9B406] dark:bg-teal-400 text-slate-950 font-bold text-xs shrink-0">
                        {index + 1}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2d409c] dark:text-white truncate">{college.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-[#2d409c] dark:text-slate-400">{college.state}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            college.management?.toLowerCase() === 'government'
                              ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                              : 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                          }`}>
                            {college.management}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => handleReorder(index, -1)}
                          disabled={index === 0}
                          className="p-1.5 rounded hover:bg-amber-200 dark:hover:bg-teal-500/20 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorder(index, 1)}
                          disabled={index === preferences.length - 1}
                          className="p-1.5 rounded hover:bg-amber-200 dark:hover:bg-teal-500/20 disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(college)}
                          className="p-1.5 rounded text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemove(college)}
                          className="p-1.5 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add colleges from the list below
                  </p>
                </div>
              )}
            </div>

            {/* Available Colleges */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
              <h2 className="text-lg font-bold mb-5 text-[#2d409c] dark:text-white">Available Colleges</h2>

              <div className="overflow-y-auto max-h-[480px] space-y-2 pr-1">
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college) => {
                    const added = isAdded(college);
                    return (
                      <div
                        key={college._id ?? college.id}
                        className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-teal-500/30 bg-slate-50 dark:bg-slate-800/50 transition-colors"
                      >
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2d409c] dark:text-white truncate">{college.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-[#2d409c] dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{college.state}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              college.management?.toLowerCase() === 'government'
                                ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                : 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                            }`}>
                              {college.management}
                            </span>
                            {college.fees?.managementQuota && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formatFee(college.fees.managementQuota)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenModal(college)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => added ? handleRemove(college) : handleAdd(college)}
                            className={`p-2 rounded-lg transition-colors ${
                              added
                                ? 'bg-red-100 dark:bg-red-500/10 text-red-500 hover:bg-red-200 dark:hover:bg-red-500/20'
                                : 'bg-amber-100 dark:bg-teal-500/10 text-[#F9B406] dark:text-teal-400 hover:bg-amber-200 dark:hover:bg-teal-500/20'
                            }`}
                            title={added ? 'Remove from preferences' : 'Add to preferences'}
                          >
                            <Heart className={`w-4 h-4 ${added ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
                    No colleges match your filters
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CollegeModal college={selectedCollege} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PreferencesList;