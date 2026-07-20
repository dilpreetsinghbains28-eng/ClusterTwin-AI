const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const srcFiles = walk(path.join(__dirname, 'src'));
const backendFiles = walk(path.join(__dirname, 'backend'));
const files = [...srcFiles, ...backendFiles];

let fixedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('\\`')) {
    content = content.replace(/\\`/g, '`');
    changed = true;
  }
  
  if (content.includes('\\${')) {
    content = content.replace(/\\\${/g, '${');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files`);
