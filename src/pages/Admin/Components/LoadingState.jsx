import useThemeStore from "../../../store/themeStore";

const Shimmer = ({ className = '', isDark }) => (
  <div className={`relative overflow-hidden rounded-lg ${isDark ? 'bg-[#2C2E69]/60' : 'bg-slate-200'} ${className}`}>
    <div className={`absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r ${
      isDark ? 'from-transparent via-white/5 to-transparent' : 'from-transparent via-white/80 to-transparent'
    }`} />
  </div>
);

const LoadingSkeleton = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className={`rounded-2xl p-8 shadow-xl border ${
            isDark ? 'bg-slate-950 border-[#2C2E69]' : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>

            {/* Logo mark */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <Shimmer className="w-8 h-8 rounded-lg" isDark={isDark} />
              <Shimmer className="h-4 w-32" isDark={isDark} />
            </div>

            {/* Title */}
            <Shimmer className="h-6 w-28 mb-1" isDark={isDark} />
            <Shimmer className="h-3.5 w-44 mb-7" isDark={isDark} />

            {/* Fields */}
            <div className="space-y-5">
              {[1, 2].map(i => (
                <div key={i}>
                  <Shimmer className="h-3.5 w-20 mb-2" isDark={isDark} />
                  <Shimmer className="h-11 w-full rounded-xl" isDark={isDark} />
                </div>
              ))}

              {/* Forgot password */}
              <div className="flex justify-end">
                <Shimmer className="h-3 w-28" isDark={isDark} />
              </div>

              {/* CTA button */}
              <div className={`relative overflow-hidden rounded-xl h-11 border ${
                isDark ? 'bg-[#F9B406]/20 border-[#F9B406]/10' : 'bg-amber-100 border-amber-200'
              }`}>
                <div className={`absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.3s_infinite] bg-linear-to-r ${
                  isDark ? 'from-transparent via-[#F9B406]/10 to-transparent' : 'from-transparent via-amber-200/60 to-transparent'
                }`} />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className={`flex-1 h-px ${isDark ? 'bg-[#2C2E69]' : 'bg-slate-200'}`} />
              <Shimmer className="h-3 w-6" isDark={isDark} />
              <div className={`flex-1 h-px ${isDark ? 'bg-[#2C2E69]' : 'bg-slate-200'}`} />
            </div>

            {/* Footer link */}
            <div className="flex items-center justify-center gap-1.5">
              <Shimmer className="h-3.5 w-36" isDark={isDark} />
              <Shimmer className="h-3.5 w-16" isDark={isDark} />
            </div>
          </div>

          {/* Below-card hint */}
          <div className="flex justify-center mt-5">
            <Shimmer className="h-3 w-48" isDark={isDark} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingSkeleton;