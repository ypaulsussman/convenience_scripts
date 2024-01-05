#!/bin/bash

# Check if two arguments were provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <image_file> <language_code>"
  exit 1
fi

# The input image file
IMAGE_FILE=$1
# The language code
LANGUAGE_CODE=$2

# The output text file
TEXT_FILE="${IMAGE_FILE%.*}.txt"

# Set the TESSDATA_PREFIX to the path of the parent directory of "tessdata".
export TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Perform OCR using the specified language
tesseract "$IMAGE_FILE" "$TEXT_FILE" -l "$LANGUAGE_CODE"

echo "OCR complete. Output is in $TEXT_FILE"
