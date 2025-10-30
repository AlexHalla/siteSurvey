import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { User, AuthResponse, Session } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  register: (username: string, password: string, email?: string | null, phone?: string | null) => Promise<{ success: boolean; data?: any; error?: string; requiresVerification?: boolean }>;
  logout: () => void;
  checkAuth: () => void;
  listSessions: () => Promise<Session[]>;
  revokeSession: (sessionId: string, reason?: string | null) => Promise<any>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
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

  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(identifier, password);
      
      // Save tokens
      apiService.setTokens(response.access_token, response.refresh_token);
      
      // Save user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email: string | null = null, phone: string | null = null) => {
    try {
      setIsLoading(true);
      // Convert empty strings to null to match apiService expectations
      const emailParam = email === '' ? null : email;
      const phoneParam = phone === '' ? null : phone;
      const response: any = await apiService.register(username, password, emailParam, phoneParam);
      
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
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    apiService.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  const listSessions = async (): Promise<Session[]> => {
    try {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }
      
      const sessions: Session[] = await apiService.listSessions(user.id);
      return sessions;
    } catch (error: any) {
      console.error('Error listing sessions:', error);
      throw error;
    }
  };

  const revokeSession = async (sessionId: string, reason?: string | null): Promise<any> => {
    try {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }
      
      // Convert empty strings to null to match apiService expectations
      const reasonParam = reason === '' ? null : reason;
      const result = await apiService.revokeSession(sessionId, reasonParam);
      return result;
    } catch (error: any) {
      console.error('Error revoking session:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    listSessions,
    revokeSession
  };
};