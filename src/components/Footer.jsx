// Footer.jsx
import { NavLink } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'Predictor', to: '/predictor' },
  { label: 'About',     to: '/about'     },
  { label: 'Contact',   to: '/contact'   },
];

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Refund Policy',      to: '/refund-policy'        },
  { label: 'Privacy Policy',     to: '/privacy-policy'       },
  { label: 'Disclaimer',         to: '/disclaimer'           },
];

const Footer = () => (
  <footer className="border-t transition-colors duration-300
    border-slate-200 dark:border-[#2C2E69]/60
    bg-white dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-8">

        {/* Brand */}
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20">
              <GraduationCap className="w-4 h-4 text-[#F9B406]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              Med<span className="text-[#F9B406]">Sankalp</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-white/30">
            AI-powered NEET college predictions. Data sourced from MCC, State DME & NEET official records.
          </p>
          <p className="text-xs mt-2 text-slate-400 dark:text-white/20 italic">
            Not affiliated with MCC, NMC, or any government counselling body.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-10">

          {/* Navigate */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3
              text-slate-400 dark:text-white/20">
              Navigate
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to}
                    className="text-sm transition-colors
                      text-slate-600 dark:text-white/40
                      hover:text-[#F9B406] dark:hover:text-[#F9B406]">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3
              text-slate-400 dark:text-white/20">
              Legal
            </p>
            <ul className="space-y-2">
              {LEGAL_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to}
                    className="text-sm transition-colors
                      text-slate-600 dark:text-white/40
                      hover:text-[#F9B406] dark:hover:text-[#F9B406]">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3
        border-slate-100 dark:border-[#2C2E69]/40">
        <p className="text-xs text-slate-400 dark:text-white/20">
          © 2025 MedSankalp · All rights reserved
        </p>
        <p className="text-xs text-slate-400 dark:text-white/20">
          Predictions are indicative only · Not a guarantee of admission
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;