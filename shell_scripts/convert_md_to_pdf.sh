#!/bin/bash

# HOW TO USE: `cp` both this and the `blanK_pages.pdf` file into the dir containing all the markdown files you want to convert to PDF, then run `./convert_md_to_pdf.sh` in the terminal; you should get a new `output.pdf` file in the same dir containing all the converted PDFs with blank pages added in between.

set -e

temp_dir=$(mktemp -d)
echo "Created temporary directory: $temp_dir"

for file in *.md; do
    echo "Processing $file..."
    if pandoc "$file" -o "$temp_dir/$file.pdf"; then
        echo "Converted $file to PDF successfully."
    else
        echo "Error converting $file to PDF."
        exit 1
    fi

    if pdftk "$temp_dir/$file.pdf" blank_pages.pdf cat output "$temp_dir/$file-with-blank.pdf"; then
        echo "Added blank pages to $file-with-blank.pdf successfully."
    else
        echo "Error adding blank pages to $file-with-blank.pdf."
        exit 1
    fi
done

if pdfunite "$temp_dir"/*-with-blank.pdf output.pdf; then
    echo "Merged PDF files successfully."
else
    echo "Error merging PDF files."
    exit 1
fi

rm -rf "$temp_dir"