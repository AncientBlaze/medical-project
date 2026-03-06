import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggle: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(next);
          return { theme: next };
        }),
      init: () => {
        const saved = localStorage.getItem('theme-store');
        const parsed = saved ? JSON.parse(saved) : null;
        const theme = parsed?.state?.theme || 'dark';
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      },
    }),
    {
      name: 'theme-store',
    }
  )
);

export default useThemeStore;