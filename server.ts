import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Support base64 image uploads up to 25MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Init Google GenAI SDK (server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface PhotoAnalysis {
  scene: string;
  subjects: string[];
  environment: string;
  mood: string;
  dominantColors: string[];
  suggestedTheme: string;
  suggestedStyle: 'Vintage' | 'Minimal' | 'Elegant' | 'Travel' | 'Polaroid' | 'Artistic' | 'Film' | 'Modern';
  suggestedTitle: string;
  suggestedCaption: string;
  detectedLocation?: string;
  suggestedMessage: string;
}

// POST /api/analyze-photo
app.post('/api/analyze-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data in request body' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const cleanMimeType = mimeType || 'image/jpeg';

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set in environment. Returning fallback smart analysis.');
      const fallbackAnalysis: PhotoAnalysis = {
        scene: 'peaceful vista',
        subjects: ['memorable landscape', 'moment in time'],
        environment: 'outdoor journey',
        mood: 'serene, timeless and nostalgic',
        dominantColors: ['golden amber', 'slate blue', 'warm stone'],
        suggestedTheme: 'Travel',
        suggestedStyle: 'Vintage',
        suggestedTitle: 'Cherished Horizons',
        suggestedCaption: 'Where every moment tells a story',
        detectedLocation: '',
        suggestedMessage:
          'Sending you a piece of this beautiful day! Wishing you were here to share this view with me. Sending warmest thoughts and hugs from afar.',
      };
      return res.json(fallbackAnalysis);
    }

    const promptText = `You are an expert visual analyzer and vintage/editorial postcard curator.
Analyze the provided photograph thoroughly and return structured JSON matching the requested schema.

Guidelines:
1. "scene": 2-4 word description of what is depicted (e.g. "beach at sunset", "historic cobblestone street", "cozy coffee shop").
2. "subjects": Array of 1-4 main subjects recognized in the photo (e.g. ["person", "ocean", "sunset"]).
3. "environment": Overall setting type (e.g. "coastal", "mountain", "urban cityscape", "interior cafe", "woodland").
4. "mood": 2-4 evocative mood adjectives (e.g. "warm and peaceful", "vibrant and joyful", "moody and contemplative").
5. "dominantColors": Array of 2-4 primary perceived aesthetic colors (e.g. ["warm terracotta", "seafoam cyan", "soft ivory"]).
6. "suggestedTheme": Postcard theme best fitting this photo: choose from "Travel", "Birthday", "Wedding", "Anniversary", "Festival", "Thank You", "Friendship", or "Just Because".
7. "suggestedStyle": Best visual postcard aesthetic: choose exactly one of: "Vintage", "Minimal", "Elegant", "Travel", "Polaroid", "Artistic", "Film", "Modern".
8. "suggestedTitle": A captivating, artistic postcard title (2-5 words) suitable for embossing or editorial headline on the front of a printed postcard.
9. "suggestedCaption": A poetic, memorable subcaption or greeting line (e.g. "Greetings from paradise", "Golden hour glow", "Treasured moments").
10. "detectedLocation": If you can reliably identify a famous landmark, city, or geography with high certainty (e.g. "Eiffel Tower, Paris", "Venice Canals", "Grand Canyon"), state it. IMPORTANT: Do NOT invent or guess an exact location if it cannot be reliably determined from visual landmarks; leave as empty string "" if unsure.
11. "suggestedMessage": A warm, authentic 2-3 sentence personalized postcard message that sounds genuinely human, matching the photo's atmosphere and suggested occasion.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: cleanMimeType,
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scene: { type: Type.STRING, description: 'Short summary of the scene' },
            subjects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Main subjects in the photo',
            },
            environment: { type: Type.STRING, description: 'Type of environment' },
            mood: { type: Type.STRING, description: 'Atmosphere and mood' },
            dominantColors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 4 dominant aesthetic colors',
            },
            suggestedTheme: { type: Type.STRING, description: 'Matching occasion/theme' },
            suggestedStyle: {
              type: Type.STRING,
              description: 'One of: Vintage, Minimal, Elegant, Travel, Polaroid, Artistic, Film, Modern',
            },
            suggestedTitle: { type: Type.STRING, description: 'Suggested postcard front title' },
            suggestedCaption: { type: Type.STRING, description: 'Suggested postcard short caption' },
            detectedLocation: {
              type: Type.STRING,
              description: 'Reliably identified landmark/city or empty string if not verifiable',
            },
            suggestedMessage: {
              type: Type.STRING,
              description: 'Heartfelt human postcard message tailored to this photo',
            },
          },
          required: [
            'scene',
            'subjects',
            'environment',
            'mood',
            'dominantColors',
            'suggestedTheme',
            'suggestedStyle',
            'suggestedTitle',
            'suggestedCaption',
            'suggestedMessage',
          ],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData: PhotoAnalysis = JSON.parse(responseText);

    // Normalize style if needed
    const validStyles = ['Vintage', 'Minimal', 'Elegant', 'Travel', 'Polaroid', 'Artistic', 'Film', 'Modern'];
    const matchedStyle = validStyles.find((s) => s.toLowerCase() === (parsedData.suggestedStyle || '').toLowerCase());
    if (matchedStyle) {
      parsedData.suggestedStyle = matchedStyle as any;
    } else {
      parsedData.suggestedStyle = 'Vintage';
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing photo with Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze photograph with AI',
      fallback: {
        scene: 'beautiful memory',
        subjects: ['treasured moment'],
        environment: 'scenic view',
        mood: 'warm, uplifting and peaceful',
        dominantColors: ['amber', 'slate', 'warm white'],
        suggestedTheme: 'Travel',
        suggestedStyle: 'Vintage',
        suggestedTitle: 'Greetings from Here',
        suggestedCaption: 'Cherishing this moment forever',
        detectedLocation: '',
        suggestedMessage:
          'Thinking of you and wanted to send a little slice of this wonderful day. Hope you are smiling and well!',
      },
    });
  }
});

// POST /api/craft-postcard
// Regenerates or refines title, caption, personalized message, and custom postal stamp details
app.post('/api/craft-postcard', async (req: Request, res: Response) => {
  try {
    const { occasion, style, destination, recipient, sender, personalMessage, analysis } = req.body;

    if (!apiKey) {
      return res.json({
        title: analysis?.suggestedTitle || (destination ? `Greetings from ${destination}` : 'Cherished Memory'),
        caption: analysis?.suggestedCaption || 'Wishes from afar',
        message:
          personalMessage ||
          `Dear ${recipient || 'Friend'},\n\nSending warm greetings and thinking of you! Hope this postcard brings a smile to your day.\n\nWarmly,\n${sender || 'Me'}`,
        stampTheme: 'Vintage Post',
        stampPrice: '85¢',
        postmarkLocation: (destination || 'WORLDWIDE').toUpperCase(),
      });
    }

    const promptText = `You are a master postcard copywriter and vintage ephemera designer.
A user is creating a personalized digital postcard with the following parameters:
- Occasion: ${occasion || 'Travel'}
- Style: ${style || 'Vintage'}
- Destination / Location: ${destination || 'Not specified'}
- Recipient: ${recipient || 'Friend'}
- Sender: ${sender || 'A friend'}
- User's existing message or notes: ${personalMessage || 'None provided, please compose a warm, heartfelt message'}
- Photo Analysis Context: ${JSON.stringify(analysis || {})}

Tasks:
1. "title": A striking, evocative 2-5 word title for the front of the postcard fitting the style and occasion (e.g. "Golden Amalfi Days", "Joyful Beginnings", "Elegance in Bloom").
2. "caption": A short, poetic subtitle (3-7 words) for the front (e.g. "Greetings from sunny shores", "Celebrating your special day").
3. "message": A beautifully written, heartfelt postcard message (2 to 4 sentences).
   - If the user provided a personalMessage, preserve their core meaning, voice, and personal details, but gently polish formatting so it feels like authentic handwritten postcard prose.
   - If no message was provided, craft an original, genuine message fitting the occasion and photo atmosphere.
4. "stampTheme": A charming postal stamp subject name matching the scene and style (e.g. "Air Mail Clipper", "Botanical Fern", "Maritime Compass", "Golden Sun", "Alpine Edelweiss").
5. "stampPrice": Realistic vintage stamp denomination (e.g. "65¢", "1st Class", "Airmail 85¢", "25¢").
6. "postmarkLocation": City / area in uppercase for the postmark cancellation circle (e.g. "SAN FRANCISCO, CA", "PARIS, FR", or destination uppercase).

Do not alter the factual meaning of the user's intent. Return JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            caption: { type: Type.STRING },
            message: { type: Type.STRING },
            stampTheme: { type: Type.STRING },
            stampPrice: { type: Type.STRING },
            postmarkLocation: { type: Type.STRING },
          },
          required: ['title', 'caption', 'message', 'stampTheme', 'stampPrice', 'postmarkLocation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI crafting temporary error, returning crafted fallback:', error?.message);
    const { occasion, style, destination, recipient, sender, personalMessage, analysis } = req.body;
    return res.json({
      title:
        analysis?.suggestedTitle ||
        (destination ? `Greetings from ${destination}` : `${occasion || 'Cherished'} Memories`),
      caption: analysis?.suggestedCaption || 'Warmest wishes across the miles',
      message:
        personalMessage ||
        `Thinking of you and wanted to send this little memory your way. Wishing you were here with me! Sending warmest hugs.`,
      stampTheme:
        style === 'Travel'
          ? 'Air Mail Clipper'
          : style === 'Elegant'
          ? 'Golden Crest'
          : style === 'Artistic'
          ? 'Botanical Flora'
          : 'Vintage Post',
      stampPrice: '85¢',
      postmarkLocation: (destination || 'AIR MAIL').toUpperCase(),
    });
  }
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: Number(PORT), host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Postcard AI] Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
