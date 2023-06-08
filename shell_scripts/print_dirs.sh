#!/bin/bash

# Function to traverse directories recursively
traverse_directories() {
    local dir="$1"
    # Loop through each file and directory in the current directory
    for file in "$dir"/*; do
        # echo "$file"
        if [[ -f "$file" ]]; then
            # Print the full filepath of the file
            echo "$file"
        elif [[ -d "$file" ]]; then
            # If the item is a directory, recursively call the function
            traverse_directories "$file"
        fi
    done
}

# Prompt the user to enter the directory path
read -p "Enter the directory path: " directory

# Call the function to traverse the provided directory
traverse_directories "$directory"
