// Simple test for the API service
import apiService from './api';

// Test the API service functionality
console.log('Testing API service...');

// Test token management
console.log('Initial tokens:', {
  accessToken: apiService.accessToken,
  refreshToken: apiService.refreshToken
});

// Test setting tokens
apiService.setTokens('test-access-token', 'test-refresh-token');
console.log('After setting tokens:', {
  accessToken: apiService.accessToken,
  refreshToken: apiService.refreshToken
});

// Test clearing tokens
apiService.clearTokens();
console.log('After clearing tokens:', {
  accessToken: apiService.accessToken,
  refreshToken: apiService.refreshToken
});

console.log('API service test completed.');