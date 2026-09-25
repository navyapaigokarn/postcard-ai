import React, { useState } from 'react';
import {
  PostcardData,
} from '../types';
import {
  Camera,
  Trash2,
  ExternalLink,
  Edit3,
  RotateCcw,
  Download,
  Calendar,
  Sparkles,
  ArrowLeft,
  Stamp,
  AlertTriangle,
} from 'lucide-react';
import { triggerDownload } from '../utils/imageUtils';

interface MyPostcardsProps {
  postcards: PostcardData[];
  onOpen: (postcard: PostcardData) => void;
  onEdit: (postcard: PostcardData) => void;
  onRegenerate: (postcard: PostcardData) => void;
  onDelete: (id: string) => void;
  onNewPostcard: () => void;
  onBackToHome: () => void;
}

export const MyPostcards: React.FC<MyPostcardsProps> = ({
  postcards,
  onOpen,
  onEdit,
  onRegenerate,
  onDelete,
  onNewPostcard,
  onBackToHome,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDownload = (postcard: PostcardData) => {
    // Downloads the photo asset directly with title
    triggerDownload(
      postcard.imageUrl,
      `postcard-${postcard.title.toLowerCase().replace(/\s+/g, '-')}.jpg`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center">
          <h2 className="font-serif-display font-bold text-2xl text-stone-900">
            My Postcards Collection
          </h2>
          <p className="text-xs text-stone-500 font-sans-clean mt-0.5">
            {postcards.length} {postcards.length === 1 ? 'postcard' : 'postcards'} created & archived
          </p>
        </div>

        <button
          onClick={onNewPostcard}
          className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Postcard</span>
        </button>
      </div>

      {/* Empty State */}
      {postcards.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center max-w-lg mx-auto shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-xs">
            <Stamp className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-display font-bold text-xl text-stone-900">
              No Postcards Yet
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Capture or upload your first photo and let AI turn it into a personalized keepsake.
            </p>
          </div>
          <button
            onClick={onNewPostcard}
            className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 text-sm font-semibold transition shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create Your First Postcard</span>
          </button>
        </div>
      ) : (
        /* Postcards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postcards.map((p) => {
            const formattedDate = new Date(p.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Thumbnail Preview Banner */}
                <div
                  onClick={() => onOpen(p)}
                  className="relative aspect-[16/10] bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-colors" />

                  {/* Style & Occasion Tag */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono tracking-wider">
                      {p.style}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-semibold">
                      {p.occasion}
                    </span>
                  </div>

                  {/* Stamp icon watermark */}
                  <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-amber-900/30 flex items-center justify-center text-amber-900 shadow-xs">
                    <Stamp className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-3">
                    <h3
                      onClick={() => onOpen(p)}
                      className="font-serif-display font-bold text-base text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 italic mt-0.5">
                      {p.caption || `To: ${p.recipient}`}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-2 font-mono">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{formattedDate}</span>
                      {p.destination && (
                        <>
                          <span>·</span>
                          <span className="truncate">{p.destination}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {/* Open Action */}
                      <button
                        onClick={() => onOpen(p)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
                        title="Open & Flip Postcard"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      {/* Edit Action */}
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Regenerate Action */}
                      <button
                        onClick={() => onRegenerate(p)}
                        className="p-1.5 rounded-lg text-amber-800 hover:text-amber-950 hover:bg-amber-50 transition"
                        title="Regenerate Message"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {/* Download Action */}
                      <button
                        onClick={() => handleDownload(p)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
                        title="Download Photo"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Delete Confirmation or Trigger */}
                    {deleteConfirmId === p.id ? (
                      <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg">
                        <button
                          onClick={() => {
                            onDelete(p.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600 text-white"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-[11px] text-stone-600 hover:text-stone-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Postcard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
