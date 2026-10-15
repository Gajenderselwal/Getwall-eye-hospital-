import React, { useState, useEffect } from 'react';
import { HospitalInfo } from './types.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Services } from './components/Services.tsx';
import { DoctorProfile } from './components/DoctorProfile.tsx';
import { Gallery } from './components/Gallery.tsx';
import { WhyChooseUs } from './components/WhyChooseUs.tsx';
import { AppointmentForm } from './components/AppointmentForm.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { PrivacyModal } from './components/PrivacyModal.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { Phone, Calendar } from 'lucide-react';

export default function App() {
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prefilledService, setPrefilledService] = useState('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Admin routing state
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('gw_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(() => {
    const raw = sessionStorage.getItem('gw_admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  // Check URL path/hash on load & hashchange
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      const adminRequested =
        path.startsWith('/admin') ||
        hash.startsWith('#/admin') ||
        hash.startsWith('#admin') ||
        search.includes('view=admin');

      setIsAdminRoute(adminRequested);
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Fetch verified hospital info
  useEffect(() => {
    const fetchHospitalInfo = async () => {
      try {
        const res = await fetch('/api/hospital-info');
        if (res.ok) {
          const data = await res.json();
          setHospitalInfo(data);
        }
      } catch (err) {
        console.error('Failed to fetch hospital info:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitalInfo();
  }, []);

  const scrollToAppointment = () => {
    const el = document.getElementById('appointment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
    scrollToAppointment();
  };

  const handleAdminLoginSuccess = (token: string, user: { email: string; name: string }) => {
    sessionStorage.setItem('gw_admin_token', token);
    sessionStorage.setItem('gw_admin_user', JSON.stringify(user));
    setAdminToken(token);
    setAdminUser(user);
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch (e) {
        // ignore
      }
    }
    sessionStorage.removeItem('gw_admin_token');
    sessionStorage.removeItem('gw_admin_user');
    setAdminToken(null);
    setAdminUser(null);
  };

  const handleBackToPublic = () => {
    window.location.hash = '';
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
    setIsAdminRoute(false);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-700">Loading GetWell Eye Hospital...</p>
        <span className="text-xs text-slate-400 mt-1">Bikaner, Rajasthan</span>
      </div>
    );
  }

  // Admin Route View
  if (isAdminRoute) {
    if (adminToken && adminUser) {
      return (
        <AdminDashboard
          token={adminToken}
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onBackToHome={handleBackToPublic}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToHome={handleBackToPublic}
      />
    );
  }

  // Fallback defaults if API temporarily down
  const info: HospitalInfo = hospitalInfo || {
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
    email: 'getwelleyehospitalbikaner@gmail.com',
    openingHours: 'Monday – Saturday: 9:00 AM – 7:00 PM | Sunday: Closed',
    closedDays: ['Sunday'],
    doctor: {
      name: 'Dr. Verified Specialist',
      title: 'Senior Consultant Ophthalmologist & Eye Surgeon',
      qualifications: 'MBBS, MS (Ophthalmology)',
      experience: '15+ Years Clinical Practice',
      bio: 'Providing comprehensive eye examinations, cataract care, and anterior segment diagnostics.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
      isVerified: true,
    },
    services: [],
    gallery: [],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <Header
        hospitalInfo={info}
        onBookClick={scrollToAppointment}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* A. Hero Section */}
        <Hero
          hospitalInfo={info}
          onBookClick={scrollToAppointment}
        />

        {/* B. About Section */}
        <About hospitalInfo={info} />

        {/* C. Eye Care Services */}
        <Services
          services={info.services}
          onSelectService={handleSelectService}
        />

        {/* D. Doctor Profile */}
        <DoctorProfile
          doctor={info.doctor}
          onBookClick={scrollToAppointment}
        />

        {/* E. Hospital Gallery */}
        <Gallery gallery={info.gallery} />

        {/* F. Why Choose Us */}
        <WhyChooseUs />

        {/* Appointment Booking Form */}
        <AppointmentForm
          prefilledReason={prefilledService}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        />

        {/* G. Contact and Location */}
        <ContactSection hospitalInfo={info} />
      </main>

      {/* Footer (No public admin link) */}
      <Footer
        hospitalInfo={info}
        onBookClick={scrollToAppointment}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Mobile Floating Sticky Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center gap-2 shadow-lg">
        <a
          href={`tel:${info.phone.replace(/\s+/g, '')}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-sky-300 bg-sky-50 text-sky-800 text-xs font-bold"
        >
          <Phone className="w-4 h-4 text-sky-600" />
          <span>Call Now</span>
        </a>
        <button
          onClick={scrollToAppointment}
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-600/20"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Visit</span>
        </button>
      </div>

    </div>
  );
}
