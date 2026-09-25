export type PostcardOccasion =
  | 'Travel'
  | 'Birthday'
  | 'Wedding'
  | 'Anniversary'
  | 'Festival'
  | 'Thank You'
  | 'Friendship'
  | 'Just Because';

export type PostcardStyle =
  | 'Vintage'
  | 'Minimal'
  | 'Elegant'
  | 'Travel'
  | 'Polaroid'
  | 'Artistic'
  | 'Film'
  | 'Modern';

export interface PhotoAnalysis {
  scene: string;
  subjects: string[];
  environment: string;
  mood: string;
  dominantColors: string[];
  suggestedTheme: string;
  suggestedStyle: PostcardStyle;
  suggestedTitle: string;
  suggestedCaption: string;
  detectedLocation?: string;
  suggestedMessage: string;
}

export interface PostcardData {
  id: string;
  createdAt: string;
  imageUrl: string; // base64 or blob URL
  analysis?: PhotoAnalysis;
  occasion: PostcardOccasion;
  style: PostcardStyle;
  title: string;
  caption: string;
  destination: string;
  recipient: string;
  sender: string;
  message: string;
  stampTheme?: string;
  stampPrice?: string;
  postmarkLocation?: string;
  favorite?: boolean;
}

export type AppView =
  | 'home'
  | 'camera'
  | 'upload'
  | 'analysis'
  | 'personalize'
  | 'preview'
  | 'gallery';
