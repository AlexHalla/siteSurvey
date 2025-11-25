const API_BASE_URL = 'https:'; // Replace with API base URL

class ApiService {
  baseURL: string;
  accessToken: string | null;
  refreshToken: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  // Set tokens
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Clear tokens
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Get headers for requests
  getHeaders(includeAuth: boolean = false): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Refresh token
  async refreshAuthToken(): Promise<any> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/token/refresh`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          refresh_token: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Make API request with automatic token refresh
  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const includeAuth = !!(options.headers && 'Authorization' in options.headers);

    let response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers
      }
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401 && includeAuth && this.refreshToken) {
      try {
        await this.refreshAuthToken();
        // Retry the request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...this.getHeaders(includeAuth),
            ...options.headers
          }
        });
      } catch (refreshError) {
        // If refresh fails, clear tokens and return original error
        this.clearTokens();
        return response;
      }
    }

    return response;
  }

  // Auth endpoints
  async login(identifier: string, password: string): Promise<any> {
    const response = await this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    return await response.json();
  }

  async register(username: string, password: string, email: string | null | undefined = null, phone: string | null | undefined = null): Promise<any> {
    const response = await this.request('/api/v1/user/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, phone })
    });

    if (!response.ok) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    return await response.json();
  }

  // User endpoints
  async changePassword(currentPassword: string, newPassword: string, userId: number | null = null): Promise<any> {
    const response = await this.request('/api/v1/user/password/change', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, user_id: userId })
    });

    if (!response.ok) {
      throw new Error(`Password change failed with status ${response.status}`);
    }

    return await response.json();
  }

  // Session endpoints
  async validateSession(sessionId: string): Promise<any> {
    const response = await this.request(`/api/v1/session/validate?session_id=${sessionId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Session validation failed with status ${response.status}`);
    }

    return await response.json();
  }

  async listSessions(userId: number): Promise<any> {
    const response = await this.request(`/api/v1/session/list?user_id=${userId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Session listing failed with status ${response.status}`);
    }

    return await response.json();
  }

  async revokeSession(sessionId: string, reason: string | null | undefined = null): Promise<any> {
    const response = await this.request('/api/v1/session/revoke', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      },
      body: JSON.stringify({ session_id: sessionId, reason })
    });

    if (!response.ok) {
      throw new Error(`Session revocation failed with status ${response.status}`);
    }

    return await response.json();
  }

  // Test endpoints
  async getTests(): Promise<any> {
    const response = await this.request('/api/v1/tests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tests with status ${response.status}`);
    }

    return await response.json();
  }

  async getTest(id: string): Promise<any> {
    const response = await this.request(`/api/v1/tests/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch test with status ${response.status}`);
    }

    return await response.json();
  }

  async createTest(testData: any): Promise<any> {
    const response = await this.request('/api/v1/tests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create test with status ${response.status}`);
    }

    return await response.json();
  }

  async updateTest(id: string, testData: any): Promise<any> {
    const response = await this.request(`/api/v1/tests/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update test with status ${response.status}`);
    }

    return await response.json();
  }

  async deleteTest(id: string): Promise<any> {
    const response = await this.request(`/api/v1/tests/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete test with status ${response.status}`);
    }

    return await response.json();
  }

  async submitTestResult(resultData: any): Promise<any> {
    const response = await this.request('/api/v1/test-results', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken!}`
      },
      body: JSON.stringify(resultData)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit test result with status ${response.status}`);
    }

    return await response.json();
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;