import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, ArrowRight, Eye, Palette, Compass, Layers, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { PhotoAnalysis } from '../types';
import { analyzePhotoWithAI } from '../services/api';

interface AIAnalysisStepProps {
  imageUrl: string;
  onAnalysisComplete: (analysis: PhotoAnalysis) => void;
  onBack: () => void;
}

export const AIAnalysisStep: React.FC<AIAnalysisStepProps> = ({
  imageUrl,
  onAnalysisComplete,
  onBack,
}) => {
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const analysisSteps = [
    'Scanning visual features & light composition...',
    'Identifying primary subjects & environmental scenery...',
    'Extracting emotional mood & dominant color tones...',
    'Curating postcard aesthetic, typography & postal themes...',
  ];

  useEffect(() => {
    let stepTimer: any;
    if (isLoading) {
      stepTimer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % analysisSteps.length);
      }, 1400);
    }
    return () => clearInterval(stepTimer);
  }, [isLoading]);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzePhotoWithAI(imageUrl);
      setAnalysis(result);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err?.message || 'Failed to complete AI photo analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [imageUrl]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Photo</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <h2 className="font-serif-display font-bold text-lg sm:text-xl text-stone-900">
            Multimodal AI Analysis
          </h2>
        </div>

        <div className="w-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Photograph with scanning beam indicator */}
        <div className="md:col-span-5 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={imageUrl}
              alt="Memory to analyze"
              className="w-full h-full object-cover"
            />

            {/* Scanning beam animation during loading */}
            {isLoading && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-[bounce_2s_infinite]" />
                <div className="absolute inset-0 bg-amber-900/10 backdrop-brightness-105" />
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span className="font-mono">SOURCE PHOTOGRAPH</span>
            <span className="font-mono">{isLoading ? 'ANALYZING...' : 'PROCESSED'}</span>
          </div>
        </div>

        {/* Right: AI Understanding Results */}
        <div className="md:col-span-7 space-y-6">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-stone-900 text-base">
                    Understanding your memory...
                  </h3>
                  <p className="text-xs text-stone-500 font-sans-clean">
                    Gemini Multimodal Vision is reading subjects, mood, and atmosphere
                  </p>
                </div>
              </div>

              {/* Progress step */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-amber-800 animate-spin flex-shrink-0" />
                <p className="text-xs sm:text-sm text-amber-950 font-medium font-sans-clean transition-all">
                  {analysisSteps[currentStepIndex]}
                </p>
              </div>

              {/* Skeleton lines */}
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-stone-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-stone-100 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-stone-100 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-2xl border border-red-200 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif-display font-bold">Analysis Interrupted</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{error}</p>
              <button
                onClick={runAnalysis}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          ) : analysis ? (
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Analysis Complete</span>
                  </div>
                  <h3 className="font-serif-display font-bold text-xl text-stone-900 mt-1">
                    "{analysis.suggestedTitle}"
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 italic">
                    {analysis.suggestedCaption}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                    Suggested Style
                  </span>
                  <span className="font-serif-display font-bold text-amber-900 text-sm">
                    {analysis.suggestedStyle}
                  </span>
                </div>
              </div>

              {/* Grid of structured findings */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Scene & Environment */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Eye className="w-3.5 h-3.5 text-amber-800" />
                    <span>Scene & Environment</span>
                  </div>
                  <p className="font-semibold text-stone-800 capitalize">{analysis.scene}</p>
                  <p className="text-[11px] text-stone-500 capitalize">{analysis.environment}</p>
                </div>

                {/* Mood & Atmosphere */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Compass className="w-3.5 h-3.5 text-amber-800" />
                    <span>Mood & Atmosphere</span>
                  </div>
                  <p className="font-semibold text-stone-800 capitalize">{analysis.mood}</p>
                  <p className="text-[11px] text-stone-500">Theme: {analysis.suggestedTheme}</p>
                </div>

                {/* Main Subjects */}
                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Layers className="w-3.5 h-3.5 text-amber-800" />
                    <span>Main Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-800 text-[11px] font-medium capitalize"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Palette className="w-3.5 h-3.5 text-amber-800" />
                    <span>Color Palette</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {analysis.dominantColors.map((color, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[11px] font-medium capitalize"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggested Message Sneak Peek */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/50">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900/70 block mb-1">
                  Drafted Postcard Sentiment
                </span>
                <p className="font-handwriting text-stone-700 text-lg leading-snug">
                  "{analysis.suggestedMessage}"
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onAnalysisComplete(analysis)}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 text-sm font-semibold transition active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Personalize Postcard</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
