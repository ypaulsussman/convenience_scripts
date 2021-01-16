import fs from "fs";
import path from "path";
import { exec } from "child_process";

// $ node ~/Desktop/convenience_scripts/node_scripts/image_scraper.js ~/Documents/path/to/toplevel/dir/
// NB need to mkdir for L10 first

const extractImages = (file, fullPath) => {
  exec(
    `pdfimages -all "${fullPath}" ~/Desktop/pf_pics/${file
      .replace(/ /g, "\\ ")
      .slice(0, -4)}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

const walk = function (directoryName) {
  fs.readdir(directoryName, function (e, files) {
    if (e) {
      console.log("readdir error: ", e);
      return;
    }
    files.forEach(function (file) {
      var fullPath = path.join(directoryName, file);
      fs.stat(fullPath, function (e, f) {
        if (e) {
          console.log("stat error: ", e);
          return;
        }
        if (f.isDirectory()) {
          walk(fullPath);
        } else {
          console.log("file: ", file);
          console.log("fullpath: ", fullPath);
          extractImages(file, fullPath);
        }
      });
    });
  });
};

const startingDir = process.argv[2];
console.log("startingDir: ", startingDir);
walk(startingDir);

// AFTER:
// In Krita, set Filter > Colors > Color to Alpha (w/ low threshold) to remove black background
// Alternatively, use Contiguous selection tool, cut to separate layer, then delete that layer
// For FR books: Krita Ctrl+i to invert colors