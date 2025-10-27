const API_BASE_URL = 'https://setihome.ru/psycho-iam'; // Replace with API base URL

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  // Set tokens
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Get headers for requests
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Refresh token
  async refreshToken() {
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
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const includeAuth = options.headers && options.headers['Authorization'];

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
        await this.refreshToken();
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
  async login(identifier, password) {
    const response = await this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    return await response.json();
  }

  async register(username, password, email = null, phone = null) {
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
  async changePassword(currentPassword, newPassword, userId = null) {
    const response = await this.request('/api/v1/user/password/change', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, user_id: userId })
    });

    if (!response.ok) {
      throw new Error(`Password change failed with status ${response.status}`);
    }

    return await response.json();
  }

  // Session endpoints
  async validateSession(sessionId) {
    const response = await this.request(`/api/v1/session/validate?session_id=${sessionId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Session validation failed with status ${response.status}`);
    }

    return await response.json();
  }

  async listSessions(userId) {
    const response = await this.request(`/api/v1/session/list?user_id=${userId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Session listing failed with status ${response.status}`);
    }

    return await response.json();
  }

  async revokeSession(sessionId, reason = null) {
    const response = await this.request('/api/v1/session/revoke', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ session_id: sessionId, reason })
    });

    if (!response.ok) {
      throw new Error(`Session revocation failed with status ${response.status}`);
    }

    return await response.json();
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;