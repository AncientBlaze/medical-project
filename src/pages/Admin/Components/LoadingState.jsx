const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-lg bg-slate-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-slate-700/40 to-transparent" />
  </div>
);

const LoadingSkeleton = () => (
  <>
    {/* Inject keyframe once */}
    <style>{`
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `}</style>

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

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

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Shimmer className="h-3 w-28" />
            </div>

            {/* CTA button */}
            <div className="relative overflow-hidden rounded-xl h-11 bg-teal-500/20 border border-teal-500/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.3s_infinite] bg-linear-to-r from-transparent via-teal-400/10 to-transparent" />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <Shimmer className="h-3 w-6" />
            <div className="flex-1 h-px bg-slate-800" />
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

export default LoadingSkeleton;