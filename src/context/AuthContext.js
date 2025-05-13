import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create auth context
const AuthContext = createContext();

// Set default axios baseURL
axios.defaults.baseURL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user data
          const response = await axios.get('/api/auth/me');
          
          if (response.data.success) {
            setCurrentUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (err) {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Register function
  const register = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post('/api/auth/register', { email, password });
      
      if (response.data.success) {
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        // Save token to local storage
        localStorage.setItem('token', token);
        
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 