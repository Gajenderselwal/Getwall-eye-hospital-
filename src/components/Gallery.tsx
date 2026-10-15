import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, Tag } from 'lucide-react';
import { GalleryItem } from '../types.ts';

interface GalleryProps {
  gallery: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalImage, setActiveModalImage] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'exterior', label: 'Exterior & Entrance' },
    { id: 'interior', label: 'Reception & Waiting' },
    { id: 'consultation', label: 'Consultation Rooms' },
    { id: 'equipment', label: 'Diagnostic Equipment' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            Hospital Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Hospital & Diagnostic Facilities
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Take a look inside GetWell Eye Hospital in Bikaner. Clean consultation suites, advanced equipment, and comfortable patient areas.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalImage(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
            >
              <div className="h-56 overflow-hidden bg-slate-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-xs">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wide">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Admin upload hint */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Hospital photographs can be uploaded, updated, or reordered anytime through the private administrator portal.
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalImage.title}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={activeModalImage.imageUrl}
                alt={activeModalImage.altText}
                className="w-full max-h-[70vh] object-contain bg-slate-950"
              />
              <button
                onClick={() => setActiveModalImage(null)}
                type="button"
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-left bg-white">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                  {activeModalImage.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{activeModalImage.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{activeModalImage.altText}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
