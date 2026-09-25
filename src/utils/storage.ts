import { PostcardData } from '../types';

const STORAGE_KEY = 'postcard_ai_saved_postcards_v1';

export function getSavedPostcards(): PostcardData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: PostcardData[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load postcards from storage:', err);
    return [];
  }
}

export function savePostcard(postcard: PostcardData): void {
  try {
    const existing = getSavedPostcards();
    const index = existing.findIndex((p) => p.id === postcard.id);
    let updated: PostcardData[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = postcard;
    } else {
      updated = [postcard, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save postcard:', err);
  }
}

export function deletePostcard(id: string): PostcardData[] {
  try {
    const existing = getSavedPostcards();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete postcard:', err);
    return [];
  }
}

export function getPostcardById(id: string): PostcardData | undefined {
  const existing = getSavedPostcards();
  return existing.find((p) => p.id === id);
}
