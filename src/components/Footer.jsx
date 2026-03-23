// Footer.jsx
import { NavLink } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Predictor', to: '/predictor' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Disclaimer', to: '/disclaimer' },
];

const smoothScrollToTop = () => {
  const targetPosition = 0;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 100;
  let start = null;

  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress);
    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={smoothScrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-[#F9B406] dark:bg-teal-400 text-slate-950 dark:text-slate-950 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-fadeIn"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <footer className="border-t transition-colors duration-300
        border-amber-200 dark:border-slate-800
        bg-[#fffdf7] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-teal-500/10 border border-amber-200 dark:border-teal-500/30">
                  <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
                </div>
                <span className="font-bold text-lg tracking-tight text-[#2d409c] dark:text-white">
                  Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#2d409c] dark:text-slate-400 mb-3">
                AI-powered NEET college predictions powered by real data. Helping students find their perfect medical college.
              </p>
            </div>

            {/* Navigate */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4
                text-[#2d409c] dark:text-white">
                Navigate
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink to={to}
                      onClick={smoothScrollToTop}
                      className="text-sm transition-colors
                        text-[#2d409c] dark:text-slate-400
                        hover:text-[#F9B406] dark:hover:text-teal-400 font-medium">
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4
                text-[#2d409c] dark:text-white">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink to={to}
                      onClick={smoothScrollToTop}
                      className="text-sm transition-colors
                        text-[#2d409c] dark:text-slate-400
                        hover:text-[#F9B406] dark:hover:text-teal-400 font-medium">
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4
                text-[#2d409c] dark:text-white">
                Get In Touch
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F9B406] dark:text-teal-400 mt-0.5
                    shrink-0" />
                  <a href="mailto:support@medsankalp.com" className="text-sm text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400 transition-colors">
                    support@medsankalp.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#F9B406] dark:text-teal-400 mt-0.5 shrink-0" />
                  <a href="tel:+919876543210" className="text-sm text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400 transition-colors">
                    +91 9876 543 210
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F9B406] dark:text-teal-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-[#2d409c] dark:text-slate-400">
                    India
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-amber-200 dark:bg-slate-800 mb-8"></div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#2d409c] dark:text-slate-400">
              © 2025 MedSankalp · All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;