#!/usr/bin/env python3
"""
Wikipedia Language Data Scraper
Extracts native speaker numbers and UNESCO endangerment classifications
for languages from Wikipedia pages.
"""

import json
import re
import requests
from urllib.parse import quote
import time
import sys
from typing import Dict, Optional, Tuple

# UNESCO endangerment levels mapping
UNESCO_LEVELS = {
    'extinct': 'EX',
    'critically endangered': 'CR', 
    'severely endangered': 'SE',
    'definitely endangered': 'DE',
    'vulnerable': 'VU',
    'safe': 'NE'  # Not Endangered
}

class WikipediaScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Language Garden Bot 1.0 (educational hackathon project)'
        })
        
    def get_wikipedia_page(self, language_name: str) -> Optional[str]:
        """Get Wikipedia page content for a language."""
        try:
            # Try with the language name directly
            url = f"https://en.wikipedia.org/wiki/{quote(language_name.replace(' ', '_'))}"
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 200:
                return response.text
            
            # Try with "language" suffix
            url = f"https://en.wikipedia.org/wiki/{quote(language_name.replace(' ', '_'))}_language"
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 200:
                return response.text
                
            return None
            
        except Exception as e:
            print(f"Error fetching page for {language_name}: {e}")
            return None
    
    def extract_native_speakers(self, html_content: str) -> Optional[int]:
        """Extract native speakers number from Wikipedia page."""
        try:
            # Look for patterns with numbers and units
            patterns = [
                # Pattern for "Native speakers" followed by number and unit (like "242 million")
                r'Native speakers[^0-9]*?(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)\s*(million|thousand|billion)',
                # Pattern for "Native speakers" followed by just a number
                r'Native speakers[^0-9]*?(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)',
                
                # Pattern for number with unit before "native speakers"
                r'(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)\s*(million|thousand|billion)[^.]*?native speakers',
                r'(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)[^.]*?native speakers',
                
                # Pattern for general "speakers" context
                r'speakers[^0-9]*?(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)\s*(million|thousand|billion)',
                r'speakers[^0-9]*?(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)',
                
                # More specific patterns for Wikipedia infobox format
                r'>(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)\s*(million|thousand|billion)[^<]*?(?:native|speakers)',
                r'>(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?)[^<]*?(?:native|speakers)',
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE | re.DOTALL)
                if matches:
                    match = matches[0]
                    
                    # Handle tuple vs string based on pattern
                    if isinstance(match, tuple):
                        number_str = match[0].replace(',', '').replace(' ', '')
                        unit = match[1].lower() if len(match) > 1 and match[1] else ''
                    else:
                        number_str = match.replace(',', '').replace(' ', '')
                        unit = ''
                    
                    try:
                        number = float(number_str)
                        
                        # Convert based on unit
                        if unit == 'billion':
                            return int(number * 1_000_000_000)
                        elif unit == 'million':
                            return int(number * 1_000_000)
                        elif unit == 'thousand':
                            return int(number * 1_000)
                        else:
                            # If no unit, assume it's already the full number
                            return int(number)
                            
                    except ValueError:
                        continue
            
            return None
            
        except Exception as e:
            print(f"Error extracting speakers: {e}")
            return None
    
    def extract_unesco_status(self, html_content: str) -> Optional[str]:
        """Extract UNESCO endangerment status from Wikipedia page."""
        try:
            # Look for UNESCO Atlas mentions
            unesco_patterns = [
                r'UNESCO.*?Atlas.*?(?:classified|lists?).*?as\s+([^.]+)',
                r'classified\s+as\s+([^.]+).*?by.*?UNESCO',
                r'UNESCO.*?([A-Z]{2})\s*[^\w]',  # Look for abbreviations like VU, CR, etc.
                r'(Extinct|Critically\s+endangered|Severely\s+endangered|Definitely\s+endangered|Vulnerable|Safe).*?UNESCO',
                r'UNESCO.*?(Extinct|Critically\s+endangered|Severely\s+endangered|Definitely\s+endangered|Vulnerable|Safe)',
            ]
            
            for pattern in unesco_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE | re.DOTALL)
                if matches:
                    status = matches[0].strip().lower()
                    
                    # Check if it's already an abbreviation
                    if status.upper() in ['EX', 'CR', 'SE', 'DE', 'VU', 'NE']:
                        return status.upper()
                    
                    # Map full names to abbreviations
                    for full_name, abbrev in UNESCO_LEVELS.items():
                        if full_name in status:
                            return abbrev
            
            return None
            
        except Exception as e:
            print(f"Error extracting UNESCO status: {e}")
            return None
    
    def scrape_language_data(self, language_name: str, official_name: str = None) -> Tuple[Optional[int], Optional[str]]:
        """Scrape both speaker count and UNESCO status for a language."""
        print(f"Scraping data for: {language_name}")
        
        # Try with the regular name first
        html_content = self.get_wikipedia_page(language_name)
        
        # If that fails and we have an official name, try that
        if not html_content and official_name:
            print(f"  Trying with official name: {official_name}")
            html_content = self.get_wikipedia_page(official_name)
        
        if not html_content:
            print(f"  Could not find Wikipedia page for {language_name}")
            return None, None
        
        speakers = self.extract_native_speakers(html_content)
        unesco_status = self.extract_unesco_status(html_content)
        
        print(f"  Speakers: {speakers}, UNESCO: {unesco_status}")
        
        # Small delay to be respectful to Wikipedia
        time.sleep(0.5)
        
        return speakers, unesco_status

def test_number_parsing():
    """Test the number parsing logic with sample data."""
    scraper = WikipediaScraper()
    
    # Test cases
    test_cases = [
        ("Native speakers 242 million, all varieties", 242_000_000),
        ("Native speakers 15 million (2012)", 15_000_000),
        ("Native speakers 500 thousand", 500_000),
        ("Native speakers 1.2 billion", 1_200_000_000),
        ("242 million native speakers", 242_000_000),
        (">242 million<", 242_000_000),
    ]
    
    print("Testing number parsing:")
    for test_html, expected in test_cases:
        result = scraper.extract_native_speakers(test_html)
        status = "✓" if result == expected else "✗"
        print(f"  {status} '{test_html}' -> {result} (expected {expected})")

def main():
    print("Starting Wikipedia language data scraper...")
    
    # Run tests first
    test_number_parsing()
    print()
    
    # Load the names.json file
    try:
        with open('/Users/gustavo/Documents/Projects/AgentsHackaElvenlabs/LanguageGarden/public/data/names.json', 'r', encoding='utf-8') as f:
            names_data = json.load(f)
    except FileNotFoundError:
        print("Error: names.json file not found!")
        sys.exit(1)
    
    scraper = WikipediaScraper()
    
    # Initialize result dictionaries
    speakers_data = {}
    unesco_data = {}
    
    # Track missing data for reporting
    missing_speakers = []
    missing_unesco = []
    
    # Process each language
    for lang_code, variants in names_data.items():
        speakers_data[lang_code] = {}
        unesco_data[lang_code] = {}
        
        for variant_key, variant_data in variants.items():
            if not isinstance(variant_data, dict) or 'name' not in variant_data:
                continue
                
            language_name = variant_data['name']
            official_name = variant_data.get('official_name')
            
            speakers, unesco_status = scraper.scrape_language_data(language_name, official_name)
            
            if speakers is not None:
                speakers_data[lang_code][variant_key] = speakers
            else:
                missing_speakers.append(f"{lang_code}.{variant_key} ({language_name})")
            
            if unesco_status is not None:
                unesco_data[lang_code][variant_key] = unesco_status
            else:
                missing_unesco.append(f"{lang_code}.{variant_key} ({language_name})")
    
    # Save the results
    with open('/Users/gustavo/Documents/Projects/AgentsHackaElvenlabs/LanguageGarden/public/data/speakers.json', 'w', encoding='utf-8') as f:
        json.dump(speakers_data, f, indent=2, ensure_ascii=False)
    
    with open('/Users/gustavo/Documents/Projects/AgentsHackaElvenlabs/LanguageGarden/public/data/unesco_status.json', 'w', encoding='utf-8') as f:
        json.dump(unesco_data, f, indent=2, ensure_ascii=False)
    
    # Report missing data
    print(f"\n=== SCRAPING COMPLETE ===")
    print(f"Total languages processed: {sum(len(variants) for variants in names_data.values())}")
    print(f"Speaker data found: {sum(len(variants) for variants in speakers_data.values())}")
    print(f"UNESCO data found: {sum(len(variants) for variants in unesco_data.values())}")
    
    if missing_speakers:
        print(f"\n=== MISSING SPEAKER DATA ({len(missing_speakers)} languages) ===")
        for lang in missing_speakers:
            print(f"  - {lang}")
    
    if missing_unesco:
        print(f"\n=== MISSING UNESCO DATA ({len(missing_unesco)} languages) ===")
        for lang in missing_unesco:
            print(f"  - {lang}")
    
    print(f"\nResults saved to:")
    print(f"  - speakers.json")
    print(f"  - unesco_status.json")

if __name__ == "__main__":
    main()