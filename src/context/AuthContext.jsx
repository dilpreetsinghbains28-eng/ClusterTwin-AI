import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // For initial boot

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Verify token by fetching user profile
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    console.log('5. [AuthContext] Calling api.post with:', userData);
    const res = await api.post('/auth/register', userData);
    console.log('6. [AuthContext] Received response:', res.status, res.data);
    const { token, ...user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
