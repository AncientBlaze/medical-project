import {
  MapPin, ExternalLink, Building2, Users, Zap, Search,
  MessageCircle, Lightbulb, Target, Award, X, IndianRupee,
  Info, CalendarDays, ChevronRight
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { allColleges } from "../../data/allColleges";


// ── College Detail Drawer ─────────────────────────────────────────────────────
const ROUND_LABELS = { round1: 'Round 1', round2: 'Round 2', round3: 'Mop-Up', round4: 'Stray' };

const CollegeDrawer = ({ college, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (college) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [college]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!college) return null;

  const isGovt = college.management !== 'Private';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{
        backgroundColor: visible ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(4px)' : 'blur(0px)',
        transition: 'background-color 300ms ease, backdrop-filter 300ms ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-xl flex flex-col rounded-t-3xl sm:rounded-2xl overflow-hidden border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl"
        style={{
          maxHeight: '90dvh',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.97)',
          opacity: visible ? 1 : 0,
          transition: 'transform 320ms cubic-bezier(0.34,1.1,0.64,1), opacity 250ms ease',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${isGovt
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                    : 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20'
                  }`}>
                  {college.management}
                </span>
                {college.established && (
                  <span className="text-[10px] text-slate-400 dark:text-[#2d409c] flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Est. {college.established}
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold leading-snug text-[#2d409c] dark:text-white">{college.name}</h2>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-500">{college.state}</span>
                {college.university && (
                  <span className="text-xs text-slate-400 dark:text-[#2d409c] ml-1">· {college.university}</span>
                )}
              </div>
            </div>
            <button onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            {college.seats && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {college.seats} seats</span>}
            {college.fees?.stateQuota && <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> SQ: {college.fees.stateQuota}</span>}
            {college.fees?.managementQuota && <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> Mgmt: {college.fees.managementQuota}</span>}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-4 space-y-5">
          {/* Fees */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#2d409c] mb-3">Fee Structure</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'State Quota', val: college.fees?.stateQuota },
                { label: 'Management', val: college.fees?.managementQuota },
                { label: 'NRI Quota', val: college.fees?.nriQuota },
              ].map(({ label, val }) => (
                <div key={label} className="flex flex-col gap-0.5 p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 dark:text-[#2d409c]">{label}</span>
                  <span className="text-sm font-bold text-[#2d409c] dark:text-white">{val ?? 'NA'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AIQ cutoffs */}
          {college.cutoffs?.allIndiaQuota && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#2d409c] mb-3">All India Quota Cutoffs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2 pr-3 text-slate-400 dark:text-[#2d409c] font-medium">Category</th>
                      {Object.values(ROUND_LABELS).map(r => <th key={r} className="pb-2 px-2 text-slate-400 dark:text-[#2d409c] font-medium text-center">{r}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(college.cutoffs.allIndiaQuota).map(([cat, rounds]) => (
                      <tr key={cat}>
                        <td className="py-2 pr-3 font-semibold text-slate-700 dark:text-slate-300">{cat}</td>
                        {Object.keys(ROUND_LABELS).map(r => (
                          <td key={r} className="py-2 px-2 text-center text-[#2d409c] dark:text-slate-400">
                            {rounds?.[r]?.toLocaleString('en-IN') ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* State Quota cutoffs */}
          {college.cutoffs?.stateQuota && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#2d409c] mb-3">WB State Quota Cutoffs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2 pr-3 text-slate-400 dark:text-[#2d409c] font-medium">Category</th>
                      {Object.values(ROUND_LABELS).map(r => <th key={r} className="pb-2 px-2 text-slate-400 dark:text-[#2d409c] font-medium text-center">{r}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(college.cutoffs.stateQuota).map(([cat, rounds]) => (
                      <tr key={cat}>
                        <td className="py-2 pr-3 font-semibold text-slate-700 dark:text-slate-300">{cat}</td>
                        {Object.keys(ROUND_LABELS).map(r => (
                          <td key={r} className="py-2 px-2 text-center text-[#2d409c] dark:text-slate-400">
                            {rounds?.[r]?.toLocaleString('en-IN') ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Private Management */}
          {college.cutoffs?.privateManagement && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#2d409c] mb-3">Private Management Cutoffs</h3>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(ROUND_LABELS).map(([key, label]) => (
                  <div key={key} className="flex flex-col gap-0.5 p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-[#2d409c]">{label}</span>
                    <span className="text-sm font-bold text-[#2d409c] dark:text-white">
                      {college.cutoffs.privateManagement?.[key]?.toLocaleString('en-IN') ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-500">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Cutoff data is from NEET 2025 WB counselling. Verify with MCC / WBMCC portals before making decisions.
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
          <Link to="/predictor" className="flex items-center gap-1.5 text-xs font-medium text-[#F9B406] dark:text-teal-400 hover:underline">
            <Target className="w-3.5 h-3.5" /> Check my eligibility
          </Link>
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-colors bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Explore Search Bar ────────────────────────────────────────────────────────
const ExploreSearchBar = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const wrapRef = useRef(null);

  // Auto open code unnecessary ekhon
  // useEffect(() => {
  //   // If empty → show ALL colleges
  //   if (!q.trim()) {
  //     setResults(allColleges);
  //     setOpen(true);
  //     return;
  //   }

  //   // If typing → filter
  //   const r = allColleges.filter((c) =>
  //     c.name.toLowerCase().includes(q.toLowerCase())
  //   );

  //   setResults(r);
  //   setOpen(true);
  // }, [q]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div ref={wrapRef} className="relative w-full max-w-2xl mx-auto">
        <div className={`flex items-center rounded-2xl overflow-hidden border shadow-md transition-all
          bg-white dark:bg-slate-900
          border-slate-200 dark:border-slate-700
          focus-within:border-[#F9B406] dark:focus-within:border-teal-500
          focus-within:ring-2 focus-within:ring-[#F9B406]/10 dark:focus-within:ring-teal-500/10
          ${open ? 'rounded-b-none border-b-0' : ''}`}>

          <input
            type="text"
            value={q}
            onFocus={() => {
              // 🔥 SHOW ALL ON CLICK
              if (!q.trim()) {
                setResults(allColleges);
              }
              setOpen(true);
            }}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Explore colleges…"
            className="flex-1 px-5 py-4 text-sm bg-transparent outline-none text-[#2d409c] dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
          />

          {q && (
            <button
              onClick={() => {
                setQ('');
                setResults(allColleges);
                setOpen(true);
              }}
              className="px-2 text-slate-400 hover:text-[#2d409c] dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button className="flex items-center justify-center px-5 py-5 bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* 🔥 SCROLLABLE DROPDOWN */}
        {open && (
          <div className="absolute left-0 right-0 max-h-100 overflow-y-auto rounded-b-2xl border border-t-0 shadow-xl z-30
            bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">

            {results.map((c) => (
              <button
                key={c.uid}
                onClick={() => {
                  setSelected(c);
                  setOpen(false);
                  setQ('');
                }}
                className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-colors
                  hover:bg-slate-50 dark:hover:bg-slate-800
                  border-b border-slate-100 dark:border-slate-800 last:border-0
                  text-slate-700 dark:text-white/80"
              >
                <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-[#2d409c]" />

                <span className="flex-1 truncate">{c.name}</span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${c.management !== 'Private'
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                    : 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-500/20'
                  }`}>
                  {c.management}
                </span>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
              </button>
            ))}

          </div>
        )}
      </div>

      {selected && (
        <CollegeDrawer
          college={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

// ── Home ──────────────────────────────────────────────────────────────────────
const WHY_CHOOSE = [

  { icon: Target, title: 'Doctor-Driven, Student-Focused, Result-Oriented', desc: "MedSankalp is built by doctors and MBBS students who’ve been through the same journey — giving you real, practical guidance that actually works." },
  { icon: MessageCircle, title: 'Personalized MBBS Counselling', desc: 'No generic advice. Get guidance tailored to your NEET rank, category, and career goals.' },
  { icon: Lightbulb, title: 'End-to-End Admission Support', desc: 'From strategy to seat allotment — we stay with you at every step of your MBBS journey.' },
  { icon: Award, title: 'Real Data. Real Insights.', desc: 'Accurate cutoffs, college analysis, and counselling strategies based on real experiences, not assumptions.' },
  { icon: Zap, title: 'Mentorship That Makes a Difference', desc: 'Learn directly from those who cracked NEET and secured MBBS seats — your roadmap is already tested.' },
  { icon: Building2, title: 'Transparency You Can Trust', desc: 'Clear processes, honest advice, and student-first approach — always.' },
];

const Home = () => (
  <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-[#2d409c] dark:text-white">

    {/* ── Hero ──────────────────────────────────────────────────────────── */}
    <div className="relative border-b border-slate-200 dark:border-slate-800">
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(249,180,6,0.06),transparent)]
        dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Find Your{' '}
          <span className="text-[#F9B406] dark:text-teal-400">Perfect Medical College</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Access real NEET cutoff data, compare colleges, and make informed decisions about your future
        </p>

        {/* ── Search bar ── */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Get trusted guidance with{' '}
          <span className="font-bold text-slate-800 dark:text-white underline underline-offset-2 decoration-[#F9B406] dark:decoration-teal-400">
            MedSankalp
          </span>{' '}
          for every step of your admission process.
        </p>
        <ExploreSearchBar />
      </div>
    </div>

    {/* ── Platform Section ──────────────────────────────────────────────── */}
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="rounded-2xl border p-10 flex flex-col lg:flex-row items-center gap-10
        bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
        <div className="flex-1">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#2d409c] dark:text-white">
            The Ultimate{' '}
            <span className="text-[#F9B406] dark:text-teal-400">College Guidance</span> and{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Counselling</span> Platform for NEET
          </h2>
          <ul className="space-y-3">
            {[
              'Get personalized 1-On-1 counselling from experts.',
              'Predict college using our advanced college predictor.',
              'Get an eBook to help you with your college selection.',
              'Get honest insights about medical colleges directly from current students',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[#2d409c] dark:text-slate-300">
                <span className="text-[#F9B406] dark:text-teal-400 font-bold mt-1">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 hidden lg:flex items-center justify-center">
          <div className="w-full h-64 rounded-xl flex items-center justify-center bg-[url('/Counselling.png')] bg-contain bg-no-repeat bg-center dark:bg-[url('/Counselling_Dark.png')]">
          </div>
        </div>
      </div>
    </div>


    <div className="max-w-6xl mx-auto px-6 pb-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 px-8 border rounded-2xl bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full h-80 rounded-xl flex items-center justify-center
            bg-[url('/Admission_Support.png')] dark:bg-[url('/Admission_Support_Dark.png')] bg-center bg-contain ">
          </div>
        </div>
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-[#2d409c] dark:text-white">
            Our <span className="text-[#F9B406] dark:text-teal-400">Admission Support</span>
          </h2>
          <div className="space-y-4">
            {[
              'Personalized 1-on-1 expert counselling',
              'Affordable & Transparent Pricing',
              'Registration & Form Filling Support',
              'Assistance in both AIQ + State Counselling',
              'Documentation & Scholarship Guidance',
              'Deep Analysis of Cutoff Trends, Seat Matrix, Bond & Fees',
            ].map((service, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
                  bg-[#F9B406] dark:bg-teal-400">
                  <span className="text-slate-950 text-xs font-bold">✓</span>
                </div>
                <p className="text-[#2d409c] dark:text-slate-300">{service}</p>
              </div>
            ))}
          </div>
          <Link to="/admission-support"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full font-bold transition-all hover:scale-105
              bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
            View Plans →
          </Link>
        </div>
      </div>
    </div>



    {/* ── NEET College Predictor ─────────────────────────────────────────── */}
    <div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 px-8 border rounded-2xl bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-[#2d409c] dark:text-white">
              NEET UG College <span className="text-[#F9B406] dark:text-teal-400">Predictor</span>
            </h2>
            <div className="space-y-4">
              {[
                'Predict your admission chances',
                'Deep analysis of previous year cutoff trends',
                'Based on 100+ parameters',
                '100% accurate Prediction',
                'Includes both AIQ and STATE Counselling predictions',
                'Covers Govt, Central, Deemed & Private colleges',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
                    bg-[#F9B406] dark:bg-teal-400">
                    <span className="text-slate-950 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-[#2d409c] dark:text-slate-300">{feature}</p>
                </div>
              ))}
            </div>
            <Link to="/predictor"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full font-bold transition-all hover:scale-105
                bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              Get Predictor →
            </Link>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full h-80 rounded-xl flex items-center justify-center
              bg-[url('/Predictor.png')] bg-contain bg-no-repeat bg-center dark:bg-[url('/Predictor_Dark.png')]">
              
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── Counselling Services ───────────────────────────────────────────── */}
    <div className="max-w-6xl mx-auto px-6 pb-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 px-8 border rounded-2xl bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full h-80 rounded-xl flex items-center justify-center
            bg-[url('/Coun.png')] bg-contain bg-no-repeat bg-center dark:bg-[url('/Coun_Dark.png')] ">
          </div>
        </div>
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-[#2d409c] dark:text-white">
            Our <span className="text-[#F9B406] dark:text-teal-400">Counselling Services</span>
          </h2>
          <div className="space-y-4">
            {[
              'Personalized 1-on-1 expert counselling',
              'Affordable & Transparent Pricing',
              'Registration & Form Filling Support',
              'Assistance in both AIQ + State Counselling',
              'Documentation & Scholarship Guidance',
              'Deep Analysis of Cutoff Trends, Seat Matrix, Bond & Fees',
            ].map((service, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
                  bg-[#F9B406] dark:bg-teal-400">
                  <span className="text-slate-950 text-xs font-bold">✓</span>
                </div>
                <p className="text-[#2d409c] dark:text-slate-300">{service}</p>
              </div>
            ))}
          </div>
          <Link to="/packages"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full font-bold transition-all hover:scale-105
              bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
            View Plans →
          </Link>
        </div>
      </div>
    </div>

    {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
    <div className="border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-[#2d409c] dark:text-white">
            Why Choose <span className="text-[#F9B406] dark:text-teal-400">MedSankalp</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Everything you need to make the right college choice
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE.map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="rounded-xl p-6 border transition-all group
              bg-white dark:bg-slate-900/40
              border-slate-200 dark:border-slate-800
              hover:border-[#F9B406]/40 dark:hover:border-teal-500/30
              hover:shadow-md dark:hover:shadow-none">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors
                bg-slate-50 dark:bg-slate-800
                group-hover:bg-[#F9B406]/10 dark:group-hover:bg-teal-500/10">
                <Icon className="w-6 h-6 text-[#F9B406] dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-[#2d409c] dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default Home;