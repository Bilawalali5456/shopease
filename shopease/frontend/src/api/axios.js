import axios from 'axios';

/**
 * Base Axios instance for all API requests
 * - Base URL points to the Express backend
 * - JWT token is injected automatically from localStorage
 */
const API = axios.create({
  // Always same-origin /api (Vite proxies to :5000 in local; Vercel serves /api serverless)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT auth header
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired/invalid token
      localStorage.removeItem('userInfo');
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
