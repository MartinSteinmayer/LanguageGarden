#!/usr/bin/env python3
import json

def create_coordinates_json():
    with open('voices.json', 'r', encoding='utf-8') as f:
        voices_data = json.load(f)

    coordinates_data = {}

    for language, accents in voices_data.items():
        coordinates_data[language] = {}

        for accent in accents.keys():
            coordinates_data[language][accent] = {
                "coordinates": {
                    "lat": "TODO",
                    "long": "TODO"
                }
            }

    with open('coordinates.json', 'w', encoding='utf-8') as f:
        json.dump(coordinates_data, f, indent=2, ensure_ascii=False)

    print(f"Created coordinates.json with {len(coordinates_data)} languages")
    for lang, accents in coordinates_data.items():
        print(f"  {lang}: {len(accents)} accents")

if __name__ == "__main__":
    create_coordinates_json()