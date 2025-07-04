import api from './api';

const API_URL = '/auth';

// Set auth token in headers
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Register user
const register = async (name, email, password) => {
  const response = await api.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  
  return response.data;
};

// Login user
const login = async (email, password) => {
  const response = await api.post(`${API_URL}/login`, {
    email,
    password,
  });
  
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  
  return response.data;
};

// Get logged in user
const getMe = async () => {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
};

export { register, login, logout, getMe, setAuthToken };
