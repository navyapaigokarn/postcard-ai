import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Wand2, RefreshCw, Stamp, Send, MapPin, User, MessageSquare } from 'lucide-react';
import { PhotoAnalysis, PostcardOccasion, PostcardStyle, PostcardData } from '../types';
import { craftPostcardWithAI } from '../services/api';

interface PersonalizationStepProps {
  imageUrl: string;
  analysis: PhotoAnalysis;
  onGenerate: (data: Omit<PostcardData, 'id' | 'createdAt'>) => void;
  onBack: () => void;
  initialData?: Partial<PostcardData>;
}

export const PersonalizationStep: React.FC<PersonalizationStepProps> = ({
  imageUrl,
  analysis,
  onGenerate,
  onBack,
  initialData,
}) => {
  const occasions: PostcardOccasion[] = [
    'Travel',
    'Birthday',
    'Wedding',
    'Anniversary',
    'Festival',
    'Thank You',
    'Friendship',
    'Just Because',
  ];

  const styles: { id: PostcardStyle; label: string; desc: string }[] = [
    { id: 'Vintage', label: 'Vintage', desc: 'Aged parchment & airmail cancellation' },
    { id: 'Polaroid', label: 'Polaroid', desc: 'Classic instant frame & marker note' },
    { id: 'Travel', label: 'Travel', desc: 'Red & blue airmail stripe with postal marks' },
    { id: 'Minimal', label: 'Minimal', desc: 'Clean Swiss typography & white space' },
    { id: 'Elegant', label: 'Elegant', desc: 'Refined serif typography & gold borders' },
    { id: 'Artistic', label: 'Artistic', desc: 'Deckled museum paper & botanical stamp' },
    { id: 'Film', label: 'Film', desc: '35mm analogue grain, sprocket & timestamp' },
    { id: 'Modern', label: 'Modern', desc: 'Bold contemporary layouts & crisp accents' },
  ];

  // Match initial state
  const [occasion, setOccasion] = useState<PostcardOccasion>(
    (initialData?.occasion as PostcardOccasion) ||
      (occasions.includes(analysis.suggestedTheme as PostcardOccasion)
        ? (analysis.suggestedTheme as PostcardOccasion)
        : 'Travel')
  );

  const [style, setStyle] = useState<PostcardStyle>(
    initialData?.style || analysis.suggestedStyle || 'Vintage'
  );

  const [destination, setDestination] = useState<string>(
    initialData?.destination || analysis.detectedLocation || ''
  );
  const [recipient, setRecipient] = useState<string>(initialData?.recipient || '');
  const [sender, setSender] = useState<string>(initialData?.sender || '');
  const [title, setTitle] = useState<string>(initialData?.title || analysis.suggestedTitle);
  const [caption, setCaption] = useState<string>(initialData?.caption || analysis.suggestedCaption);
  const [message, setMessage] = useState<string>(
    initialData?.message || analysis.suggestedMessage
  );

  const [stampTheme, setStampTheme] = useState<string>(initialData?.stampTheme || 'Airmail Classic');
  const [stampPrice, setStampPrice] = useState<string>(initialData?.stampPrice || '85¢');
  const [postmarkLocation, setPostmarkLocation] = useState<string>(
    initialData?.postmarkLocation || (destination ? destination.toUpperCase() : 'AIR MAIL')
  );

  const [isPolishing, setIsPolishing] = useState<boolean>(false);

  // Use AI to polish or regenerate the message based on chosen occasion and inputs
  const handleAIPolish = async () => {
    setIsPolishing(true);
    try {
      const res = await craftPostcardWithAI({
        occasion,
        style,
        destination,
        recipient,
        sender,
        personalMessage: message,
        analysis,
      });

      if (res.title) setTitle(res.title);
      if (res.caption) setCaption(res.caption);
      if (res.message) setMessage(res.message);
      if (res.stampTheme) setStampTheme(res.stampTheme);
      if (res.stampPrice) setStampPrice(res.stampPrice);
      if (res.postmarkLocation) setPostmarkLocation(res.postmarkLocation);
    } catch (err) {
      console.warn('Could not polish with AI:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      imageUrl,
      analysis,
      occasion,
      style,
      title: title || 'Greetings',
      caption: caption || 'Wish you were here',
      destination,
      recipient: recipient || 'Friend',
      sender: sender || 'Sender',
      message: message || 'Thinking of you!',
      stampTheme,
      stampPrice,
      postmarkLocation: postmarkLocation || (destination ? destination.toUpperCase() : 'POSTED'),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis</span>
        </button>

        <h2 className="font-serif-display font-bold text-xl sm:text-2xl text-stone-900">
          Personalize Your Postcard
        </h2>

        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Occasion Selection */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <label className="block font-serif-display font-bold text-base text-stone-900">
            Occasion
          </label>
          <p className="text-xs text-stone-500 font-sans-clean -mt-1 mb-2">
            Select the sentiment or celebration for your postcard
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {occasions.map((occ) => {
              const isSelected = occasion === occ;
              return (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-900 text-amber-50 shadow-sm scale-[1.02]'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Visual Style Selection */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <label className="block font-serif-display font-bold text-base text-stone-900">
            Postcard Aesthetic Style
          </label>
          <p className="text-xs text-stone-500 font-sans-clean -mt-1 mb-2">
            AI suggested <span className="font-semibold text-amber-900">{analysis.suggestedStyle}</span> based on photo mood
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {styles.map((s) => {
              const isSelected = style === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-900 bg-amber-50/70 shadow-sm ring-2 ring-amber-900/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-serif-display font-bold text-sm ${
                        isSelected ? 'text-amber-950' : 'text-stone-900'
                      }`}
                    >
                      {s.label}
                    </span>
                    {analysis.suggestedStyle === s.id && (
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-amber-200 text-amber-900 rounded font-semibold">
                        AI Pick
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Postcard Front Headline & Location */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif-display font-bold text-base text-stone-900">
            Front Cover Typography
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Postcard Title (Front headline)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunset Memories"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Subtitle or Greeting Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Greetings from paradise"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Destination or City (Optional)</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (!postmarkLocation || postmarkLocation === 'AIR MAIL') {
                    setPostmarkLocation(e.target.value.toUpperCase());
                  }
                }}
                placeholder="e.g. Amalfi Coast, Italy or Malibu, CA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
              />
            </div>
          </div>
        </div>

        {/* 4. Postcard Back: Recipient, Sender & Personal Message */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display font-bold text-base text-stone-900">
              Back of Postcard Message & Stamp
            </h3>
            <button
              type="button"
              onClick={handleAIPolish}
              disabled={isPolishing}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              {isPolishing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>{isPolishing ? 'Refining...' : 'Regenerate Message with AI'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>Recipient Name</span>
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Maya or Grandma & Grandpa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-stone-500" />
                <span>Sender Name (Sign-off)</span>
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Alex or Love, Lucas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                  <span>Personal Handwritten Message</span>
                </span>
                <span className="text-[11px] text-stone-400 font-normal">
                  Renders in handwriting on back
                </span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your personal postcard message..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 font-sans-clean leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 font-semibold text-base shadow-md hover:shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Generate Postcard</span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </form>
    </div>
  );
};
