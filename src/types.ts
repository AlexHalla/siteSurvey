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

// Test types
export interface TestScale {
  id: string;
  name: string;
  min: number;
  max: number;
  interpretations: {
    minScore: number;
    maxScore: number;
    description: string;
  }[];
}

export interface TestQuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  score?: { [scaleId: string]: number }; // Score contribution to each scale
}

export interface TestQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: TestQuestionOption[];
  correctAnswer?: string;
  scaleId?: string; // Which scale this question contributes to
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration?: string;
  questions: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionsList?: TestQuestion[];
  scales?: TestScale[]; // Scoring scales for this test
}

export interface TestResult {
  id: string;
  testId: string;
  userId: number;
  score: number;
  completedAt: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  scaleScores?: { [scaleId: string]: number }; // Scores for each scale
}