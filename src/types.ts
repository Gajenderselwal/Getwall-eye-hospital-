export interface DoctorProfile {
  name: string;
  title: string;
  qualifications: string;
  experience: string;
  bio: string;
  image: string;
  isVerified: boolean;
}

export interface EyeService {
  id: string;
  title: string;
  description: string;
  icon: string;
  isVerified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'exterior' | 'interior' | 'consultation' | 'equipment';
  imageUrl: string;
  altText: string;
}

export interface HospitalInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  googleMapsUrl: string;
  directionsUrl: string;
  phone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  closedDays: string[];
  doctor: DoctorProfile;
  services: EyeService[];
  gallery: GalleryItem[];
}

export interface Appointment {
  id: string;
  patientName: string;
  phoneNumber: string;
  cleanPhoneNumber: string;
  requestedDate: string;
  visitReason: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSubmission {
  patientName: string;
  phoneNumber: string;
  requestedDate: string;
  visitReason?: string;
  consentGiven: boolean;
}
