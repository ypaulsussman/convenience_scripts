const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://secretwarsociety.com/card/"
const downloadDir = path.join(process.env.HOME, "Downloads", "cardlist");
const downloadDelay = 500; // Delay between each image download in milliseconds

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(imgUrl, imgFilePath, retries = 3) {
  try {
    const imgResponse = await axios.get(imgUrl, {
      responseType: "stream",
      timeout: 10000, // Increase the timeout to 10 seconds
    });
    const writer = fs.createWriteStream(imgFilePath);
    imgResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying download for ${imgUrl}. Retries left: ${retries}`);
      await downloadImage(imgUrl, imgFilePath, retries - 1);
    } else {
      console.error("Error downloading image:", error);
    }
  }
}

async function downloadImages(url, directory) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const viewContent = $("div.view-content");
    const imgTags = viewContent.find("div.field-content img");

    for (const element of imgTags) {
      const imgSrc = $(element).attr("src");
      const imgUrl = new URL(imgSrc, url).href;
      const imgFileName = path.basename(imgSrc).split("?")[0];
      const imgFilePath = path.join(directory, imgFileName);

      await downloadImage(imgUrl, imgFilePath);
      await sleep(downloadDelay);
    }
  } catch (error) {
    console.error("Error downloading images:", error);
  }
}

async function processLinks(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const viewContent = $("div.view-content");
    const aTags = viewContent.find("span.field-content a");

    for (const element of aTags) {
      const linkText = $(element).text();
      const href = $(element).attr("href");
      const linkUrl = new URL(href, url).href;
      const dirName = linkText.toLowerCase().replace(/\s+/g, "_");
      const dirPath = path.join(downloadDir, dirName);

      fs.mkdirSync(dirPath, { recursive: true });
      await downloadImages(linkUrl, dirPath);
    }
  } catch (error) {
    console.error("Error processing links:", error);
  }
}

// Start the script
processLinks(baseUrl);
