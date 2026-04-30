import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verify token by fetching user profile
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // If token is invalid or expired
        console.error("Auth check failed:", error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    
    // Save token to localStorage
    localStorage.setItem('token', res.data.token);
    
    // Update state
    setUser(res.data.user);
    setIsAuthenticated(true);
    
    return res.data;
  };

  // Register function
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    
    // Save token to localStorage
    localStorage.setItem('token', res.data.token);
    
    // Update state
    setUser(res.data.user);
    setIsAuthenticated(true);
    
    return res.data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
