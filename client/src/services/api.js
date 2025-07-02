import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // The proxy will handle the full URL
});

export default api;