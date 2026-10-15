import React from 'react';
import { Stethoscope, Award, GraduationCap, Calendar, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { DoctorProfile as DoctorProfileType } from '../types.ts';

interface DoctorProfileProps {
  doctor: DoctorProfileType;
  onBookClick: () => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, onBookClick }) => {
  return (
    <section id="doctor" className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            Medical Specialist
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consult With Our Senior Eye Specialist
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Comprehensive ophthalmic examinations guided by clinical precision and patient care.
          </p>
        </div>

        {/* Doctor Card */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-sky-50/30 to-teal-50/20 rounded-3xl border border-sky-100/80 shadow-lg p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Doctor Photo */}
            <div className="md:col-span-5 text-center">
              <div className="relative inline-block mx-auto">
                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 mx-auto">
                  <img
                    src={doctor.image}
                    alt={`${doctor.name} - Ophthalmologist at GetWell Eye Hospital Bikaner`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Clinical Lead</span>
                </div>
              </div>
            </div>

            {/* Doctor Info Details */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  {doctor.title}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {doctor.name}
                </h3>
              </div>

              {/* Qualifications & Experience */}
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-sky-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{doctor.qualifications}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{doctor.experience}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>OPD Consultation Hours: Mon – Sat (9:00 AM – 7:00 PM)</span>
                </div>
              </div>

              {/* Biography / Focus */}
              <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {doctor.bio}
              </p>

              {/* Book Button */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onBookClick}
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all shadow-md shadow-sky-600/25 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Prior appointment requested to minimize waiting time</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                * Doctor profile and credentials can be verified or updated anytime by clinic administrators in the secure dashboard.
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
