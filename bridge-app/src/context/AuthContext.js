import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authAPI.getCurrentUser();
    const authenticated = authAPI.isAuthenticated();

    if (currentUser && authenticated) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    return response;
  };

  const verify = async (email, code) => {
    const response = await authAPI.verify(email, code);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    verify,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
