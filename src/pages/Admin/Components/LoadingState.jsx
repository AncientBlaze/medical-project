const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-900/40 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/80 to-transparent dark:via-white/5" />
  </div>
);

const LoadingSkeleton = () => {

  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className="rounded-2xl p-8 shadow-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-slate-200/60 dark:shadow-none">

            {/* Logo mark */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <Shimmer className="w-8 h-8 rounded-lg" />
              <Shimmer className="h-4 w-32" />
            </div>

            {/* Title */}
            <Shimmer className="h-6 w-28 mb-1" />
            <Shimmer className="h-3.5 w-44 mb-7" />

            {/* Fields */}
            <div className="space-y-5">
              {[1, 2].map(i => (
                <div key={i}>
                  <Shimmer className="h-3.5 w-20 mb-2" />
                  <Shimmer className="h-11 w-full rounded-xl" />
                </div>
              ))}

              {/* Forgot password */}
              <div className="flex justify-end">
                <Shimmer className="h-3 w-28" />
              </div>

              {/* CTA button */}
              <div className="relative overflow-hidden rounded-xl h-11 border bg-amber-100 dark:bg-teal-400/20 border-amber-200 dark:border-teal-400/10">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.3s_infinite] bg-linear-to-r from-transparent via-amber-200/60 to-transparent dark:via-teal-400/10" />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <Shimmer className="h-3 w-6" />
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Footer link */}
            <div className="flex items-center justify-center gap-1.5">
              <Shimmer className="h-3.5 w-36" />
              <Shimmer className="h-3.5 w-16" />
            </div>
          </div>

          {/* Below-card hint */}
          <div className="flex justify-center mt-5">
            <Shimmer className="h-3 w-48" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingSkeleton;