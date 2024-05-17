import { readFile } from 'fs';

readFile('node_scripts/daisy_deck_optimizing.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const sections = data.split(/## (.+)/);
  let output = '';

  for (let i = 1; i < sections.length; i += 2) {
    const heading = sections[i];
    const content = sections[i + 1];

    output += `## ${heading}\n\n`;

    const qualities = ['Bad', 'Okay', 'Good', 'Excellent', 'Staple'];
    const cardsByQuality = {};

    content.split('\n').forEach(card => {
      const [name, description] = card.split(': ');
      if (name && description) {
        const [quality] = description.split('. ');
        if (!cardsByQuality[quality]) {
          cardsByQuality[quality] = [];
        }
        cardsByQuality[quality].push(card);
      }
    });

    qualities.forEach(quality => {
      if (cardsByQuality[quality]) {
        output += `### ${quality}\n\n`;
        output += cardsByQuality[quality].join('\n') + '\n\n';
      }
    });
  }

  console.log(output);
});