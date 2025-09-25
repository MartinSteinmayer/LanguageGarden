import { NextResponse } from 'next/server';

// Cache for language data to avoid repeated API calls
const languageCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Parse textproto format to JSON
function parseTextProto(textProtoContent) {
  const lines = textProtoContent.split('\n');
  const result = {
    regions: [],
    exemplar_chars: {},
    sample_text: {}
  };
  
  let currentSection = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    if (trimmedLine.startsWith('exemplar_chars {')) {
      currentSection = 'exemplar_chars';
      continue;
    }
    
    if (trimmedLine.startsWith('sample_text {')) {
      currentSection = 'sample_text';
      continue;
    }
    
    if (trimmedLine === '}') {
      currentSection = null;
      continue;
    }
    
    // Parse key-value pairs
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmedLine.substring(0, colonIndex).trim();
    const value = trimmedLine.substring(colonIndex + 1).trim().replace(/^"|"$/g, '');
    
    if (currentSection) {
      // We're inside a nested object
      result[currentSection][key] = value;
    } else {
      // Top-level properties
      if (key === 'region') {
        result.regions.push(value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

async function fetchLanguageData(languageCode) {
  // Check cache first
  const cacheKey = languageCode;
  const cached = languageCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    // Try different possible file formats based on common language codes
    const possibleFilenames = [
      `${languageCode}_Latn.textproto`,
      `${languageCode}_Cyrl.textproto`,
      `${languageCode}_Arab.textproto`,
      `${languageCode}_Deva.textproto`,
      `${languageCode}_Hans.textproto`,
      `${languageCode}_Hant.textproto`,
    ];
    
    let languageData = null;
    
    for (const filename of possibleFilenames) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/google/fonts/main/lang/Lib/gflanguages/data/languages/${filename}`,
          { 
            headers: { 'User-Agent': 'LanguageGarden/1.0' },
            cache: 'force-cache' 
          }
        );
        
        if (response.ok) {
          const textProtoContent = await response.text();
          languageData = parseTextProto(textProtoContent);
          languageData.sourceFile = filename;
          break;
        }
      } catch (error) {
        // Continue to next filename
        continue;
      }
    }
    
    if (languageData) {
      // Cache the result
      languageCache.set(cacheKey, {
        data: languageData,
        timestamp: Date.now()
      });
      
      return languageData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Google Fonts data for ${languageCode}:`, error);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const languageCode = searchParams.get('lang');
  
  if (!languageCode) {
    return NextResponse.json({ error: 'Language code is required' }, { status: 400 });
  }
  
  try {
    const languageData = await fetchLanguageData(languageCode);
    
    if (languageData) {
      return NextResponse.json({
        success: true,
        data: languageData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `No Google Fonts data found for language code: ${languageCode}`
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in Google Fonts API route:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
