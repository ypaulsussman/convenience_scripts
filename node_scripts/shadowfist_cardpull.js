import { createWriteStream, mkdirSync } from "fs";
import { join, basename } from "path";
import { get } from "axios";
import { load } from "cheerio";

const baseUrl = "https://secretwarsociety.com/card";
const downloadDir = join(process.env.HOME, "Downloads", "cardlist");

async function downloadImages(url, directory) {
  try {
    const response = await get(url);
    const $ = load(response.data);

    const viewContent = $("div.view-content");
    const imgTags = viewContent.find("span.field-content img");

    imgTags.each(async (index, element) => {
      const imgSrc = $(element).attr("src");
      const imgUrl = new URL(imgSrc, url).href;
      const imgFileName = basename(imgSrc);
      const imgFilePath = join(directory, imgFileName);

      const imgResponse = await get(imgUrl, { responseType: "stream" });
      const writer = createWriteStream(imgFilePath);
      imgResponse.data.pipe(writer);
    });
  } catch (error) {
    console.error("Error downloading images:", error);
  }
}

async function processLinks(url) {
  try {
    const response = await get(url);
    const $ = load(response.data);

    const viewContent = $("div.view-content");
    const aTags = viewContent.find("span.field-content a");

    aTags.each(async (index, element) => {
      const linkText = $(element).text();
      const href = $(element).attr("href");
      const linkUrl = new URL(href, url).href;
      const dirName = linkText.toLowerCase().replace(/\s+/g, "_");
      const dirPath = join(downloadDir, dirName);

      mkdirSync(dirPath, { recursive: true });
      await downloadImages(linkUrl, dirPath);
    });
  } catch (error) {
    console.error("Error processing links:", error);
  }
}

// Start the script
processLinks(baseUrl);
