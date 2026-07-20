import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
