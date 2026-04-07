// Footer.jsx
import { NavLink } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone, ArrowUp, Youtube, Instagram, ExternalLink } from 'lucide-react';
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

const OFFICIAL_LINKS = [
  { label: 'NMC Website', href: 'https://www.nmc.org.in' },
  { label: 'NTA Website', href: 'https://nta.ac.in' },
  { label: 'MCC Counselling', href: 'https://mcc.nic.in' },
];

// WhatsApp SVG icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Telegram SVG icon
const TelegramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@MedSankalpEducation',
    Icon: Youtube,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/medsankalp_education?igsh=cXRxdnY4YTNpNGNk',
    Icon: Instagram,
  },
  {
    label: 'WhatsApp',
    href: 'https://whatsapp.com/channel/0029Vb7U3v8LY6dBIvT69N07',
    Icon: WhatsAppIcon,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/medsankalp',
    Icon: TelegramIcon,
  },
];

const smoothScrollToTop = () => {
  const startPosition = window.scrollY;
  const distance = -startPosition;
  const duration = 100;
  let start = null;

  const easeInOutQuad = (t) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={smoothScrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-[#F9B406] dark:bg-teal-400 text-slate-950 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <footer className="border-t transition-colors duration-300 border-amber-200 dark:border-slate-800 bg-[#fffdf7] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

            {/* Brand — spans 2 cols on large */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-teal-500/10 border border-amber-200 dark:border-teal-500/30">
                  <GraduationCap className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
                </div>
                <span className="font-bold text-lg tracking-tight text-[#2d409c] dark:text-white">
                  Med<span className="text-[#F9B406] dark:text-teal-400">Sankalp</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#2d409c] dark:text-slate-400 mb-5">
                AI-powered NEET college predictions powered by real data. Helping students find their perfect medical college.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all
                      bg-amber-50 dark:bg-slate-800
                      border-amber-200 dark:border-slate-700
                      text-[#F9B406] dark:text-teal-400
                      hover:bg-[#F9B406] dark:hover:bg-teal-400
                      hover:text-slate-950 dark:hover:text-slate-950
                      hover:border-[#F9B406] dark:hover:border-teal-400
                      hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigate */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#2d409c] dark:text-white">
                Navigate
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={smoothScrollToTop}
                      className="text-sm font-medium transition-colors text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#2d409c] dark:text-white">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={smoothScrollToTop}
                      className="text-sm font-medium transition-colors text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Official Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#2d409c] dark:text-white">
                Get In Touch
              </h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F9B406] dark:text-teal-400 mt-0.5 shrink-0" />
                  <a href="mailto:support@medsankalp.com"
                    className="text-sm text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400 transition-colors">
                    support@medsankalp.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#F9B406] dark:text-teal-400 mt-0.5 shrink-0" />
                  <a href="tel:+919876543210"
                    className="text-sm text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400 transition-colors">
                    +91 9876 543 210
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F9B406] dark:text-teal-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-[#2d409c] dark:text-slate-400">India</span>
                </li>
              </ul>

              {/* Official Websites */}
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-[#2d409c] dark:text-white">
                Official Sites
              </h4>
              <ul className="space-y-2.5">
                {OFFICIAL_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors text-[#2d409c] dark:text-slate-400 hover:text-[#F9B406] dark:hover:text-teal-400"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-amber-200 dark:bg-slate-800 mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#2d409c] dark:text-slate-400">
              © 2026 MedSankalp · All rights reserved
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2d409c] dark:text-slate-500 hover:text-[#F9B406] dark:hover:text-teal-400 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;