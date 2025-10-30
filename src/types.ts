// User types
export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Authentication types
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Session types
export interface Session {
  id: string;
  device: string;
  lastActive: string;
  current: boolean;
}

// News and Feed types
export interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
}

export interface FeedItem {
  id: number;
  type: 'article' | 'event' | 'image';
  title: string;
  author?: string;
  date: string;
  time?: string;
  image: string;
}