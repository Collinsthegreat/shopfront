const fs = require('fs');
const path = require('path');

const code = fs.readFileSync('src/lib/data/products.ts', 'utf8');
const slugs = [];
const regex = /slug:\s*["']([^"']+)["']/g;
let match;
while ((match = regex.exec(code)) !== null) {
  slugs.push(match[1]);
}

console.log('Total product slugs in dataset:', slugs.length);

let missing = 0;
for (const slug of slugs) {
  const file = path.join('public', 'products', `${slug}.webp`);
  if (!fs.existsSync(file)) {
    console.error('MISSING FILE:', file);
    missing++;
  }
}

if (missing === 0) {
  console.log(`SUCCESS: ALL ${slugs.length} PRODUCTS HAVE VERIFIED WEBP IMAGES ON DISK!`);
} else {
  console.error(`ERROR: ${missing} files are missing!`);
  process.exit(1);
}
