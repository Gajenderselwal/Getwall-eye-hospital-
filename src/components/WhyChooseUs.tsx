import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, MapPin, Sparkles, HeartHandshake } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      title: 'Evidence-Based Ophthalmic Care',
      desc: 'All evaluations adhere strictly to recognized ophthalmic diagnostic guidelines and clinical standards.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-teal-600" />,
      title: 'Modern Diagnostic Instruments',
      desc: 'Computerized automated refraction, Goldmann applanation tonometry, and precision slit-lamp biomicroscopy.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-sky-600" />,
      title: 'Accessible Patel Nagar Location',
      desc: 'Conveniently located on New Shivbari Road (near S.K. Medicose) with straightforward parking and road access.',
    },
    {
      icon: <Clock className="w-6 h-6 text-teal-600" />,
      title: 'Reliable Appointment Scheduling',
      desc: 'Dedicated slots Monday through Saturday to reduce patient waiting times and prioritize comfort.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-sky-600" />,
      title: 'Ethical & Transparent Consultation',
      desc: 'No inflated claims or pressured procedures. We explain diagnoses clearly and present verified care options.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-teal-600" />,
      title: 'Sanitized Clinical Environment',
      desc: 'Strict hygiene routines and sanitized chin rests, headbands, and instruments before every examination.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Commitment to Trustworthy Patient Care
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Grounded in verifiable medical ethics, professional care, and thorough eye examinations.
          </p>
        </div>

        {/* 6 Grid points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-4">
                {pt.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{pt.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
