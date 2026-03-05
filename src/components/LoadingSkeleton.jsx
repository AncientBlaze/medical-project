const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-lg bg-[#2C2E69]/60 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

const LoadingSkeleton = () => (
  <>
    <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl p-8 shadow-xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <Shimmer className="w-8 h-8 rounded-lg" />
            <Shimmer className="h-4 w-32" />
          </div>

          {/* Title + subtitle */}
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
            <div className="relative overflow-hidden rounded-xl h-11 bg-[#F9B406]/20 border border-[#F9B406]/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.3s_infinite] bg-linear-to-r from-transparent via-[#F9B406]/10 to-transparent" />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#2C2E69]" />
            <Shimmer className="h-3 w-6" />
            <div className="flex-1 h-px bg-[#2C2E69]" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5">
            <Shimmer className="h-3.5 w-36" />
            <Shimmer className="h-3.5 w-16" />
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Shimmer className="h-3 w-48" />
        </div>
      </div>
    </div>
  </>
);

export default LoadingSkeleton;