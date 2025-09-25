import { Translate } from '@google-cloud/translate/build/src/v2';

// Initialize the Google Translate client
const translate = new Translate({
  key: process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY,
});

export async function POST(request) {
  try {
    const { text, from, to } = await request.json();

    if (!text || !from || !to) {
      return Response.json(
        { error: 'Missing required parameters: text, from, to' },
        { status: 400 }
      );
    }

    // Translate the text
    const [translation] = await translate.translate(text, {
      from: from,
      to: to,
    });

    return Response.json({
      originalText: text,
      translatedText: translation,
      sourceLanguage: from,
      targetLanguage: to,
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    // Handle specific Google Translate API errors
    if (error.code === 400) {
      return Response.json(
        { error: 'Invalid language code or text format' },
        { status: 400 }
      );
    }
    
    if (error.code === 403) {
      return Response.json(
        { error: 'API key invalid or quota exceeded' },
        { status: 403 }
      );
    }

    return Response.json(
      { error: 'Translation service unavailable' },
      { status: 500 }
    );
  }
}