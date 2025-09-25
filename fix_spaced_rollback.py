#!/usr/bin/env python3
import json
import shutil
from pathlib import Path

def create_spaced_rollback_mapping(json_path):
    """Create mapping to rollback files with spaces/underscores in dialect names"""
    rollback = {}
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for iso2, lang_data in data.items():
        if isinstance(lang_data, dict):
            # Check each dialect
            for dialect_key, dialect_data in lang_data.items():
                if isinstance(dialect_data, dict) and 'iso_639_3' in dialect_data:
                    iso3 = dialect_data['iso_639_3']

                    # Convert spaces to underscores for file names
                    dialect_key_file = dialect_key.replace(' ', '_')

                    # Map from 3-letter back to 2-letter
                    from_name = f"{iso3}_{dialect_key_file}"
                    to_name = f"{iso2}_{dialect_key_file}"
                    rollback[from_name] = to_name
                    print(f"Rollback mapping: {from_name} -> {to_name}")

    return rollback

def rollback_spaced_images(images_dir, rollback_mapping):
    """Rollback image names with spaces/underscores in dialect names"""
    images_path = Path(images_dir)
    rollback_count = 0

    for image_file in images_path.glob("*.png"):
        filename = image_file.name
        name_without_ext = filename.replace('.png', '')

        if name_without_ext in rollback_mapping:
            new_name = f"{rollback_mapping[name_without_ext]}.png"
            new_path = images_path / new_name

            if not new_path.exists():
                print(f"Rolling back: {filename} -> {new_name}")
                shutil.move(str(image_file), str(new_path))
                rollback_count += 1
            else:
                print(f"Skipping {filename}: {new_name} already exists")

    print(f"Rolled back {rollback_count} files with spaced dialect names")

def main():
    # Paths
    json_path = "public/data/data.json"
    images_dir = "public/data/images_data"

    print("Creating rollback mapping for spaced dialect names...")
    rollback_mapping = create_spaced_rollback_mapping(json_path)

    print(f"\nFound {len(rollback_mapping)} spaced rollback mappings")

    print(f"\nRolling back spaced dialect images in {images_dir}...")
    rollback_spaced_images(images_dir, rollback_mapping)

if __name__ == "__main__":
    main()