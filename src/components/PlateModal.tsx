import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  ShieldCheck,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { PlateMetadata } from '../types';

interface PlateModalProps {
  plate: PlateMetadata | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const PlateModal: React.FC<PlateModalProps> = ({
  plate,
  onClose,
  onNext,
  onPrev
}) => {
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [isInverted, setIsInverted] = useState(false);
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);

  if (!plate) return null;

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  const handleExportCodex = () => {
    const codexData = {
      curator: 'J. Vance',
      archive: 'Nocturne Archive',
      plate: plate,
      sealedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(codexData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plate.filename.replace(/\.[^/.]+$/, '')}_CODEX.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-md p-4 md:p-8 animate-in fade-in">
      <div
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#0e0e0e] border border-[#2a2a2a] flex flex-col md:flex-row overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 25px 60px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(153, 27, 27, 0.4)'
        }}
      >
        {/* Top Control Bar for Mobile / Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleZoom}
            className="p-2 bg-[#1c1b1b] hover:bg-[#2a2a2a] text-[#e5e2e1] border border-[#2a2a2a] transition-colors cursor-pointer"
            title="Toggle magnification"
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsInverted(!isInverted)}
            className={`p-2 border transition-colors cursor-pointer ${
              isInverted
                ? 'bg-[#ffb4ac] text-[#690007] border-[#ffb4ac]'
                : 'bg-[#1c1b1b] hover:bg-[#2a2a2a] text-[#e5e2e1] border-[#2a2a2a]'
            }`}
            title="Toggle Inverted Plate View"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-[#991b1b] hover:bg-[#cc003c] text-[#ffdad6] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Previous / Next Arrow Controls */}
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-[#0e0e0e]/80 hover:bg-[#1c1b1b] text-[#e5e2e1] border border-[#2a2a2a] transition-colors cursor-pointer hidden sm:block"
            title="Previous Plate"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-4 md:right-[420px] top-1/2 -translate-y-1/2 z-20 p-2 bg-[#0e0e0e]/80 hover:bg-[#1c1b1b] text-[#e5e2e1] border border-[#2a2a2a] transition-colors cursor-pointer hidden sm:block"
            title="Next Plate"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Left / Center: Artwork Display Stage */}
        <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center p-6 md:p-12 overflow-auto relative select-none">
          {/* Subtle Grid crosshairs */}
          <div className="absolute top-4 left-4 font-mono text-[9px] text-[#59413e]">
            [ INSPECTION MODE // 100% RAW ]
          </div>
          <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#59413e]">
            [ UUID: {plate.uuid} ]
          </div>

          <div
            className="transition-transform duration-300 relative max-h-full max-w-full flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={plate.imageUrl}
              alt={plate.title}
              className={`max-h-[72vh] w-auto object-contain border border-[#2a2a2a] shadow-2xl transition-all duration-300 ${
                isInverted ? 'invert contrast-150' : 'grayscale contrast-125'
              }`}
            />
            {/* Corner reticles */}
            <div className="absolute top-2 left-2 w-2 h-2 text-[#ffb4ac] pointer-events-none">
              <svg fill="none" height="8" viewBox="0 0 8 8" width="8">
                <path d="M0 0H8M0 0V8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 w-2 h-2 text-[#ffb4ac] pointer-events-none">
              <svg fill="none" height="8" viewBox="0 0 8 8" width="8">
                <path d="M8 8H0M8 8V0" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Curatorial Codex & Technical Telemetry */}
        <div className="w-full md:w-[400px] flex-shrink-0 bg-[#0e0e0e] border-t md:border-t-0 md:border-l border-[#201f1f] p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <div className="flex flex-col gap-4">
            {/* Plate Identification */}
            <div className="flex flex-col gap-1 pb-3 border-b border-[#201f1f]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
                  {plate.series}
                </span>
                <span className="font-mono text-[10px] text-[#a88a86]">
                  {plate.plateNumber}
                </span>
              </div>
              <h2 className="font-serif text-2xl text-[#e5e2e1] font-medium leading-tight">
                {plate.title}
              </h2>
              <span className="font-mono text-[11px] text-[#c6c6ca]">
                {plate.epoch}
              </span>
            </div>

            {/* Medium & Technique */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                Medium &amp; Instruments
              </span>
              <p className="font-mono text-[12px] text-[#e5e2e1] leading-relaxed">
                {plate.medium}
              </p>
            </div>

            {/* Lore Statement */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                Provenance Lore
              </span>
              <p className="font-mono text-[12px] text-[#a88a86] leading-relaxed italic bg-[#1c1b1b] p-3 border-l-2 border-[#991b1b]">
                "{plate.lore}"
              </p>
            </div>

            {/* Taxa Tags */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                Archival Taxa
              </span>
              <div className="flex flex-wrap gap-1.5">
                {plate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2 py-0.5 bg-[#201f1f] text-[#c6c6ca] border border-[#2a2a2a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Parameters Accordion / Toggle */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#201f1f]">
              <button
                type="button"
                onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
                className="flex items-center justify-between font-mono text-[10px] uppercase text-[#ffb4ac] hover:text-[#e5e2e1] transition-colors cursor-pointer"
              >
                <span>Technical Specifications</span>
                <span>{showTechnicalSpecs ? '− HIDE' : '+ EXPAND'}</span>
              </button>

              {showTechnicalSpecs && (
                <div className="p-3 bg-[#131313] border border-[#201f1f] flex flex-col gap-1.5 font-mono text-[10px] text-[#a88a86] animate-in fade-in">
                  <div className="flex justify-between">
                    <span>RESOLUTION:</span>
                    <span className="text-[#e5e2e1]">{plate.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COLOR SPACE:</span>
                    <span className="text-[#e5e2e1]">{plate.colorDepth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FILE SIZE:</span>
                    <span className="text-[#e5e2e1]">{plate.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FILENAME:</span>
                    <span className="text-[#e5e2e1] truncate max-w-[180px]">
                      {plate.filename}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GAMMA:</span>
                    <span className="text-[#e5e2e1]">{plate.gamma}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LIGHTING:</span>
                    <span className="text-[#ffb4ac]">
                      {plate.exhibitionLighting}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 mt-4 border-t border-[#201f1f] flex flex-col gap-2">
            <button
              type="button"
              onClick={handleExportCodex}
              className="w-full py-2 px-4 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#e5e2e1] font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#2a2a2a]"
            >
              <Download className="w-3.5 h-3.5 text-[#ffb4ac]" />
              <span>Export Curatorial Codex (JSON)</span>
            </button>
            <div className="flex items-center justify-between text-[#a88a86] font-mono text-[9px] uppercase px-1">
              <span>STATUS: SEALED IN VAULT</span>
              <span className="text-[#ffb4ac] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#ffb4ac]" /> 100% INTACT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
