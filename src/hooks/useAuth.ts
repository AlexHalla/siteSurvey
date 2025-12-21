import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { User, AuthResponse } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string, deviceId?: string, deviceLabel?: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  register: (username: string, password: string, email: string, phone: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
  getProfile: () => Promise<User>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
    // Check if we have user data in localStorage (indicating authenticated state)
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        // console.error('Error parsing user data:', error);
        // Clear invalid user data
        localStorage.removeItem('user');
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const getProfile = async (): Promise<User> => {
    try {
      const profileData = await apiService.getProfile();
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(profileData));
      setUser(profileData);
      setIsAuthenticated(true);
      return profileData;
    } catch (error: any) {
      //console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const login = async (identifier: string, password: string, deviceId?: string, deviceLabel?: string) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(identifier, password, deviceId, deviceLabel);
      
      // Save user data to localStorage (no tokens since we're using cookies)
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true, data: response };
    } catch (error: any) {
      //console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email: string, phone: string) => {
    try {
      setIsLoading(true);
      const response: any = await apiService.register(username, password, email, phone);
      
      // If registration is complete, save user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return { success: true, data: response };
    } catch (error: any) {
      //console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clear user data from localStorage
    await apiService.logout();
    localStorage.removeItem('user');
    // Update state
    setIsAuthenticated(false);
    setUser(null);
    
    // Note: The actual cookie clearing should be handled by the backend
    // when it responds to a logout request. We're just clearing our local state.
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    getProfile
  };
};