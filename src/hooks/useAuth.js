import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const accessToken = localStorage.getItem('access_token');
    // Check if we have a token and validate it with the backend
    if (accessToken) {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // If we have a token but no user data, clear everything
          logout();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const login = async (identifier, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(identifier, password);
      
      // Save tokens
      apiService.setTokens(response.access_token, response.refresh_token);
      
      // Save user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, password, email = null, phone = null) => {
    try {
      setIsLoading(true);
      const response = await apiService.register(username, password, email, phone);
      
      // If registration requires verification, handle accordingly
      if (response.requires_verification) {
        return { success: true, data: response, requiresVerification: true };
      }
      
      // If registration is complete, log the user in
      if (response.access_token && response.refresh_token) {
        apiService.setTokens(response.access_token, response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return { success: true, data: response, requiresVerification: false };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  };
};