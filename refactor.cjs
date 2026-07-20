const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const backend = path.join(root, 'backend');

// 1. Create missing directories
const dirsToCreate = [
  path.join(src, 'styles'),
  path.join(src, 'context'),
  path.join(src, 'components', 'layout'),
  path.join(src, 'components', 'auth'),
  path.join(src, 'hooks'),
  path.join(src, 'constants'),
  path.join(src, 'types'),
  path.join(src, 'utils'),
  path.join(src, 'routes'),
  path.join(backend, 'database'),
  path.join(backend, 'scripts'),
  path.join(backend, 'validations'),
  path.join(backend, 'uploads'),
  path.join(backend, 'services'),
];

dirsToCreate.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    // Add a .gitkeep so git tracks it
    fs.writeFileSync(path.join(d, '.gitkeep'), '');
  }
});

// Helper for moving files
function moveFile(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved: ${oldPath} -> ${newPath}`);
  }
}

// Helper for moving directories
function moveDirContents(oldDir, newDir) {
  if (fs.existsSync(oldDir)) {
    const files = fs.readdirSync(oldDir);
    files.forEach(f => {
      moveFile(path.join(oldDir, f), path.join(newDir, f));
    });
    fs.rmdirSync(oldDir);
  }
}

// 2. Perform frontend moves
moveFile(path.join(src, 'App.css'), path.join(src, 'styles', 'App.css'));
moveFile(path.join(src, 'index.css'), path.join(src, 'styles', 'index.css'));

moveDirContents(path.join(src, 'contexts'), path.join(src, 'context'));
moveDirContents(path.join(src, 'layouts'), path.join(src, 'components', 'layout'));

moveFile(path.join(src, 'components', 'Navbar.jsx'), path.join(src, 'components', 'layout', 'Navbar.jsx'));
moveFile(path.join(src, 'components', 'Sidebar.jsx'), path.join(src, 'components', 'layout', 'Sidebar.jsx'));
moveFile(path.join(src, 'components', 'ProtectedRoute.jsx'), path.join(src, 'components', 'auth', 'ProtectedRoute.jsx'));

// 3. Perform backend moves
moveFile(path.join(backend, 'config', 'db.js'), path.join(backend, 'database', 'db.js'));
if (fs.existsSync(path.join(backend, 'config'))) {
    // leave config if other things are there, or delete if empty
    const files = fs.readdirSync(path.join(backend, 'config'));
    if (files.length === 0) fs.rmdirSync(path.join(backend, 'config'));
}

moveFile(path.join(backend, 'ai', 'recommendationEngine.js'), path.join(backend, 'services', 'recommendationEngine.js'));
if (fs.existsSync(path.join(backend, 'ai'))) fs.rmdirSync(path.join(backend, 'ai'));

moveFile(path.join(backend, 'simulators', 'iotSimulator.js'), path.join(backend, 'scripts', 'iotSimulator.js'));
moveFile(path.join(backend, 'simulators', 'scenarioEngine.js'), path.join(backend, 'scripts', 'scenarioEngine.js'));
if (fs.existsSync(path.join(backend, 'simulators'))) fs.rmdirSync(path.join(backend, 'simulators'));

moveFile(path.join(backend, 'generateApis.js'), path.join(backend, 'scripts', 'generateApis.js'));

if (fs.existsSync(path.join(backend, 'seed'))) fs.rmSync(path.join(backend, 'seed'), { recursive: true, force: true });
if (fs.existsSync(path.join(backend, 'sockets'))) fs.rmSync(path.join(backend, 'sockets'), { recursive: true, force: true });

// 4. Update import statements globally in frontend
const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const frontendFiles = walkSync(src);
let updatedFiles = 0;

frontendFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace contexts -> context
  content = content.replace(/\/contexts\//g, '/context/');

  // Replace layouts -> components/layout
  content = content.replace(/\/layouts\//g, '/components/layout/');
  content = content.replace(/from '\.\/layouts\//g, "from './components/layout/");
  content = content.replace(/from '\.\.\/layouts\//g, "from '../components/layout/");

  // Replace Navbar, Sidebar, ProtectedRoute imports
  // If a file was in pages/dashboard (depth 2), it imported components as ../../components/Navbar
  // Now it's ../../components/layout/Navbar
  content = content.replace(/from '\.\.\/\.\.\/components\/Navbar'/g, "from '../../components/layout/Navbar'");
  content = content.replace(/from '\.\.\/\.\.\/components\/Sidebar'/g, "from '../../components/layout/Sidebar'");
  content = content.replace(/from '\.\.\/components\/Navbar'/g, "from '../components/layout/Navbar'");
  content = content.replace(/from '\.\.\/components\/Sidebar'/g, "from '../components/layout/Sidebar'");
  content = content.replace(/from '\.\/components\/Navbar'/g, "from './components/layout/Navbar'");
  content = content.replace(/from '\.\/components\/Sidebar'/g, "from './components/layout/Sidebar'");
  
  content = content.replace(/from '\.\.\/\.\.\/components\/ProtectedRoute'/g, "from '../../components/auth/ProtectedRoute'");
  content = content.replace(/from '\.\.\/components\/ProtectedRoute'/g, "from '../components/auth/ProtectedRoute'");
  content = content.replace(/from '\.\/components\/ProtectedRoute'/g, "from './components/auth/ProtectedRoute'");

  // Fix styles
  if (file.includes('main.jsx')) {
    content = content.replace(/import '\.\/index\.css';/, "import './styles/index.css';");
  }
  if (file.includes('App.jsx')) {
    content = content.replace(/import '\.\/App\.css';/, "import './styles/App.css';");
  }

  // Self-correction for components that moved to components/layout
  if (file.includes(path.join('components', 'layout'))) {
    // they used to be in src/layouts (depth 1), now depth 2.
    // they used to import: import Navbar from '../components/Navbar';
    // now they import: import Navbar from './Navbar';
    content = content.replace(/from '\.\.\/components\/Navbar'/g, "from './Navbar'");
    content = content.replace(/from '\.\.\/components\/Sidebar'/g, "from './Sidebar'");
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
  }
});
console.log(`Updated ${updatedFiles} frontend files for imports.`);

// 5. Update backend imports
const backendFiles = walkSync(backend);
let updatedBackendFiles = 0;
backendFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // server.js
  if (file.includes('server.js')) {
    content = content.replace(/require\('\.\/config\/db'\)/, "require('./database/db')");
    content = content.replace(/require\('\.\/simulators\/iotSimulator'\)/, "require('./scripts/iotSimulator')");
  }

  // aiController.js
  if (file.includes('aiController.js')) {
    content = content.replace(/require\('\.\.\/ai\/recommendationEngine'\)/, "require('../services/recommendationEngine')");
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedBackendFiles++;
  }
});
console.log(`Updated ${updatedBackendFiles} backend files for imports.`);
