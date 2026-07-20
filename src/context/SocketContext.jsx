import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '../components/ui/Toast';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [globalKpis, setGlobalKpis] = useState({});
  const [alerts, setAlerts] = useState([]);
  const addToast = useToast();

  useEffect(() => {
    // Connect to the backend
    const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('SOCKET CONNECTED to server!');
    });
    
    socketInstance.onAny((eventName, ...args) => {
      console.log(`RECEIVED EVENT [${eventName}]:`, ...args);
    });

    // Listen to global KPIs
    socketInstance.on('telemetry:factory_summary', (data) => {
      console.log('Received telemetry:factory_summary:', data);
      setGlobalKpis(data);
    });

    // Listen to new alerts globally
    socketInstance.on('alert:new', (alertData) => {
      // Add to local state list
      setAlerts(prev => [alertData, ...prev].slice(0, 20)); // Keep last 20
      
      // Trigger UI Toast
      const color = alertData.severity === 'Critical' ? 'error' : 'tertiary';
      addToast(`[${alertData.severity}] ${alertData.message}`, color);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [addToast]);

  return (
    <SocketContext.Provider value={{ socket, globalKpis, alerts }}>
      {children}
    </SocketContext.Provider>
  );
};
