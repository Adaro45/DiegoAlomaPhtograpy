// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Ajusta según tu backend
});

// Interceptor para incluir el token CSRF si usas SessionAuthentication
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

export default api;