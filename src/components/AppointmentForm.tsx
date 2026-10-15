import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Phone,
  User,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  getTodayKolkataString,
  isDateSunday,
  validateAppointmentForm,
  validateIndianPhone,
  SUNDAY_ERROR_MESSAGE,
} from '../utils/appointmentValidation.ts';

interface AppointmentFormProps {
  prefilledReason?: string;
  onSuccess?: () => void;
  onOpenPrivacyModal: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  prefilledReason = '',
  onOpenPrivacyModal,
}) => {
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
    id: string;
    patientName: string;
    requestedDate: string;
    status: string;
  } | null>(null);

  // Today in Asia/Kolkata for min date restriction
  const minDate = getTodayKolkataString();

  // Update visit reason if selected from service card
  useEffect(() => {
    if (prefilledReason) {
      setVisitReason(`Enquiry for: ${prefilledReason}`);
    }
  }, [prefilledReason]);

  // Real-time date change handler with instant Sunday check
  const handleDateChange = (val: string) => {
    setRequestedDate(val);
    setServerError(null);

    if (!val) {
      setFieldErrors((prev) => ({ ...prev, requestedDate: 'Please select an appointment date.' }));
      return;
    }

    if (val < minDate) {
      setFieldErrors((prev) => ({ ...prev, requestedDate: 'Appointment date cannot be in the past.' }));
      return;
    }

    if (isDateSunday(val)) {
      setFieldErrors((prev) => ({
        ...prev,
        requestedDate: SUNDAY_ERROR_MESSAGE,
      }));
      return;
    }

    // Clear date error if valid
    setFieldErrors((prev) => {
      const rest = { ...prev };
      delete rest.requestedDate;
      return rest;
    });
  };

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    if (fieldErrors.phoneNumber) {
      const phoneCheck = validateIndianPhone(val);
      if (phoneCheck.isValid) {
        setFieldErrors((prev) => {
          const rest = { ...prev };
          delete rest.phoneNumber;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate using pure testable logic
    const validation = validateAppointmentForm({
      patientName,
      phoneNumber,
      requestedDate,
      visitReason,
      consentGiven,
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          phoneNumber: phoneNumber.trim(),
          requestedDate: requestedDate.trim(),
          visitReason: visitReason.trim(),
          consentGiven,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      setBookingSuccess(data.appointment);
    } catch (err: any) {
      console.error('Appointment booking error:', err);
      setServerError(err.message || 'Network error. Please try again or call the hospital directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPatientName('');
    setPhoneNumber('');
    setRequestedDate('');
    setVisitReason('');
    setConsentGiven(false);
    setFieldErrors({});
    setServerError(null);
    setBookingSuccess(null);
  };

  return (
    <section id="appointment" className="py-16 sm:py-20 bg-gradient-to-b from-white via-sky-50/40 to-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <CalendarIcon className="w-3.5 h-3.5" />
            Patient Appointments
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Request an Eye Care Consultation
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Submit your consultation request online. Our reception team will review slot availability and contact you with confirmation.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden">
          
          {/* Top Notice Banner: Hospital Working Days & Hours */}
          <div className="bg-sky-50/80 border-b border-sky-100 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-900">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Consultations: <strong>Monday to Saturday</strong> (9:00 AM – 7:00 PM)</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Closed on Sundays (Appointments unavailable)</span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {bookingSuccess ? (
              /* Success State */
              <div className="text-center py-8 space-y-6 max-w-xl mx-auto animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Appointment Request Received
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Your appointment request has been submitted successfully. Please wait for confirmation from the hospital.
                  </p>
                </div>

                {/* Details summary card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Request Reference ID:</span>
                    <span className="font-mono font-bold text-sky-700">{bookingSuccess.id}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Patient Name:</span>
                    <span className="font-bold text-slate-800">{bookingSuccess.patientName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Requested Date:</span>
                    <span className="font-bold text-slate-800">{bookingSuccess.requestedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Initial Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {bookingSuccess.status} (Awaiting clinic confirmation)
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed">
                  Our reception desk will contact you via phone or SMS to finalize the exact appointment slot and provide preparation guidance (e.g., prior dilation precautions if applicable).
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm cursor-pointer"
                  >
                    <span>Book Another Appointment</span>
                  </button>
                  <a
                    href="tel:+917023451759"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 font-semibold text-sm shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Reception</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
                
                {serverError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="font-medium">{serverError}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Field 1: Patient Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="patientName" className="block text-sm font-semibold text-slate-800">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="patientName"
                        name="patientName"
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => {
                          setPatientName(e.target.value);
                          if (fieldErrors.patientName) {
                            setFieldErrors((p) => {
                              const r = { ...p };
                              delete r.patientName;
                              return r;
                            });
                          }
                        }}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-hidden focus:ring-2 ${
                          fieldErrors.patientName
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-sky-600 focus:ring-sky-100'
                        }`}
                      />
                    </div>
                    {fieldErrors.patientName && (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{fieldErrors.patientName}</span>
                      </p>
                    )}
                  </div>

                  {/* Field 2: Contact Number (Indian Mobile) */}
                  <div className="space-y-1.5">
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-800">
                      Contact Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="10-digit number (e.g. 9829012345)"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-hidden focus:ring-2 ${
                          fieldErrors.phoneNumber
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-sky-600 focus:ring-sky-100'
                        }`}
                      />
                    </div>
                    {fieldErrors.phoneNumber ? (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{fieldErrors.phoneNumber}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Indian 10-digit mobile number for appointment SMS / call confirmation.
                      </p>
                    )}
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Field 3: Preferred Appointment Date (Calendar Picker with Sunday Rejection) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="requestedDate" className="block text-sm font-semibold text-slate-800">
                        Preferred Appointment Date <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        Sundays Closed
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <input
                        id="requestedDate"
                        name="requestedDate"
                        type="date"
                        min={minDate}
                        required
                        value={requestedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 text-sm transition-all focus:outline-hidden focus:ring-2 ${
                          fieldErrors.requestedDate
                            ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-sky-600 focus:ring-sky-100'
                        }`}
                      />
                    </div>

                    {/* Specific Sunday or Past Date Error */}
                    {fieldErrors.requestedDate ? (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{fieldErrors.requestedDate}</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Select any upcoming Monday to Saturday. Sundays are non-working days.
                      </p>
                    )}
                  </div>

                  {/* Field 4: Optional Reason for Visit */}
                  <div className="space-y-1.5">
                    <label htmlFor="visitReason" className="block text-sm font-semibold text-slate-800">
                      Reason for Visit <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <textarea
                        id="visitReason"
                        name="visitReason"
                        rows={2}
                        maxLength={300}
                        value={visitReason}
                        onChange={(e) => setVisitReason(e.target.value)}
                        placeholder="e.g., Cataract check, blurry vision, headache, eye pain..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-hidden"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Brief symptoms or service interest</span>
                      <span>{visitReason.length}/300</span>
                    </div>
                  </div>

                </div>

                {/* Patient Privacy Notice & Consent Checkbox */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Patient Privacy Protection:</strong> Your personal contact information is stored strictly for appointment scheduling and clinical communication by GetWell Eye Hospital. We never sell, share, or display patient records publicly.{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacyModal}
                        className="text-sky-600 hover:text-sky-800 underline font-medium cursor-pointer"
                      >
                        Read Privacy Policy
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="consentGiven"
                      name="consentGiven"
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => {
                        setConsentGiven(e.target.checked);
                        if (fieldErrors.consentGiven && e.target.checked) {
                          setFieldErrors((p) => {
                            const r = { ...p };
                            delete r.consentGiven;
                            return r;
                          });
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <label htmlFor="consentGiven" className="text-xs text-slate-700 cursor-pointer select-none">
                      I agree to the privacy notice and consent to GetWell Eye Hospital contacting me at this phone number to schedule or confirm this consultation request. <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  {fieldErrors.consentGiven && (
                    <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{fieldErrors.consentGiven}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold text-base transition-all shadow-lg shadow-sky-600/30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-5 h-5" />
                        <span>Book Appointment</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    * Bookings are treated as appointment requests until confirmed by hospital staff.
                  </p>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
