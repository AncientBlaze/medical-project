import { ShieldCheck, Users, Microscope, HeartPulse, Clock, Lightbulb } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const WHY_ITEMS = [
  { icon: ShieldCheck, text: 'Verified and accredited hospitals and medical colleges' },
  { icon: Users,       text: 'Expert medical professionals and specialists' },
  { icon: Microscope,  text: 'State-of-the-art facilities and technology' },
  { icon: HeartPulse,  text: 'Affordable healthcare solutions' },
  { icon: Clock,       text: '24/7 customer support and assistance' },
];

const Card = ({ children, className = '', isDark }) => (
  <div className={`rounded-2xl p-8 border transition-colors ${
    isDark ? 'bg-[#2C2E69]/30 border-[#2C2E69]' : 'bg-white border-slate-200 shadow-sm'
  } ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title, isDark }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
      isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'
    }`}>
      <Icon className="w-4 h-4 text-[#F9B406]" />
    </div>
    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
  </div>
);

const About = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* Hero */}
      <div className={`relative border-b ${isDark ? 'border-[#2C2E69]/60 bg-[#2C2E69]/20' : 'border-amber-200 bg-amber-50'}`}>
        <div className={`absolute inset-0 ${isDark
          ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]'
          : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,180,6,0.15),transparent)]'
        }`} />
        <div className="relative max-w-4xl mx-auto px-6 py-14 text-center flex flex-col justify-center items-center gap-5">
          <h1 className="text-4xl font-bold tracking-tight">
            About <span className="text-[#F9B406]">Us</span>
          </h1>
          <p className={`text-base max-w-md mx-auto ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            Connecting aspiring medical students with the right institutions through data and transparency.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">

        {/* Mission */}
        <Card isDark={isDark}>
          <CardHeader icon={HeartPulse} title="Our Mission" isDark={isDark} />
          <p className={`leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            MedSankalp is dedicated to connecting aspiring medical students with the finest
            institutions and healthcare programs. We believe in making quality medical education
            accessible and transparent for everyone — from MBBS to nursing and beyond.
          </p>
        </Card>

        {/* Why choose us */}
        <Card isDark={isDark}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'
            }`}>
              <ShieldCheck className="w-4 h-4 text-[#F9B406]" />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Why Choose Us?</h2>
          </div>
          <div className="space-y-4">
            {WHY_ITEMS.map(({ icon: Icon, text }) => (
              <div key={text} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-white/5 border-white/5 hover:border-[#F9B406]/20'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-300'
              }`}>
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                  isDark ? 'bg-[#F9B406]/10 border-[#F9B406]/20' : 'bg-amber-50 border-amber-200'
                }`}>
                  <Icon className="w-3.5 h-3.5 text-[#F9B406]" />
                </div>
                <span className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Vision */}
        <Card isDark={isDark}>
          <CardHeader icon={Lightbulb} title="Our Vision" isDark={isDark} />
          <p className={`leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
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