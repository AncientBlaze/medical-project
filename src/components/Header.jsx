// Header.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'Predictor', to: '/predictor' },
  { label: 'Contact',   to: '/contact'   },
];

const ThemeToggle = ({ theme, toggle, className = '' }) => (
  <button onClick={toggle}
    className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors
      border-slate-200 dark:border-white/10
      bg-slate-100 dark:bg-white/5
      hover:bg-slate-200 dark:hover:bg-white/10
      text-slate-500 dark:text-white/50
      hover:text-slate-900 dark:hover:text-white
      ${className}`}>
    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </button>
);

const Header = ({ user, onLogout }) => {
  const { theme, toggle } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const links = user?.isAdmin ? [] : [...NAV_LINKS];

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b transition-colors duration-300
      border-slate-200 dark:border-[#2C2E69]/60
      bg-white/90 dark:bg-slate-950/90
      backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0 rounded-lg overflow-hidden">
          <img src="/logo.png" className="h-10 w-auto" />
        </NavLink>

        {/* Desktop nav */}
        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-0.5">
            {links.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-[#F9B406]/10 text-[#F9B406] border-[#F9B406]/30'
                      : 'border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2.5">
          {user && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border
                bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#F9B406] flex items-center justify-center text-[#2C2E69] text-xs font-bold shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-white/80 max-w-30 truncate">
                  {user.name}
                </span>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors
                  bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10
                  border-slate-200 dark:border-white/10
                  text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          )}
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={theme} toggle={toggle} />
          <button
            className="p-1.5 rounded-lg transition-colors
              text-slate-600 dark:text-white/60
              hover:text-slate-900 dark:hover:text-white
              hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t transition-colors
          border-slate-200 dark:border-white/10
          bg-white dark:bg-slate-950">
          <div className="px-4 py-3 space-y-0.5">
            {links.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-[#F9B406]/10 text-[#F9B406] border-[#F9B406]/30'
                      : 'border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {user && (
              <div className="pt-3 mt-2 border-t space-y-2 border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2.5 px-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#F9B406] flex items-center justify-center text-[#2C2E69] text-xs font-bold shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-white/80 truncate">
                    {user.name}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors
                    bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10
                    border-slate-200 dark:border-white/10
                    text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;