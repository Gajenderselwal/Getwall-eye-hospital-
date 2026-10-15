import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string; // scrypt hash
  passwordSalt: string;
  name: string;
}

export interface DatabaseSchema {
  hospitalInfo: HospitalInfo;
  appointments: Appointment[];
  adminUsers: AdminUser[];
  sessions: { token: string; email: string; expiresAt: number }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hospital_db.json');

// Default initial state adhering strictly to prompt requirements:
// Hospital: GetWell Eye Hospital, New Shivbari Road, near S.K. Medicose, Patel Nagar, Bikaner, Rajasthan 334003, India
// Reference Google Maps: https://maps.app.goo.gl/bbYmYeR8msgz61xk9
const DEFAULT_HOSPITAL_INFO: HospitalInfo = {
  name: 'GetWell Eye Hospital',
  tagline: 'Expert Eye Care, Closer to You',
  address: 'New Shivbari Road, near S.K. Medicose, Patel Nagar, Bikaner, Rajasthan 334003, India',
  city: 'Bikaner',
  state: 'Rajasthan',
  postalCode: '334003',
  googleMapsUrl: 'https://maps.app.goo.gl/bbYmYeR8msgz61xk9',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=GetWell+Eye+Hospital%2C+Patel+Nagar%2C+Bikaner%2C+Rajasthan+334003',
  phone: '+91 70234 51759',
  secondaryPhone: '',
  whatsappNumber: '+91 70234 51759',
  email: 'getwellevehospitalbikaner@gmail.com',
  openingHours: 'Monday – Saturday: 9:00 AM – 7:00 PM | Sunday: Closed',
  closedDays: ['Sunday'],
  doctor: {
    name: 'Dr. Verified Specialist (Editable via Dashboard)',
    title: 'Senior Consultant Ophthalmologist & Eye Surgeon',
    qualifications: 'MBBS, MS (Ophthalmology), Fellow in Anterior Segment Surgery',
    experience: '15+ Years of Dedicated Clinical Practice',
    bio: 'Dedicated to compassionate, modern vision care in Bikaner. Specialized in phacoemulsification cataract assessment, precise refraction, glaucoma management, and comprehensive anterior segment evaluations.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
  },
  services: [
    {
      id: 'srv-1',
      title: 'Comprehensive Eye Examination',
      description: 'Computerized automated refraction, slit-lamp bio-microscopy, intraocular pressure check, and visual acuity evaluation for patients of all ages.',
      icon: 'Eye',
      isVerified: true,
    },
    {
      id: 'srv-2',
      title: 'Cataract Evaluation & IOL Assessment',
      description: 'Pre-operative optical biometry, keratometry, modern intraocular lens counseling, and micro-incision phacoemulsification evaluation.',
      icon: 'Sparkles',
      isVerified: true,
    },
    {
      id: 'srv-3',
      title: 'Glaucoma Screening & Pressure Checks',
      description: 'Goldmann applanation tonometry, central corneal thickness assessment, optic disc evaluation, and long-term intraocular tension monitoring.',
      icon: 'Activity',
      isVerified: true,
    },
    {
      id: 'srv-4',
      title: 'Retina & Diabetic Eye Screening',
      description: 'Dilated funduscopy, diabetic retinopathy risk evaluation, hypertensive retinopathy screening, and timely retinal referral coordination.',
      icon: 'ShieldCheck',
      isVerified: true,
    },
    {
      id: 'srv-5',
      title: 'Refractive Error & Pediatric Vision',
      description: 'Pediatric vision screening, amblyopia management, accurate spectacle prescription, and progressive myopia counseling.',
      icon: 'Glasses',
      isVerified: true,
    },
    {
      id: 'srv-6',
      title: 'Dry Eye & Computer Vision Care',
      description: 'Tear breakup time diagnostics, ocular surface soothing therapy, digital eye strain mitigation, and lubricating regimen guidance.',
      icon: 'HeartPulse',
      isVerified: true,
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Hospital Storefront & Entrance',
      category: 'exterior',
      imageUrl: '/src/assets/images/hospital_exterior_1792061017657.jpg',
      altText: 'GetWell Eye Hospital & Optical storefront on New Shivbari Road next to S.K. Medicose in Patel Nagar, Bikaner',
    },
    {
      id: 'gal-2',
      title: 'Computerized Refraction & Diagnostics',
      category: 'equipment',
      imageUrl: '/src/assets/images/refraction_room_1792061055981.jpg',
      altText: 'Optometrist specialist conducting automated refraction eye examination with trial lens case',
    },
    {
      id: 'gal-3',
      title: 'Patient Waiting Corridor & Cabins',
      category: 'interior',
      imageUrl: '/src/assets/images/waiting_lounge_1792061097553.jpg',
      altText: 'Clean hospital waiting lounge with comfortable bench seating and doctor consultation suites',
    },
  ],
};

// Helper for hashing password with salt
export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

// Initial Admin User: admin@getwelleyehospital.com / GetWell@Bikaner2026!
const defaultSalt = crypto.randomBytes(16).toString('hex');
const defaultPasswordHash = hashPassword('GetWell@Bikaner2026!', defaultSalt);

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'admin-1',
  email: 'admin@getwelleyehospital.com',
  passwordHash: defaultPasswordHash,
  passwordSalt: defaultSalt,
  name: 'Hospital Administrator',
};

// Seed an initial demo appointment so the admin dashboard immediately demonstrates all filtering and status features
const INITIAL_DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'GW-M2K8P-1042',
    patientName: 'Sunita Meena',
    phoneNumber: '+91 98290 44211',
    cleanPhoneNumber: '+91 98290 44211',
    requestedDate: '2026-10-19', // Monday
    visitReason: 'Blurry distance vision and headache after computer screen use',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'GW-M2K8P-2089',
    patientName: 'Rajendra Singh Bhati',
    phoneNumber: '+91 94141 88923',
    cleanPhoneNumber: '+91 94141 88923',
    requestedDate: '2026-10-20', // Tuesday
    visitReason: 'Senior citizen cataract evaluation and reading glasses review',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'GW-M2K8P-3312',
    patientName: 'Priya Joshi',
    phoneNumber: '+91 97845 11209',
    cleanPhoneNumber: '+91 97845 11209',
    requestedDate: '2026-10-21', // Wednesday
    visitReason: 'Dry eyes, burning sensation, and routine refractive check',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure defaults are populated if any section is missing
        return {
          hospitalInfo: parsed.hospitalInfo || DEFAULT_HOSPITAL_INFO,
          appointments: Array.isArray(parsed.appointments) ? parsed.appointments : INITIAL_DEMO_APPOINTMENTS,
          adminUsers: Array.isArray(parsed.adminUsers) && parsed.adminUsers.length > 0 ? parsed.adminUsers : [DEFAULT_ADMIN_USER],
          sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        };
      }
    } catch (err) {
      console.error('Error loading database, using defaults:', err);
    }

    const initial: DatabaseSchema = {
      hospitalInfo: DEFAULT_HOSPITAL_INFO,
      appointments: INITIAL_DEMO_APPOINTMENTS,
      adminUsers: [DEFAULT_ADMIN_USER],
      sessions: [],
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      const tmpPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  // --- Hospital Info ---
  getHospitalInfo(): HospitalInfo {
    return this.data.hospitalInfo;
  }

  updateHospitalInfo(partial: Partial<HospitalInfo>): HospitalInfo {
    this.data.hospitalInfo = {
      ...this.data.hospitalInfo,
      ...partial,
    };
    this.save();
    return this.data.hospitalInfo;
  }

  // --- Appointments ---
  getAppointments(): Appointment[] {
    // Sort newest first
    return [...this.data.appointments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createAppointment(entry: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Appointment {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '').toUpperCase();
    const id = `GW-${dateCode}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newAppointment: Appointment = {
      ...entry,
      id,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    this.data.appointments.unshift(newAppointment);
    this.save();
    return newAppointment;
  }

  updateAppointmentStatus(id: string, status: Appointment['status']): Appointment | null {
    const item = this.data.appointments.find((a) => a.id === id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.save();
    return item;
  }

  deleteAppointment(id: string): boolean {
    const beforeCount = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter((a) => a.id !== id);
    if (this.data.appointments.length !== beforeCount) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Admin Auth ---
  authenticateAdmin(email: string, pass: string): { success: boolean; token?: string; user?: { email: string; name: string } } {
    const cleanEmail = email.trim().toLowerCase();
    const admin = this.data.adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!admin) {
      return { success: false };
    }

    const matches = verifyPassword(pass, admin.passwordSalt, admin.passwordHash);
    if (!matches) {
      return { success: false };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // Clean old expired sessions
    this.data.sessions = this.data.sessions.filter((s) => s.expiresAt > Date.now());
    this.data.sessions.push({ token, email: admin.email, expiresAt });
    this.save();

    return {
      success: true,
      token,
      user: { email: admin.email, name: admin.name },
    };
  }

  validateSession(token: string): { valid: boolean; email?: string } {
    if (!token) return { valid: false };
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return { valid: false };
    if (session.expiresAt < Date.now()) {
      this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
      this.save();
      return { valid: false };
    }
    return { valid: true, email: session.email };
  }

  destroySession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }
}

export const db = new Database();
