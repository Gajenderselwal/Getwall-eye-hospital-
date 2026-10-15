import React from 'react';
import { Building2, Award, HeartPulse, CheckCircle, MapPin, Eye, Stethoscope } from 'lucide-react';
import { HospitalInfo } from '../types.ts';

interface AboutProps {
  hospitalInfo: HospitalInfo;
}

export const About: React.FC<AboutProps> = ({ hospitalInfo }) => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            About Our Hospital
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Committed to Clearer, Healthier Vision in Bikaner
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Located in Patel Nagar, <strong>GetWell Eye Hospital</strong> provides accessible, ethical, and modern ophthalmic care for patients from Bikaner and surrounding districts of Rajasthan.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Images Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md bg-slate-100 h-48 sm:h-56">
                <img
                  src="/src/assets/images/waiting_lounge_1792061097553.jpg"
                  alt="GetWell Eye Hospital Bikaner reception corridor and patient waiting seating"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-left">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Prime Bikaner Location</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Easily accessible on New Shivbari Road, near S.K. Medicose, Patel Nagar.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-left">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                  <Eye className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Modern Diagnostics</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Slit-lamp examination, automated refraction, and glaucoma pressure checks.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md bg-slate-100 h-48 sm:h-56">
                <img
                  src="/src/assets/images/refraction_room_1792061055981.jpg"
                  alt="Computerized automated refraction testing suite at GetWell Eye Hospital"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h3 className="text-2xl font-bold text-slate-900 leading-snug">
              Patient-Centric Eye Care Grounded in Clinical Excellence
            </h3>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              At GetWell Eye Hospital, every patient receives unhurried, thorough examinations. We recognize that sight is our most precious sense; our clinical team focuses on early diagnosis, preventative counseling, and tailored treatment plans for every stage of life.
            </p>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              From senior citizens seeking cataract assessments to children needing refractive correction or working professionals suffering from digital eye strain, our facility is equipped with certified ophthalmic diagnostic tools to ensure accurate evaluations.
            </p>

            {/* Core Values List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-sky-100 text-sky-700 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Accurate Ophthalmic Diagnostics</h4>
                  <p className="text-xs text-slate-500">Computerized refraction, corneal curvature assessment, and optic nerve examination.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-sky-100 text-sky-700 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Ethical & Transparent Advice</h4>
                  <p className="text-xs text-slate-500">Zero unnecessary procedures. We provide honest clinical explanations and transparent recommendations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-sky-100 text-sky-700 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Hygienic & Patient-Friendly Premises</h4>
                  <p className="text-xs text-slate-500">Clean waiting spaces, sanitized instrumentation before every patient, and friendly staff.</p>
                </div>
              </div>
            </div>

            {/* Verified Location Box */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                <strong className="text-slate-700">Official Hospital Address:</strong> {hospitalInfo.address}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
