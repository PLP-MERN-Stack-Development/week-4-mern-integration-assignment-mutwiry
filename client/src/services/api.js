// api.js - API service for making requests to the backend

import axios from 'axios';

// Using Vite proxy in development, empty string means current origin
const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle file uploads
const createFormData = (data) => {
  const formData = new FormData();
  
  // Append all fields to formData
  Object.keys(data).forEach(key => {
    // Handle array fields (like categories)
    if (Array.isArray(data[key])) {
      formData.append(key, JSON.stringify(data[key]));
    } 
    // Handle file uploads
    else if (data[key] instanceof File) {
      formData.append('featuredImage', data[key]);
    }
    // Handle other fields
    else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

// API methods
export const posts = {
  // Get all posts
  async getAll(page = 1, limit = 10) {
    try {
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      return {
        data: response.data.data || [],
        pagination: {
          currentPage: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.total || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPreviousPage: response.data.hasPreviousPage || false,
        }
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  // Get single post
  get: (id) => api.get(`/posts/${id}`),
  
  // Create new post with file upload support
  create: (postData) => {
    const isFormData = postData instanceof FormData;
    return api.post('/posts', isFormData ? postData : createFormData(postData), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update post with file upload support
  update: (id, postData) => {
    const isFormData = postData instanceof FormData;
    return api.put(`/posts/${id}`, isFormData ? postData : createFormData(postData), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete post
  delete: (id) => api.delete(`/posts/${id}`),
  
  // Get all posts with optional pagination and filters
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Search posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return response.data;
  },
};

export const categories = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create a new category
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
};

export const auth = {
  // Login
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  // Register
  register: (userData) => api.post('/api/auth/register', userData),
  
  // Get current user
  getCurrentUser: () => api.get('/api/auth/me'),
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default {
  posts,
  categories,
  auth,
};