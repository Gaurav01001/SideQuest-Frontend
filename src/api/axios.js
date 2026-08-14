import axios from 'axios';
import { API_BASE_URL } from '../config/env';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log('[axios] →', config.method?.toUpperCase(), config.baseURL + config.url, token ? '(with token)' : '(no token)');
  return config;
});

// Handle 401 globally — clear token and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Do not redirect/reload if the error is from a login/auth request or we are already on the login page
      const isAuthRoute = err.config?.url?.includes('/auth/login') || 
                          err.config?.url?.includes('/auth/register') ||
                          err.config?.url?.includes('/auth/forgot-password') ||
                          err.config?.url?.includes('/auth/reset-password');
                          
      if (!isAuthRoute && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
