import { readFileSync, writeFileSync } from "fs";
import { get } from "https";

async function fetchAuthorInfo(name) {
  return new Promise((resolve, reject) => {
    const formattedName = name.split(" ").join("_");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`;

    get(url, (res) => {
      // Handling 302 redirects
      if (res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${redirectUrl}`,
          (res) => processResponse(res, resolve, reject)
        );
      } else {
        processResponse(res, resolve, reject);
      }
    }).on("error", (err) => {
      console.log(`Error fetching data for ${name}`);
      reject(err);
    });
  });
}

function processResponse(res, resolve, reject) {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const parsedData = JSON.parse(data);
      resolve(parsedData);
    } catch (error) {
      console.log(`Error processing data`);
      reject(error);
    }
  });
}

async function updateAuthorsWithWikipediaInfo() {
  try {
    // Read the JSON file
    const rawData = readFileSync(
      "./opl_data/authors_with_standardized_keys.json"
    );
    const data = JSON.parse(rawData);

    // Loop through the "authors" array
    for (let i = 0; i < data.authors.length; i++) {
      // Only fetch info if the title key is an empty string
      if (data.authors[i].title === "") {
        try {
          console.log(`Fetching information for ${data.authors[i].name}`);
          const authorInfo = await fetchAuthorInfo(data.authors[i].name);

          // Add the returned information to the "author" object
          data.authors[i].title = authorInfo.title;
          data.authors[i].extract = authorInfo.extract;
          data.authors[i].thumbnail = authorInfo.thumbnail
            ? authorInfo.thumbnail.source
            : "";
          data.authors[i].content_urls = authorInfo.content_urls
            ? authorInfo.content_urls.desktop.page
            : "";
        } catch (error) {
          console.log(
            `Could not fetch information for ${data.authors[i].name}`
          );
        }
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
