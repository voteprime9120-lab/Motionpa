import React, { useState } from 'react';
import { Plus, User, Eye, ShieldCheck } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  stagedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  stagedCount
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#201f1f]">
      <div className="h-20 w-full px-6 md:px-12 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="flex items-center gap-4 group text-left cursor-pointer"
          >
            <img
              alt="Obsidian Archive Emblem"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-9YwWkKs9Q_ML0Xr7KdkIMojE7oHlit1db2mqCz6GH2xOAMvHzV43O79ocXpWKQtAoOflnf6OnAYSS_-kC5ihzOHGOib9RonGLcUk_itO9ieItlXP-fkSkfJI036yxYhzibMv-Fep17aYpT-J-Kxcj8Y4GPNQt0VibbixDfQYNAq1cW9gSwoX-1cwravt2AKixv8uk0rWmgIpZ61cPog_TTcgvdEoRatOuqEQwWkqeQjQ9SJiemJ4"
            />
            <div className="flex flex-col">
              <span className="font-serif text-[22px] tracking-wide text-[#e5e2e1] group-hover:text-[#ffb4ac] transition-colors leading-tight">
                NOCTURNE ARCHIVE
              </span>
              <span className="font-mono text-[10px] uppercase text-[#a88a86] tracking-[0.12em]">
                J. Vance // Concept & Fine Art
              </span>
            </div>
          </button>

          {/* Exhibition Status Badge */}
          <button
            type="button"
            onClick={() => onNavigate('series')}
            className="hidden xl:flex items-center gap-2 pl-6 border-l border-[#2a2a2a] group cursor-pointer"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#cc003c] animate-pulse" />
            <span className="font-mono text-[10px] uppercase text-[#a88a86] group-hover:text-[#ffb4ac] transition-colors tracking-widest">
              Exhibition: Sanctum of Ash (Open)
            </span>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className={`font-mono text-[12px] uppercase tracking-wider transition-colors cursor-pointer ${
              currentView === 'gallery'
                ? 'text-[#ffb4ac] font-bold border-b border-[#991b1b] pb-0.5'
                : 'text-[#a88a86] hover:text-[#e5e2e1]'
            }`}
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() => onNavigate('series')}
            className={`font-mono text-[12px] uppercase tracking-wider transition-colors cursor-pointer ${
              currentView === 'series'
                ? 'text-[#ffb4ac] font-bold border-b border-[#991b1b] pb-0.5'
                : 'text-[#a88a86] hover:text-[#e5e2e1]'
            }`}
          >
            Series & Collections
          </button>
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className={`font-mono text-[12px] uppercase tracking-wider transition-colors cursor-pointer relative ${
              currentView === 'upload'
                ? 'text-[#ffb4ac] font-bold border-b border-[#991b1b] pb-0.5'
                : 'text-[#a88a86] hover:text-[#e5e2e1]'
            }`}
          >
            Upload Works
            {stagedCount > 0 && (
              <span className="ml-1.5 px-1 py-0.2 bg-[#991b1b] text-[#ffdad6] text-[9px] font-mono">
                {stagedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className={`font-mono text-[12px] uppercase tracking-wider transition-colors cursor-pointer ${
              currentView === 'about'
                ? 'text-[#ffb4ac] font-bold border-b border-[#991b1b] pb-0.5'
                : 'text-[#a88a86] hover:text-[#e5e2e1]'
            }`}
          >
            About / Contact
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="hidden sm:flex items-center gap-1.5 bg-[#991b1b] hover:bg-[#cc003c] text-[#ffdad6] font-mono text-[12px] uppercase tracking-widest px-4 py-2 transition-all duration-200 cursor-pointer shadow-md hover:shadow-red-900/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Work</span>
          </button>

          {/* User / Curatorial Credential Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-[#ffb4ac] text-[#690007] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
              title="Curator Access Credentials"
              aria-label="User Profile"
            >
              <User className="w-4 h-4 text-[#690007]" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 top-11 w-72 bg-[#0e0e0e] border border-[#2a2a2a] p-4 shadow-2xl z-50 text-left animate-in fade-in slide-in-from-top-2"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(153, 27, 27, 0.4)'
                }}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[#201f1f]">
                  <div className="w-8 h-8 rounded-full bg-[#991b1b] text-[#ffdad6] flex items-center justify-center text-xs font-mono font-bold">
                    JV
                  </div>
                  <div>
                    <div className="font-serif text-sm font-medium text-[#e5e2e1]">
                      J. Vance
                    </div>
                    <div className="font-mono text-[10px] text-[#ffb4ac] uppercase tracking-wider">
                      Master Archivist // Level 09
                    </div>
                  </div>
                </div>

                <div className="py-3 flex flex-col gap-2 font-mono text-[11px] text-[#a88a86]">
                  <div className="flex items-center justify-between">
                    <span>VAULT KEY:</span>
                    <span className="text-[#e5e2e1] font-mono">0x8F2A...79BC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SECURITY CLEARANCE:</span>
                    <span className="text-[#ffb4ac] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#ffb4ac]" /> FULL CIPHER
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ACTIVE BUFFER:</span>
                    <span className="text-[#e5e2e1]">{stagedCount} Plates Staged</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#201f1f] flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('about');
                      setShowProfileMenu(false);
                    }}
                    className="w-full py-1.5 px-2 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#e5e2e1] text-[11px] font-mono uppercase tracking-wider text-center transition-colors"
                  >
                    View Curatorial Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full py-1 text-[10px] font-mono text-[#a88a86] hover:text-[#e5e2e1] uppercase tracking-widest text-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
