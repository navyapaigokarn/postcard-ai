import { PhotoAnalysis, PostcardOccasion, PostcardStyle } from '../types';

export async function analyzePhotoWithAI(
  imageBase64: string,
  mimeType = 'image/jpeg'
): Promise<PhotoAnalysis> {
  const response = await fetch('/api/analyze-photo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.fallback) {
      console.warn('Backend returned fallback analysis:', errorData.error);
      return errorData.fallback as PhotoAnalysis;
    }
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data as PhotoAnalysis;
}

export interface CraftPostcardParams {
  occasion: PostcardOccasion;
  style: PostcardStyle;
  destination: string;
  recipient: string;
  sender: string;
  personalMessage?: string;
  analysis?: PhotoAnalysis;
}

export interface CraftPostcardResult {
  title: string;
  caption: string;
  message: string;
  stampTheme: string;
  stampPrice: string;
  postmarkLocation: string;
}

export async function craftPostcardWithAI(
  params: CraftPostcardParams
): Promise<CraftPostcardResult> {
  const response = await fetch('/api/craft-postcard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}
