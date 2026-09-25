import React from 'react';
import { PostcardData, PostcardStyle } from '../types';
import { Stamp, Sparkles, MapPin, Plane, Compass, Heart } from 'lucide-react';

interface PostcardViewProps {
  postcard: PostcardData;
  side: 'front' | 'back';
  onClick?: () => void;
  className?: string;
  id?: string;
}

export const PostcardView: React.FC<PostcardViewProps> = ({
  postcard,
  side,
  onClick,
  className = '',
  id,
}) => {
  const {
    imageUrl,
    style,
    title,
    caption,
    destination,
    recipient,
    sender,
    message,
    occasion,
    stampTheme,
    stampPrice,
    postmarkLocation,
    createdAt,
  } = postcard;

  const dateObj = new Date(createdAt || Date.now());
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative w-full aspect-[16/10.5] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 select-none bg-[#FDFBF7] ${className}`}
    >
      {side === 'front' ? (
        <PostcardFront
          imageUrl={imageUrl}
          style={style}
          title={title}
          caption={caption}
          destination={destination}
          occasion={occasion}
          formattedDate={formattedDate}
          dateObj={dateObj}
        />
      ) : (
        <PostcardBack
          id={postcard.id}
          style={style}
          recipient={recipient}
          sender={sender}
          message={message}
          destination={destination}
          stampTheme={stampTheme || 'Airmail Classic'}
          stampPrice={stampPrice || '85¢'}
          postmarkLocation={postmarkLocation || (destination ? destination.toUpperCase() : 'WORLDWIDE')}
          formattedDate={formattedDate}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------
   POSTCARD FRONT RENDERER
------------------------------------------------------------- */
interface FrontProps {
  imageUrl: string;
  style: PostcardStyle;
  title: string;
  caption: string;
  destination: string;
  occasion: string;
  formattedDate: string;
  dateObj: Date;
}

const PostcardFront: React.FC<FrontProps> = ({
  imageUrl,
  style,
  title,
  caption,
  destination,
  occasion,
  formattedDate,
  dateObj,
}) => {
  switch (style) {
    /* 1. POLAROID STYLE */
    case 'Polaroid':
      return (
        <div className="w-full h-full bg-[#FAFAFA] p-3 sm:p-5 pb-8 sm:pb-12 flex flex-col justify-between shadow-inner">
          <div className="relative w-full flex-1 rounded-sm overflow-hidden bg-stone-900 border border-stone-200/90 shadow-sm">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            {destination && (
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono tracking-wider rounded">
                {destination}
              </div>
            )}
          </div>
          <div className="pt-3 sm:pt-4 text-center px-2">
            <h2 className="font-handwriting text-2xl sm:text-3xl text-stone-900 font-bold tracking-wide">
              {title}
            </h2>
            {caption && (
              <p className="font-handwriting text-stone-600 text-sm sm:text-base -mt-0.5">
                {caption}
              </p>
            )}
          </div>
        </div>
      );

    /* 2. TRAVEL AIRMAIL STYLE */
    case 'Travel':
      return (
        <div className="w-full h-full airmail-border p-2 sm:p-3 flex items-center justify-center">
          <div className="w-full h-full bg-[#FFFDF8] p-3 sm:p-4 rounded-lg flex flex-col justify-between relative overflow-hidden">
            <div className="relative w-full flex-1 rounded-md overflow-hidden bg-stone-200 border border-stone-300 shadow-sm">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />

              {/* Blue Airmail Par Avion Badge */}
              <div className="absolute top-3 left-3 bg-[#1d4ed8] text-white px-2.5 py-1 rounded shadow-sm text-[9px] sm:text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1">
                <Plane className="w-3 h-3" />
                <span>PAR AVION / AIR MAIL</span>
              </div>

              {/* Travel Destination stamp */}
              {destination && (
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-amber-900/30 text-amber-950 px-3 py-1 rounded shadow-sm flex items-center gap-1.5 text-xs font-serif-display font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>{destination}</span>
                </div>
              )}
            </div>

            <div className="pt-2 sm:pt-3 flex items-baseline justify-between px-1">
              <div>
                <h2 className="font-serif-display font-bold text-lg sm:text-2xl text-stone-900 tracking-tight">
                  {title}
                </h2>
                {caption && <p className="text-xs text-stone-500 font-sans-clean">{caption}</p>}
              </div>
              <span className="text-[11px] font-mono uppercase text-amber-900 font-semibold tracking-wider">
                {occasion} Post
              </span>
            </div>
          </div>
        </div>
      );

    /* 3. ELEGANT GOLD & SERIF STYLE */
    case 'Elegant':
      return (
        <div className="w-full h-full bg-[#FAF7F2] p-4 sm:p-6 flex flex-col justify-between relative border-4 border-[#E6DEC8]">
          {/* Inner hairline gold border */}
          <div className="relative w-full flex-1 rounded overflow-hidden border border-[#D5C7A5] p-1 bg-white">
            <div className="relative w-full h-full overflow-hidden">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                {destination && (
                  <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200 font-sans-clean mb-1">
                    {destination}
                  </p>
                )}
                <h2 className="font-marcellus text-xl sm:text-3xl text-amber-50 tracking-wide font-normal">
                  {title}
                </h2>
                {caption && (
                  <p className="text-xs sm:text-sm text-stone-200 italic font-serif-display mt-0.5">
                    {caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    /* 4. FILM 35MM RETRO STYLE */
    case 'Film':
      return (
        <div className="w-full h-full bg-stone-950 p-2 sm:p-3 flex flex-col justify-between text-white">
          {/* Film sprockets top */}
          <div className="flex items-center justify-between px-2 py-1 opacity-60">
            <div className="flex gap-2">
              <div className="w-3 h-2 rounded-xs bg-stone-700" />
              <div className="w-3 h-2 rounded-xs bg-stone-700" />
              <div className="w-3 h-2 rounded-xs bg-stone-700" />
              <div className="w-3 h-2 rounded-xs bg-stone-700" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-amber-400">
              KODAK PORTRA 400 · 35mm
            </span>
            <div className="flex gap-2">
              <div className="w-3 h-2 rounded-xs bg-stone-700" />
              <div className="w-3 h-2 rounded-xs bg-stone-700" />
            </div>
          </div>

          <div className="relative w-full flex-1 overflow-hidden bg-stone-900 border border-stone-800">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            {/* Amber LED film timestamp */}
            <div className="absolute bottom-2.5 right-3 font-mono font-bold text-amber-400 text-xs sm:text-sm tracking-wider drop-shadow-md">
              '{dateObj.getFullYear().toString().slice(-2)} {dateObj.getMonth() + 1} {dateObj.getDate()}
            </div>
          </div>

          {/* Film bottom strip */}
          <div className="pt-2 px-2 flex items-center justify-between text-stone-400 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold">24A</span>
              <span className="text-stone-200 font-serif-display text-xs">{title}</span>
            </div>
            <span>{destination || caption}</span>
          </div>
        </div>
      );

    /* 5. MINIMAL MODERNIST STYLE */
    case 'Minimal':
      return (
        <div className="w-full h-full bg-white p-4 sm:p-6 flex flex-col justify-between">
          <div className="relative w-full flex-1 overflow-hidden bg-stone-100">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="pt-3 sm:pt-4 flex items-end justify-between border-t border-stone-100 mt-2">
            <div>
              <h2 className="font-sans-clean font-extrabold text-base sm:text-xl text-stone-900 tracking-tight uppercase">
                {title}
              </h2>
              <p className="text-[11px] text-stone-500 font-sans-clean">{caption}</p>
            </div>
            <div className="text-right">
              {destination && (
                <span className="text-xs font-mono font-medium text-stone-800 block">
                  {destination}
                </span>
              )}
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      );

    /* 6. ARTISTIC / MUSEUM STYLE */
    case 'Artistic':
      return (
        <div className="w-full h-full bg-[#F4F1EA] p-5 sm:p-7 flex flex-col justify-between relative shadow-inner">
          <div className="relative w-full flex-1 rounded-sm overflow-hidden bg-stone-200 shadow-md">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="pt-3 text-center">
            <h2 className="font-serif-display italic font-semibold text-lg sm:text-2xl text-stone-900">
              {title}
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mt-0.5">
              <span>{destination || 'Postcard Study'}</span>
              <span>·</span>
              <span>{occasion}</span>
            </div>
          </div>
        </div>
      );

    /* 7. MODERN CONTEMPORARY STYLE */
    case 'Modern':
      return (
        <div className="w-full h-full bg-[#18181B] text-white p-3 sm:p-4 flex flex-col justify-between">
          <div className="relative w-full flex-1 rounded-lg overflow-hidden bg-stone-900">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px] uppercase tracking-wider">
              {occasion}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="font-sans-clean font-extrabold text-lg sm:text-2xl tracking-tight text-white">
                {title}
              </h2>
              {caption && <p className="text-xs text-stone-300 font-sans-clean">{caption}</p>}
            </div>
          </div>
        </div>
      );

    /* 8. VINTAGE (DEFAULT) */
    case 'Vintage':
    default:
      return (
        <div className="w-full h-full bg-[#FAF6EC] p-3 sm:p-5 flex flex-col justify-between border-8 border-[#F3ECE0] shadow-inner relative">
          <div className="relative w-full flex-1 rounded-xs overflow-hidden bg-stone-300 border border-amber-900/20 shadow-xs">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover sepia-[0.15] contrast-[1.05]"
            />
            {/* Vintage Postmark watermark in corner */}
            <div className="absolute top-2.5 right-2.5 w-14 h-14 rounded-full border border-amber-900/40 border-dashed bg-amber-50/80 backdrop-blur-xs flex flex-col items-center justify-center text-amber-950 rotate-12">
              <span className="text-[7px] uppercase font-mono font-bold">AIR POST</span>
              <Compass className="w-3.5 h-3.5 text-amber-900 my-0.5" />
              <span className="text-[6px] font-mono">{formattedDate}</span>
            </div>

            {destination && (
              <div className="absolute bottom-2.5 left-2.5 bg-stone-900/75 backdrop-blur-xs text-amber-100 text-[11px] font-serif-display px-2.5 py-1 rounded">
                {destination}
              </div>
            )}
          </div>

          <div className="pt-2 sm:pt-3 text-center">
            <h2 className="font-serif-display font-bold text-lg sm:text-2xl text-stone-900 tracking-tight">
              {title}
            </h2>
            {caption && (
              <p className="font-serif-display italic text-xs text-stone-600 mt-0.5">
                {caption}
              </p>
            )}
          </div>
        </div>
      );
  }
};

/* -------------------------------------------------------------
   POSTCARD BACK RENDERER
------------------------------------------------------------- */
interface BackProps {
  id?: string;
  style: PostcardStyle;
  recipient: string;
  sender: string;
  message: string;
  destination: string;
  stampTheme: string;
  stampPrice: string;
  postmarkLocation: string;
  formattedDate: string;
}

const PostcardBack: React.FC<BackProps> = ({
  id,
  style,
  recipient,
  sender,
  message,
  destination,
  stampTheme,
  stampPrice,
  postmarkLocation,
  formattedDate,
}) => {
  const isTypewriter = style === 'Film' || style === 'Minimal';
  const isSerif = style === 'Elegant';

  return (
    <div className="w-full h-full bg-[#FFFDF9] p-4 sm:p-7 flex flex-col justify-between relative border border-stone-200">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-stone-300 pb-2 mb-2 sm:mb-4">
        <div>
          <h3 className="font-serif-display font-black text-xs sm:text-sm tracking-[0.2em] text-stone-800 uppercase">
            CARTE POSTALE · POST CARD
          </h3>
          <p className="text-[8px] sm:text-[9px] font-mono text-stone-400 uppercase tracking-widest">
            UNIVERSAL POSTAL UNION / PAR AVION
          </p>
        </div>

        {destination && (
          <span className="text-[10px] sm:text-xs font-serif-display font-semibold text-amber-900">
            {destination}
          </span>
        )}
      </div>

      {/* Main 2-Column Split: Message on Left, Stamp & Address on Right */}
      <div className="flex-1 grid grid-cols-12 gap-3 sm:gap-6 items-stretch relative">
        {/* Left Column: Personal Message */}
        <div className="col-span-7 flex flex-col justify-between pr-2 sm:pr-4 border-r border-stone-200/90">
          <div className="space-y-2">
            {recipient && (
              <p
                className={`text-sm sm:text-base font-semibold text-stone-800 ${
                  isTypewriter ? 'font-typewriter' : isSerif ? 'font-serif-display' : 'font-handwriting'
                }`}
              >
                Dear {recipient},
              </p>
            )}

            <div
              className={`text-stone-700 leading-relaxed whitespace-pre-line text-sm sm:text-base ${
                isTypewriter
                  ? 'font-typewriter text-xs sm:text-sm text-stone-800'
                  : isSerif
                  ? 'font-serif-display text-xs sm:text-sm italic'
                  : 'font-handwriting text-base sm:text-xl text-stone-800'
              }`}
            >
              {message}
            </div>
          </div>

          {sender && (
            <div className="pt-2 text-right">
              <p
                className={`text-sm sm:text-lg font-bold text-amber-950 ${
                  isTypewriter ? 'font-typewriter' : 'font-handwriting'
                }`}
              >
                {sender}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Stamp & Ruled Address Lines */}
        <div className="col-span-5 flex flex-col justify-between pl-1 sm:pl-2">
          {/* Top Stamp Area & Postmark */}
          <div className="flex items-start justify-end gap-2 relative">
            {/* Circular Postmark ink stamp overlapping the postage stamp */}
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-stone-600/70 border-dashed text-stone-700 flex flex-col items-center justify-center text-center p-1 rotate-[-8deg] pointer-events-none select-none -mr-4 z-10 bg-white/40">
              <span className="text-[6px] sm:text-[7px] font-mono font-bold tracking-tight uppercase line-clamp-1">
                {postmarkLocation}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-extrabold my-0.5">
                {formattedDate}
              </span>
              <div className="flex gap-0.5 text-[6px] font-mono uppercase">
                <span>POSTED</span>
              </div>
            </div>

            {/* Vintage Serrated Stamp */}
            <div className="w-14 sm:w-18 h-18 sm:h-22 bg-[#FAF7EE] border-2 border-dashed border-amber-900/60 rounded p-1.5 flex flex-col items-center justify-between text-center shadow-xs relative">
              <div className="w-full flex items-center justify-between text-[7px] font-mono font-bold text-amber-900">
                <span>POST</span>
                <span>{stampPrice}</span>
              </div>
              <div className="my-auto py-1">
                <Stamp className="w-5 sm:w-6 h-5 sm:h-6 text-amber-800 mx-auto" />
                <span className="text-[7px] sm:text-[8px] font-serif-display font-bold text-stone-800 block line-clamp-1 mt-0.5">
                  {stampTheme}
                </span>
              </div>
              <div className="w-full border-t border-amber-800/30 pt-0.5 text-[6px] uppercase font-mono text-stone-400">
                1st CLASS
              </div>
            </div>
          </div>

          {/* Ruled Address Lines */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="border-b border-stone-300 pb-0.5 flex justify-between items-baseline">
              <span className="text-[8px] font-mono text-stone-400 uppercase">To:</span>
              <span className="text-xs font-handwriting text-stone-800 text-sm font-bold">
                {recipient || 'Special Someone'}
              </span>
            </div>
            <div className="border-b border-stone-300 pb-0.5 flex justify-between items-baseline">
              <span className="text-[8px] font-mono text-stone-400 uppercase">Address:</span>
              <span className="text-xs font-handwriting text-stone-700">
                {destination ? `Greetings from ${destination}` : 'Across the Miles'}
              </span>
            </div>
            <div className="border-b border-stone-300 h-3" />
            <div className="border-b border-stone-300 h-3" />
          </div>

          {/* Postal Barcode / Serial */}
          <div className="pt-2 flex items-center justify-between opacity-50">
            <span className="font-mono text-[8px] tracking-widest text-stone-500">
              ||| | |||| | |||||| || |
            </span>
            <span className="font-mono text-[8px] text-stone-500">
              NO. {id ? id.slice(0, 6) : '749201'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="border-t border-stone-200/80 pt-1.5 mt-2 flex items-center justify-between text-[8px] sm:text-[9px] text-stone-400 font-mono">
        <span>POSTCARD AI STUDIO</span>
        <span>PRINT & DIGITAL ARCHIVE</span>
      </div>
    </div>
  );
};
