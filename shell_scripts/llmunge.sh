#!/bin/bash

# Check if the filepath parameter is provided
if [ $# -eq 0 ]; then
		echo "Please provide a filepath as a parameter."
		exit 1
fi

# Get the filepath from the command line argument
filepath="$1"

# Create a new output.txt file
output_file="$HOME/Downloads/output.txt"
> "$output_file"

# Recursively traverse all child files and directories
while IFS= read -r -d '' file; do
		# Check if the item is a regular file and has a matching extension
		if [ -f "$file" ] && [[ "$file" =~ \.(svelte|ts|js|json|css|html)$ ]]; then
				# Get the relative filepath
				relative_path="${file#$filepath}"
				
				# Append the relative filepath to the output file
				echo "// $relative_path" >> "$output_file"
				
				# Append the first 500 lines of the file to the output file
				head -n 500 "$file" >> "$output_file"
				
				# Check if the file has more than 500 lines
				if [ $(wc -l < "$file") -gt 500 ]; then
						echo "// rest of file truncated" >> "$output_file"
				fi
				
				# Append the separator to the output file
				echo -e "\n\n===\n\n" >> "$output_file"
		fi
done < <(find "$filepath" -type f -print0)

echo "Output file generated: $output_file"