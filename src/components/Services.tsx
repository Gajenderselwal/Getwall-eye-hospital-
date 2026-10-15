import React from 'react';
import { Eye, Sparkles, Activity, ShieldCheck, Glasses, HeartPulse, ArrowRight } from 'lucide-react';
import { EyeService } from '../types.ts';

interface ServicesProps {
  services: EyeService[];
  onSelectService: (serviceTitle: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Eye: <Eye className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Glasses: <Glasses className="w-6 h-6" />,
  HeartPulse: <HeartPulse className="w-6 h-6" />,
};

export const Services: React.FC<ServicesProps> = ({ services, onSelectService }) => {
  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Eye className="w-3.5 h-3.5" />
            Clinical Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Eye Care & Diagnostic Evaluations
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            All clinical evaluations are conducted using calibrated diagnostic equipment. We prioritize early detection and accurate diagnosis.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const iconElement = ICON_MAP[service.icon] || <Eye className="w-6 h-6" />;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="w-13 h-13 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center transition-colors mb-5 shadow-2xs">
                    {iconElement}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                    Verified Service
                  </span>
                  <button
                    onClick={() => onSelectService(service.title)}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-800 cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Request Visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical disclaimer note */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-2xl mx-auto">
          Notice: Service availability is subject to clinical assessment and appointment scheduling. Detailed treatment options and evaluations are determined after in-person doctor consultation.
        </div>

      </div>
    </section>
  );
};
