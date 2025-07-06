import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookies
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Log request
    console.log(`[API] ${config.method?.toUpperCase() || 'REQUEST'} ${config.url}`, {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: {
        ...config.headers,
        // Don't log the entire auth token, just that it exists
        Authorization: config.headers.Authorization ? '[REDACTED]' : 'Not set'
      }
    });

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
      console.log('[API] Using auth token:', formattedToken.substring(0, 15) + '...');
    } else {
      console.warn('[API] No auth token found');
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`[API] ${response.config.method?.toUpperCase() || 'RESPONSE'} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error responses
    if (error.response) {
      console.error(`[API] Error ${error.response.status} ${error.response.statusText}:`, {
        url: error.config.url,
        method: error.config.method,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        request: {
          headers: error.config.headers,
          data: error.config.data,
          params: error.config.params
        }
      });
      
      // Add more descriptive error message based on status code
      if (error.response.status === 401) {
        error.message = 'Authentication required. Please log in again.';
      } else if (error.response.status === 403) {
        error.message = 'You do not have permission to perform this action.';
      } else if (error.response.status === 404) {
        error.message = 'The requested resource was not found.';
      } else if (error.response.status === 500) {
        error.message = 'A server error occurred. Please try again later.';
      }
      
      // Attach server response to error object
      error.serverResponse = error.response.data;
    } else if (error.request) {
      console.error('[API] No response received:', error.request);
      error.message = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API] Request setup error:', error.message);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we have a token but it's expired, try to refresh it
      if (localStorage.getItem('token')) {
        console.log('[API] Attempting to refresh token...');
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const response = await axios.post(
            '/auth/refresh-token', 
            {},
            { 
              withCredentials: true,
              baseURL: 'http://localhost:5000/api' // Ensure we use the correct base URL
            }
          );
          
          const token = response.data.token || (response.data.data && response.data.data.token);
          if (token) {
            console.log('[API] Token refreshed successfully');
            localStorage.setItem('token', token);
            
            // Update the Authorization header and retry the original request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          // If refresh fails, clear the token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // If we get here, either we didn't have a token or refresh failed
      console.warn('[API] Authentication required - redirecting to login');
      window.location.href = '/login';
    }
    
    // For other errors, just reject with the error
    return Promise.reject(error);
  }
);

export default api;