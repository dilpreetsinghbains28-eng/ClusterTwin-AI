const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend', 'models');
const files = fs.readdirSync(modelsDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    try {
      const model = require(path.join(modelsDir, file));
      console.log(`Loaded ${file} - Model Name: ${model.modelName}`);
      
      // Print references
      const schemaPaths = model.schema.paths;
      for (const [key, value] of Object.entries(schemaPaths)) {
        if (value.options && value.options.ref) {
          console.log(`  -> ${key} references ${value.options.ref}`);
        }
      }
    } catch (e) {
      console.error(`Error loading ${file}: ${e.message}`);
    }
  }
});
