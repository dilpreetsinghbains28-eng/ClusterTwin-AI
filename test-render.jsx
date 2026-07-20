import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

import AppRoutes from './src/routes/AppRoutes.jsx';
import { SocketProvider } from './src/context/SocketContext.jsx';
import { ToastProvider } from './src/components/ui/Toast.jsx';
import { AuthContext } from './src/context/AuthContext.jsx';

// Since AuthContext is not exported, we can just mock useAuth by mocking the module, or since we can't easily do that, we will just export AuthContext from the file.

const mockAuthValue = {
  user: { name: 'Test User' },
  loading: false,
  login: () => {},
  logout: () => {},
  register: () => {},
};

try {
  const html = renderToString(
    <ToastProvider>
      <AuthContext.Provider value={mockAuthValue}>
        <SocketProvider>
          <MemoryRouter initialEntries={['/digital-twin']}>
            <AppRoutes />
          </MemoryRouter>
        </SocketProvider>
      </AuthContext.Provider>
    </ToastProvider>
  );
  console.log('SUCCESS! HTML:');
  console.log(html);
} catch (e) {
  console.error('ERROR RENDERING:');
  console.error(e);
}
