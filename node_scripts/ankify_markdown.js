import { readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import markdownIt from 'markdown-it';

// Read the Markdown file
const markdownFilePath = '/home/y/Desktop/anki_whiteboard.md';
const markdown = readFileSync(markdownFilePath, 'utf8');

// Convert Markdown to HTML
const md = new markdownIt();
const html = md.render(markdown);

// Create output file path
const htmlFileName = basename(markdownFilePath, '.md') + '.html';
const outputFilePath = join('/home/y/Desktop/', htmlFileName);

// Write the HTML to a new file
writeFileSync(outputFilePath, html, 'utf8');

console.log('Conversion completed!');
