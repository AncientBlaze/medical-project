import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

const INFO = [
  { icon: MapPin, label: 'Address', lines: ['241, GT Road, Mahesh, Serampore, Hooghly, West Bengal, 712202'] },
  { icon: Phone, label: 'Phone', lines: ['+919477346186'] },
  { icon: Mail, label: 'Email', lines: ['support@medsankalp.com'] },
  { icon: Clock, label: 'Hours', lines: ['Mon – Fri: 11:00 AM – 08:00 PM', 'Saturday-Sunday: Appointments Only'] },
];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-[#2d409c] dark:text-white/50">
      {label}
    </label>
    {children}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const inputClass = 'w-full px-4 py-2.5 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors shadow-sm dark:shadow-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#2d409c] dark:text-white focus:border-[#F9B406] dark:focus:border-teal-500 focus:ring-[#F9B406]/20 dark:focus:ring-teal-500/20';

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = `Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message}`;

    const gmailUrl = 'https://mail.google.com/mail/?view=cm'
      + '&to=' + encodeURIComponent('support@medsankalp.com')
      + '&su=' + encodeURIComponent('Contact Form: ' + formData.subject)
      + '&body=' + encodeURIComponent(body);

    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-[#2d409c] dark:text-white">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Get in <span className="text-[#F9B406] dark:text-teal-400">Touch</span>
          </h1>
          <p className="text-base text-[#2d409c] dark:text-slate-400">
            We're here to help. Reach out anytime.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Info panel */}
        <aside className="md:col-span-2 space-y-3">
          {INFO.map(({ icon: Icon, label, lines }) => (
            <div key={label}
              className="flex gap-4 p-4 rounded-2xl border transition-colors bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none">
              <div className="w-8 h-8 shrink-0 rounded-lg border flex items-center justify-center bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
                <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400 dark:text-white/30">
                  {label}
                </p>
                {lines.map(line => (
                  <p key={line} className="text-sm text-slate-700 dark:text-white/70">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Form */}
        <div className="md:col-span-3 rounded-2xl border p-7 bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
          <h2 className="text-sm font-semibold mb-6 text-[#2d409c] dark:text-white">
            Send us a message
          </h2>

          {submitted && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm mb-6 bg-[#F9B406]/10 dark:bg-teal-500/10 border-[#F9B406]/20 dark:border-teal-500/20 text-[#F9B406] dark:text-teal-400">
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
              <Field label="Phone">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className={inputClass} />
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
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950">
              {sending
                ? <><span className="w-4 h-4 border-2 rounded-full animate-spin border-slate-900/30 dark:border-slate-950/30 border-t-slate-900 dark:border-t-slate-950" /> Sending…</>
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