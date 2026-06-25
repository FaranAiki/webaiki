#!/bin/bash

# A script to automatically compress PDF files using Ghostscript
# Usage: ./scripts/compress_pdfs.sh [target_directory]
# If no directory is provided, it defaults to 'public'

TARGET_DIR="${1:-public}"

echo "Compressing PDFs in directory: $TARGET_DIR"

# Find all PDF files in the target directory
find "$TARGET_DIR" -type f -name "*.pdf" | while read -r pdf_file; do
    echo "Processing: $pdf_file"
    
    # Get original file size
    orig_size=$(stat -c%s "$pdf_file")
    
    # Create a temporary file
    temp_file=$(mktemp --suffix=".pdf")
    
    # Compress the PDF using Ghostscript
    # /ebook setting provides a good balance between size and quality (150 dpi)
    gs -sDEVICE=pdfwrite \
       -dCompatibilityLevel=1.4 \
       -dPDFSETTINGS=/ebook \
       -dNOPAUSE \
       -dQUIET \
       -dBATCH \
       -sOutputFile="$temp_file" \
       "$pdf_file"
    
    if [ $? -eq 0 ]; then
        new_size=$(stat -c%s "$temp_file")
        
        # Check if the compressed file is actually smaller
        if [ "$new_size" -lt "$orig_size" ]; then
            mv "$temp_file" "$pdf_file"
            
            orig_mb=$(echo "scale=2; $orig_size / 1048576" | bc)
            new_mb=$(echo "scale=2; $new_size / 1048576" | bc)
            
            echo "  ✅ Compressed: ${orig_mb}MB -> ${new_mb}MB"
        else
            rm "$temp_file"
            echo "  ➖ Skipped: Already optimized"
        fi
    else
        rm "$temp_file"
        echo "  ❌ Failed to compress"
    fi
done

echo "Done compressing PDFs!"
