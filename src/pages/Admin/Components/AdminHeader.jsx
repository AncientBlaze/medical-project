import { GraduationCap, LogOut, Moon, Sun } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import useThemeStore from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';

const ThemeToggle = ({ theme, toggle, className = '' }) => (
  <button onClick={toggle}
    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 ${className}`}
  >
    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon fill='currentColor' className="w-4 h-4" />}
  </button>
);

const AdminHeader = () => {

  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { theme, toggle } = useThemeStore();

  return (
    <div className="sticky top-0 z-20 border-b backdrop-blur-sm transition-colors duration-300 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border bg-[#F9B406]/10 dark:bg-teal-500/10 border-[#F9B406]/20 dark:border-teal-500/20">
            <GraduationCap className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
            <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">Admin</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
