#!/usr/bin/env python3

import os
import glob
from pathlib import Path

def rename_images_to_standard(directory_path):
    """
    Rename all image files in the given directory to {name}_standard.png format
    Avoids double renaming by checking if file already has _standard suffix
    """
    directory = Path(directory_path)
    if not directory.exists():
        print(f"Directory {directory_path} does not exist")
        return

    # Get all image files (common extensions)
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.JPG', '*.JPEG', '*.PNG', '*.GIF', '*.webp', '*.WEBP']

    for ext in image_extensions:
        for image_path in directory.glob(ext):
            # Skip hidden files like .DS_Store
            if image_path.name.startswith('.'):
                continue

            # Get the base name without extension
            base_name = image_path.stem

            # Skip if already has _standard suffix
            if base_name.endswith('_standard'):
                print(f"Skipping: {image_path.name} (already has _standard suffix)")
                continue

            # Create new name with _standard.png
            new_name = f"{base_name}_standard.png"
            new_path = directory / new_name

            print(f"Renaming: {image_path.name} -> {new_name}")

            try:
                image_path.rename(new_path)
                print(f"✓ Successfully renamed {image_path.name}")
            except Exception as e:
                print(f"✗ Error renaming {image_path.name}: {e}")

def main():
    # Define the directories to process
    directories = [
        "public/data/images_definitely_endangered",
        "public/data/images_severely_endangered"
    ]

    for directory in directories:
        print(f"\nProcessing directory: {directory}")
        print("=" * 50)
        rename_images_to_standard(directory)

    print("\nRenaming complete!")

if __name__ == "__main__":
    main()