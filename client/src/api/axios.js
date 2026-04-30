import axios from 'axios';

// Create an Axios instance configured for our API
const api = axios.create({
  // Use environment variable if available (production), otherwise use Vite proxy (development)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');
    
    // If we have a token, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
