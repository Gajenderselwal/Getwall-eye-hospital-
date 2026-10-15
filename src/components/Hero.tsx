import React from 'react';
import { Calendar, Phone, Navigation, ShieldCheck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { HospitalInfo } from '../types.ts';

interface HeroProps {
  hospitalInfo: HospitalInfo;
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ hospitalInfo, onBookClick }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Supporting Text, and Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Location Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs sm:text-sm font-semibold tracking-wide">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Patel Nagar, Bikaner (New Shivbari Road)</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Expert Eye Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700">
                Closer to You
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Welcome to <strong>GetWell Eye Hospital</strong> in Bikaner. We deliver patient-focused,
              evidence-based ophthalmic care ranging from comprehensive vision evaluations and cataract assessments
              to glaucoma screening and retinal checkups with modern diagnostics.
            </p>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Verified Specialist Care</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Modern Eye Diagnostics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Ethical & Transparent</span>
              </div>
            </div>

            {/* Action Buttons: Book Appointment, Call Now, Get Directions */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onBookClick}
                type="button"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base transition-all shadow-lg shadow-sky-600/30 hover:shadow-sky-600/40 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>

              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-sky-600/30 text-sky-800 bg-white hover:bg-sky-50 font-semibold text-base transition-all shadow-xs"
              >
                <Phone className="w-5 h-5 text-sky-600" />
                <span>Call Now</span>
              </a>

              <a
                href={hospitalInfo.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 font-semibold text-base transition-all shadow-xs"
              >
                <Navigation className="w-5 h-5 text-teal-600" />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Quick operational notice */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>OPD Consultations: Monday – Saturday (9:00 AM – 7:00 PM) | Closed on Sundays</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="/src/assets/images/hospital_exterior_1792061017657.jpg"
                  alt="GetWell Eye Hospital and Optical storefront on New Shivbari Road near S.K. Medicose in Patel Nagar, Bikaner"
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Overlaid Hospital Identity Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/90 text-white text-xs font-bold uppercase tracking-wider mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Facility
                  </div>
                  <h3 className="text-lg font-bold">GetWell Eye Hospital</h3>
                  <p className="text-xs text-slate-200 line-clamp-1">
                    New Shivbari Road, near S.K. Medicose, Patel Nagar, Bikaner
                  </p>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-xl p-4 shadow-xl border border-sky-100 flex items-center gap-3.5 max-w-[260px] text-left">
                <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Patient-First Care</div>
                  <div className="text-xs text-slate-500">Dedicated eye hospital serving Bikaner district</div>
                </div>
              </div>

              {/* Floating Sunday Closed notice pill */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Mon–Sat Open</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
