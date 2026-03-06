import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorState = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950">
      <div className="rounded-2xl p-10 max-w-sm w-full text-center shadow-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-slate-200/60 dark:shadow-black/40">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
          Access Denied
        </h2>
        <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ErrorState;