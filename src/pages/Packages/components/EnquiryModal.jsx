import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const SUPPORT_EMAIL = 'support@medsankalp.com'; // 🔁 replace with real email

const EnquiryModal = ({ pkg, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    const subject = encodeURIComponent(`Enquiry: ${pkg.name} — MedSankalp`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.message || `I am interested in the ${pkg.name} program (${pkg.price} + GST).`}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    onClose();
  };

  const valid = form.name.trim() && form.phone.trim() && form.email.trim();

  const input = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
    bg-slate-50 dark:bg-white/5
    border-slate-200 dark:border-white/10
    text-slate-900 dark:text-white
    placeholder-slate-400 dark:placeholder-white/20
    focus:border-amber-400 dark:focus:border-[#F9B406]/60`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border shadow-xl transition-colors
        bg-white dark:bg-slate-900
        border-slate-200 dark:border-[#2C2E69]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-white/10">
          <div>
            <p className="text-xs font-medium text-[#F9B406] mb-1">{pkg.tag}</p>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{pkg.name}</h2>
            <p className="text-sm text-slate-500 dark:text-white/40 mt-0.5">
              {pkg.price} <span className="text-xs">+ GST</span>
            </p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg transition-colors
              text-slate-400 dark:text-white/30
              hover:text-slate-700 dark:hover:text-white
              hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-3">
          <input className={input} placeholder="Full Name *"
            value={form.name} onChange={set('name')} />
          <input className={input} placeholder="Phone Number *" type="tel"
            value={form.phone} onChange={set('phone')} />
          <input className={input} placeholder="Email Address *" type="email"
            value={form.email} onChange={set('email')} />
          <textarea className={`${input} resize-none`} rows={3}
            placeholder="Message (optional)"
            value={form.message} onChange={set('message')} />

          <button onClick={handleSubmit} disabled={!valid}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors mt-1
              bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69]
              disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
            Send Enquiry
          </button>

          <p className="text-center text-xs text-slate-400 dark:text-white/20">
            We'll get back to you within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;