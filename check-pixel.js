const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const expectedId = '697185be2058fdd08c7d7436';
const missing = [];
const incorrect = [];
const correct = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('cdn.utmify.com.br/scripts/pixel/pixel.js')) {
    missing.push(file);
    continue;
  }
  
  const match = content.match(/window\.pixelId\s*=\s*["']([^"']+)["']/);
  if (!match) {
    missing.push(file + " (script exists but ID not found)");
  } else if (match[1] !== expectedId) {
    incorrect.push(`${file} (Found: ${match[1]})`);
  } else {
    correct.push(file);
  }
}

console.log("=== PIXEL CHECK ===");
console.log("Missing pixel completely:", missing);
console.log("Incorrect pixel ID:", incorrect);
console.log("Correct pages:", correct.length);
