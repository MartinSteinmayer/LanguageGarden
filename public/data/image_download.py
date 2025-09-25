import requests
import os
import re
import time
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
# Get API keys from environment variables
API_KEY = os.getenv("GUSTAVO_API_KEY")
CSE_ID = os.getenv("CSE_ID")
print("API_KEY:", API_KEY)
print("CSE_ID:", CSE_ID)

# Check if the required environment variables are set
if not API_KEY:
    raise ValueError("❌ ERROR: GUSTAVO_API_KEY not found in your .env file")
if not CSE_ID:
    raise ValueError("❌ ERROR: CSE_ID not found in your .env file")

# --- SCRIPT ---

def build_search_query(language_data):
    """
    Intelligently builds a search query to find pictures of the people.
    This version is optimized for searching high-quality, curated websites.
    """
    name = language_data.get('name', 'Unknown').replace('language', '').strip()

    # 💡 Smart Extraction: Try to find "spoken by the [People Name] people"
    
    return f'"{name}" people'

def download_images_for_json(json_file_path, output_folder):
    """
    Processes a JSON file, searches for images for each language, 
    and downloads the first result.
    """
    print(f"--- Starting process for {json_file_path} ---")

    # Create the output directory if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder) # Corrected typo here
        print(f"Created directory: {output_folder}")

    # Load the JSON file
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            languages = json.load(f)
    except FileNotFoundError:
        print(f"❌ ERROR: The file '{json_file_path}' was not found.")
        return

    # Process each language
    for iso_code, data in languages.items():
        standard_data = data.get('standard', {})
        language_name = standard_data.get('name', iso_code)
        
        # 1. Build the search query
        query = build_search_query(standard_data)
        print(f"\nProcessing '{language_name}' ({iso_code})...")
        print(f"  -> Search query: {query}")

        # 2. Make the API request to Google
        search_url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'q': query,
            'cx': CSE_ID,
            'key': API_KEY,
            'searchType': 'image',
            'num': 1, # We only want the top result
            'imgSize': 'medium' 
        }
        
        try:
            response = requests.get(search_url, params=params)
            response.raise_for_status() 
            search_results = response.json()

            # 3. Get the image URL from the results
            image_items = search_results.get('items')
            if not image_items:
                print(f"  -> ⚠️ No image results found for '{query}'. Skipping.")
                continue

            image_url = image_items[0].get('link')
            if not image_url:
                print(f"  -> ⚠️ Found a result but it has no image link. Skipping.")
                continue
            
            # 4. Download and save the image with the User-Agent header
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            image_response = requests.get(image_url, headers=headers, timeout=10)
            image_response.raise_for_status()
            
            # Determine file extension, default to .jpg
            file_extension = os.path.splitext(image_url)[1].split('?')[0]
            if not file_extension or len(file_extension) > 5:
                file_extension = '.jpg'

            file_path = os.path.join(output_folder, f"{iso_code}{file_extension}")
            
            with open(file_path, 'wb') as f:
                f.write(image_response.content)
            
            print(f"  -> ✅ Success! Image saved to {file_path}")

        except requests.exceptions.RequestException as e:
            print(f"  -> ❌ ERROR making request for '{language_name}': {e}")
        except Exception as e:
            print(f"  -> ❌ An unexpected error occurred for '{language_name}': {e}")
        
        # Pause for 1 second between requests to respect the API rate limits
        time.sleep(1) 

    print(f"\n--- Finished processing {json_file_path} ---")


if __name__ == "__main__":
    # Define the input JSON files and their corresponding output folders
    severely_endangered_json = "severely_endangered.json"
    definitely_endangered_json = "definitely_endangered.json"
    not_endangered_json = "data.json"
    
    #download_images_for_json(severely_endangered_json, "images_severely_endangered")
    #download_images_for_json(definitely_endangered_json, "images_definitely_endangered")
    download_images_for_json(not_endangered_json, "images_data")