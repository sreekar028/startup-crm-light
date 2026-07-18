import axios from 'axios';
import toast from 'react-hot-toast';

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: attach JWT token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: handle global HTTP failures (401, network offline)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Connection/Network Offline errors
    if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'server-connection-error',
      });
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 2. Token Expired / Unauthorized (401)
    if (status === 401) {
      localStorage.removeItem('crm-token');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
