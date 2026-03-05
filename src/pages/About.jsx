/* eslint-disable no-unused-vars */
import { GraduationCap, ShieldCheck, Users, Microscope, HeartPulse, Clock, Lightbulb } from 'lucide-react';

const WHY_ITEMS = [
  { icon: ShieldCheck, text: 'Verified and accredited hospitals and medical colleges' },
  { icon: Users, text: 'Expert medical professionals and specialists' },
  { icon: Microscope, text: 'State-of-the-art facilities and technology' },
  { icon: HeartPulse, text: 'Affordable healthcare solutions' },
  { icon: Clock, text: '24/7 customer support and assistance' },
];

const About = () => (
  <div className="min-h-screen bg-slate-950 text-white">

    {/* Hero */}
    <div className="relative border-b border-[#2C2E69]/60 bg-[#2C2E69]/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(44,46,105,0.5),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-6 py-14 text-center flex flex-col justify-center items-center gap-5">
        <h1 className="text-4xl font-bold tracking-tight">
          About <span className="text-[#F9B406]">Us</span>
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto">
          Connecting aspiring medical students with the right institutions through data and transparency.
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">

      {/* Mission */}
      <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center shrink-0">
            <HeartPulse className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-lg font-semibold text-white">Our Mission</h2>
        </div>
        <p className="text-white/50 leading-relaxed">
          MedSankalp is dedicated to connecting aspiring medical students with the finest
          institutions and healthcare programs. We believe in making quality medical education
          accessible and transparent for everyone — from MBBS to nursing and beyond.
        </p>
      </div>

      {/* Why choose us */}
      <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-lg font-semibold text-white">Why Choose Us?</h2>
        </div>
        <div className="space-y-4">
          {WHY_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#F9B406]/20 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-[#F9B406]" />
              </div>
              <span className="text-white/60 text-sm leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vision */}
      <div className="bg-[#2C2E69]/30 border border-[#2C2E69] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#F9B406]/10 border border-[#F9B406]/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-[#F9B406]" />
          </div>
          <h2 className="text-lg font-semibold text-white">Our Vision</h2>
        </div>
        <p className="text-white/50 leading-relaxed">
          To create a world where every NEET aspirant can make an informed decision about
          their medical education. We strive to bridge the gap between students and institutions
          through AI-driven predictions, live cutoff data, and complete transparency.
        </p>
      </div>

    </div>
  </div>
);

export default About;