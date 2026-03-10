import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Predictor', to: '/predictor' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const ThemeToggle = ({ theme, toggle, className = '' }) => (
  <button onClick={toggle}
    className={`flex items-center justify-center w-8 h-8 rounded-lg border border-black/5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 transition-colors ${className}`}>
    {theme === 'dark' ? <Sun fill='currentColor' className="w-4 h-4" /> : <Moon fill='currentColor' className="w-4 h-4" />}
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
    <header className="sticky top-0 z-50 border-b transition-colors duration-300 border-slate-200 dark:border-[#2C2E69] bg-white/90 dark:bg-black">
      <nav className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0 bg-white hover:bg-white/80 border border-white/10 rounded-lg overflow-hidden">
          <img src="/logo.png" className="h-10 w-auto" />
        </NavLink>

        {/* Desktop nav links */}
        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive
                    ? 'bg-[#F9B406]/15 text-[#F9B406] border border-[#F9B406]/30'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#F9B406] flex items-center justify-center text-[#2C2E69] text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-white/90">
                  {user.name}
                </span>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          )}
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={theme} toggle={toggle} />
          <button
            className="p-1.5 rounded-lg transition-colors text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t transition-colors border-slate-200 dark:border-white/10 bg-white dark:bg-[#2C2E69]">
          <div className="px-6 py-4 space-y-1">
            {links.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-[#F9B406]/15 text-[#F9B406] border border-[#F9B406]/30'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {user && (
              <div className="pt-4 mt-3 border-t space-y-3 border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2.5 px-3">
                  <div className="w-7 h-7 rounded-full bg-[#F9B406] flex items-center justify-center text-[#2C2E69] text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-white/90">
                    {user.name}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white">
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