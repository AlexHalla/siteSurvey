const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002';

class ApiService {
  baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getHeaders(includeAuth: boolean = false): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    return response;
  }

  // Auth endpoints
  async login(identifier: string, password: string, deviceId?: string, deviceLabel?: string): Promise<any> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, deviceId, deviceLabel })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    const result = await response.json();
    
    return result;
  }

  async logout(): Promise<any> {
    const response = await this.request('/auth/logout', {
      method: 'POST'
    });
    
    return await response.json();
  }

  async register(username: string, password: string, email: string, phone: string): Promise<any> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, phone })
    });

    if (!response.ok) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    const result = await response.json();
    
    return result;
  }

  async getProfile(): Promise<any> {
    const response = await this.request('/personalization/profile', {
      method: 'GET',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch profile with status ${response.status}: ${text}`);
    }

    return await response.json();
  }

  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.request('/auth/check-auth', {
        method: 'POST',
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async revokeSpecificSession(sessionId: string) {
    const response = await this.request(`/auth/revoke-specific-session/${sessionId}`, {
      method: 'POST',
    });

    return response.ok;
  }

  // Survey endpoints
  async getSurveys(): Promise<any> {
    const response = await this.request('/api/v1/survey-service/surveys', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch surveys with status ${response.status}`);
    }

    return await response.json();
  }

  async getSurveyById(id: string): Promise<any> {
    const response = await this.request(`/api/v1/survey-service/surveys/${id}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch survey with status ${response.status}`);
    }

    return await response.json();
  }

  async createSurvey(surveyData: any): Promise<any> {
    const response = await this.request('/api/v1/survey-service/surveys', {
      method: 'POST',
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create survey with status ${response.status}`);
    }

    return await response.json();
  }

  async saveSurveyResult(id: string, resultData: any): Promise<any> {
    const response = await this.request(`/api/v1/survey-service/surveys/${id}/results`, {
      method: 'POST',
      body: JSON.stringify(resultData)
    });

    if (!response.ok) {
      throw new Error(`Failed to save survey result with status ${response.status}, ${await response.text()}`);
    }

    return await response.json();
  }

  async getSurveyResults(id: string): Promise<any> {
    const response = await this.request(`/api/v1/survey-service/surveys/${id}/results`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch survey results with status ${response.status}`);
    }

    return await response.json();
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
