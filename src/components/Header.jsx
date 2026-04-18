// Header.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Predict Rank', to: '/predictor' },
  { label: 'Counselling', to: '/packages' },
  { label: 'Study Abroad', to: '/study-abroad' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Mentors', to: '/doctors' },
  { label: 'Contact', to: '/contact' },
];

const ThemeToggle = ({ theme, toggle }) => (
  <button
    onClick={toggle}
    aria-label="Toggle theme"
    className="w-11 h-11 flex items-center justify-center rounded-xl
    bg-amber-50/60 dark:bg-slate-900/40
    hover:bg-amber-100 dark:hover:bg-slate-800/60
    text-amber-600 dark:text-slate-400
    hover:text-[#F9B406] dark:hover:text-teal-400
    transition-all"
  >
    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </button>
);

const Header = ({ user, onLogout }) => {
  const { theme, toggle } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    close();
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <header className="
        sticky top-0 z-50
        bg-white/80 dark:bg-slate-950/80
        backdrop-blur-sm
        border-b border-amber-100/60 dark:border-slate-800/60
      ">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src="/logo.png" className="h-12 w-auto dark:bg-white rounded-2xl" alt="Logo" />
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'text-[#F9B406] dark:text-teal-400 bg-[#F9B406]/10 dark:bg-teal-500/10'
                    : 'text-[#2d409c] dark:text-slate-400 hover:text-[#2d409c] dark:hover:text-white hover:bg-amber-50 dark:hover:bg-slate-900/40'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl
                bg-amber-50/60 dark:bg-slate-900/40">
                <Link to="/profile" className="flex items-center gap-2 px-2 py-1 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-[#F9B406] dark:bg-teal-400
                    flex items-center justify-center text-xs font-bold text-[#2d409c] dark:text-slate-950">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-white max-w-28 truncate">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-500
                  hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium
                bg-[#F9B406] hover:bg-[#e0a205] text-[#2d409c] dark:bg-teal-300 dark:hover:bg-teal-500 transition-all"
              >
                Login
              </Link>
            )}
            <ThemeToggle theme={theme} toggle={toggle} />
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle theme={theme} toggle={toggle} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="w-11 h-11 flex items-center justify-center rounded-xl
              hover:bg-amber-50 dark:hover:bg-slate-900/40 transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? 'max-h-dvh opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 pb-6 pt-2 space-y-0.5
            bg-[#fffdf7] dark:bg-slate-950
            border-t border-amber-100 dark:border-slate-800
            overflow-y-auto max-h-[calc(100dvh-56px)]"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={close}
                className={({ isActive }) =>
                  `flex items-center px-3 rounded-lg text-sm font-medium transition min-h-11
                  ${isActive
                    ? 'text-[#F9B406] dark:text-teal-400 bg-[#F9B406]/10 dark:bg-teal-500/10'
                    : 'text-[#2d409c] dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-900/40'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="pt-3 mt-2 border-t border-amber-100 dark:border-slate-800">
              {user ? (
                <div className="space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={close}
                    className="flex items-center gap-3 px-3 min-h-11 rounded-lg
                    hover:bg-amber-50 dark:hover:bg-slate-900/40 transition"
                  >
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#F9B406] dark:bg-teal-400
                      flex items-center justify-center text-xs font-bold text-[#2d409c] dark:text-slate-950">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-700 dark:text-white truncate">
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 min-h-11 w-full rounded-lg
                    text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 shrink-0" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={close}
                  className="flex items-center justify-center min-h-11 px-3 rounded-lg
                  text-sm font-medium bg-[#F9B406] hover:bg-[#e0a205] text-[#2d409c] transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Header;