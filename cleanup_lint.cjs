const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const { target, replacement } of replacements) {
    // Escape regex if string provided or use regex directly
    if (typeof target === 'string') {
      content = content.split(target).join(replacement);
    } else {
      content = content.replace(target, replacement);
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. OverviewPage.jsx
replaceInFile('src/pages/dashboard/OverviewPage.jsx', [
  { target: 'const handleAction = (title, message) => {\n    setModalState({ isOpen: true, title, message });\n  };\n\n', replacement: '' },
  { target: 'bottomFactories.map((f, i) => (', replacement: 'bottomFactories.map((f) => (' }
]);

// 2. DashboardLayout.jsx
replaceInFile('src/layouts/DashboardLayout.jsx', [
  { target: "import { useState } from 'react';\n", replacement: '' }
]);

// 3. SimulationPage.jsx
replaceInFile('src/pages/dashboard/SimulationPage.jsx', [
  { target: '  }, [activeFactory]);', replacement: '  }, [activeFactory, fetchHistory]);' },
  { target: 'const fetchHistory = async () => {', replacement: 'const fetchHistory = useCallback(async () => {' },
  { target: "console.error('Failed to fetch history', err);\n    }\n  };\n", replacement: "console.error('Failed to fetch history', err);\n    }\n  }, [activeFactory]);\n" },
  { target: "import { useState, useEffect } from 'react';", replacement: "import { useState, useEffect, useCallback } from 'react';" }
]);

// 4. iotSimulator.js
replaceInFile('backend/simulators/iotSimulator.js', [
  { target: 'const createdRec = await Recommendation.create({', replacement: 'await Recommendation.create({' }
]);

// 5. Toast.jsx
replaceInFile('src/components/ui/Toast.jsx', [
  { target: "import { useState, useEffect, createContext, useContext, useCallback } from 'react';", replacement: "import { useState, createContext, useContext, useCallback } from 'react';" }
]);

// 6. AICopilot.jsx
replaceInFile('src/components/ui/AICopilot.jsx', [
  { target: '} catch (error) {', replacement: '} catch (error) {\n      console.error(error);' }
]);

// 7. Navbar.jsx
replaceInFile('src/components/Navbar.jsx', [
  { target: '} catch (error) {', replacement: '} catch (error) {\n      console.error(error);' },
  { target: '  const markAllRead = () => {\n    setNotifications(prev => prev.map(n => ({ ...n, read: true })));\n  };\n\n', replacement: '' },
  { target: '  const clearAll = () => {\n    setNotifications([]);\n  };\n\n', replacement: '' }
]);

// 8. ClustersPage.jsx
replaceInFile('src/pages/dashboard/ClustersPage.jsx', [
  { target: 'const navigate = useNavigate();\n  ', replacement: '' },
  { target: '  const handleAction = (title, message) => {\n    setModalState({ isOpen: true, title, message });\n  };\n\n', replacement: '' },
  { target: "import { useNavigate } from 'react-router-dom';\n", replacement: '' }
]);

// 9. PredictivePage.jsx
replaceInFile('src/pages/dashboard/PredictivePage.jsx', [
  { target: '  const handleAction = (title, message) => setModalState({ isOpen: true, title, message });\n\n', replacement: '' }
]);

// 10. ReportsPage.jsx
replaceInFile('src/pages/dashboard/ReportsPage.jsx', [
  { target: "import api from '../../services/api';\n", replacement: '' }
]);

// 11. DigitalTwinPage.jsx
replaceInFile('src/pages/dashboard/DigitalTwinPage.jsx', [
  { target: '  const handleAction = (title, message) => setModalState({ isOpen: true, title, message });\n\n', replacement: '' }
]);

console.log('Cleanup script finished.');
