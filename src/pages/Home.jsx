import { colleges } from '../../data/hospitalData';
import { MapPin, BookOpen, ExternalLink } from 'lucide-react';

const CollegeCard = ({ name, address, courses, image, detailsUrl, index }) => (
  <div
    className="group bg-[#2C2E69]/40 border border-[#2C2E69] rounded-2xl overflow-hidden flex flex-col hover:border-[#F9B406]/40 transition-all duration-300 hover:shadow-[0_0_32px_-4px_rgba(249,180,6,0.15)]"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Image */}
    <div className="relative h-44 overflow-hidden bg-[#2C2E69]/60 shrink-0">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#2C2E69]/90 via-transparent to-transparent" />
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-[#F9B406]/20 backdrop-blur-sm">
        <BookOpen className="w-3 h-3 text-[#F9B406]" />
        <span className="text-xs font-medium text-white/80">{courses.length} courses</span>
      </div>
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col grow">
      <h3 className="text-base font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#F9B406] transition-colors duration-200">
        {name}
      </h3>

      <div className="flex items-start gap-1.5 mb-4">
        <MapPin className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
        <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{address}</p>
      </div>

      {/* Courses */}
      <div className="flex flex-wrap gap-1.5 mb-5 grow content-start">
        {courses.slice(0, 4).map((course) => (
          <span
            key={course}
            className="px-2 py-0.5 h-fit rounded-md bg-white/5 border border-white/10 text-xs text-white/60"
          >
            {course}
          </span>
        ))}
        {courses.length > 4 && (
          <span className="px-2 py-0.5 h-fit rounded-md bg-white/5 border border-white/10 text-xs text-white/30">
            +{courses.length - 4} more
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => window.open(detailsUrl, '_blank', 'noopener,noreferrer')}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 text-[#F9B406] text-sm font-medium hover:bg-[#F9B406] hover:text-[#2C2E69] hover:border-[#F9B406] transition-all duration-200"
      >
        View Details <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const Home = () => (
  <div className="min-h-screen bg-slate-900 text-white">
    {/* Hero */}
    <div className="relative border-b border-[#2C2E69]/60 bg-[#2C2E69]/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.4),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-6 py-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9B406]/10 border border-[#F9B406]/20 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F9B406] animate-pulse" />
          <span className="text-xs font-medium text-[#F9B406]">{colleges.length} institutions listed</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          Medical <span className="text-[#F9B406]">Institutions</span>
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto">
          Discover top-rated hospitals and medical colleges across India
        </p>
      </div>
    </div>

    {/* Grid */}
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {colleges.map(({ id, ...props }, index) => (
          <CollegeCard key={id} index={index} {...props} />
        ))}
      </div>
    </div>
  </div>
);

export default Home;