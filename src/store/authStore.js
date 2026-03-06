import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      init: async () => {
        const token = localStorage.getItem('token');
        if (!token) return set({ loading: false });

        try {
          const { data } = await api.get('/auth/verify');
          if (data.user) {
            set({ user: data.user, isAuthenticated: true });
          }
        } catch (err) {
          console.error('Token verify failed', err);
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },

      login: (userData) => set({ user: userData, isAuthenticated: true }),

      signup: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
      // don't persist loading — always start fresh
    }
  )
);

export default useAuthStore;