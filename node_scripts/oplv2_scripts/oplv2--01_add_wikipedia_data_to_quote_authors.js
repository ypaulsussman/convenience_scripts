import { readFileSync, writeFileSync } from "fs";
import { get } from "https";

async function fetchAuthorInfo(name) {
  return new Promise((resolve, reject) => {
    const formattedName = name.split(" ").join("_");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`;

    get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          console.log(`Error processing data for ${name}`);
          reject(error);
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function updateAuthorsWithWikipediaInfo() {
  try {
    // Read the JSON file
    const rawData = readFileSync("./opl_data/og_opl_data.json");
    const data = JSON.parse(rawData);

    // Loop through the "authors" array
    for (let i = 0; i < data.authors.length; i++) {
      try {
        console.log(`Fetching information for ${data.authors[i].name}`);
        const authorInfo = await fetchAuthorInfo(data.authors[i].name);

        // Add the returned information to the "author" object
        data.authors[i].title = authorInfo.title;
        data.authors[i].extract = authorInfo.extract;
        data.authors[i].thumbnail = authorInfo.thumbnail
          ? authorInfo.thumbnail.source
          : null;
        data.authors[i].content_urls = authorInfo.content_urls
          ? authorInfo.content_urls.desktop.page
          : null;
      } catch (error) {
        console.log(`Could not fetch information for ${data.authors[i].name}`);
      }
    }

    // Write the updated "authors" array to a new JSON file
    writeFileSync("updatedAuthors.json", JSON.stringify(data, null, 2));

    console.log("Updated authors information saved to updatedAuthors.json");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute the function
updateAuthorsWithWikipediaInfo();
