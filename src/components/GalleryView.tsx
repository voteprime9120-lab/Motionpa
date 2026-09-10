import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  Plus,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { PlateMetadata, CollectionSeries } from '../types';

interface GalleryViewProps {
  plates: PlateMetadata[];
  seriesList: CollectionSeries[];
  onSelectPlate: (plate: PlateMetadata) => void;
  onNavigateToUpload: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  plates,
  seriesList,
  onSelectPlate,
  onNavigateToUpload
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'newest' | 'title'>('number');

  const filteredPlates = useMemo(() => {
    return plates
      .filter((plate) => {
        const matchesSeries =
          selectedSeries === 'all' ||
          plate.series.toLowerCase() === selectedSeries.toLowerCase();

        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          plate.title.toLowerCase().includes(query) ||
          plate.lore.toLowerCase().includes(query) ||
          plate.medium.toLowerCase().includes(query) ||
          plate.tags.some((t) => t.toLowerCase().includes(query)) ||
          plate.plateNumber.toLowerCase().includes(query);

        return matchesSeries && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.ingestedAt).getTime() - new Date(a.ingestedAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return a.plateNumber.localeCompare(b.plateNumber);
      });
  }, [plates, selectedSeries, searchQuery, sortBy]);

  return (
    <div className="flex flex-col w-full">
      {/* Gallery Header & Archival Notice */}
      <div className="w-full px-6 md:px-12 py-8 bg-[#0e0e0e] border-b border-[#201f1f] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
              PERMANENT MONOCHROME ARCHIVE
            </span>
            <span className="w-1 h-1 rounded-full bg-[#a88a86]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86]">
              AUTHENTICATED INK STAGINGS
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#e5e2e1] font-normal tracking-tight">
            Vault Folios &amp; Exhibition Plates
          </h1>
          <p className="font-mono text-[13px] text-[#a88a86] max-w-2xl leading-relaxed">
            Peruse authenticated master plates from the Sovereign Cycle, Nocturnal
            Monoliths, and Heretical Reliquaries. Calibrated for 2700K low-lux
            observation.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end font-mono">
            <span className="text-[10px] uppercase text-[#a88a86]">
              Sealed Plates
            </span>
            <span className="font-serif text-[22px] text-[#e5e2e1]">
              {filteredPlates.length} of {plates.length} Indexed
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateToUpload}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#991b1b] hover:bg-[#cc003c] text-[#ffdad6] font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest New</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="w-full px-6 md:px-12 py-4 bg-[#131313] border-b border-[#201f1f] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Series Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedSeries('all')}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap ${
              selectedSeries === 'all'
                ? 'bg-[#1c1b1b] text-[#ffb4ac] border-[#991b1b]'
                : 'bg-[#0e0e0e] text-[#a88a86] border-[#201f1f] hover:text-[#e5e2e1]'
            }`}
          >
            All Plates ({plates.length})
          </button>
          {seriesList.map((series) => (
            <button
              key={series.id}
              type="button"
              onClick={() => setSelectedSeries(series.name)}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap ${
                selectedSeries.toLowerCase() === series.name.toLowerCase()
                  ? 'bg-[#1c1b1b] text-[#ffb4ac] border-[#991b1b]'
                  : 'bg-[#0e0e0e] text-[#a88a86] border-[#201f1f] hover:text-[#e5e2e1]'
              }`}
            >
              {series.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#a88a86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, tag, medium..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0e0e0e] border border-[#201f1f] text-[#e5e2e1] font-mono text-[11px] focus:outline-none focus:border-[#991b1b]"
            />
          </div>

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none px-3 py-1.5 pr-8 bg-[#0e0e0e] border border-[#201f1f] text-[#a88a86] hover:text-[#e5e2e1] font-mono text-[11px] uppercase tracking-wider cursor-pointer focus:outline-none"
            >
              <option value="number">Sort: Plate No.</option>
              <option value="newest">Sort: Ingestion Date</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#a88a86] absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="w-full px-6 md:px-12 py-10">
        {filteredPlates.length === 0 ? (
          <div className="p-16 bg-[#0e0e0e] border border-[#201f1f] text-center flex flex-col items-center gap-3">
            <Compass className="w-10 h-10 text-[#a88a86]" />
            <span className="font-serif text-2xl text-[#e5e2e1]">
              No Artefacts Match Current Inquiry
            </span>
            <p className="font-mono text-xs text-[#a88a86] max-w-md">
              Try adjusting your taxonomy search terms or switch series filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSeries('all');
              }}
              className="mt-2 px-4 py-1.5 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#ffb4ac] font-mono text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlates.map((plate) => (
              <div
                key={plate.id}
                onClick={() => onSelectPlate(plate)}
                className="group cursor-pointer bg-[#0e0e0e] border border-[#201f1f] hover:border-[#991b1b]/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
              >
                {/* Plate Frame */}
                <div className="w-full aspect-[3/4] bg-[#131313] overflow-hidden relative flex items-center justify-center border-b border-[#201f1f]">
                  <img
                    src={plate.imageUrl}
                    alt={plate.title}
                    className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Corner Crosshairs */}
                  <div className="absolute top-2 left-2 w-2 h-2 text-[#ffb4ac] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg fill="none" height="8" viewBox="0 0 8 8" width="8">
                      <path d="M0 0H8M0 0V8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 text-[#ffb4ac] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg fill="none" height="8" viewBox="0 0 8 8" width="8">
                      <path d="M8 8H0M8 8V0" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Archival Stamp */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-[#0e0e0e]/90 text-[#e2e2e6] font-mono text-[9px] tracking-widest uppercase border border-[#353534]">
                    {plate.plateNumber}
                  </div>

                  {/* Quick Inspect Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#0e0e0e]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 bg-[#991b1b] text-[#ffdad6] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" /> Inspect Plate
                    </span>
                  </div>
                </div>

                {/* Placard Information */}
                <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#ffb4ac]">
                        {plate.series}
                      </span>
                      <span className="font-mono text-[9px] text-[#a88a86]">
                        {plate.epoch}
                      </span>
                    </div>
                    <h3 className="font-serif text-[19px] text-[#e5e2e1] group-hover:text-[#ffb4ac] transition-colors leading-tight font-medium mt-0.5 truncate">
                      {plate.title}
                    </h3>
                    <p className="font-mono text-[10px] text-[#a88a86] uppercase truncate mt-0.5">
                      {plate.medium}
                    </p>
                  </div>

                  {/* Bottom tags & visibility */}
                  <div className="pt-2 border-t border-[#201f1f] flex items-center justify-between text-[10px] font-mono text-[#a88a86]">
                    <span className="truncate max-w-[140px]">
                      {plate.tags[0]} {plate.tags[1] ? `• ${plate.tags[1]}` : ''}
                    </span>
                    <span className="uppercase text-[#ffb4ac] text-[9px]">
                      {plate.visibility === 'public'
                        ? 'PUBLIC VAULT'
                        : plate.visibility === 'curators'
                        ? 'CURATORS ONLY'
                        : 'CIPHER KEY'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
