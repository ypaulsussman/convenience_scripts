import fs from "fs";
import cheerio from "cheerio";
import axios from "axios";
const { get } = axios;

import { urls, htmlCrufts } from "./gcStrings.js";

const ogFilePath = "./gcData.md";
const processedFilePath = "./gcDataMunged.md";

urls.forEach((courseUrl) => {
  get(courseUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const h1 = $(".product-name").html();
      const lectures = $(".lectures-container").html();

      fs.writeFileSync(ogFilePath, `qqqq${h1} `, { flag: "a+" }, (err) => {
        console.log("err: ", err);
      });
      fs.writeFileSync(
        ogFilePath,
        `${lectures} `,
        { flag: "a+" },
        (err) => {
          console.log("err: ", err);
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

const fileContent = fs.readFileSync(ogFilePath, "utf8");

let newContent;

newContent = fileContent.replace(/\n/g, "");
newContent = newContent.replace(/[\s]+/g, " ");

newContent = newContent.replace(
  /<div class="lecture-counter">([\d]+)<\/div> <div class="lecture-title">/g,
  /### Lecture $1: /
  );

newContent = newContent.replace(/qqqq/g, "## ");
newContent = newContent.replace(
  /<div class="lecture-description-block right">|<div class="lecture-description-block left">/g,
  "####"
);

newContent = newContent.replace(/&apos;|#x2019;/g, "'");
newContent = newContent.replace(/&quot;|&#x201C;|&#x201D;/g, '"');
newContent = newContent.replace(/&#x2013;|&#x2014;/g, " - ");
newContent = newContent.replace(/<em>|<\/em>|<i>|<\/i>/g, " - ");

// there was definitely a better way to do this
newContent = newContent.replace(/&#xC7;/g, "Ç");
newContent = newContent.replace(/&#xD6;/g, "Ö");
newContent = newContent.replace(/&#xE1;/g, "á");
newContent = newContent.replace(/&#xE8;/g, "è");
newContent = newContent.replace(/&#xE9;/g, "é");
newContent = newContent.replace(/&#xFC;/g, "ü");
newContent = newContent.replace(/&#xF6;/g, "ö");
newContent = newContent.replace(/&#xF4;/g, "ô");


htmlCrufts.forEach((cruft) => {
  newContent = newContent.replace(cruft, "");
});

newContent = newContent.replace(/\/|&#xAC;/g, "");
newContent = newContent.replace(/[\s]+/g, " ");

fs.writeFileSync(processedFilePath, newContent);
