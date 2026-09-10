import React, { useState } from 'react';
import { CollectionSeries, PlateMetadata } from '../types';
import { Layers, ArrowRight, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface SeriesViewProps {
  seriesList: CollectionSeries[];
  plates: PlateMetadata[];
  onSelectPlate: (plate: PlateMetadata) => void;
  onSelectSeriesForUpload?: (seriesName: string) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({
  seriesList,
  plates,
  onSelectPlate,
  onSelectSeriesForUpload
}) => {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(
    seriesList[0]?.id || ''
  );

  const activeSeries =
    seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];

  const seriesPlates = plates.filter(
    (p) => p.series.toLowerCase() === activeSeries?.name.toLowerCase()
  );

  return (
    <div className="flex flex-col w-full">
      {/* Folios Header */}
      <div className="w-full px-6 md:px-12 py-8 bg-[#0e0e0e] border-b border-[#201f1f] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
              CURATORIAL FOLIOS &amp; CODICES
            </span>
            <span className="w-1 h-1 rounded-full bg-[#a88a86]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86]">
              NOCTURNE CANON
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#e5e2e1] font-normal tracking-tight">
            Series &amp; Collections
          </h1>
          <p className="font-mono text-[13px] text-[#a88a86] max-w-2xl leading-relaxed">
            Thematic cycles developed across distinct epochs. Each collection constitutes
            a unified theological, architectural, or sovereign visual treatise.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#a88a86]">
          <BookOpen className="w-4 h-4 text-[#ffb4ac]" />
          <span>{seriesList.length} Active Folios Documented</span>
        </div>
      </div>

      {/* Series Selector Bar */}
      <div className="w-full px-6 md:px-12 py-4 bg-[#131313] border-b border-[#201f1f] flex items-center gap-3 overflow-x-auto scrollbar-none">
        {seriesList.map((series) => {
          const isSelected = series.id === selectedSeriesId;
          return (
            <button
              key={series.id}
              type="button"
              onClick={() => setSelectedSeriesId(series.id)}
              className={`px-4 py-2 font-mono text-[12px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
                isSelected
                  ? 'bg-[#1c1b1b] text-[#ffb4ac] border-[#991b1b]'
                  : 'bg-[#0e0e0e] text-[#a88a86] border-[#201f1f] hover:text-[#e5e2e1]'
              }`}
            >
              <span>{series.name}</span>
              <span className="text-[10px] opacity-70">
                ({series.plateCount} Plates)
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Series Showcase */}
      {activeSeries && (
        <div className="w-full px-6 md:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0e0e0e] border border-[#201f1f] p-6 md:p-8">
            {/* Folio Cover Artwork */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="aspect-[4/5] bg-[#131313] relative overflow-hidden border border-[#2a2a2a] group">
                <img
                  src={activeSeries.coverImage}
                  alt={activeSeries.name}
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                />
                {/* Crosshairs */}
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
                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#0e0e0e]/90 text-[#ffb4ac] font-mono text-[10px] tracking-widest uppercase border border-[#353534]">
                  FOLIO COVER PLATE
                </div>
              </div>
            </div>

            {/* Folio Dossier Info */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#201f1f]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
                    EXHIBITION DOSSIER // {activeSeries.epoch}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 border ${
                      activeSeries.status === 'Open'
                        ? 'bg-[#991b1b]/20 text-[#ffb4ac] border-[#991b1b]'
                        : 'bg-[#201f1f] text-[#a88a86] border-[#2a2a2a]'
                    }`}
                  >
                    STATUS: {activeSeries.status}
                  </span>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl text-[#e5e2e1] font-normal leading-tight">
                  {activeSeries.name}
                </h2>

                <p className="font-mono text-[13px] text-[#e5e2e1] leading-relaxed">
                  {activeSeries.description}
                </p>

                <div className="p-4 bg-[#1c1b1b] border-l-2 border-[#991b1b] flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#ffb4ac]">
                    Curatorial Advisory Note
                  </span>
                  <p className="font-mono text-[12px] text-[#a88a86] italic">
                    "{activeSeries.curatorNote}"
                  </p>
                </div>
              </div>

              {/* Folio Plates Preview Section */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#201f1f]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#a88a86]">
                    Indexed Plates in this Folio ({seriesPlates.length})
                  </span>
                </div>

                {seriesPlates.length === 0 ? (
                  <p className="font-mono text-xs text-[#a88a86]">
                    Plates are currently in cold archival storage or pending staging.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {seriesPlates.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectPlate(p)}
                        className="cursor-pointer p-2 bg-[#131313] hover:bg-[#1c1b1b] border border-[#2a2a2a] transition-colors flex items-center gap-2 group"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-14 object-cover grayscale contrast-125 flex-shrink-0"
                        />
                        <div className="min-w-0 flex flex-col">
                          <span className="font-serif text-[13px] text-[#e5e2e1] group-hover:text-[#ffb4ac] transition-colors truncate">
                            {p.title}
                          </span>
                          <span className="font-mono text-[9px] text-[#a88a86]">
                            {p.plateNumber}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
