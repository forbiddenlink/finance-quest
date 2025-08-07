// Simple test to check if the component can be imported
const path = require('path');
const fs = require('fs');

// Read the component file
const componentPath = './components/chapters/fundamentals/lessons/BusinessFinanceLesson.tsx';
const content = fs.readFileSync(componentPath, 'utf8');

// Check for common issues
console.log('File length:', content.length);
console.log('Has export default:', content.includes('export default'));
console.log('Has React import:', content.includes("import React"));

// Check for potential reserved word issues
const reservedWords = ['class', 'interface', 'let', 'const', 'function', 'export', 'import'];
reservedWords.forEach(word => {
  const regex = new RegExp(`\\b${word}\\b`, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`${word} found ${matches.length} times`);
  }
});

// Look for potential syntax issues
if (content.includes('switch')) console.log('Contains switch statement');
if (content.includes('case')) console.log('Contains case statements'); 
if (content.includes('default:')) console.log('Contains default case');
