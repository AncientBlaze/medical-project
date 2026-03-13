import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,
});

// attach token from localStorage to each request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
    console.error(e.data?.message || e.message || 'Error attaching token to request');
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
