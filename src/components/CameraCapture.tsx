import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, ArrowLeft, Image as ImageIcon, AlertCircle, Grid, Zap } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCaptured: (imageBase64: string) => void;
  onFallbackToUpload: () => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCaptured,
  onFallbackToUpload,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  // Check available cameras
  useEffect(() => {
    async function checkDevices() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        }
      } catch (e) {
        console.warn('Could not enumerate media devices:', e);
      }
    }
    checkDevices();
  }, []);

  // Initialize camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setIsLoading(true);
    setCameraError(null);

    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this device/browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => console.warn('Video play error:', err));
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      let errorMsg = 'Could not access device camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera access in your browser settings, or choose an existing photo instead.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device found on this system.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is currently in use by another application.';
      }
      setCameraError(errorMsg);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Switch camera between front and rear
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture frame
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Visual camera flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    // Pause stream while previewing
    if (stream) {
      stream.getTracks().forEach((t) => (t.enabled = false));
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    if (stream) {
      stream.getTracks().forEach((t) => (t.enabled = true));
    }
  };

  // Accept captured photo
  const handleConfirmPhoto = () => {
    if (capturedImage) {
      // Clean up stream before proceeding
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onPhotoCaptured(capturedImage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="font-serif-display font-bold text-lg text-stone-900">
          {capturedImage ? 'Review Photo' : 'Take a Photo'}
        </h2>

        {!capturedImage && !cameraError && (
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg text-xs transition ${
              showGrid ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:bg-stone-100'
            }`}
            title="Toggle Framing Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
        )}
        {(capturedImage || cameraError) && <div className="w-8" />}
      </div>

      {/* Main Viewport Container */}
      <div className="relative bg-stone-950 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] shadow-xl border border-stone-800 flex items-center justify-center">
        {/* Flash overlay */}
        {flashActive && (
          <div className="absolute inset-0 bg-white z-30 transition-opacity duration-200" />
        )}

        {/* Live Camera View */}
        {!capturedImage && !cameraError && (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Rule of thirds grid overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 opacity-30">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>
            )}

            {/* Corner viewfinder markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60 pointer-events-none" />
          </>
        )}

        {/* Loading state */}
        {isLoading && !cameraError && !capturedImage && (
          <div className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center gap-3 z-20 text-white">
            <RefreshCw className="w-7 h-7 animate-spin text-amber-400" />
            <p className="text-sm font-medium">Starting camera...</p>
          </div>
        )}

        {/* Captured Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured memory"
            className="w-full h-full object-cover"
          />
        )}

        {/* Error / Permission Denied State */}
        {cameraError && (
          <div className="p-6 text-center max-w-md mx-auto space-y-4 text-white z-20">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-lg font-bold">Camera Unavailable</h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{cameraError}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                onClick={onFallbackToUpload}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Choose a Photo Instead</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for extraction */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls Bar Below Camera */}
      {!cameraError && (
        <div className="mt-6 flex items-center justify-between px-2">
          {/* Left: Switch camera button (if multiple devices) */}
          <div className="w-24">
            {!capturedImage && hasMultipleCameras && (
              <button
                onClick={toggleFacingMode}
                className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition active:scale-95 flex items-center gap-1.5 text-xs font-medium"
                title="Flip Camera"
              >
                <RefreshCw className="w-4 h-4 text-stone-700" />
                <span className="hidden sm:inline">Flip</span>
              </button>
            )}
          </div>

          {/* Center: Primary Shutter or Decision Buttons */}
          <div className="flex items-center gap-4">
            {!capturedImage ? (
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="w-18 h-18 rounded-full border-4 border-amber-900/30 p-1 flex items-center justify-center group cursor-pointer transition active:scale-95 disabled:opacity-50"
                title="Capture Photo"
              >
                <div className="w-full h-full rounded-full bg-amber-800 group-hover:bg-amber-900 group-active:scale-90 transition-all flex items-center justify-center shadow-md">
                  <Camera className="w-7 h-7 text-amber-100" />
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetake}
                  className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake</span>
                </button>

                <button
                  onClick={handleConfirmPhoto}
                  className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 text-sm font-semibold transition active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Use This Photo</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Fallback option */}
          <div className="w-24 text-right">
            {!capturedImage && (
              <button
                onClick={onFallbackToUpload}
                className="text-xs text-stone-500 hover:text-stone-900 font-medium underline underline-offset-4 transition"
              >
                Choose file
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
