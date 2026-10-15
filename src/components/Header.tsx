import React, { useState } from 'react';
import { Eye, Phone, Calendar, Menu, X, MapPin } from 'lucide-react';
import { HospitalInfo } from '../types.ts';

interface HeaderProps {
  hospitalInfo: HospitalInfo;
  onBookClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hospitalInfo, onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Eye Care Services', href: '#services' },
    { label: 'Doctor', href: '#doctor' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
      {/* Top micro-bar for quick contact and location reference */}
      <div className="bg-sky-900 text-sky-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 text-sky-200">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">Patel Nagar, New Shivbari Road, Bikaner, Rajasthan 334003</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span>{hospitalInfo.openingHours.split('|')[0].trim()}</span>
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-1 text-white hover:text-sky-300 font-semibold"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span>{hospitalInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hospital Brand */}
          <a href="#home" className="flex items-center gap-3 group text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                GetWell Eye Hospital
              </div>
              <div className="text-xs font-medium text-sky-700 flex items-center gap-1">
                <span>Bikaner, Rajasthan</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal">Dedicated Vision Care</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-sky-700 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Prominent Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-sky-300 text-sky-700 bg-sky-50/60 hover:bg-sky-100/80 font-medium text-sm transition-colors shadow-2xs"
              aria-label={`Call hospital at ${hospitalInfo.phone}`}
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>Call Now</span>
            </a>
            <button
              onClick={onBookClick}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all shadow-md shadow-sky-600/25 hover:shadow-sky-600/35 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center sm:hidden gap-2">
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="p-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100"
              aria-label="Call Hospital"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-sky-300 text-sky-700 font-semibold bg-sky-50"
            >
              <Phone className="w-4 h-4" />
              <span>Call Hospital ({hospitalInfo.phone})</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              type="button"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
