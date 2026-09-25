import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Download,
  Share2,
  Edit3,
  Wand2,
  Printer,
  Check,
  ChevronDown,
  Layers,
  ArrowLeft,
  Sparkles,
  BookmarkCheck,
} from 'lucide-react';
import { PostcardData, PostcardStyle } from '../types';
import { PostcardView } from './PostcardView';
import { downloadElementAsImage } from '../utils/imageUtils';
import { craftPostcardWithAI } from '../services/api';

interface PostcardPreviewScreenProps {
  postcard: PostcardData;
  onEdit: () => void;
  onUpdatePostcard: (updated: PostcardData) => void;
  onBackToHome: () => void;
}

export const PostcardPreviewScreen: React.FC<PostcardPreviewScreenProps> = ({
  postcard,
  onEdit,
  onUpdatePostcard,
  onBackToHome,
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadDropdown, setDownloadDropdown] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  const availableStyles: PostcardStyle[] = [
    'Vintage',
    'Polaroid',
    'Travel',
    'Minimal',
    'Elegant',
    'Artistic',
    'Film',
    'Modern',
  ];

  // Toggle Front / Back flip
  const handleFlip = () => {
    setIsFlipping(true);
    setSide((prev) => (prev === 'front' ? 'back' : 'front'));
    setTimeout(() => setIsFlipping(false), 300);
  };

  // Change style instantly
  const handleStyleChange = (newStyle: PostcardStyle) => {
    onUpdatePostcard({
      ...postcard,
      style: newStyle,
    });
  };

  // Regenerate message with AI
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await craftPostcardWithAI({
        occasion: postcard.occasion,
        style: postcard.style,
        destination: postcard.destination,
        recipient: postcard.recipient,
        sender: postcard.sender,
        personalMessage: postcard.message,
        analysis: postcard.analysis,
      });

      onUpdatePostcard({
        ...postcard,
        title: res.title || postcard.title,
        caption: res.caption || postcard.caption,
        message: res.message || postcard.message,
        stampTheme: res.stampTheme || postcard.stampTheme,
        stampPrice: res.stampPrice || postcard.stampPrice,
        postmarkLocation: res.postmarkLocation || postcard.postmarkLocation,
      });
    } catch (err) {
      console.warn('Failed to regenerate postcard:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Download Front side as PNG
  const handleDownloadFront = async () => {
    setIsDownloading(true);
    setDownloadDropdown(false);
    try {
      const el = document.getElementById('postcard-render-front');
      if (el) {
        await downloadElementAsImage(el, `postcard-${postcard.title.toLowerCase().replace(/\s+/g, '-')}-front.png`, 2.5);
      }
    } catch (err) {
      console.error('Download front error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download Back side as PNG
  const handleDownloadBack = async () => {
    setIsDownloading(true);
    setDownloadDropdown(false);
    try {
      const el = document.getElementById('postcard-render-back');
      if (el) {
        await downloadElementAsImage(el, `postcard-${postcard.title.toLowerCase().replace(/\s+/g, '-')}-back.png`, 2.5);
      }
    } catch (err) {
      console.error('Download back error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Print Postcard
  const handlePrint = () => {
    window.print();
  };

  // Native Web Share or fallback
  const handleShare = async () => {
    const shareText = `Check out this digital postcard: "${postcard.title}" for ${postcard.recipient || 'a friend'}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Postcard AI: ${postcard.title}`,
          text: `${shareText}\n\n"${postcard.message}"`,
          url: window.location.href,
        });
        return;
      } catch (e) {
        console.log('Share dismissed or failed:', e);
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(
        `📬 Postcard AI\n\nTitle: ${postcard.title}\nTo: ${postcard.recipient}\nFrom: ${postcard.sender}\n\n"${postcard.message}"\n\nCreated with Postcard AI: ${window.location.href}`
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Saved to My Postcards</span>
        </div>
      </div>

      {/* Main Postcard Canvas Area with 3D Flip */}
      <div className="relative mb-6">
        {/* Flip Side Toggle Pill */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="inline-flex p-1 bg-stone-200/80 rounded-xl shadow-inner">
            <button
              onClick={() => setSide('front')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                side === 'front'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Postcard Front
            </button>
            <button
              onClick={() => setSide('back')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                side === 'back'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Postcard Back
            </button>
          </div>

          <button
            onClick={handleFlip}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition shadow-xs flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Flip Card"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Flip</span>
          </button>
        </div>

        {/* The Card Viewport */}
        <div className="max-w-2xl mx-auto cursor-pointer" onClick={handleFlip}>
          <div className="transition-transform duration-500 ease-out hover:scale-[1.01]">
            <PostcardView
              id="postcard-current-view"
              postcard={postcard}
              side={side}
            />
          </div>
          <p className="text-center text-[11px] text-stone-400 mt-2 font-mono">
            Click anywhere on postcard or use toggle above to flip
          </p>
        </div>

        {/* Hidden render targets for crisp PNG export of both sides */}
        <div className="fixed -left-[9999px] top-0 pointer-events-none">
          <div style={{ width: '800px', height: '525px' }}>
            <PostcardView id="postcard-render-front" postcard={postcard} side="front" />
          </div>
          <div style={{ width: '800px', height: '525px' }}>
            <PostcardView id="postcard-render-back" postcard={postcard} side="back" />
          </div>
        </div>
      </div>

      {/* Quick Style Switcher Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-stone-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-800" />
            <span>Switch Visual Style</span>
          </span>
          <span className="text-xs font-serif-display font-semibold text-amber-900">
            Current: {postcard.style}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {availableStyles.map((s) => {
            const isActive = postcard.style === s;
            return (
              <button
                key={s}
                onClick={() => handleStyleChange(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-900 text-amber-50 shadow-sm font-semibold'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Toolbar: Edit, Regenerate, Download, Share, Print */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="p-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-stone-600" />
          <span>Edit Details</span>
        </button>

        {/* Regenerate AI Button */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-50"
        >
          {isRegenerating ? (
            <RotateCcw className="w-4 h-4 animate-spin text-amber-800" />
          ) : (
            <Wand2 className="w-4 h-4 text-amber-800" />
          )}
          <span>{isRegenerating ? 'Rewriting...' : 'Regenerate'}</span>
        </button>

        {/* Download Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDownloadDropdown(!downloadDropdown)}
            disabled={isDownloading}
            className="w-full p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isDownloading ? 'Exporting...' : 'Download'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {downloadDropdown && (
            <div className="absolute bottom-full mb-2 left-0 right-0 sm:right-auto sm:w-56 bg-white rounded-xl shadow-xl border border-stone-200 p-1.5 z-30 space-y-1">
              <button
                onClick={handleDownloadFront}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-800 hover:bg-stone-100 transition flex items-center justify-between"
              >
                <span>Download Front Cover</span>
                <span className="text-[10px] text-stone-400 font-mono">PNG</span>
              </button>
              <button
                onClick={handleDownloadBack}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-800 hover:bg-stone-100 transition flex items-center justify-between"
              >
                <span>Download Back Message</span>
                <span className="text-[10px] text-stone-400 font-mono">PNG</span>
              </button>
              <div className="border-t border-stone-100 my-1" />
              <button
                onClick={handlePrint}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-amber-900 hover:bg-amber-50 transition flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ready Postcard</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          {copySuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-stone-600" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
