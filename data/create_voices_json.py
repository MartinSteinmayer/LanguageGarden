import os
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
from collections import defaultdict
import json

load_dotenv()
API_KEY = os.getenv("ELEVEN_API_KEY")  # or set directly

def build_voice_dict():
    """Build dictionary: language -> accent -> [voice_ids]"""
    client = ElevenLabs(
        base_url="https://api.elevenlabs.io",
        api_key=API_KEY,
    )
    
    voice_dict = defaultdict(lambda: defaultdict(list))
    all_voices = []
    page = 0
    page_size = 100  # Use maximum page size for efficiency
    
    print("Fetching all voices with pagination...")
    
    while True:
        print(f"Fetching page {page + 1}...")
        try:
            response = client.voices.get_shared(page_size=page_size, page=page)
            
            if not response.voices or len(response.voices) == 0:
                print(f"No more voices found on page {page + 1}")
                break
                
            print(f"Found {len(response.voices)} voices on page {page + 1}")
            
            # Add some debug info about the response object
            if hasattr(response, 'pagination') or hasattr(response, 'total_count'):
                print(f"Response attributes: {[attr for attr in dir(response) if not attr.startswith('_')]}")
            
            # Check for duplicate voice IDs to ensure we're not getting repeats
            new_voice_ids = [voice.voice_id for voice in response.voices]
            existing_voice_ids = [voice.voice_id for voice in all_voices]
            duplicates = set(new_voice_ids) & set(existing_voice_ids)
            if duplicates:
                print(f"WARNING: Found {len(duplicates)} duplicate voice IDs on page {page + 1}")
            
            all_voices.extend(response.voices)
            
            page += 1
            
            # Show progress every 10 pages
            if page % 10 == 0:
                print(f"Progress: Fetched {len(all_voices)} voices so far from {page} pages...")
            
            # NO SAFETY LIMIT - we go until the end!
            # Only stop when we get 0 voices from the API
                
        except Exception as e:
            print(f"Error fetching page {page + 1}: {e}")
            break
    
    print(f"Total voices fetched: {len(all_voices)}")
    
    # Process all voices
    for voice in all_voices:
        language = voice.language if hasattr(voice, 'language') and voice.language else "any"
        accent = voice.accent if hasattr(voice, 'accent') and voice.accent else "any"
        voice_dict[language][accent].append(voice.voice_id)
    
    # Convert to regular dict
    return {lang: dict(accents) for lang, accents in voice_dict.items()}

def save_json(data, filename="voices.json"):
    """Save dictionary to JSON file"""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Saved to {filename}")

def main():
    print("Getting voices...")
    voice_dict = build_voice_dict()
    
    print(f"Found {len(voice_dict)} languages")
    for lang, accents in voice_dict.items():
        total_voices = sum(len(voices) for voices in accents.values())
        print(f"  {lang}: {total_voices} voices across {len(accents)} accents")
    
    save_json(voice_dict)
    print("Done!")

if __name__ == "__main__":
    main()