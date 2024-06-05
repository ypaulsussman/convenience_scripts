#!/bin/bash

# This takes every h3 heading in the input file and creates a new file in the output directory with the same name as the heading. It then copies the content of the h3 heading into the new file.

input_file="/home/y/Desktop/yr_workspace/projects/small-project_brainstorming/03_revised_ideas.md"
output_dir="/home/y/Desktop/yr_workspace/projects/small-project_brainstorming/will_totally_ever_build"

mkdir -p "$output_dir"

while IFS= read -r line; do
		if [[ $line =~ ^###\ (.*)$ ]]; then
				heading="${BASH_REMATCH[1]}"
				snake_case_title=$(echo "$heading" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
				output_file="$output_dir/$snake_case_title.md"
				echo "# $heading" > "$output_file"
		elif [[ -n $output_file ]]; then
				echo "$line" >> "$output_file"
		fi
done < "$input_file"
