#!/usr/bin/env python3

import os
import shutil
from pathlib import Path

def organize_pinterest_images(source_dir, target_dir):
    """
    Organize images from Pinterest download subfolders into a single images_data folder.
    Each subfolder contains one image which will be renamed to match the subfolder name.
    """
    source_path = Path(source_dir)
    target_path = Path(target_dir)

    if not source_path.exists():
        print(f"Source directory {source_dir} does not exist")
        return

    # Create target directory if it doesn't exist
    target_path.mkdir(parents=True, exist_ok=True)

    # Get all subdirectories
    subdirs = [d for d in source_path.iterdir() if d.is_dir()]

    print(f"Found {len(subdirs)} subdirectories to process")

    processed = 0
    skipped = 0
    errors = 0

    for subdir in subdirs:
        subfolder_name = subdir.name

        # Skip hidden directories
        if subfolder_name.startswith('.'):
            continue

        print(f"Processing: {subfolder_name}")

        # Find image files in the subdirectory (skip .DS_Store and other hidden files)
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP']
        image_files = [f for f in subdir.iterdir()
                      if f.is_file() and f.suffix in image_extensions and not f.name.startswith('.')]

        if not image_files:
            print(f"  ⚠️  No image files found in {subfolder_name}")
            skipped += 1
            continue

        if len(image_files) > 1:
            print(f"  ⚠️  Multiple images found in {subfolder_name}, using the first one: {image_files[0].name}")

        # Take the first (and usually only) image file
        source_image = image_files[0]

        # Create target filename with .png extension
        target_filename = f"{subfolder_name}.png"
        target_image = target_path / target_filename

        try:
            # Copy the image to the target directory with the new name
            shutil.copy2(source_image, target_image)
            print(f"  ✓ Copied {source_image.name} -> {target_filename}")
            processed += 1

        except Exception as e:
            print(f"  ✗ Error processing {subfolder_name}: {e}")
            errors += 1

    print(f"\nSummary:")
    print(f"  Processed: {processed}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors: {errors}")
    print(f"  Total subdirectories: {len(subdirs)}")

def main():
    source_directory = "public/data/images_from_pinterest_dl"
    target_directory = "public/data/images_data"

    print("Organizing Pinterest downloaded images...")
    print(f"Source: {source_directory}")
    print(f"Target: {target_directory}")
    print("=" * 60)

    organize_pinterest_images(source_directory, target_directory)

    print("\nOrganization complete!")

if __name__ == "__main__":
    main()