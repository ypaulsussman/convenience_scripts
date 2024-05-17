import { readFile, writeFile } from "fs";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

// Original source: https://duolingo-mandarin-chinese.netlify.app/
// Alt backups at:
  // https://github.com/anki-decks/anki-deck-for-duolingo-chinese/blob/master/words.tsv
  // https://www.hackchinese.com/third_parties/duolingo

// Read the HTML file
readFile("./duolingo_zh_vocab--unparsed.html", "utf8", (err, html) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the HTML
  const dom = new JSDOM(html);
  const document = dom.window.document;

  let vocab = {};

  // Iterate over each h3 element
  document.querySelectorAll("h3").forEach((h3) => {
    const topic = h3.textContent.trim().toLowerCase().replace(/\s+/g, "_");
    vocab[topic] = {};

    // Iterate over each sibling element until the next h3 is found
    let sibling = h3.nextElementSibling;
    while (sibling && sibling.tagName !== "H3") {
      if (sibling.tagName === "TABLE") {
        const lesson = sibling
          .querySelector("caption")
          .textContent.trim()
          .toLowerCase()
          .replace(/\s+/g, "_");
        vocab[topic][lesson] = [];

        // Iterate over table rows
        sibling.querySelectorAll("tbody tr").forEach((tr) => {
          let tds = tr.querySelectorAll("td");
          let vocabItem = {
            simplified: tds[0]?.textContent.trim(),
            pinyin: tds[2]?.textContent.trim(),
            definition: tds[3]?.textContent.trim(),
          };
          vocab[topic][lesson].push(vocabItem);
        });
      }
      sibling = sibling.nextElementSibling;
    }
  });

  // Write the JSON to a file
  writeFile("vocab.json", JSON.stringify({ vocab }, null, 2), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Vocabulary JSON generated successfully!");
    }
  });
});
