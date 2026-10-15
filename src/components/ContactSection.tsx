import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Navigation,
  ExternalLink,
  MessageCircle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { HospitalInfo } from '../types.ts';

interface ContactSectionProps {
  hospitalInfo: HospitalInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ hospitalInfo }) => {
  const whatsappUrl = `https://wa.me/${hospitalInfo.whatsappNumber.replace(/[\s\+]/g, '')}?text=${encodeURIComponent(
    'Hello, I would like to enquire about an appointment at GetWell Eye Hospital.'
  )}`;

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Location & Contact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit GetWell Eye Hospital in Bikaner
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Conveniently situated in Patel Nagar on New Shivbari Road. Contact our front desk or navigate directly using Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards, Phones & Actions */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hospital Address</h3>
                  <span className="text-xs font-medium text-teal-700">Patel Nagar, Bikaner</span>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {hospitalInfo.address}
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={hospitalInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-sky-700 hover:border-sky-300 text-xs font-semibold shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>View on Google Maps</span>
                </a>
                <a
                  href={hospitalInfo.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Click-to-Call Primary & Secondary Numbers */}
            <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Click to Call Front Desk</h3>
                  <span className="text-xs text-slate-500">Opens native phone dialer</span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-sky-200 text-sky-900 hover:bg-sky-100/50 hover:border-sky-300 transition-colors shadow-2xs group"
                >
                  <div>
                    <span className="text-xs text-slate-400 block">Primary Helpline</span>
                    <span className="text-base font-bold text-slate-900 group-hover:text-sky-700">
                      {hospitalInfo.phone}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-600 text-white">
                    Call Now
                  </span>
                </a>

                {hospitalInfo.secondaryPhone && (
                  <a
                    href={`tel:${hospitalInfo.secondaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:bg-white transition-colors text-xs"
                  >
                    <div>
                      <span className="text-slate-400 block text-[11px]">Secondary Landline</span>
                      <span className="font-semibold text-slate-800">{hospitalInfo.secondaryPhone}</span>
                    </div>
                    <span className="font-medium text-sky-600 hover:underline">Dial</span>
                  </a>
                )}
              </div>

              {/* WhatsApp Enquiry Button */}
              {hospitalInfo.whatsappNumber && (
                <div className="pt-2 border-t border-sky-100">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                  <p className="text-[11px] text-slate-400 text-center mt-1">
                    Direct enquiry with pre-filled message (No patient data sent without consent)
                  </p>
                </div>
              )}
            </div>

            {/* Timings Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Operating Timings</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Monday – Saturday</span>
                <span className="font-semibold text-slate-900">9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-1 text-amber-700 font-semibold bg-amber-50 px-2 rounded-md">
                <span>Sunday</span>
                <span>Closed (No Consultations)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Showcase Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 text-left">
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Hospital Location Map</h3>
                  <p className="text-xs text-slate-500">Patel Nagar, New Shivbari Road, Bikaner 334003</p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Destination Pin</span>
                </div>
              </div>

              {/* Google Maps Visual Preview Container */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-300/80 shadow-md h-[340px] sm:h-[400px] bg-slate-200">
                <iframe
                  title="GetWell Eye Hospital Bikaner Google Maps View"
                  src="https://maps.google.com/maps?q=GetWell+Eye+Hospital,+New+Shivbari+Road,+near+S.K.+Medicose,+Patel+Nagar,+Bikaner,+Rajasthan+334003&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Overlaid Floating Quick Navigation Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-200 text-left">
                  <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
                    Google Maps Reference
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    GetWell Eye Hospital, Bikaner
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    Near S.K. Medicose, Patel Nagar
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={hospitalInfo.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Start Navigation</span>
                    </a>
                    <a
                      href={hospitalInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      <span>Open Maps App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Landmark directions help */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Landmarks & Accessibility:</div>
                <p>
                  Located along <strong>New Shivbari Road</strong> in Patel Nagar, adjacent to <strong>S.K. Medicose</strong>. Readily reachable by auto-rickshaws, private vehicles, and city buses connecting Shivbari and central Bikaner.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
