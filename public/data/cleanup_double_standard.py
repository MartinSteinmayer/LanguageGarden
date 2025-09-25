#!/usr/bin/env python3

import os
from pathlib import Path

def cleanup_double_standard(directory_path):
    """
    Fix files that have _standard_standard by renaming to just _standard
    """
    directory = Path(directory_path)
    if not directory.exists():
        print(f"Directory {directory_path} does not exist")
        return

    # Find all files with double _standard
    for image_path in directory.glob("*_standard_standard.png"):
        # Get the base name and remove the extra _standard
        base_name = image_path.stem.replace('_standard_standard', '_standard')

        new_name = f"{base_name}.png"
        new_path = directory / new_name

        print(f"Fixing: {image_path.name} -> {new_name}")

        try:
            image_path.rename(new_path)
            print(f"✓ Successfully fixed {image_path.name}")
        except Exception as e:
            print(f"✗ Error fixing {image_path.name}: {e}")

def main():
    # Define the directories to process
    directories = [
        "public/data/images_definitely_endangered",
        "public/data/images_severely_endangered"
    ]

    for directory in directories:
        print(f"\nCleaning up directory: {directory}")
        print("=" * 50)
        cleanup_double_standard(directory)

    print("\nCleanup complete!")

if __name__ == "__main__":
    main()