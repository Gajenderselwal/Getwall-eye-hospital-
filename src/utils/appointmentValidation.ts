/**
 * Pure validation utilities for GetWell Eye Hospital appointment bookings.
 * Follows Asia/Kolkata timezone rules and Indian mobile number validation.
 */

export const SUNDAY_ERROR_MESSAGE = 'Appointments cannot be booked on Sundays. Please select another date.';

/**
 * Returns the current date in Asia/Kolkata timezone as YYYY-MM-DD
 */
export function getTodayKolkataString(referenceDate?: Date): string {
  const d = referenceDate || new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d);
}

/**
 * Checks whether a given YYYY-MM-DD date is a Sunday in Asia/Kolkata timezone.
 */
export function isDateSunday(dateString: string): boolean {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  // Construct date at noon UTC to avoid edge-of-day timezone shift issues
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  const dayName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  }).format(dateObj);

  return dayName.toLowerCase() === 'sunday';
}

/**
 * Validates the requested appointment date:
 * 1. Must be a valid YYYY-MM-DD format
 * 2. Cannot be in the past (based on Asia/Kolkata)
 * 3. Sunday appointments must NOT be allowed
 */
export function validateAppointmentDate(
  dateString: string,
  referenceDate?: Date
): { isValid: boolean; error?: string } {
  if (!dateString || typeof dateString !== 'string') {
    return { isValid: false, error: 'Appointment date is required.' };
  }

  const trimmed = dateString.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return { isValid: false, error: 'Please select a valid date in YYYY-MM-DD format.' };
  }

  const todayStr = getTodayKolkataString(referenceDate);
  if (trimmed < todayStr) {
    return { isValid: false, error: 'Appointment date cannot be in the past.' };
  }

  if (isDateSunday(trimmed)) {
    return {
      isValid: false,
      error: SUNDAY_ERROR_MESSAGE,
    };
  }

  return { isValid: true };
}

/**
 * Validates Indian mobile number:
 * Accepts:
 *  - 10 digits starting with 6, 7, 8, or 9
 *  - Optional '+91' or '91' prefix
 *  - Optional leading '0'
 *  - Strips spaces and dashes
 */
export function validateIndianPhone(rawPhone: string): {
  isValid: boolean;
  cleanPhone?: string;
  error?: string;
} {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { isValid: false, error: 'Contact number is required.' };
  }

  // Strip spaces, dashes, parentheses
  let digits = rawPhone.replace(/[\s\-\(\)]/g, '');

  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g., 9829012345).',
    };
  }

  return {
    isValid: true,
    cleanPhone: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
  };
}

export interface AppointmentInput {
  patientName: string;
  phoneNumber: string;
  requestedDate: string;
  visitReason?: string;
  consentGiven: boolean;
}

export function validateAppointmentForm(
  data: AppointmentInput,
  referenceDate?: Date
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName = 'Patient full name is required (at least 2 characters).';
  } else if (data.patientName.trim().length > 80) {
    errors.patientName = 'Patient name is too long (max 80 characters).';
  }

  const phoneRes = validateIndianPhone(data.phoneNumber);
  if (!phoneRes.isValid) {
    errors.phoneNumber = phoneRes.error!;
  }

  const dateRes = validateAppointmentDate(data.requestedDate, referenceDate);
  if (!dateRes.isValid) {
    errors.requestedDate = dateRes.error!;
  }

  if (data.visitReason && data.visitReason.trim().length > 300) {
    errors.visitReason = 'Reason for visit cannot exceed 300 characters.';
  }

  if (!data.consentGiven) {
    errors.consentGiven = 'Please agree to the privacy notice to submit your appointment request.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
