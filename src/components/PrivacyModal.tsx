import React from 'react';
import { X, ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 id="privacy-policy-title" className="text-lg font-bold text-slate-900">
                Patient Privacy & Data Protection Policy
              </h3>
              <p className="text-xs text-slate-500">GetWell Eye Hospital, Bikaner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close privacy policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-600" />
              1. Information We Collect
            </h4>
            <p className="mt-1.5">
              To schedule clinical appointments, GetWell Eye Hospital collects strictly necessary information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 font-medium text-xs sm:text-sm">
              <li>Patient Full Name</li>
              <li>Valid Contact Mobile Number</li>
              <li>Requested Consultation Date</li>
              <li>Optional high-level visit reason (e.g., vision checkup, cataract evaluation)</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              We purposefully do not collect sensitive clinical records, financial records, or comprehensive medical history online prior to in-person consultation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-600" />
              2. How Your Information Is Used
            </h4>
            <p className="mt-1.5">
              Your details are used solely to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 font-medium text-xs sm:text-sm">
              <li>Coordinate appointment availability and schedule consultations with our doctor.</li>
              <li>Contact you via phone or SMS regarding appointment confirmation or clinic schedule adjustments.</li>
              <li>Verify patient identity upon arrival at the hospital reception.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              3. Strict Confidentiality & Security
            </h4>
            <p className="mt-1.5">
              <strong>Public visitors can never access or view other patients’ appointment records.</strong> All patient submissions are stored in an access-controlled, persistent database protected by server-side authorization and cryptographic authentication tokens. No patient information is ever placed into public search indexes, advertising networks, or third-party marketing services.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              4. Patient Rights & Contact
            </h4>
            <p className="mt-1.5">
              You retain the right to request modification or deletion of your contact information from our scheduling logs by presenting your appointment reference ID in person at our reception desk on New Shivbari Road, Patel Nagar, Bikaner, or by calling our verified hospital helpline: <strong>+91 70234 51759</strong>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm cursor-pointer shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
