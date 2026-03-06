import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

const INFO = [
  { icon: MapPin, label: 'Address', lines: ['To be Updated'] },
  { icon: Phone,  label: 'Phone',   lines: ['+91***********'] },
  { icon: Mail,   label: 'Email',   lines: ['socialdrive@gmail.com'] },
  { icon: Clock,  label: 'Hours',   lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM', 'Sunday: Closed'] },
];

const Field = ({ label, children, isDark }) => (
  <div>
    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-[#F9B406]/70' : 'text-amber-800/70'}`}>
      {label}
    </label>
    {children}
  </div>
);

const Contact = () => {
  const { theme }  = useThemeStore();
  const isDark     = theme === 'dark';

  const [formData,  setFormData]  = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);

  const inputClass = isDark
    ? 'w-full px-4 py-2.5 rounded-xl bg-[#2C2E69]/40 border border-[#2C2E69] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#F9B406]/60 focus:ring-1 focus:ring-[#F9B406]/20 transition-colors'
    : 'w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors shadow-sm';

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    console.log('Form submitted:', formData);
    setFormData(INITIAL);
    setSending(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* Hero */}
      <div className={`relative border-b ${isDark ? 'border-[#2C2E69]/60 bg-[#2C2E69]/20' : 'border-amber-200 bg-amber-50'}`}>
        <div className={`absolute inset-0 ${isDark
          ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]'
          : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)]'
        }`} />
        <div className="relative max-w-5xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Get in <span className="text-[#F9B406]">Touch</span>
          </h1>
          <p className={`text-base ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            We're here to help. Reach out anytime.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Info panel */}
        <aside className="md:col-span-2 space-y-3">
          {INFO.map(({ icon: Icon, label, lines }) => (
            <div key={label}
              className={`flex gap-4 p-4 rounded-2xl border transition-colors ${
                isDark
                  ? 'bg-[#2C2E69]/30 border-[#2C2E69] hover:border-[#F9B406]/30'
                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
              }`}>
              <div className={`w-8 h-8 shrink-0 rounded-lg border flex items-center justify-center ${
                isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'
              }`}>
                <Icon className="w-4 h-4 text-[#F9B406]" />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  {label}
                </p>
                {lines.map(line => (
                  <p key={line} className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-700'}`}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Form */}
        <div className={`md:col-span-3 rounded-2xl border p-7 ${
          isDark ? 'bg-[#2C2E69]/30 border-[#2C2E69]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Send us a message
          </h2>

          {submitted && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 text-[#F9B406] text-sm mb-6">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Message sent! We'll get back to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name" isDark={isDark}>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  required placeholder="Your name" className={inputClass} />
              </Field>
              <Field label="Email" isDark={isDark}>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  required placeholder="you@email.com" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone (optional)" isDark={isDark}>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className={inputClass} />
              </Field>
              <Field label="Subject" isDark={isDark}>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                  required placeholder="How can we help?" className={inputClass} />
              </Field>
            </div>

            <Field label="Message" isDark={isDark}>
              <textarea name="message" value={formData.message} onChange={handleChange}
                required rows={5} placeholder="Tell us more…"
                className={`${inputClass} resize-none`} />
            </Field>

            <button type="submit" disabled={sending}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] text-sm font-semibold disabled:opacity-60 transition-colors">
              {sending
                ? <><span className="w-4 h-4 border-2 border-[#2C2E69]/30 border-t-[#2C2E69] rounded-full animate-spin" /> Sending…</>
                : <><Send className="w-4 h-4" /> Send Message</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;