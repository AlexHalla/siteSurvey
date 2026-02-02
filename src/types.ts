// User types
export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
}


export interface Profile {
  id: number,
  username: string,
  email?: string,
  avatar?: string,
  sessions: Array<Session>
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
  id: number;  // Changed to number
  name: string;
}

export interface TestResultInterpretation {
  scale_id: number;  // Changed to number
  min_score: number;
  max_score: number;
  text: string;
}

export interface TestQuestionOption {
  id: number;  // Changed to number
  order: number;
  text: string;
  scores: number;  // Changed from score object to single number
}

export interface TestQuestion {
  id: number;
  order: number;  // Added order field
  text: string;
  type: 'single' | 'multiple' | 'text';
  scales: number[];  // Changed from scaleId to scales array
  options?: TestQuestionOption[];
}

// // Test result from backend - new format
// export interface TestResultFromBackend {
//   scale_id: number;
//   result_string: string;
// }

export interface Test {
  _id: string;  // Changed from id to _id
  name: string;  // Changed from title to name
  description: string;
  author: string;  // Added author field
  questions: TestQuestion[];
  scales: TestScale[];
  results: TestResultInterpretation[]; // For test creation
}

export interface TestResult {
  user_id: string;  // Changed structure
  questions: {
    question_id: number;
    option_id: number;
  }[];
  // Results from backend processing
  results?: [];
}