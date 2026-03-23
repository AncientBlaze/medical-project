import { ShieldCheck, Users, Microscope, HeartPulse, Clock, Lightbulb } from 'lucide-react';

const WHY_ITEMS = [
  { icon: ShieldCheck, text: 'Verified and accredited hospitals and medical colleges' },
  { icon: Users,       text: 'Expert medical professionals and specialists' },
  { icon: Microscope,  text: 'State-of-the-art facilities and technology' },
  { icon: HeartPulse,  text: 'Affordable healthcare solutions' },
  { icon: Clock,       text: '24/7 customer support and assistance' },
];

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl p-8 border transition-colors bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-slate-700 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
      <Icon className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
    </div>
    <h2 className="text-lg font-semibold text-[#2d409c] dark:text-white">{title}</h2>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fffdf7] dark:bg-slate-950 text-[#2d409c] dark:text-white">

      {/* Hero */}
      <div className="relative border-b border-amber-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-14 text-center flex flex-col justify-center items-center gap-5">
          <h1 className="text-4xl font-bold tracking-tight">
            About <span className="text-[#F9B406] dark:text-teal-400">Us</span>
          </h1>
          <p className="text-base max-w-md mx-auto text-[#2d409c] dark:text-slate-400">
            Connecting aspiring medical students with the right institutions through data and transparency.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">

        {/* Mission */}
        <Card>
          <CardHeader icon={HeartPulse} title="Our Mission" />
          <p className="leading-relaxed text-[#2d409c] dark:text-slate-400">
            MedSankalp is dedicated to connecting aspiring medical students with the finest
            institutions and healthcare programs. We believe in making quality medical education
            accessible and transparent for everyone — from MBBS to nursing and beyond.
          </p>
        </Card>

        {/* Why choose us */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
              <ShieldCheck className="w-4 h-4 text-[#F9B406] dark:text-teal-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#2d409c] dark:text-white">Why Choose Us?</h2>
          </div>
          <div className="space-y-4">
            {WHY_ITEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4 p-4 rounded-xl border transition-colors bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700">
                <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 bg-amber-50 dark:bg-teal-500/10 border-amber-200 dark:border-teal-500/20">
                  <Icon className="w-3.5 h-3.5 text-[#F9B406] dark:text-teal-400" />
                </div>
                <span className="text-sm leading-relaxed text-[#2d409c] dark:text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Vision */}
        <Card>
          <CardHeader icon={Lightbulb} title="Our Vision" />
          <p className="leading-relaxed text-[#2d409c] dark:text-slate-400">
            To create a world where every NEET aspirant can make an informed decision about
            their medical education. We strive to bridge the gap between students and institutions
            through AI-driven predictions, live cutoff data, and complete transparency.
          </p>
        </Card>

      </div>
    </div>
  );
};

export default About;