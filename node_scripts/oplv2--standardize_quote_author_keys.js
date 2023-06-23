import { readFileSync, writeFileSync } from "fs";

function ensureKeysInAuthor(author) {
  // List of keys that should be present in each author object
  const requiredKeys = ["title", "extract", "thumbnail", "content_urls"];

  // Check if each required key is present, if not, add it with an empty string value
  for (const key of requiredKeys) {
    if (!author.hasOwnProperty(key)) {
      author[key] = "";
    }
  }
}

function updateAuthorsWithMissingKeys() {
  try {
    // Read the JSON file
    const rawData = readFileSync("./opl_data/authors_with_wikipedia_data.json");
    const data = JSON.parse(rawData);

    // Loop through the "authors" array
    for (let i = 0; i < data.authors.length; i++) {
      ensureKeysInAuthor(data.authors[i]);
    }

    // Write the updated "authors" array to a new JSON file
    writeFileSync("authors_with_all_keys.json", JSON.stringify(data, null, 2));

    console.log("Updated authors information saved to authorsWithAllKeys.json");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute the function
updateAuthorsWithMissingKeys();
