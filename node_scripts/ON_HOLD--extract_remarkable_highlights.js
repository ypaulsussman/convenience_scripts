import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import zlib from "zlib";
import { promisify } from "util";

const inflate = promisify(zlib.inflate);

async function decompressStream(buffer) {
  try {
    const data = buffer[0] === 0x78 ? buffer : buffer.slice(2);
    return await inflate(data);
  } catch (error) {
    console.error("Decompression error:", error);
    return buffer;
  }
}

function isYellowHighlight(r, g, b) {
  return (
    (r > 0.6 && g > 0.6 && b < 0.7) || // Traditional yellow
    (r > 0.7 && g > 0.7 && b < 0.8)
  ); // Lighter yellow
}

function parsePath(line) {
  const pathPart = line
    .replace(/[\d.]+ [\d.]+ [\d.]+ rg/, "")
    .replace(/\s*f\s*$/, "")
    .trim();
  const parts = pathPart.split(/[ml]\s+/).filter(Boolean);
  return parts.map((part) => {
    const [x, y] = part.split(/\s+/).map(Number);
    return { x, y };
  });
}

function extractText(line) {
  const textMatch = line.match(/\((.*?)\)/) || line.match(/\[(.*?)\]/);
  if (textMatch) {
    let text = textMatch[1]
      .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\")
      .replace(/-\d+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    console.log("Extracted text:", text);
    return text;
  }
  return "";
}

function pointInRect(point, rect, tolerance = 5) {
  // Transform point to account for PDF coordinate system
  const transformedPoint = {
    x: point.x,
    y: 791.999983 - point.y, // Page height and y-axis flip
  };

  console.log(
    `Checking point (${point.x}, ${point.y}) -> transformed (${transformedPoint.x}, ${transformedPoint.y}) against rect:`,
    rect
  );

  return (
    transformedPoint.x >= rect.left - tolerance &&
    transformedPoint.x <= rect.right + tolerance &&
    transformedPoint.y >= rect.bottom - tolerance &&
    transformedPoint.y <= rect.top + tolerance
  );
}

// New function to group nearby text positions
function groupTextByPosition(textPositions, tolerance = 2) {
  if (textPositions.length === 0) return [];

  // Sort by y position first, then x position
  const sorted = [...textPositions].sort((a, b) => {
    if (Math.abs(a.position.y - b.position.y) <= tolerance) {
      return a.position.x - b.position.x;
    }
    return b.position.y - a.position.y;
  });

  const groups = [];
  let currentGroup = [sorted[0]];
  let lastPosition = sorted[0].position;

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    if (
      Math.abs(current.position.y - lastPosition.y) <= tolerance &&
      current.position.x - lastPosition.x <= 50
    ) {
      currentGroup.push(current);
    } else {
      groups.push({
        text: currentGroup
          .map((item) => item.text)
          .join(" ")
          .trim(),
        position: currentGroup[0].position,
      });
      currentGroup = [current];
    }

    lastPosition = current.position;
  }

  if (currentGroup.length > 0) {
    groups.push({
      text: currentGroup
        .map((item) => item.text)
        .join(" ")
        .trim(),
      position: currentGroup[0].position,
    });
  }

  return groups;
}

function findHighlightedText(content) {
  const highlights = [];
  const textPositions = [];
  let currentHighlight = null;
  let currentPosition = { x: 0, y: 0 };
  let currentColor = null;

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const tmMatch = line.match(
      /([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+Tm/
    );
    if (tmMatch) {
      const [_, a, b, c, d, x, y] = tmMatch.map(Number);
      currentPosition = { x, y };
      continue;
    }

    const tdMatch = line.match(/([\d.-]+)\s+([\d.-]+)\s+Td/);
    if (tdMatch) {
      const [_, dx, dy] = tdMatch.map(Number);
      currentPosition.x += dx;
      currentPosition.y += dy;
      continue;
    }

    const colorMatch = line.match(/([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+rg/);
    if (colorMatch) {
      const [_, r, g, b] = colorMatch.map(Number);
      currentColor = [r, g, b];

      if (
        isYellowHighlight(r, g, b) &&
        line.includes(" m ") &&
        line.includes(" l ")
      ) {
        const points = parsePath(line);
        if (points.length >= 4) {
          const xs = points.map((p) => p.x);
          const ys = points.map((p) => p.y);
          currentHighlight = {
            rect: {
              left: Math.min(...xs),
              right: Math.max(...xs),
              top: Math.max(...ys),
              bottom: Math.min(...ys),
            },
            color: currentColor,
            text: [],
          };
          highlights.push(currentHighlight);
        }
      }
      continue;
    }

    if (
      line.includes(" m ") &&
      line.includes(" l ") &&
      currentColor &&
      isYellowHighlight(...currentColor)
    ) {
      const points = parsePath(line);
      if (points.length >= 4) {
        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        currentHighlight = {
          rect: {
            left: Math.min(...xs),
            right: Math.max(...xs),
            top: Math.max(...ys),
            bottom: Math.min(...ys),
          },
          color: currentColor,
          text: [],
        };
        highlights.push(currentHighlight);
      }
    }

    const text = extractText(line);
    if (text) {
      console.log(
        `Found text "${text}" at position ${currentPosition.x}, ${currentPosition.y}`
      );
      textPositions.push({
        text,
        position: { ...currentPosition },
      });
    }
  }

  // Group text positions before associating with highlights
  const groupedText = groupTextByPosition(textPositions);
  console.log("Grouped text positions:", groupedText);

  // Associate text with highlights
  for (const group of groupedText) {
    for (const highlight of highlights) {
      if (pointInRect(group.position, highlight.rect)) {
        console.log(`Associating text "${group.text}" with highlight region`);
        if (!highlight.text.includes(group.text)) {
          // Avoid duplicates
          highlight.text.push(group.text);
        }
      }
    }
  }

  console.log(`\nFound ${highlights.length} highlighted regions:`);
  highlights.forEach((h, idx) => {
    console.log(`\nRegion ${idx + 1}:`);
    console.log("Rectangle:", h.rect);
    console.log("Text found:", h.text.join(" "));
  });

  return highlights;
}

async function extractHighlights(pdfPath, outputPath) {
  try {
    console.log("Reading PDF file:", pdfPath);
    const pdfBytes = await fs.readFile(pdfPath);

    console.log("Loading PDF document...");
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      updateMetadata: false,
    });

    const pages = pdfDoc.getPages();
    console.log(`Processing ${pages.length} pages...`);

    let allHighlights = [];

    for (let i = 0; i < pages.length; i++) {
      console.log(`\nProcessing page ${i + 1}...`);
      const page = pages[i];

      const content = page.node.Contents();
      if (!content) continue;

      const streams = Array.isArray(content) ? content : [content];

      for (const stream of streams) {
        const compressedData = stream.contents;
        if (!compressedData) continue;

        const decompressed = await decompressStream(compressedData);
        const streamContent = decompressed.toString("utf8");

        console.log("\nExtracting highlighted text...");
        const highlightedRegions = findHighlightedText(streamContent);
        allHighlights.push(...highlightedRegions);
      }
    }

    const output =
      `Found ${allHighlights.length} highlighted regions:\n\n` +
      allHighlights
        .map(
          (h, idx) =>
            `Region ${idx + 1}:\n` +
            `Bounds: (${h.rect.left.toFixed(2)}, ${h.rect.bottom.toFixed(
              2
            )}) to ` +
            `(${h.rect.right.toFixed(2)}, ${h.rect.top.toFixed(2)})\n` +
            `Text: ${h.text.join(" ")}\n`
        )
        .join("\n---\n\n");

    await fs.writeFile(outputPath, output, "utf-8");
    console.log(
      `\nExtracted ${allHighlights.length} highlights to ${outputPath}`
    );

    return allHighlights;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}

// CLI handling
const [, , pdfPath, outputPath] = process.argv;

if (!pdfPath) {
  console.error("Please provide a PDF file path");
  process.exit(1);
}

const finalOutputPath = outputPath || "highlights.txt";

extractHighlights(pdfPath, finalOutputPath).catch((error) => {
  console.error("Failed to extract highlights:", error);
  process.exit(1);
});
