import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, BookmarkCheck } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group text-left transition"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-display font-bold text-lg text-stone-900 tracking-tight">
                Postcard AI
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200/60">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-sans-clean -mt-0.5 hidden sm:block">
              Memories into timeless postcards
            </p>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('gallery')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
              currentView === 'gallery'
                ? 'bg-stone-900 text-stone-100 shadow-sm'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-amber-600" />
            <span>My Postcards</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-950 font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {currentView !== 'home' && currentView !== 'camera' && currentView !== 'upload' && (
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-amber-800 hover:bg-amber-900 text-amber-50 shadow-sm transition flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">New Postcard</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
