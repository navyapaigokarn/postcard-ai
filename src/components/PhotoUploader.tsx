import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, ArrowLeft, RefreshCw, ArrowRight, Camera, Check } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

interface PhotoUploaderProps {
  onPhotoSelected: (imageBase64: string) => void;
  onSwitchToCamera: () => void;
  onCancel: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotoSelected,
  onSwitchToCamera,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    // Validate format: JPG, JPEG, PNG, WEBP
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid image format: JPG, PNG, or WEBP.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const { base64 } = await processImageFile(file);
      setPreviewUrl(base64);
    } catch (err: any) {
      console.error('Error reading image file:', err);
      setErrorMessage('Could not process this image. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleContinue = () => {
    if (previewUrl) {
      onPhotoSelected(previewUrl);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="font-serif-display font-bold text-xl text-stone-900">
          {previewUrl ? 'Photo Preview' : 'Choose a Photo'}
        </h2>

        <div className="w-12 text-right">
          <button
            onClick={onSwitchToCamera}
            className="text-xs text-amber-900 hover:text-amber-950 font-medium flex items-center gap-1 ml-auto"
            title="Switch to camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera</span>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {/* Selected Preview State */}
      {previewUrl ? (
        <div className="space-y-6">
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-stone-200 shadow-sm">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80">
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-full h-full object-contain bg-stone-900/5"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={triggerPicker}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Replace Photo</span>
            </button>

            <button
              onClick={handleContinue}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 text-sm font-semibold transition active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Analyze & Continue</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Dropzone State */
        <div className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerPicker}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
              dragActive
                ? 'border-amber-600 bg-amber-50/50 scale-[1.01]'
                : 'border-stone-300 bg-white hover:border-amber-700/60 hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-sm">
              <p className="font-serif-display font-bold text-base sm:text-lg text-stone-900">
                Click to browse or drag and drop
              </p>
              <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
                Supports JPG, JPEG, PNG, and WEBP formats
              </p>
            </div>

            <button
              type="button"
              className="mt-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium transition shadow-xs pointer-events-none"
            >
              Select Image from Gallery
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Quick Fallback info */}
          <div className="text-center pt-4">
            <button
              onClick={onSwitchToCamera}
              className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4 transition inline-flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-stone-400" />
              <span>Rather snap a new photo with your camera?</span>
            </button>
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-amber-800 animate-spin" />
            <span className="text-sm font-medium text-stone-800">Optimizing photo...</span>
          </div>
        </div>
      )}
    </div>
  );
};
