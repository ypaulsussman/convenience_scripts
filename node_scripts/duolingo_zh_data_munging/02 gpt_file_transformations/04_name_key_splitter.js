import { readFile, writeFile } from 'fs';

// Read the JSON file
readFile('/home/y/Desktop/__duotingo_docs/discarded_passes/duotingo--sveltekit/src/lib/duolingo_zh_lessons.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Iterate over each lesson object
  jsonData.lessons.forEach(lesson => {
    const [unit, lessonNumber] = lesson.name.split(', Lesson ');
    
    // Replace the "name" key with "unit" and "lesson" keys
    lesson.unit = unit;
    lesson.lesson = lessonNumber;
    delete lesson.name;
  });

  // Write the reformatted JSON to a new file
  writeFile('./shell_duolingo_vocab.json', JSON.stringify(jsonData, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Reformatted JSON file created successfully.');
  });
});