const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'backend', 'routes');
const files = fs.readdirSync(routesDir);

let fixed = 0;
files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the authorize on delete routes
    // Find: .delete(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'),
    // Replace with: .delete(protect, authorize('Admin'),
    const target = ".delete(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager')";
    const replacement = ".delete(protect, authorize('Admin')";
    
    if (content.includes(target)) {
      content = content.replaceAll(target, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
      fixed++;
    }
  }
});
console.log(`Fixed ${fixed} route files`);
