import api from './api';

// The baseURL in api.js already includes /api/v1, so we don't need to repeat it here
const API_URL = '/auth';

// Set auth token in headers
const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('token', token);
      // Also set default auth header for axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw error;
  }
};

// Register user
const register = async (name, email, password) => {
  try {
    console.log('Registering user:', { name, email });
    const response = await api.post(`${API_URL}/register`, {
      name,
      email: email.toLowerCase().trim(),
      password,
    });
    
    console.log('Registration response:', response.data);
    
    // Handle token from response
    const token = response.data.token || (response.data.data && response.data.data.token);
    if (token) {
      setAuthToken(token);
      console.log('Auth token set during registration');
    } else {
      console.warn('No token received in registration response');
    }
    
    // Return the full response data for the context to handle
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
const login = async (email, password) => {
  try {
    console.log('Login attempt for:', email);
    const response = await api.post(`${API_URL}/login`, {
      email: email.toLowerCase().trim(),
      password,
    });
    
    console.log('Login response:', response.data);
    
    // Handle token from response
    const token = response.data.token || (response.data.data && response.data.data.token);
    if (token) {
      setAuthToken(token);
      console.log('Auth token set successfully');
      
      // Return the full response data for the context to handle
      return response.data;
    } else {
      console.error('No token received in login response:', response.data);
      throw new Error('Authentication failed: No token received');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get logged in user
const getMe = async () => {
  try {
    console.log('Fetching current user...');
    const response = await api.get(`${API_URL}/me`);
    console.log('Current user data:', response.data);
    
    // Return the user data directly from the response
    // The response structure might be { data: { ...userData } } or just { ...userData }
    return response.data || response;
  } catch (error) {
    console.error('Error fetching current user:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch user data' };
  }
};

// Logout user
const logout = () => {
  try {
    console.log('Logging out user...');
    setAuthToken(null);
    // Clear any user data from localStorage
    localStorage.removeItem('user');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Initialize auth state from localStorage
const initializeAuth = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Initializing auth with stored token');
      setAuthToken(token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing auth:', error);
    return false;
  }
};

// Initialize auth when service is imported
initializeAuth();

export { 
  register, 
  login, 
  logout, 
  getMe, 
  setAuthToken, 
  initializeAuth 
};
