import axios from 'axios';

// Add admin token to all requests
axios.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401/403 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const isAdminAuthenticated = () => {
  const admin = localStorage.getItem('admin');
  const adminToken = localStorage.getItem('adminToken');
  return !!(admin && adminToken);
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin');
  localStorage.removeItem('adminToken');
  window.location.href = '/admin';
}; 