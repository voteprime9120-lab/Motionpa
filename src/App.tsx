import React, { useState } from 'react';
import { ViewMode, PlateMetadata, ToastNotification } from './types';
import {
  INITIAL_STAGED_PLATES,
  INITIAL_GALLERY_PLATES,
  INITIAL_SERIES
} from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadView } from './components/UploadView';
import { GalleryView } from './components/GalleryView';
import { SeriesView } from './components/SeriesView';
import { AboutView } from './components/AboutView';
import { PlateModal } from './components/PlateModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('upload');
  const [stagedPlates, setStagedPlates] = useState<PlateMetadata[]>(
    INITIAL_STAGED_PLATES
  );
  const [galleryPlates, setGalleryPlates] = useState<PlateMetadata[]>([
    ...INITIAL_STAGED_PLATES,
    ...INITIAL_GALLERY_PLATES
  ]);
  const [seriesList, setSeriesList] = useState(INITIAL_SERIES);
  const [inspectedPlate, setInspectedPlate] = useState<PlateMetadata | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (t: ToastNotification) => {
    setToast(t);
    setTimeout(() => {
      setToast((prev) => (prev?.id === t.id ? null : prev));
    }, 4500);
  };

  const handlePublishPlate = (plate: PlateMetadata) => {
    const publishedPlate: PlateMetadata = {
      ...plate,
      isStaged: false,
      ingestedAt: new Date().toISOString()
    };

    setGalleryPlates((prev) => {
      // replace if existing or prepend
      const existingIdx = prev.findIndex((p) => p.id === plate.id);
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx] = publishedPlate;
        return next;
      }
      return [publishedPlate, ...prev];
    });

    // Update series plate count
    setSeriesList((prev) =>
      prev.map((s) =>
        s.name.toLowerCase() === plate.series.toLowerCase()
          ? { ...s, plateCount: s.plateCount + 1 }
          : s
      )
    );
  };

  // Modal navigation (next / previous plate)
  const currentModalIndex = inspectedPlate
    ? galleryPlates.findIndex((p) => p.id === inspectedPlate.id)
    : -1;

  const handleNextModalPlate = () => {
    if (currentModalIndex !== -1 && currentModalIndex < galleryPlates.length - 1) {
      setInspectedPlate(galleryPlates[currentModalIndex + 1]);
    } else if (galleryPlates.length > 0) {
      setInspectedPlate(galleryPlates[0]);
    }
  };

  const handlePrevModalPlate = () => {
    if (currentModalIndex > 0) {
      setInspectedPlate(galleryPlates[currentModalIndex - 1]);
    } else if (galleryPlates.length > 0) {
      setInspectedPlate(galleryPlates[galleryPlates.length - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-mono selection:bg-[#991b1b] selection:text-[#ffdad6]">
      {/* Primary Sticky Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        stagedCount={stagedPlates.length}
      />

      {/* Main Workspace (Offset for fixed header) */}
      <main className="w-full pt-20 flex-1 flex flex-col">
        {currentView === 'upload' && (
          <UploadView
            stagedPlates={stagedPlates}
            setStagedPlates={setStagedPlates}
            seriesList={seriesList}
            onPublishPlate={handlePublishPlate}
            onShowToast={showToast}
            onNavigateToGallery={() => setCurrentView('gallery')}
          />
        )}

        {currentView === 'gallery' && (
          <GalleryView
            plates={galleryPlates}
            seriesList={seriesList}
            onSelectPlate={setInspectedPlate}
            onNavigateToUpload={() => setCurrentView('upload')}
          />
        )}

        {currentView === 'series' && (
          <SeriesView
            seriesList={seriesList}
            plates={galleryPlates}
            onSelectPlate={setInspectedPlate}
            onSelectSeriesForUpload={(seriesName) => {
              setCurrentView('upload');
            }}
          />
        )}

        {currentView === 'about' && (
          <AboutView onShowToast={showToast} />
        )}
      </main>

      {/* Permanent Archive Footer */}
      <Footer onNavigate={setCurrentView} />

      {/* High-Resolution Codex & Plate Inspector Modal */}
      <PlateModal
        plate={inspectedPlate}
        onClose={() => setInspectedPlate(null)}
        onNext={handleNextModalPlate}
        onPrev={handlePrevModalPlate}
      />

      {/* Dynamic Curatorial Protocol Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
