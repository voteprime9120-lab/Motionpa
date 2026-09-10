import React from 'react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-[#201f1f] mt-16">
      <div className="w-full px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-[20px] text-[#e5e2e1] tracking-wide">
            NOCTURNE ARCHIVE
          </span>
          <span className="font-mono text-[11px] text-[#a88a86]">
            © 2024 J. Vance. Handcrafted dark fantasy illustration &amp; visual lore.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86] hover:text-[#e5e2e1] transition-colors cursor-pointer"
          >
            Permanent Archive
          </button>
          <button
            type="button"
            onClick={() => onNavigate('series')}
            className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86] hover:text-[#e5e2e1] transition-colors cursor-pointer"
          >
            Folios
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86] hover:text-[#e5e2e1] transition-colors cursor-pointer"
          >
            Curatorial Records
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86] hover:text-[#e5e2e1] transition-colors cursor-pointer"
          >
            Colophon
          </button>
        </div>
      </div>
    </footer>
  );
};
