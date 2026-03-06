import { GraduationCap, LogOut, Moon, Sun } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import useThemeStore from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';

const ThemeToggle = ({ theme, toggle, className = '' }) => (
  <button onClick={toggle}
    className={`flex items-center justify-center w-8 h-8 rounded-lg dark:bg-white/10 bg-black/10 dark:text-white/70 text-black/60 hover:bg-black/20 hover:text-black dark:hover:bg-white/20 dark:hover:text-white transition-colors ${className}`}
  >
    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon fill='white' className="w-4 h-4" />}
  </button>
);
const AdminHeader = () => {

  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { theme, toggle } = useThemeStore();

  return (
    <div className={`sticky top-0 z-20 border-b backdrop-blur-sm transition-colors duration-300 dark:border-[#2C2E69]/60 dark:bg-slate-950/90 border-slate-200 bg-white/90`}>
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20">
            <GraduationCap className="w-4 h-4 text-[#F9B406]" />
          </div>
          <span className={`font-bold text-sm tracking-tight dark:text-white text-slate-900}`}>
            Med<span className="text-[#F9B406]">Sankalp</span>
            <span className={`ml-2 text-xs font-medium dark:text-white/30 text-slate-400}`}>Admin</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors 
              dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white
              bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900
              `}
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
