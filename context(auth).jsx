// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setAdmin(response.data);
    } catch (error) {
      console.error('Get profile error:', error);
      localStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...adminData } = response.data;
      localStorage.setItem('adminToken', token);
      setToken(token);
      setAdmin(adminData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, ...adminData } = response.data;
      localStorage.setItem('adminToken', token);
      setToken(token);
      setAdmin(adminData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const value = {
    admin,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};