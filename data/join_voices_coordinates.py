#!/usr/bin/env python3
import json

def join_voices_coordinates_and_names():
    # Load all three JSON files
    with open('voices.json', 'r', encoding='utf-8') as f:
        voices_data = json.load(f)

    with open('coordinates.json', 'r', encoding='utf-8') as f:
        coordinates_data = json.load(f)

    with open('names.json', 'r', encoding='utf-8') as f:
        names_data = json.load(f)

    joined_data = {}

    for language, accents in voices_data.items():
        # Inner join: only include if language exists in all three files
        if language in coordinates_data and language in names_data:
            joined_data[language] = {}

            for accent, voice_ids in accents.items():
                # Inner join: only include if accent exists in all three files
                if accent in coordinates_data[language] and accent in names_data[language]:
                    coordinates = coordinates_data[language][accent]["coordinates"]
                    names_info = names_data[language][accent]

                    joined_data[language][accent] = {
                        "coordinates": coordinates,
                        "official_name": names_info.get("official_name", ""),
                        "name": names_info.get("name", ""),
                        "voice_ids": voice_ids
                    }

            # Remove language if no accents matched
            if not joined_data[language]:
                del joined_data[language]

    # Write the combined data
    with open('eleven_lab_voices_coordinates.json', 'w', encoding='utf-8') as f:
        json.dump(joined_data, f, indent=2, ensure_ascii=False)

    print("Created eleven_lab_voices_coordinates.json (inner join of voices, coordinates, and names)")
    print(f"Languages: {len(joined_data)}")

    # Count total accents and voice IDs
    total_accents = 0
    total_voice_ids = 0
    for lang, accents in joined_data.items():
        total_accents += len(accents)
        for accent, data in accents.items():
            total_voice_ids += len(data["voice_ids"])

    print(f"Total accents: {total_accents}")
    print(f"Total voice IDs: {total_voice_ids}")

    # Show sample of what was included
    print("\nSample entries:")
    count = 0
    for lang, accents in joined_data.items():
        for accent, data in accents.items():
            if count < 3:
                print(f"  {lang}.{accent}: {data['name']} ({data['official_name']}) - {len(data['voice_ids'])} voices")
                count += 1
            else:
                break
        if count >= 3:
            break

if __name__ == "__main__":
    join_voices_coordinates_and_names()