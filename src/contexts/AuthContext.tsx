import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string, deviceId?: string, deviceLabel?: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  register: (username: string, password: string, email: string, phone: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getProfile: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const isAuthenticatedFromServer = await apiService.checkAuth();
      
      if (!isAuthenticatedFromServer) {
        // Not authenticated on server
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
      } else {
        // Authenticated on server, check local storage
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setIsAuthenticated(true);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Server says authenticated but no local data
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async (): Promise<User> => {
    try {
      const profileData = await apiService.getProfile();
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      return profileData;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string, deviceId?: string, deviceLabel?: string) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(identifier, password, deviceId, deviceLabel);
      
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', JSON.stringify(response));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email: string, phone: string) => {
    try {
      setIsLoading(true);
      const response: any = await apiService.register(username, password, email, phone);
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    getProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};