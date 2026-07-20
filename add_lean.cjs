const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'backend', 'services');
const files = fs.readdirSync(servicesDir);

let fixed = 0;
files.forEach(file => {
  if (file.endsWith('Service.js')) {
    const filePath = path.join(servicesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // We want to replace .find(query) with .find(query).lean()
    // But safely. We will use a regex to find any `.find(query)` or `.findById(id)` that does NOT already end in `.lean()` or `.populate()`.
    // Actually, simple replace is safer. Let's just find exactly what we know is there.
    
    // e.g. return await Factory.find(query); -> return await Factory.find(query).lean();
    content = content.replace(/\.find\(query\);/g, '.find(query).lean();');
    content = content.replace(/\.findById\(id\);/g, '.findById(id).lean();');
    
    // For specific ones like User.find()
    content = content.replace(/\.find\(\);/g, '.find().lean();');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added .lean() to ${file}`);
      fixed++;
    }
  }
});
console.log(`Updated ${fixed} service files`);
