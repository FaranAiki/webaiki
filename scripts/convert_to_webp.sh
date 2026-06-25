#!/bin/bash

# A script to automatically convert PNG and JPG files to WebP
# Usage: ./scripts/convert_to_webp.sh [target_directory]
# If no directory is provided, it defaults to 'public'

TARGET_DIR="${1:-public}"

echo "Converting images to WebP in directory: $TARGET_DIR"

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "⚠️ cwebp is not installed. Skipping WebP conversion."
    echo "For Ubuntu/Debian: sudo apt-get install webp"
    echo "For Arch Linux: sudo pacman -S libwebp"
    exit 0
fi

# Find all PNG and JPG/JPEG files
find "$TARGET_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img_file; do
    echo "Processing: $img_file"
    
    # Define the new webp filename
    webp_file="${img_file%.*}.webp"
    
    # Check if the webp version already exists to avoid redundant conversions
    if [ -f "$webp_file" ]; then
        echo "  ➖ Skipped: $webp_file already exists."
        continue
    fi
    
    # Convert to WebP (quality 80 is a good default for web)
    cwebp -q 80 "$img_file" -o "$webp_file" -quiet
    
    if [ $? -eq 0 ]; then
        echo "  ✅ Converted to $webp_file"
        # Optional: uncomment the line below to delete the original file after conversion
        # rm "$img_file"
    else
        echo "  ❌ Failed to convert $img_file"
    fi
done

echo "Done converting images to WebP!"
