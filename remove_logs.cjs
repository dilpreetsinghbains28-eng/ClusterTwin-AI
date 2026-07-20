const fs = require('fs');
const path = require('path');

const root = __dirname;
const srcDir = path.join(root, 'src');
const backendDir = path.join(root, 'backend');

// Exceptions where console logs are important for operations/boot
const exceptions = [
  'server.js',
  'errorMiddleware.js',
  'db.js',
  'logger.js'
];

function stripLogs(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      count += stripLogs(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      if (exceptions.some(e => file.endsWith(e))) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Regex to remove console.log(...); and console.error(...);
      // Handles multi-line arguments safely by matching up to the closing parenthesis
      content = content.replace(/console\.(log|error|warn|info)\s*\([\s\S]*?\);?/g, '');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Stripped logs from: ${fullPath}`);
        count++;
      }
    }
  }
  return count;
}

console.log('Stripping frontend logs...');
const frontendCount = stripLogs(srcDir);
console.log(`Frontend files cleaned: ${frontendCount}`);

console.log('Stripping backend logs...');
const backendCount = stripLogs(backendDir);
console.log(`Backend files cleaned: ${backendCount}`);
