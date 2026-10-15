import React from 'react';
import { Eye, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { HospitalInfo } from '../types.ts';

interface FooterProps {
  hospitalInfo: HospitalInfo;
  onBookClick: () => void;
  onOpenPrivacyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  hospitalInfo,
  onBookClick,
  onOpenPrivacyModal,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Identity (lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">GetWell Eye Hospital</h3>
                <p className="text-xs text-sky-400 font-medium">Bikaner, Rajasthan</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Providing professional, trustworthy ophthalmic evaluations, cataract screenings, and preventative eye care to the community of Bikaner and Western Rajasthan.
            </p>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Registered Healthcare Facility • Strict Patient Confidentiality</span>
            </div>
          </div>

          {/* Col 2: Quick Links (lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About the Hospital</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Eye Care Services</a>
              </li>
              <li>
                <a href="#doctor" className="hover:text-white transition-colors">Doctor Profile</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">Hospital Gallery</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Location & Contact</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onBookClick}
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Working Hours (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Verified Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{hospitalInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`} className="text-slate-200 hover:text-white font-medium">
                  {hospitalInfo.phone}
                </a>
              </div>
              {hospitalInfo.secondaryPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Landline: {hospitalInfo.secondaryPhone}</span>
                </div>
              )}
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-300 font-medium">Mon – Sat: 9:00 AM – 7:00 PM</div>
                  <div className="text-amber-400 font-medium">Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} GetWell Eye Hospital. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacyModal}
              type="button"
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              Privacy Policy & Patient Rights
            </button>
            <span>•</span>
            <a
              href={hospitalInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Google Maps Listing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
