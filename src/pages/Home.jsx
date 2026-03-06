import { BookOpen, ExternalLink, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { colleges } from "../../data/hospitalData";

const CollegeCard = ({ name, address, courses, image, id, index, navigate }) => (
  <div
    className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-amber-400/10 dark:hover:shadow-lg"
    style={{ animationDelay: `${index * 80}ms` }}
    onClick={() => navigate(`/preview/${id}`)}
  >
    {/* Image */}
    <div className="relative h-44 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900/60">
      <img src={image} alt={name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 dark:from-slate-900/90 via-transparent to-transparent" />
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm bg-white/90 dark:bg-slate-950/70 border-amber-200 dark:border-slate-700">
        <BookOpen className="w-3 h-3 text-[#F9B406] dark:text-teal-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-white/70">{courses.length} courses</span>
      </div>
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col grow">
      <h3 className="text-base font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[#F9B406] transition-colors duration-200 text-slate-900 dark:text-white">
        {name}
      </h3>

      <div className="flex items-start gap-1.5 mb-4">
        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400 dark:text-slate-600" />
        <p className="text-xs leading-relaxed line-clamp-2 text-slate-600 dark:text-slate-500">{address}</p>
      </div>

      {/* Courses */}
      <div className="flex flex-wrap gap-1.5 mb-5 grow content-start">
        {courses.slice(0, 4).map((course) => (
          <span key={course}
            className="px-2 py-0.5 h-fit rounded-md border text-xs bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            {course}
          </span>
        ))}
        {courses.length > 4 && (
          <span className="px-2 py-0.5 h-fit rounded-md border text-xs bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-600">
            +{courses.length - 4} more
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20 text-[#F9B406] dark:text-teal-400 hover:bg-[#F9B406] dark:hover:bg-teal-400 hover:text-slate-950 dark:hover:text-slate-950 hover:border-[#F9B406] dark:hover:border-teal-400"
      >
        View Details <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 bg-amber-100 dark:bg-teal-500/10 border-amber-300 dark:border-teal-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] dark:bg-teal-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-800 dark:text-teal-400">
              {colleges.length} institutions listed
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Medical{' '}
            <span className="text-[#F9B406] dark:text-teal-400">Institutions</span>
          </h1>
          <p className="text-base max-w-md mx-auto text-slate-600 dark:text-slate-400">
            Discover top-rated hospitals and medical colleges across India
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {colleges.map(({ id, ...props }, index) => (
            <CollegeCard key={id} index={index} {...props} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
