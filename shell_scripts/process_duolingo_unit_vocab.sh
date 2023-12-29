#!/bin/bash

# Check if an argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# Input file provided as an argument
input_file=$1

# Output file name
output_file="${input_file%.txt}_processed.txt"

# Process the file
grep -oP '[\p{Han}-]' "$input_file" | sort -u | tr -d '\n' > "$output_file"

echo "Processed file is written to $output_file"
