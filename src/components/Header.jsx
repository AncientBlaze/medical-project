import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'Predictor', to: '/predictor' },
  { label: 'About',     to: '/about'     },
  { label: 'Contact',   to: '/contact'   },
];

const Header = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate            = useNavigate();

  const links = user?.isAdmin ? [] : [...NAV_LINKS];

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#2C2E69]/40 bg-[#2C2E69]/75 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 bg-white hover:bg-white/80 border border-white/10 rounded-4xl">
          <img src="/logo.png" className="h-15 w-auto" />
        </NavLink>

        {/* Desktop nav links */}
        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#F9B406]/15 text-[#F9B406] border border-[#F9B406]/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#F9B406] flex items-center justify-center text-[#2C2E69] text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/90 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#2C2E69]">
          <div className="px-6 py-4 space-y-1">
            {links.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F9B406]/15 text-[#F9B406] border border-[#F9B406]/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {user && (
              <div className="pt-4 mt-3 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2.5 px-3">
                  <div className="w-7 h-7 rounded-full bg-[#F9B406] flex items-center justify-center text-[#2C2E69] text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/90 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
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