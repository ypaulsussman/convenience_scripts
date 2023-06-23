import { readFileSync, writeFileSync } from "fs";

function removeTitleKeyFromAuthors() {
  try {
    // Read the JSON file
    const rawData = readFileSync("./opl_data/03_authors_requiring_redirects.json");
    const data = JSON.parse(rawData);

    // Loop through the "authors" array and remove the 'title' key
    for (let i = 0; i < data.authors.length; i++) {
      delete data.authors[i].title;
    }

    // Write the updated "authors" array to a new JSON file
    writeFileSync(
      "updatedAuthorsWithoutTitle.json",
      JSON.stringify(data, null, 2)
    );

    console.log(
      "Updated authors information saved to updatedAuthorsWithoutTitle.json"
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute the function
removeTitleKeyFromAuthors();
