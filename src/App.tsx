/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppView, PostcardData, PhotoAnalysis } from './types';
import { getSavedPostcards, savePostcard, deletePostcard } from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { CameraCapture } from './components/CameraCapture';
import { PhotoUploader } from './components/PhotoUploader';
import { AIAnalysisStep } from './components/AIAnalysisStep';
import { PersonalizationStep } from './components/PersonalizationStep';
import { PostcardPreviewScreen } from './components/PostcardPreviewScreen';
import { MyPostcards } from './components/MyPostcards';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [savedPostcards, setSavedPostcards] = useState<PostcardData[]>([]);

  // Workflow states
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<PhotoAnalysis | null>(null);
  const [activePostcard, setActivePostcard] = useState<PostcardData | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);

  // Load saved postcards from storage on mount
  useEffect(() => {
    const list = getSavedPostcards();
    setSavedPostcards(list);
  }, []);

  // Handle Photo selection from Camera or Upload
  const handlePhotoCapturedOrSelected = (base64Image: string) => {
    setCurrentImage(base64Image);
    setCurrentAnalysis(null);
    setCurrentView('analysis');
  };

  // Handle AI analysis completed
  const handleAnalysisComplete = (analysis: PhotoAnalysis) => {
    setCurrentAnalysis(analysis);
    setCurrentView('personalize');
  };

  // Generate Postcard
  const handleGeneratePostcard = (
    data: Omit<PostcardData, 'id' | 'createdAt'>
  ) => {
    const id = activePostcard?.id || `postcard_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newPostcard: PostcardData = {
      ...data,
      id,
      createdAt: activePostcard?.createdAt || new Date().toISOString(),
    };

    // Save to storage
    savePostcard(newPostcard);
    setSavedPostcards(getSavedPostcards());
    setActivePostcard(newPostcard);
    setCurrentView('preview');
  };

  // Update existing postcard (e.g. style change or regenerated message from preview)
  const handleUpdateActivePostcard = (updated: PostcardData) => {
    setActivePostcard(updated);
    savePostcard(updated);
    setSavedPostcards(getSavedPostcards());
  };

  // Edit action
  const handleEditPostcard = (postcardToEdit?: PostcardData) => {
    const target = postcardToEdit || activePostcard;
    if (target) {
      setCurrentImage(target.imageUrl);
      if (target.analysis) {
        setCurrentAnalysis(target.analysis);
      } else {
        // Construct fallback analysis so form works seamlessly
        setCurrentAnalysis({
          scene: 'custom memory',
          subjects: ['keepsake'],
          environment: 'destination',
          mood: 'warm',
          dominantColors: ['golden amber'],
          suggestedTheme: target.occasion,
          suggestedStyle: target.style,
          suggestedTitle: target.title,
          suggestedCaption: target.caption,
          suggestedMessage: target.message,
        });
      }
      setActivePostcard(target);
      setIsEditingExisting(true);
      setCurrentView('personalize');
    }
  };

  // Open existing postcard in preview
  const handleOpenPostcard = (postcard: PostcardData) => {
    setActivePostcard(postcard);
    setCurrentView('preview');
  };

  // Delete postcard
  const handleDeletePostcard = (id: string) => {
    const remaining = deletePostcard(id);
    setSavedPostcards(remaining);
    if (activePostcard?.id === id) {
      setActivePostcard(null);
      setCurrentView('gallery');
    }
  };

  // Reset to create new
  const handleStartNew = () => {
    setCurrentImage(null);
    setCurrentAnalysis(null);
    setActivePostcard(null);
    setIsEditingExisting(false);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col font-sans-clean selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'home') handleStartNew();
          else setCurrentView(view);
        }}
        savedCount={savedPostcards.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeHero
            onTakePhoto={() => setCurrentView('camera')}
            onChoosePhoto={() => setCurrentView('upload')}
            onOpenGallery={() => setCurrentView('gallery')}
            recentPostcards={savedPostcards}
            onOpenPostcard={handleOpenPostcard}
          />
        )}

        {currentView === 'camera' && (
          <CameraCapture
            onPhotoCaptured={handlePhotoCapturedOrSelected}
            onFallbackToUpload={() => setCurrentView('upload')}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'upload' && (
          <PhotoUploader
            onPhotoSelected={handlePhotoCapturedOrSelected}
            onSwitchToCamera={() => setCurrentView('camera')}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'analysis' && currentImage && (
          <AIAnalysisStep
            imageUrl={currentImage}
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setCurrentView('upload')}
          />
        )}

        {currentView === 'personalize' && currentImage && currentAnalysis && (
          <PersonalizationStep
            imageUrl={currentImage}
            analysis={currentAnalysis}
            initialData={isEditingExisting && activePostcard ? activePostcard : undefined}
            onGenerate={handleGeneratePostcard}
            onBack={() => {
              if (isEditingExisting && activePostcard) {
                setCurrentView('preview');
              } else {
                setCurrentView('analysis');
              }
            }}
          />
        )}

        {currentView === 'preview' && activePostcard && (
          <PostcardPreviewScreen
            postcard={activePostcard}
            onEdit={() => handleEditPostcard(activePostcard)}
            onUpdatePostcard={handleUpdateActivePostcard}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'gallery' && (
          <MyPostcards
            postcards={savedPostcards}
            onOpen={handleOpenPostcard}
            onEdit={handleEditPostcard}
            onRegenerate={handleOpenPostcard}
            onDelete={handleDeletePostcard}
            onNewPostcard={() => setCurrentView('home')}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-[#FAF8F3] py-8 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif-display font-medium text-stone-700">
            Postcard AI · Handcrafted Digital & Printable Keepsakes
          </p>
          <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
            <span>Multimodal Vision</span>
            <span>·</span>
            <span>8 Archival Styles</span>
            <span>·</span>
            <span>Print Ready 4×6</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
