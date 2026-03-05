// store/authStore.js
import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) return set({ loading: false });

    try {
      const { data } = await api.get('/auth/verify');
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        set({ user: data.user, isAuthenticated: true });
      }
    } catch (err) {
      console.error('Token verify failed', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      set({ loading: false });
    }
  },

  login: (userData) => set({ user: userData, isAuthenticated: true }),

  signup: (userData) => set({ user: userData, isAuthenticated: true }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;