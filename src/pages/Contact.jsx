/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

const INFO = [
  { icon: MapPin, label: 'Address', lines: ['To be Updated'] },
  { icon: Phone,  label: 'Phone',   lines: ['+91***********'] },
  { icon: Mail,   label: 'Email',   lines: ['socialdrive@gmail.com'] },
  { icon: Clock,  label: 'Hours',   lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM', 'Sunday: Closed'] },
];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#F9B406]/70 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-[#2C2E69]/40 border border-[#2C2E69] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#F9B406]/60 focus:ring-1 focus:ring-[#F9B406]/20 transition-colors';

const Contact = () => {
  const [formData,  setFormData]  = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <div className="relative border-b border-[#2C2E69]/60 bg-[#2C2E69]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Get in <span className="text-[#F9B406]">Touch</span>
          </h1>
          <p className="text-white/50 text-base">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Info panel */}
        <aside className="md:col-span-2 space-y-3">
          {INFO.map(({icon: Icon, label, lines }) => (
            <div key={label}
              className="flex gap-4 p-4 rounded-2xl bg-[#2C2E69]/30 border border-[#2C2E69] hover:border-[#F9B406]/30 transition-colors"
            >
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#F9B406]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-1">{label}</p>
                {lines.map(line => (
                  <p key={line} className="text-sm text-white/70">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Form */}
        <div className="md:col-span-3 bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl p-7">
          <h2 className="text-sm font-semibold text-white mb-6">Send us a message</h2>

          {submitted && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 text-[#F9B406] text-sm mb-6">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Message sent! We'll get back to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name">
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  required placeholder="Your name" className={inputClass} />
              </Field>
              <Field label="Email">
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  required placeholder="you@email.com" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone (optional)">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+1 (800) 123-4567" className={inputClass} />
              </Field>
              <Field label="Subject">
                <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                  required placeholder="How can we help?" className={inputClass} />
              </Field>
            </div>

            <Field label="Message">
              <textarea name="message" value={formData.message} onChange={handleChange}
                required rows={5} placeholder="Tell us more…"
                className={`${inputClass} resize-none`} />
            </Field>

            <button type="submit" disabled={sending}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F9B406] hover:bg-[#F9B406]/90 text-[#2C2E69] text-sm font-semibold disabled:opacity-60 transition-colors"
            >
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