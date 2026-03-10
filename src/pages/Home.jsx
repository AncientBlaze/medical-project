import { MapPin, ExternalLink, Building2, Users, Zap } from "lucide-react";
import { useState } from "react";
import { indiaColleges } from "../../data/indiaCollegeData.js";
import CollegeModal from "../components/CollegeModal";

const formatFee = (n) => {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const CollegeCard = ({ name, state, management, seats, fees, id, image, index, onOpen }) => (
  <div
    className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-amber-400/10 cursor-pointer"
    style={{ animationDelay: `${index * 80}ms` }}
    onClick={() => onOpen(id)}
  >
    {/* Header */}
    <div className="relative h-32 overflow-hidden shrink-0 bg-linear-to-br from-amber-50 to-amber-100 dark:from-slate-800 dark:to-slate-700">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#F9B406,#F9B406_10px,transparent_10px,transparent_20px)]" />
      )}

      {image && (
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      )}

      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm bg-white/90 dark:bg-slate-950/70 border-amber-200 dark:border-slate-700">
        <Building2 className="w-3 h-3 text-[#F9B406] dark:text-teal-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-white/70">{management}</span>
      </div>
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col grow">
      <h3 className="text-base font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[#F9B406] transition-colors duration-200 text-slate-900 dark:text-white">
        {name}
      </h3>

      <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-500">{state}</p>
      </div>

      <div className="flex items-center gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{seats} seats</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>{formatFee(fees?.managementQuota)}</span>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onOpen(id); }}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20 text-[#F9B406] dark:text-teal-400 hover:bg-[#F9B406] dark:hover:bg-teal-400 hover:text-slate-950 dark:hover:text-slate-950 hover:border-[#F9B406] dark:hover:border-teal-400"
      >
        View Details <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const Home = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (collegeId) => {
    const college = indiaColleges.find((c) => c.id === collegeId);
    setSelectedCollege(college);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCollege(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 dark:bg-teal-500/10 border-amber-300 dark:border-teal-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] dark:bg-teal-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-800 dark:text-teal-400">
              {indiaColleges.length} medical colleges listed
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Medical{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Colleges</span>
          </h1>
          <p className="text-base max-w-md mx-auto text-slate-600 dark:text-slate-400">
            Explore top medical colleges across India with accurate NEET cutoff data
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {indiaColleges.map(({ id, ...props }, index) => (
            <CollegeCard key={id} id={id} index={index} {...props} onOpen={handleOpenModal} />
          ))}
        </div>
      </div>

      <CollegeModal college={selectedCollege} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;