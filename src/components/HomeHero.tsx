import React from 'react';
import { Camera, Image as ImageIcon, Stamp, Sparkles, Send, ArrowRight, Heart } from 'lucide-react';
import { PostcardData } from '../types';

interface HomeHeroProps {
  onTakePhoto: () => void;
  onChoosePhoto: () => void;
  onOpenGallery: () => void;
  recentPostcards: PostcardData[];
  onOpenPostcard: (postcard: PostcardData) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onTakePhoto,
  onChoosePhoto,
  onOpenGallery,
  recentPostcards,
  onOpenPostcard,
}) => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      {/* Background subtle postal watermark patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex justify-around items-center">
        <span className="text-[20vw] font-serif-display font-black">POST</span>
        <span className="text-[20vw] font-serif-display font-black">AIR</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Top Kicker */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-900/80 bg-amber-100/70 border border-amber-200/80 px-3.5 py-1 rounded-full shadow-xs">
            <Stamp className="w-3.5 h-3.5 text-amber-800" />
            <span>Digital Postcard Studio</span>
            <span className="text-amber-400">·</span>
            <span className="text-amber-800">Multimodal AI</span>
          </div>
        </div>

        {/* Primary Headline & Subheading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
            Turn your memories into <span className="italic text-amber-900 underline decoration-amber-300 decoration-wavy decoration-2">beautiful postcards</span>
          </h1>
          <p className="text-stone-600 font-sans-clean text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Take a photo or choose one from your gallery, and let AI create a personalized postcard for you.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={onTakePhoto}
            className="w-full sm:w-auto flex-1 px-6 py-4 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 font-medium text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] group cursor-pointer"
          >
            <Camera className="w-5 h-5 text-amber-300 group-hover:rotate-6 transition-transform" />
            <span className="font-semibold">📷 Take a Photo</span>
          </button>

          <button
            onClick={onChoosePhoto}
            className="w-full sm:w-auto flex-1 px-6 py-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-base shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer"
          >
            <ImageIcon className="w-5 h-5 text-stone-600" />
            <span className="font-semibold">🖼️ Choose a Photo</span>
          </button>
        </div>

        {/* Tactile Visual Inspiration Showcase */}
        <div className="relative mb-16">
          <div className="text-center mb-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Handcrafted Postcard Styles & Real Prints
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Vintage Travel */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl shadow-sm border border-stone-200/80 hover:shadow-md transition-shadow group relative rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-stone-200 border border-amber-900/10">
                <img
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
                  alt="Santorini Greece coastal sample"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[11px] font-serif-display">
                  Vintage Travel
                </div>
                <div className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full border border-amber-900/40 border-dashed bg-white/90 text-amber-900 flex flex-col items-center justify-center text-[7px] font-serif-display uppercase leading-tight text-center">
                  <span>POSTED</span>
                  <span className="font-bold text-[8px]">AIR</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-display font-bold text-stone-900 text-sm">
                    Mediterranean Breeze
                  </h3>
                  <p className="text-xs text-stone-500">Amalfi Coast · Italy</p>
                </div>
                <span className="text-[11px] text-amber-800 font-mono font-medium">85¢ Airmail</span>
              </div>
            </div>

            {/* Card 2: Classic Polaroid */}
            <div className="bg-white p-4 pb-7 rounded-xl shadow-md border border-stone-200 hover:shadow-lg transition-shadow group relative rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
              <div className="relative aspect-square rounded-sm overflow-hidden mb-3 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                  alt="Sunny tropical beach memory sample"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-100/90 text-amber-950 font-mono text-[9px] rounded">
                  POLAROID
                </div>
              </div>
              <div className="text-center px-1">
                <p className="font-handwriting text-xl text-stone-800 font-bold leading-none">
                  "Golden Hour with you"
                </p>
                <p className="text-[11px] text-stone-400 mt-1">Sunset Bay, Pacific</p>
              </div>
            </div>

            {/* Card 3: Postcard Back with Stamp & Handwriting */}
            <div className="bg-[#FFFDF9] p-5 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-md transition-shadow group relative rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3 border-b border-stone-200 pb-2">
                  <div>
                    <span className="font-serif-display text-xs uppercase tracking-widest text-stone-500 font-bold">
                      CARTE POSTALE
                    </span>
                    <p className="text-[9px] text-stone-400">AIR MAIL / PAR AVION</p>
                  </div>
                  {/* Decorative Stamp */}
                  <div className="w-12 h-14 bg-amber-50 border-2 border-dashed border-amber-800/40 rounded p-1 flex flex-col items-center justify-between text-center relative shadow-xs">
                    <span className="text-[7px] text-amber-900 uppercase font-mono font-bold">PARIS</span>
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span className="text-[8px] font-bold text-amber-950">1st</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-handwriting text-lg text-stone-700 leading-snug">
                    "Wish you were here! The coffee is divine and the streets smell of fresh rain..."
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-200/60 pt-2 flex items-center justify-between mt-4">
                <span className="text-xs text-stone-400 font-handwriting text-base">With love, Maya</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                  Double Sided
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="border-t border-stone-200/70 pt-12 pb-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif-display font-bold text-stone-900 text-base">
                Multimodal AI Vision
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans-clean">
                Understands scene mood, subjects, colors, and geography to suggest harmonious styles and titles.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center mx-auto sm:mx-0">
                <Stamp className="w-4 h-4" />
              </div>
              <h3 className="font-serif-display font-bold text-stone-900 text-base">
                Authentic Ephemera
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans-clean">
                Complete with classic postmarks, serrated stamps, handwriting typefaces, and double-sided layouts.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mx-auto sm:mx-0">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="font-serif-display font-bold text-stone-900 text-base">
                High-Res & Printable
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans-clean">
                Download ready-to-share digital cards or print real 4×6 physical postcards for loved ones.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Postcards Strip if any exist */}
        {recentPostcards.length > 0 && (
          <div className="mt-12 bg-white/70 border border-stone-200 rounded-2xl p-6 shadow-xs max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif-display font-bold text-stone-900 text-base">
                  Your Recent Postcards
                </h3>
              </div>
              <button
                onClick={onOpenGallery}
                className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 group"
              >
                <span>View all ({recentPostcards.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentPostcards.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onOpenPostcard(p)}
                  className="group text-left focus:outline-none cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 mb-2 relative">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] bg-black/70 text-white rounded font-mono">
                      {p.style}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 truncate group-hover:text-amber-900">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">{p.occasion}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
