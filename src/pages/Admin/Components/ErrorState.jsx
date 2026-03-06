import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';

const ErrorState = ({ message }) => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      <div className={`rounded-2xl p-10 max-w-sm w-full text-center shadow-xl border ${
        isDark ? 'bg-slate-950 border-[#2C2E69] shadow-black/40' : 'bg-white border-slate-200 shadow-slate-200/60'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Access Denied
        </h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{message}</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] font-semibold text-sm transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ErrorState;